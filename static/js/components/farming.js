// farming js
const farmingDuration = 6 * 60 * 60 * 1000;

async function startFarming() {
    await setFarmingTime();
    document.getElementById('farming-btn').innerHTML = `1000 TP IN ⌛<span id="farming-timer" class="timer">-- : -- : --</span> <span id="claim-point" class="timer"></span>`;
    document.getElementById('farming-btn').onclick = "";
    startFarmingTimer(6 * 60 * 60 * 1000);
}

async function claimPoints() {
    document.getElementById('farming-btn').classList.remove('claimed');
    document.getElementById('farming-btn').innerHTML = `Start Farming`;
    document.getElementById('farming-btn').onclick = startFarming;
    const total_score_ele = document.getElementById('total_score');

    await fetch(`${serverurl}/api/v2/farmingClaim`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then((response) => {
            total_score_ele.innerHTML = parseInt(total_score_ele.innerText) + 1000;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function setFarmingTime() {
    const response = await fetch(`${serverurl}/api/v2/farmingStart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user_id })
    });
    return response;
}

async function getfarmingTime() {
    const response = await fetch(`${serverurl}/api/v1/farmingTime?user_id=${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.farmingTime;
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
            document.getElementById('farming-btn').classList.add('claimed');
            document.getElementById('farming-btn').innerHTML = `CLAIM 1000 TP`;
            document.getElementById('farming-btn').onclick = claimPoints;
            timerElement.style.display = 'none';
        } else {
            timeRemaining -= 1000;
        }
    }, 1000);
}