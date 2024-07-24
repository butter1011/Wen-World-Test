let farmingInterval;
const dailyLoginRewards = [100, 200, 400, 800, 1600, 3200, 5000];
const farmingDuration = 6 * 60 * 60 * 1000;

function navigateTo(page) {
    window.location.href = `/${page}`;
}

function navigateToHome() {
    window.location.href = '/';
}

// get the all the score value
async function displayLeaderboard() {
    const highScorelist = document.getElementById('high-scores-list');
    const totalScorelist = document.getElementById('total-points-list');

    highScorelist.innerHTML = '';
    totalScorelist.innerHTML = '';

    await fetch('https://wen-world-test.onrender.com/api/v1/highscore_data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b.points - a.points).forEach((entry, index) => {
                const highlistItem = document.createElement('tr');
                highlistItem.innerHTML = `<td>${index + 1}</td><td>${entry.name}</td><td>${entry.points}</td>`;
                highScorelist.appendChild(highlistItem);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    await fetch('https://wen-world-test.onrender.com/api/v1/totalscore_data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b.points - a.points).forEach((entry, index) => {
                const totallistItem = document.createElement('tr');
                totallistItem.innerHTML = `<td>${index + 1}</td><td>${entry.name}</td><td>${entry.total}</td>`;
                totalScorelist.appendChild(totallistItem);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// init top score and total score
async function initScore() {
    const user = window.Telegram.WebApp.initDataUnsafe.user;
    const totalPointsDiv = document.getElementById('tridend-amount');
    const top_scoreDiv = document.getElementById("top-score");
    const player_name = document.getElementById("nickname-display");
    const start_farming = document.getElementById("farming-btn");

    // Total Score
    await fetch(`https://wen-world-test.onrender.com/api/v1/totalscore_data?user_id=${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            totalPointsDiv.innerText = `Total Points: ${data.total}`;
            player_name.innerText = `${data.name}`;
        })
        .catch((error) => {
            console.error(error);
        });

    // High Score
    await fetch(`https://wen-world-test.onrender.com/api/v1/highscore_data?user_id=${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            top_scoreDiv.innerText = `Today's Top Score: ${data.points}`
        })
        .catch((error) => {
            console.error(error);
        });
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

document.addEventListener('DOMContentLoaded', async function () {
    await displayLeaderboard();
    await initScore();
});