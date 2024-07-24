const infoButton = document.getElementById("info-button");
const infoClose = document.getElementById("info-close");
const infoModal = document.getElementById("info-modal");
infoButton.onclick = function () {
    infoModal.style.display = "flex";
    infoButton.style.display = "none";
}

infoClose.onclick = function () {
    infoModal.style.display = "none";
    infoButton.style.display = "flex";
    infoButton.innerHTML = "i";
    infoModal.style.display = "none";
    document.getElementById("opening-page").style.display = "flex";
}

window.onclick = function (event) {
    if (event.target === infoModal) {
        infoModal.style.display = "none";
        infoButton.innerHTML = "i";
        infoButton.style.display = "flex";
        // document.getElementById("opening-page").style.display = "flex";
        // document.getElementById("header").style.display = "flex";
    }
}
async function inviteFriend() {
    user_id = 12345678;
    window.open(`https://t.me/share/url?url=https://t.me/wenworld_bot?startapp=${user_id}&text=Hey%20there!%F0%9F%8C%9F%0A%20Your%20go-to%20game%20for%20navigating%20the%20crypto%20market%20-%20travel%20the%20world,%20navigate%20the%20bull%20and%20bear%20market,%20and%20dodge%20the%20SEC!%20%F0%9F%8C%8D%F0%9F%93%88%F0%9F%9A%80.%0A%0A%20Start%20farming%20points%20now,%20and%20who%20knows%20what%20cool%20stuff%20you%27ll%20snag%20with%20them%20soon!%20%F0%9F%9A%80%0A%0A%20Got%20friends?%20Bring%20%27em%20in!%20The%20more,%20the%20errier!%20%F0%9F%8C%B1%0A%0A%20Remember:%20World%20of%20Wen%20is%20where%20growth%20thrives%20and%20endless%20opportunities%20are%20discovered!%20%F0%9F%8C%BC%0A%0A`);
}

async function init() {
    user_id = 12345678
    await fetch('https://wen-world-test.onrender.com/api/v1/getTaskStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                if (data.data.followTelegram) {
                    document.getElementById('followTelegram').classList.add('completed');
                    document.getElementById('followTelegram').innerHTML = 'Completed';
                    document.getElementById('followTelegram').onclick = '';
                }

                if (data.data.inviteFriend != null) {
                    if (data.data.inviteFriend > 9) {
                        document.getElementById('inviteFriend').classList.add('completed');
                        document.getElementById('inviteFriend').innerHTML = 'Completed';
                        document.getElementById('inviteFriend').onclick = '';
                    } else {
                        document.getElementById('inviteText').innerHTML = `${data.data.inviteFriend} / 10`;
                    }
                }

                if (data.data.joinDiscord) {
                    document.getElementById('joinDiscord').classList.add('completed');
                    document.getElementById('joinDiscord').innerHTML = 'Completed';
                    document.getElementById('joinDiscord').onclick = '';
                }

                if (data.data.joinInstagram) {
                    document.getElementById('joinInstagram').classList.add('completed');
                    document.getElementById('joinInstagram').innerHTML = 'Completed';
                    document.getElementById('joinInstagram').onclick = '';
                }

                if (data.data.joinTikTok) {
                    document.getElementById('joinTikTok').classList.add('completed');
                    document.getElementById('joinTikTok').innerHTML = 'Completed';
                    document.getElementById('joinTikTok').onclick = '';
                }

                if (data.data.joinX) {
                    document.getElementById('joinX').classList.add('completed');
                    document.getElementById('joinX').innerHTML = 'Completed';
                    document.getElementById('joinX').onclick = '';
                }

                if (data.data.learnAbout) {
                    document.getElementById('learnAbout').classList.add('completed');
                    document.getElementById('learnAbout').innerHTML = 'Completed';
                    document.getElementById('learnAbout').onclick = '';
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function learnClick() {
    const user_id = user.id
    window.open('https://triend.gitbook.io/triend-docs-and-litepaper', "_blank");
    await fetch('/api/v2/learnAbout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function followTelegram() {
    const user_id = user.id
    window.open('https://t.me/triendapp', "_blank");
    await fetch('https://wen-world-test.onrender.com/api/v2/followTelegram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function joinX() {
    const user_id = user.id
    window.open('https://x.com/triendapp', "_blank");
    await fetch('https://wen-world-test.onrender.com/api/v2/joinX', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function joinTikTok() {
    const user_id = user.id
    window.open('https://www.tiktok.com/@triendapp', '_blank');
    await fetch('https://wen-world-test.onrender.com/api/v2/joinTikTok', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function joinInstagram() {
    const user_id = user.id
    window.open('https://www.instagram.com/triend.app/?hl=en', '_blank');
    await fetch('https://wen-world-test.onrender.com/api/v2/joinInstagram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function joinInstagram() {
    const user_id = user.id
    window.open('https://www.instagram.com/triend.app/?hl=en', '_blank');
    await fetch('https://wen-world-test.onrender.com/api/v2/joinInstagram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function joinDiscord() {
    const user_id = user.id
    window.open('https://discord.gg/XZPwtfZjWq', '_blank');
    await fetch('https://wen-world-test.onrender.com/api/v2/joinDiscord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'user_id': user_id })
    })
        .then(response => {
            init();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function navigateTo(page) {
    window.location.href = `/${page}`;
}

function navigateToHome() {
    window.location.href = '/';
}

function completeTask(button, points, url) {
    window.open(url, '_blank');
    let tridendAmount = parseInt(localStorage.getItem('tridendAmount')) || 0;
    tridendAmount += points;
    localStorage.setItem('tridendAmount', tridendAmount);
    updateLeaderboard(points);
    button.innerText = "Completed";
    button.classList.add("completed");
    button.disabled = true;
}

document.addEventListener('DOMContentLoaded', async (event) => {
    init();
});