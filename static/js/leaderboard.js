// let serverurl = "https://wen-world-test.onrender.com";
let serverurl = "http://localhost:5000";
// let serverurl = "https://telegram-1-Triend.replit.app";
const user = window.Telegram.WebApp.initDataUnsafe.user;
// const user_id = user?.id;
const user_id = 7269635495;

let farmingInterval;
const dailyLoginRewards = [100, 200, 400, 800, 1600, 3200, 5000];
const farmingDuration = 6 * 60 * 60 * 1000;
const defautlSvg = `<svg fill="#FFFFFF" height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<g>
	<g>
		<path d="M256,0c-84.83,0-153.6,85.965-153.6,192S171.17,384,256,384s153.6-85.965,153.6-192S340.83,0,256,0z M256,358.4
			c-70.579,0-128-74.65-128-166.4S185.421,25.6,256,25.6S384,100.25,384,192S326.579,358.4,256,358.4z"/>
	</g>
</g>
<g>
	<g>
		<path d="M367.812,361.762c-6.869,6.682-14.182,12.689-21.82,18.099c24.388,11.332,45.781,20.753,64.051,28.732
			c67.797,29.585,76.356,35.439,76.356,52.207c0,11.597-11.418,25.6-25.6,25.6H51.2c-14.182,0-25.6-14.003-25.6-25.6
			c0-16.768,8.559-22.622,76.348-52.207c18.278-7.979,39.671-17.399,64.051-28.732c-7.637-5.41-14.95-11.418-21.82-18.099
			C37.598,410.539,0,417.075,0,460.8C0,486.4,22.921,512,51.2,512h409.6c28.279,0,51.2-25.6,51.2-51.2
			C512,417.075,474.402,410.539,367.812,361.762z"/>
	</g>
</g>
</svg>`;

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
                highlistItem.innerHTML = `<div style="display:flex; justify-content: space-between;width: 30%;align-items:center"><span class="width:40px;">${index + 1}.</span>${entry.picture != "" ? (`<img src='${entry.picture}' width='40' height='40' />`) : defautlSvg}</div>${entry.name}</span><span style="color:gray;">${entry.points}</span>`;
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
                totallistItem.innerHTML = `<div style="display:flex; justify-content: space-between;width: 30%;align-items:center;"><span class="width:40px;">${index + 1}.</span>${entry.picture != "" ? (`<img src='${entry.picture}' width='40' height='40' />`) : defautlSvg}</div><span>${entry.name}</span><span style="color:gray;">${entry.total}</span>`;
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