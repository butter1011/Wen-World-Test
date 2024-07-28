let serverurl = "http://localhost:5000";
// let serverurl = "https://telegram-1-Triend.replit.app";
const user = window.Telegram.WebApp.initDataUnsafe.user;
// const user_id = user?.id;
const user_id = 706939346;

document.addEventListener('DOMContentLoaded', (event) => {
    if (window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        resizeCanvas();
    }
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    if (window.Telegram.WebApp) {
        const viewportHeight = Telegram.WebApp.viewportHeight;
        const viewportStableHeight = Telegram.WebApp.viewportStableHeight;
        canvas.width = window.innerWidth;
        canvas.height = viewportHeight;
        canvas.style.marginTop = `${(window.innerHeight - viewportHeight) / 2}px`;
        canvas.style.marginLeft = `${(window.innerWidth - canvas.width) / 2}px`;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.marginTop = '0';
        canvas.style.marginLeft = '0';
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
}

window.addEventListener('resize', resizeCanvas);

// Preload images
const images = {
    playerImg: "../static/img/player-img.png",
    goodCoinImg: "../static/img/good-coin-img.png",
    badCoinImg: "../static/img/bad-coin-img.png",
    bullImg: "../static/img/bull-img.png",
    bearImg: "../static/img/bear-img.png",
    samBankmanImg: "../static/img/sam-bankman-img.png",
    triendImg: "../static/img/triend-img.png",
    zkpImg: "../static/img/zkp-img.png"
};
const imageElements = {};

function preloadImages(sources, callback) {
    let loadedImages = 0;
    let numImages = 0;
    for (let src in sources) {
        numImages++;
    }
    for (let src in sources) {
        imageElements[src] = new Image();
        imageElements[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback();
            }
        };
        imageElements[src].src = sources[src];

        // Log any transparency issues
        imageElements[src].onerror = function () {
            console.error(`Error loading image ${sources[src]}`);
        };
    }
}

preloadImages(images, function () {
    console.log("All images loaded");
});

const player = {
    x: 5,
    y: canvas.height - 75 - 25,
    width: 75,
    height: 75,
    speed: 3.5, // Reduced player speed by 30%
    dy: 0,
    gravity: 0.5,
    jumpPower: 12,
    jumpCount: 0,
    maxJumpCount: 4,
    health: 3, // Set to 3 lives
    visible: true
};
let coins = [];
let obstacles = [];
let platforms = [];
let score = 0;
let bankedScore = 0;
let gameOver = false;
let clouds = [];
let currentTerrainIndex = 0;
let coinSpawnRate = 0.25;
let obstacleSpawnRate = 0.005;
let platformSpawnRate = 0.001;
let boostActive = false;
let slowdownActive = false;
let reducedPointsActive = false;
let reducedPointsDuration = 5000;
// let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let doublePointsActive = false;
let doubleGoodCoinSpawn = false;
let bullTouched = false;
let bearTouched = false;
let lastTouchTime = 0;
let lastHurtTime = 0;
let todayScore = 0;
let allTimeTopScore = 0;
let collectingCoins = false;
let clearingCoins = false;
let bullhit = false;
const debugMode = false; // Change this to true to enable hitbox visualization

const terrains = [
    {
        // background: '#87CEEB',
        backgroundImage: "../static/img/background_game.png",
        ground: 'linear-gradient(to top, #1E90FF, #87CEEB)',
        generateCoins: () => Math.random() < 0.1 ? 'bad' : 'good',
        character: 'bull'
    }
];

function getRandomSize(min = 50, max = 150) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && player.jumpCount < player.maxJumpCount) {
        player.dy = -player.jumpPower;
        player.jumpCount++;
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (player.jumpCount < player.maxJumpCount) {
        player.dy = -player.jumpPower;
        player.jumpCount++;
    }
});

canvas.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTouchTime < 300) {
        if (bullTouched) {
            activateBullEffect();
            bullTouched = false;
        }
        if (bearTouched) {
            activateBearEffect();
            bearTouched = false;
        }
    }
    lastTouchTime = now;
});

function drawElement(ctx, x, y, width, height, type) {
    if (type === 'candleGreen') {
        drawCandle(ctx, x, y, width, height, '#228B22');
    } else if (type === 'candleRed') {
        drawCandle(ctx, x, y, width, height, '#FF4500');
    } else if (type === 'cloud') {
        drawCloudObstacle(ctx, x, y, width, height);
    } else if (type === 'bull') {
        drawBull(ctx, x, y, width, height);
    } else if (type === 'bear') {
        drawBear(ctx, x, y, width, height);
    } else if (type === 'samBankman') {
        drawSamBankman(ctx, x, y, width, height);
    } else if (type === 'triend') {
        drawTriend(ctx, x, y, width, height);
    } else if (type === 'zkp') {
        drawZKP(ctx, x, y, width, height);
    }
}

function drawCandle(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x + width / 4, y, width / 2, height);
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 2, y - height / 2);
    ctx.stroke();
}

function drawCloud(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.arc(x + width / 4, y, width / 4, 0, Math.PI * 2);
    ctx.arc(x + width / 2, y - height / 4, width / 4, 0, Math.PI * 2);
    ctx.arc(x + (3 * width) / 4, y, width / 4, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function drawCloudObstacle(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.arc(x + width / 4, y, width / 4, 0, Math.PI * 2);
    ctx.arc(x + width / 2, y - height / 4, width / 4, 0, Math.PI * 2);
    ctx.arc(x + (3 * width) / 4, y, width / 4, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
}

function drawBull(ctx, x, y, width, height) {
    ctx.drawImage(imageElements.bullImg, x, y, width, height);
}

function drawBear(ctx, x, y, width, height) {
    ctx.drawImage(imageElements.bearImg, x, y, width, height);
}

function drawSamBankman(ctx, x, y, width, height) {
    ctx.drawImage(imageElements.samBankmanImg, x, y, width, height);
}

function drawTriend(ctx, x, y, width, height) {
    ctx.drawImage(imageElements.triendImg, x, y, width, height);
}

function drawZKP(ctx, x, y, width, height) {
    ctx.drawImage(imageElements.zkpImg, x, y, width, height);
}

function drawRoad() {
    const roadHeight = 25;
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height - roadHeight, canvas.width, roadHeight);

    const stripeWidth = 10;
    const stripeHeight = 10;
    const stripeSpacing = 20;
    ctx.fillStyle = '#FFF';

    for (let x = 0; x < canvas.width; x += stripeWidth + stripeSpacing) {
        ctx.fillRect(x, canvas.height - roadHeight / 2 - stripeHeight / 2, stripeWidth, stripeHeight);
    }
}

function updateScore(breakdownMessage = '') {
    document.getElementById('score').innerText = `Score: ${score + bankedScore}`;
    document.getElementById('final-score').innerText = score + bankedScore;

    const scoreBreakdownElement = document.getElementById('score-breakdown');
    if (breakdownMessage) {
        scoreBreakdownElement.innerHTML = breakdownMessage;
        scoreBreakdownElement.style.display = 'block';
        setTimeout(() => {
            scoreBreakdownElement.style.display = 'none';
        }, 3000);
    }
}

function updateHealth() {
    const healthPercentage = (player.health / 3) * 100; // Adjusted for 3 lives
    document.getElementById('health-bar').style.width = healthPercentage + '%';

    const red = Math.min(255, Math.floor((1 - healthPercentage / 100) * 255));
    const green = Math.min(255, Math.floor((healthPercentage / 100) * 255));
    const color = `rgb(${red}, ${green}, 0)`;

    document.getElementById('health-bar').style.backgroundColor = color;
}

function showMessage(text, duration = 3000) {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = text;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, duration);
}

function showLastLifeMessage() {
    const lastLifeMessage = document.getElementById('last-life-message');
    lastLifeMessage.style.display = 'block';
    setTimeout(() => {
        lastLifeMessage.style.display = 'none';
    }, 3000);
}

function changeTerrain() {
    const newTerrain = terrains[0]; // Always use the light blue terrain
    canvas.style.backgroundImage = `url('${newTerrain.backgroundImage}')`;
    canvas.style.backgroundSize = 'cover'; // This ensures the image covers the entire canvas
    canvas.style.backgroundRepeat = 'no-repeat';
    document.getElementById('ground').style.background = newTerrain.ground;

    if (newTerrain.character) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height / 2),
            width: player.width,
            height: player.height,
            speed: 5,
            type: newTerrain.character
        });
    }
}

// Function to transform shit coins to gold coins
function transformShitCoinsToGold() {
    coins.forEach(coin => {
        if (coin.type === 'bad') {
            coin.type = 'good';
        }
    });
}

// Function to transform all coins to shit coins
function transformCoinsToShit() {
    coins.forEach(coin => {
        coin.originalType = coin.type;
        coin.type = 'bad';
    });
}

// Function to revert gold coins back to shit coins after 5 seconds
function revertGoldCoins() {
    setTimeout(() => {
        coins.forEach(coin => {
            if (coin.type === 'good') {
                const isGoldCoin = Math.random() < 0.1; // 10% chance to remain gold
                coin.type = isGoldCoin ? 'good' : 'bad';
            }
        });
        updateCoinImages();
    }, 5000);
}

// Function to revert coins to their original types after 5 seconds
function revertCoins() {
    setTimeout(() => {
        coins.forEach(coin => {
            if (coin.originalType) {
                coin.type = coin.originalType;
                delete coin.originalType;
            }
        });
        updateCoinImages();
    }, 5000);
}

// Function to update coin images based on their type
function updateCoinImages() {
    coins.forEach(coin => {
        coin.img = coin.type === 'good' ? imageElements.goodCoinImg : imageElements.badCoinImg;
    });
}

function bankCoins() {
    bankedScore += score;
    todayScore += score;
    score = 0;
    updateScore();
    showMessage("Coins banked successfully!", 2000);
}

function startGame() {
    // localStorage.setItem("GameStart", Date.now());
    document.getElementById('opening-page').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('ground').style.display = 'block';
    document.getElementById('score').style.display = 'block';
    document.getElementById('score-breakdown').style.display = 'block';
    document.getElementById('health-container').style.display = 'flex';
    document.getElementById('end-and-bank-button').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    // hideNavigationBar();  // Hide the navigation bar when the game starts
    resizeCanvas();
    changeTerrain(); // Set the initial terrain
    resetScores();
    lastTime = performance.now();
    gameLoop(lastTime);
}

function resetScores() {
    score = 0;
    bankedScore = 0;
    todayScore = 0;
    updateScore();
}

function showNoMessage() {
    alert("You chose not to enter the world of wen. The game will not start.");
}

function enterGame() {
    document.getElementById('info-button').style.display = 'flex';
    document.getElementById('opening-page').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('rule-content1').style.display = 'flex';
}

function startCountdown() {
    // document.getElementById('info-button').style.display = 'none';
    document.getElementById('opening-page').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.getElementById('character-card').style.display = 'none';
    document.getElementById('loading_screen').style.display = 'block'
    // const countdownElement = document.getElementById('countdown');
    // countdownElement.style.display = 'block';
    let countdown = 3;
    // countdownElement.innerHTML = countdown;
    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            // countdownElement.innerHTML = countdown;
        } else if (countdown === 0) {
            // countdownElement.innerHTML = 'GO!';
        } else {
            clearInterval(interval);
            // countdownElement.style.display = 'none';
            document.getElementById('loading_screen').style.display = 'none'
            startGame();
        }
    }, 1000);
}

function restartGame() {
    resetScores();
    player.x = 5;
    player.y = canvas.height - 75 - 25;
    player.dy = 0;
    player.jumpCount = 0;
    player.health = 3; // Set to 3 lives
    player.visible = true;

    coins = [];
    obstacles = [];
    platforms = [];
    score = 0;
    bankedScore = 0;
    gameOver = false;
    clouds = [];
    currentTerrainIndex = 0;
    coinSpawnRate = 0.25;
    obstacleSpawnRate = 0.005;
    platformSpawnRate = 0.001;
    boostActive = false;
    slowdownActive = false;
    reducedPointsActive = false;
    doublePointsActive = false;
    doubleGoodCoinSpawn = false;
    bullTouched = false;
    bearTouched = false;
    lastTouchTime = 0;
    lastHurtTime = 0;

    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('score').style.display = 'block';
    document.getElementById('score-breakdown').style.display = 'block';
    document.getElementById('health-container').style.display = 'flex';
    document.getElementById('end-and-bank-button').style.display = 'block';
    hideNavigationBar();  // Hide the navigation bar when the game restarts
    changeTerrain();
    lastTime = performance.now();
    gameLoop(lastTime);
}

async function endAndBank() {
    bankedScore += score;
    todayScore += score;
    score = 0;
    gameOver = true;

    await saveScore();
    await updateScore();

    document.getElementById('footer').style.display = 'flex';
    document.getElementById('final-score').innerText = todayScore;
    document.getElementById('game-over-screen').style.display = 'flex';
    document.getElementById('info-button').style.display = 'flex';
    document.getElementById('score').style.display = 'none';
    document.getElementById('score-breakdown').style.display = 'none';
    document.getElementById('health-container').style.display = 'none';
    document.getElementById('end-and-bank-button').style.display = 'none';

    showNavigationBar();  // Show the navigation bar when the game ends
    await initScore();

    if (todayScore > allTimeTopScore) {
        allTimeTopScore = todayScore;
    }
}

function drawHitbox(ctx, x, y, width, height, color = 'red') {
    if (debugMode) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }
}

let lastTime = performance.now();

function gameLoop(timestamp) {
    if (gameOver) return;

    const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();

    clouds.forEach(cloud => {
        drawCloud(ctx, cloud.x, cloud.y, cloud.width, cloud.height);
        cloud.x -= cloud.speed * deltaTime * 60;

        if (cloud.x + cloud.width < 0) {
            clouds = clouds.filter(c => c !== cloud);
        }
    });

    if (player.visible) {
        ctx.drawImage(imageElements.playerImg, player.x, player.y, player.width, player.height);
        drawHitbox(ctx, player.x, player.y, player.width, player.height); // Draw hitbox if debugMode is true
    }

    coins.forEach(coin => {
        const coinImg = coin.img || (coin.type === 'good' ? imageElements.goodCoinImg : imageElements.badCoinImg);
        const coinSize = 30;
        ctx.drawImage(coinImg, coin.x, coin.y, coinSize, coinSize);
        drawHitbox(ctx, coin.x, coin.y, coinSize, coinSize); // Draw hitbox if debugMode is true

        if (collectingCoins) {
            const dx = coin.targetX - coin.x;
            const dy = coin.targetY - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 5 * deltaTime * 60;
            if (distance < speed) {
                coin.x = coin.targetX;
                coin.y = coin.targetY;
            } else {
                coin.x += (dx / distance) * speed;
                coin.y += (dy / distance) * speed;
            }
        } else {
            coin.x -= coin.speed * deltaTime * 60;
        }

        if (clearingCoins) {
            const dx = canvas.width / 2 - coin.x;
            const dy = canvas.height / 2 - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 15 * deltaTime * 60;
            if (distance < speed) {
                coin.x = canvas.width / 2;
                coin.y = canvas.height / 2;
            } else {
                coin.x += (dx / distance) * speed;
                coin.y += (dy / distance) * speed;
            }
        }

        if (player.x < coin.x + coinSize &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coinSize &&
            player.y + player.height > coin.y) {
            console.log(`Collision detected between player and ${coin.type} coin at (${coin.x}, ${coin.y})`);
            let breakdownMessage = '';
            if (coin.type === 'good') {
                score += 5;
                cashRegisterSound.play();
                breakdownMessage = `<span style="color:green;">5 Triend points collected</span>`;
            } else {
                let shitCoinPoints = Math.floor(Math.random() * 81) - 40; // -40 to +40 points for shit coins

                if (bullhit) shitCoinPoints = Math.abs(shitCoinPoints);
                score += shitCoinPoints;

                if (score < 0) score = 0;
                breakdownMessage = `<span style="${shitCoinPoints < 0 ? 'color:red;' : 'color:green;'}">${shitCoinPoints} Triend points collected</span>`;
            }
            updateScore(breakdownMessage);
            coins = coins.filter(c => c !== coin);
        }
    });

    obstacles.forEach(obstacle => {
        drawElement(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.type);
        drawHitbox(ctx, obstacle.x, obstacle.y, obstacle.width, obstacle.height); // Draw hitbox if debugMode is true
        obstacle.x -= obstacle.speed * deltaTime * 60;

        // Check for collision with bull
        if (obstacle.type === 'bull' &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            console.log(`Collision detected between player and ${obstacle.type} obstacle at (${obstacle.x}, ${obstacle.y})`);
            showMessage('<span style="color:green;">This Ones For Retail</span>');
            obstacles = obstacles.filter(o => o !== obstacle);

            // for 2 seconds +shitcoin
            bullhit = true;

            setTimeout(() => {
                bullhit = false;
            }, 2000);
        }

        // Check for collision with bear
        if (obstacle.type === 'bear' &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            console.log(`Collision detected between player and ${obstacle.type} obstacle at (${obstacle.x}, ${obstacle.y})`);
            showMessage('<span style="color:red;">Market Maker Bear Has Stolen Your Gains</span>');
            obstacles = obstacles.filter(o => o !== obstacle);
            //actions
            score = score - 50;
            if (score < 0) score = 0;

            for (let i = 0; i < 4; i++) {
                obstacles.push({
                    x: Math.random() * (canvas.width - 200),
                    y: Math.random() * (canvas.height - 200),
                    width: player.width,
                    height: player.height,
                    speed: 5,
                    type: 'samBankman'
                });
            }
        }

        // Check for collision with Sam Bankman
        if (obstacle.type === 'samBankman' &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            console.log(`Collision detected between player and ${obstacle.type} obstacle at (${obstacle.x}, ${obstacle.y})`);
            score = Math.floor(score / 2); // Halve the score
            player.health--; // Reduce one life
            showMessage('<span style="color:red;">Sammy just rug pulled you</span>');
            obstacles = obstacles.filter(o => o !== obstacle);
            updateScore();
            updateHealth();
            if (player.health === 1) {
                showLastLifeMessage();
            }
            if (player.health <= 0) {
                gameOver = true;
                saveScore();
                document.getElementById('game-over-screen').style.display = 'flex';
                document.getElementById('score').style.display = 'none';
                document.getElementById('score-breakdown').style.display = 'none';
                document.getElementById('health-container').style.display = 'none';
                document.getElementById('end-and-bank-button').style.display = 'none';
                showNavigationBar();  // Show the navigation bar when the game ends
                initScore();
                if (todayScore > allTimeTopScore) {
                    allTimeTopScore = todayScore;
                }
                return;
            }
        }

        // Handle other obstacles (e.g., candles, etc.)
        if (obstacle.type === 'candleGreen' &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            showBoostMessage();
            player.dy = -player.jumpPower * 2;
            obstacles = obstacles.filter(o => o !== obstacle);
        }

        if (obstacle.type === 'candleRed' &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            showSlowdownMessage();
            player.dy = player.jumpPower * 2;
            player.visible = false;
            // showFlash();
            setTimeout(() => {
                player.visible = true;
                player.y = canvas.height - player.height - 25;
                player.dy = 0;
                updateHealth();
            }, 1000);
            obstacle.y = canvas.height + 100;
            setTimeout(() => {
                obstacles = obstacles.filter(o => o !== obstacle);
            }, 500);
            const now = Date.now();
            if (now - lastHurtTime > 3000) {
                player.health--;
                lastHurtTime = now;
                if (player.health === 1) {
                    showLastLifeMessage();
                }
                if (player.health <= 0) {
                    gameOver = true;
                    saveScore();
                    document.getElementById('game-over-screen').style.display = 'flex';
                    document.getElementById('score').style.display = 'none';
                    document.getElementById('score-breakdown').style.display = 'none';
                    document.getElementById('health-container').style.display = 'none';
                    document.getElementById('end-and-bank-button').style.display = 'none';
                    showNavigationBar();  // Show the navigation bar when the game ends
                    initScore();
                    if (todayScore > allTimeTopScore) {
                        allTimeTopScore = todayScore;
                    }
                    return;
                }
                // showFlash();
                updateHealth();
            }
        }

        if (obstacle.type !== 'bull' && obstacle.type !== 'bear' && obstacle.type !== 'cloud' &&
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            const now = Date.now();
            if (now - lastHurtTime > 3000) {
                if (obstacle.type === 'triend') {
                    score += 200; // +200 points for Triend
                    updateScore(`<span style="color:green;">200 Triend points collected</span>`);
                    const triendMessage = document.getElementById('triend-message');
                    triendMessage.style.display = 'block';
                    setTimeout(() => {
                        triendMessage.style.display = 'none';
                    }, 3000);
                    obstacles = obstacles.filter(o => o !== obstacle);
                } else if (obstacle.type === 'zkp') {
                    score += 100; // +100 points for ZKP
                    updateScore(`<span style="color:green;">Infinite knowledge grants you +100 Triend points</span>`);
                    const zkpMessage = document.getElementById('zkp-message');
                    zkpMessage.style.display = 'block';
                    setTimeout(() => {
                        zkpMessage.style.display = 'none';
                    }, 3000);
                    obstacles = obstacles.filter(o => o !== obstacle);
                }
            }
        }
    });

    platforms.forEach(platform => {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        drawHitbox(ctx, platform.x, platform.y, platform.width, platform.height); // Draw hitbox if debugMode is true
        platform.x -= platform.speed * deltaTime * 60;

        if (platform.x + platform.width < 0) {
            platforms = platforms.filter(p => p !== platform);
        }

        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.jumpCount = 0;
        }
    });

    player.dy += player.gravity * deltaTime * 60;
    player.y += player.dy * deltaTime * 60;

    if (player.y + player.height > canvas.height - 25) {
        player.y = canvas.height - player.height - 25;
        player.jumpCount = 0;
    }
    if (player.y < 0) {
        player.y = 0;
        player.dy = 0;
    }

    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (Math.random() < coinSpawnRate * deltaTime * 60) {
        const coinType = doubleGoodCoinSpawn ? 'good' : Math.random() < 0.1 ? 'bad' : 'good';
        coins.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            size: 20,
            speed: 5,
            type: coinType
        });
    }

    const baseGoldTokenProbability = 0.1; // 10%

    const shitCoinProbability = baseGoldTokenProbability; // 10%
    const triendProbability = baseGoldTokenProbability * 0.01; // 0.1%
    const zkpProbability = baseGoldTokenProbability * 0.02; // 0.2%
    const bullProbability = baseGoldTokenProbability * 0.01; // 0.1%
    const bearProbability = baseGoldTokenProbability * 0.02; // 0.2%
    const greenCandleProbability = baseGoldTokenProbability * (1 / 120); // 0.083%
    const redCandleProbability = baseGoldTokenProbability * 0.01; // 0.1%
    const samBankmanProbability = baseGoldTokenProbability * (1 / 60); // 0.167%

    if (Math.random() < baseGoldTokenProbability * deltaTime * 60) {
        coins.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            size: 20,
            speed: 5,
            type: 'good'
        });
    }

    if (Math.random() < shitCoinProbability * deltaTime * 60) {
        coins.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            size: 40,
            speed: 5,
            type: 'bad'
        });
    }

    if (Math.random() < triendProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'triend'
        });
    }

    if (Math.random() < zkpProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'zkp'
        });
    }

    if (Math.random() < bullProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'bull'
        });
    }

    if (Math.random() < bearProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'bear'
        });
    }

    if (Math.random() < greenCandleProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 25 - player.height, // on the road
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'candleGreen'
        });
    }

    if (Math.random() < redCandleProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 25 - player.height, // on the road
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'candleRed'
        });
    }

    if (Math.random() < samBankmanProbability * deltaTime * 60) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 200),
            width: player.width,
            height: player.height,
            speed: 5,
            type: 'samBankman'
        });
    }

    if (Math.random() < platformSpawnRate * deltaTime * 60) {
        const platformWidth = getRandomSize(100, 200);
        platforms.push({
            x: canvas.width,
            y: Math.random() * (canvas.height / 2),
            width: platformWidth,
            height: 20,
            speed: 5
        });
    }

    if (Math.random() < 0.01 * deltaTime * 60) {
        clouds.push({
            x: canvas.width,
            y: Math.random() * (canvas.height / 2),
            width: 100,
            height: 50,
            speed: 2
        });
    }

    requestAnimationFrame(gameLoop);
}

function showBoostMessage() {
    const boostMessage = document.getElementById('boost-message');
    boostMessage.style.display = 'block';
    setTimeout(() => {
        boostMessage.style.display = 'none';
    }, 2000);
}

function showSlowdownMessage() {
    const slowdownMessage = document.getElementById('slowdown-message');
    slowdownMessage.style.display = 'block';

    setTimeout(() => {
        slowdownMessage.style.display = 'none';
    }, 2000);
}

window.onclick = function (event) {
    if (!event.target.matches('#add-points-button') && !event.target.closest('#share-dropdown')) {
        const dropdowns = document.getElementsByClassName("share-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none';
            }
        }
    }
}

// init top score and total score
async function initScore() {
    const bestScore = document.getElementById('best-score');
    const rankScore = document.getElementById("rank-score");

    // High Score
    await fetch(`${serverurl}/api/v1/highscore_data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            let score = 0;
            let rank = 1;
            data.forEach(element => {
                if (element.user_id == user_id) {
                    score = element.points;
                } else {
                    rank++;
                }
            });

            bestScore.innerHTML = `${score}`;
            rankScore.innerHTML = `${rank}`;
        })
        .catch((error) => {
            console.error(error);
        });
}

async function saveScore() {
    if (user_id) {
        await fetch(`${serverurl}/api/v2/update_score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'user_id': user_id, 'score': score }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

function hideNavigationBar() {
    document.getElementById('footer').style.display = 'none';
}

function showNavigationBar() {
    document.getElementById('footer').style.display = 'flex';
}


// function shareWithFriends() {
//     const shareText = `I scored ${todayScore} points in this awesome game! Can you beat my score?`;
//     const url = window.location.href;
//     const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
//     const discordUrl = `https://discord.com/channels/@me?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
//     const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;

//     return { twitterUrl, discordUrl, telegramUrl };
// }

// function toggleDropdown() {
//     const dropdown = document.getElementById('share-dropdown');
//     dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
// }

// function shareOnDiscord() {
//     const { discordUrl } = shareWithFriends();
//     window.open(discordUrl, 'Share on Discord', 'height=600,width=800,resizable,scrollbars');
// }

// function shareOnTelegram() {
//     const { telegramUrl } = shareWithFriends();
//     window.open(telegramUrl, 'Share on Telegram', 'height=600,width=800,resizable,scrollbars');
// }

// function shareOnTwitter() {
//     const { twitterUrl } = shareWithFriends();
//     window.open(twitterUrl, 'Share on Twitter', 'height=600,width=800,resizable,scrollbars');
// }


