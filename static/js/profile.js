let serverurl = "https://wen-world-test.onrender.com";
// let serverurl = "http://localhost:5000";
// let serverurl = "https://telegram-1-Triend.replit.app";
const user = window.Telegram.WebApp.initDataUnsafe.user;
const user_id = user?.id;

async function init() {
    const scoreElement = document.getElementById("top-score");
    const checkinCountElement = document.getElementById("checkin-count");
    const highScoreElement = document.getElementById("tridend-amount");

    await fetch(`${serverurl}/api/v1/getUserInfo`, {
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

    updateCheckinCount(checkinCount);
    dailyCheckIn();
}

document.getElementById('upload-img').addEventListener('change', function () {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('profile-img').src = e.target.result;
        localStorage.setItem('profileImage', e.target.result);
    }
    reader.readAsDataURL(this.files[0]);
});

async function getCurrentTime() {
    const response = await fetch(`${serverurl}/api/v1/currentTime?user_id=${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.currentTime;
}

document.addEventListener('DOMContentLoaded', async (event) => {
    if (window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        init();
    }
});

// async function update_name(username) {
//     const response = await fetch(`${serverurl}/api/v2/updateName`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ user_id: user_id, name: username })
//     });

//     init();
// }