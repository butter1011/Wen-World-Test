let serverurl = "http://localhost:5000";
// let serverurl = "https://telegram-1-Triend.replit.app";
// const user = window.Telegram.WebApp.initDataUnsafe.user;
// const user_id = user?.id;
const user_id = 706939346;

let farmingInterval;
const dailyLoginRewards = [100, 200, 400, 800, 1600, 3200, 5000];
const farmingDuration = 6 * 60 * 60 * 1000;

// init top score and total score
async function initScore() {
    const highScorelist = document.getElementById('high-scores-list');
    const totalScorelist = document.getElementById('total-points-list');
    const total_rank = document.getElementById("total_rank");

    highScorelist.innerHTML = '';
    totalScorelist.innerHTML = '';

    await fetch(`${serverurl}/api/v1/highscore_data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            data.forEach((entry, index) => {
                const highlistItem = document.createElement('div');
                highlistItem.classList.add("score-table");
                highlistItem.innerHTML = `<div style="display:flex; justify-content: space-between;width: 30%;align-items:center"><span class="width:40px;">${index + 1}.</span><img src="${entry.picture}" width="40" height="40" /></div>${entry.name}</span><span style="color:gray;">${entry.points}</span>`;
                highScorelist.appendChild(highlistItem);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    await fetch(`${serverurl}/api/v1/totalscore_data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            let score = 0;
            let rank = 1;
            data.forEach((entry, index) => {
                if (entry.user_id == user_id) {
                    score = entry.points;
                } else {
                    rank++;
                }

                const totallistItem = document.createElement('div');
                totallistItem.classList.add("score-table");
                totallistItem.innerHTML = `<div style="display:flex; justify-content: space-between;width: 30%;align-items:center;"><span class="width:40px;">${index + 1}.</span><img src="${entry.picture}" width="40" height="40" /></div><span>${entry.name}</span><span style="color:gray;">${entry.total}</span>`;
                totalScorelist.appendChild(totallistItem);
                total_rank.innerHTML = `${rank}`;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// get the all the score value
async function displayLeaderboard() {
    const highScorelist = document.getElementById('high-scores-list');
    const totalScorelist = document.getElementById('total-points-list');

    highScorelist.innerHTML = '';
    totalScorelist.innerHTML = '';

    await fetch(`${serverurl}/api/v1/highscore_data`, {
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

    await fetch(`${serverurl}/api/v1/totalscore_data`, {
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
    if (window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        initScore();
    }
});