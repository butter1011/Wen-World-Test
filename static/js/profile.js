async function init() {
    const scoreElement = document.getElementById("top-score");
    const checkinCountElement = document.getElementById("checkin-count");
    const highScoreElement = document.getElementById("tridend-amount");
    // const nicknameDisplayElement = document.getElementById("nickname-display");
    // const nicknameInputELement = document.getElementById("nickname-input");
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;

    await fetch('https://wen-world-test.onrender.com/api/v1/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => response.json())
        .then((data) => {
            scoreElement.innerHTML = `Today's Top Score: ${data.data.total_score}`;
            checkinCountElement.innerHTML = `Check-ins: ${data.data.dailyCheckin}`;
            highScoreElement.innerHTML = data.data.high_score;
            // nicknameDisplayElement.innerHTML = data.data.user_name;
            // nicknameInputELement.value = data.data.user_name;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // startfarming button init
    const currentTime = await getCurrentTime();
    const lastTime = await getfarmingTime();
    const farmingDuration = currentTime - lastTime;

    if (lastTime === 0) {
        document.getElementById('farming-btn').innerHTML = `Start Farming`;
        document.getElementById('farming-btn').onclick = startFarming;
    }

    else {
        if (farmingDuration > 6 * 1000 * 3600) {
            document.getElementById('farming-btn').innerHTML = `Claim Point <span class="farming-circle"></span><span id="claim-point" class="timer">1000</span>`;
            document.getElementById('farming-btn').onclick = claimPoints;
        } else {
            document.getElementById('farming-btn').innerHTML = `⌛Farming <span id="farming-timer" class="timer">-- : -- : --</span> <span id="claim-point" class="timer"></span>`;
            document.getElementById('farming-btn').onclick = "";

            if (6 * 1000 * 3600 - farmingDuration > 0)
                startFarmingTimer(6 * 1000 * 3600 - farmingDuration);
            else {
                document.getElementById('farming-btn').innerHTML = `Claim Point <span class="farming-circle"></span><span id="claim-point" class="timer">1000</span>`;
                document.getElementById('farming-btn').onclick = claimPoints;
            }
        }
    }

    // if (storedNickname) {
    //     document.getElementById('nickname-display').textContent = storedNickname;
    //     document.getElementById('nickname-input').value = storedNickname;
    // }
    updateCheckinCount(checkinCount);
    dailyCheckIn();
}

document.addEventListener('DOMContentLoaded', async (event) => {
    init();
});

const dailyLoginRewards = [100, 200, 400, 800, 1600, 3200, 5000];
const farmingDuration = 6 * 60 * 60 * 1000;

function navigateTo(page) {
    window.location.href = `/${page}`;
}

function navigateToHome() {
    window.location.href = '/';
}
async function startFarming() {
    await setFarmingTime();
    document.getElementById('farming-btn').innerHTML = `⌛Farming <span id="farming-timer" class="timer">-- : -- : --</span> <span id="claim-point" class="timer"></span>`;
    document.getElementById('farming-btn').onclick = "";
    startFarmingTimer(6 * 60 * 60 * 1000);
}

async function claimPoints() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;
    document.getElementById('farming-btn').innerHTML = `Farming`;
    document.getElementById('farming-btn').onclick = startFarming;

    await fetch('https://wen-world-test.onrender.com/api/v2/farmingClaim', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function setFarmingTime() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;
    const response = await fetch(`https://wen-world-test.onrender.com/api/v2/farmingStart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id })
    });
    return response;
}

async function getCurrentTime() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;
    const response = await fetch(`https://wen-world-test.onrender.com/api/v1/currentTime?user_id=${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.currentTime;
}

async function getfarmingTime() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;
    const response = await fetch(`https://wen-world-test.onrender.com/api/v1/farmingTime?user_id=${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.farmingTime;
}

async function dailyCheckIn() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;
    const response = await fetch(`https://wen-world-test.onrender.com/api/v2/dailyCheckin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id })
    });

    const data = await response.json();
    const claimable = data.claimable;
    let checkinCount = data.dailyCheckin;
    if (checkinCount > 7) checkinCount = 7;

    const rewards_list = document.getElementsByClassName("reward");
    const claim_btn = document.getElementById("daily_claim");
    // delete the class
    for (let i = 0; i < rewards_list.length; i++) {
        rewards_list[i].classList.remove("current");
    }

    // add the class
    for (let i = 0; i < checkinCount; i++) {
        rewards_list[i].classList.add("current");
    }

    // disable the claimbutton
    if (claimable) {
        claim_btn.disabled = false;
        claim_btn.style.background = 'linear-gradient(135deg, #FF0092, #00FFCF)';
    } else {
        claim_btn.disabled = true;
        claim_btn.style.background = 'grey';
    }
}

async function dailyClaim() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;

    const user_id = user.id;
    const response = await fetch(`https://wen-world-test.onrender.com/api/v2/dailyClaim`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id })
    });

    await dailyCheckIn();
}

function updateCheckinCount(count) {
    document.getElementById('checkin-count').innerText = `Check-ins: ${count}`;
}

function showModal() {
    document.getElementById('daily-checkin-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('daily-checkin-modal').style.display = 'none';
}

function startFarmingTimer(duration) {
    const timerElement = document.getElementById('farming-timer');
    const pointElement = document.getElementById('claim-point');
    let timeRemaining = duration;

    const timerInterval = setInterval(async () => {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        const elapsed = 1000 * 6 * 3600 - timeRemaining;

        let points = Math.min(1000, (elapsed / (1000 * 6 * 3600)) * 1000);

        pointElement.innerHTML = points.toFixed(1);
        timerElement.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById('farming-btn').innerHTML = `Claim Point <span class="farming-circle"></span><span id="claim-point" class="timer">1000</span>`;
            document.getElementById('farming-btn').onclick = claimPoints;
            timerElement.style.display = 'none';
        } else {
            timeRemaining -= 1000;
        }
    }, 1000);
}

document.getElementById('upload-img').addEventListener('change', function () {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profile-img').src = e.target.result;
        localStorage.setItem('profileImage', e.target.result);
    }
    reader.readAsDataURL(this.files[0]);
});

// document.getElementById('nickname-display').addEventListener('click', function () {
//     document.getElementById('nickname-display').style.display = 'none';
//     document.getElementById('nickname-input').style.display = 'inline-block';
//     document.getElementById('nickname-input').focus();
// });

// document.getElementById('nickname-input').addEventListener('blur', async function () {
//     const nickname = document.getElementById('nickname-input').value;
//     document.getElementById('nickname-display').textContent = nickname;
//     document.getElementById('nickname-display').style.display = 'inline-block';
//     document.getElementById('nickname-input').style.display = 'none';
//     await update_name(nickname);
// });

// document.getElementById('nickname-input').addEventListener('keypress', async function (e) {
//     if (e.key === 'Enter') {
//         e.preventDefault();
//         const nickname = document.getElementById('nickname-input').value;
//         document.getElementById('nickname-display').textContent = nickname;
//         document.getElementById('nickname-display').style.display = 'inline-block';
//         document.getElementById('nickname-input').style.display = 'none';
//         await update_name(nickname);
//     }
// });

async function update_name(username) {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const user_id = user.id;
    const response = await fetch(`https://wen-world-test.onrender.com/api/v2/updateName`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id, name: username })
    });

    init();
}