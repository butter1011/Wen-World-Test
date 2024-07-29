let serverurl = "https://wen-world-test.onrender.com";
// let serverurl = "http://localhost:5000";
// let serverurl = "https://telegram-1-Triend.replit.app";
const user = window.Telegram.WebApp.initDataUnsafe.user;
const user_id = user?.id;
// const user_id = 7269635495;

function convertToUnixTimestamp(dateString) {
    const [datePart, timePart] = dateString.split(':');
    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split('-').map(Number);
    const date = new Date(`20${year}`, month - 1, day, hours, minutes, seconds);

    return date.getTime();
}

async function init() {
    const scoreElement = document.getElementById("total_score");
    const checkinCountElement = document.getElementById("check_ins");
    const highScoreElement = document.getElementById("high_score");
    const profileImage = document.getElementById("profile-img");
    const nickname = document.getElementById("nickname");

    await fetch(`${serverurl}/api/v1/getUserInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => response.json())
        .then((data) => {
            scoreElement.innerHTML = data.data.total_score;
            checkinCountElement.innerHTML = data.data.dailyCheckin;
            highScoreElement.innerHTML = data.data.high_score;
            profileImage.src = data.data.picture != "" ? data.data.picture : "{{ url_for('static', filename='img/profile.png') }}";
            nickname.innerHTML = data.data.user_name;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // startfarming button init
    const currentTime = await getCurrentTime();
    const lastTime = await getfarmingTime();
    
    const convert_lastTime = convertToUnixTimestamp(lastTime);
    const farmingDuration = currentTime - convert_lastTime;

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

    dailyCheckIn();
}

document.getElementById('nickname').addEventListener('click', function(){
    const nicknameElement = document.getElementById('nickname');
    const currentNickname = nicknameElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentNickname;
    input.id = 'nickname-input';

    nicknameElement.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
        const newNickname = input.value;
        nicknameElement.textContent = newNickname;
        input.replaceWith(nicknameElement);

        // Send the updated nickname to the backend
        fetch(`${serverurl}/api/v2/updateName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user_id, name: newNickname })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Nickname updated successfully');
            } else {
                console.error('Error updating nickname');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

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