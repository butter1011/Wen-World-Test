let serverurl = "https://telegram-1-triend.replit.app";
// let serverurl = "http://localhost:5000";
// let serverurl = "https://telegram-1-Triend.replit.app";
const user = window.Telegram.WebApp.initDataUnsafe.user;
const user_id = user?.id;
// const user_id = 7269635495;

async function init() {
    await fetch(`${serverurl}/api/v1/getTaskStatus`, {
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
                    document.getElementById('followTelegram').classList.add('claim');
                    document.getElementById('followTelegram').innerHTML = 'CLAIM';
                    document.getElementById('followTelegram').onclick = 'claimPoints("followTelegram")';
                }

                if (data.data.inviteFriend != null) {
                    if (data.data.inviteFriend > 9) {
                        document.getElementById('inviteFriend').classList.add('claim');
                        document.getElementById('inviteFriend').innerHTML = 'CLAIMED';
                        document.getElementById('inviteFriend').onclick = '';
                    } else {
                        document.getElementById('inviteText').innerHTML = `${10 - data.data.inviteFriend} / 10`;
                    }
                }

                if (data.data.joinDiscord) {
                    document.getElementById('joinDiscord').classList.add('claim');
                    document.getElementById('joinDiscord').innerHTML = 'claim';
                    document.getElementById('joinDiscord').onclick = 'claimPoints("joinDiscord")';
                }

                if (data.data.joinInstagram) {
                    document.getElementById('joinInstagram').classList.add('claim');
                    document.getElementById('joinInstagram').innerHTML = 'claim';
                    document.getElementById('joinInstagram').onclick = 'claimPoints("joinInstagram")';
                }

                if (data.data.joinTikTok) {
                    document.getElementById('joinTikTok').classList.add('claim');
                    document.getElementById('joinTikTok').innerHTML = 'claim';
                    document.getElementById('joinTikTok').onclick = 'claimPoints("joinTikTok")';
                }

                if (data.data.joinX) {
                    document.getElementById('joinX').classList.add('claim');
                    document.getElementById('joinX').innerHTML = 'claim';
                    document.getElementById('joinX').onclick = 'claimPoints("joinX")';
                }

                if (data.data.learnAbout) {
                    document.getElementById('learnAbout').classList.add('claim');
                    document.getElementById('learnAbout').innerHTML = 'claim';
                    document.getElementById('learnAbout').onclick = 'claimPoints("learnAbout")';
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function claimPoints(parameters) {
    document.getElementById(parameters).classList.delete('claim');
    document.getElementById(parameters).innerHTML = 'CLAIMED';
    document.getElementById(parameters).onclick = '';
    document.getElementById(parameters).disabled = true;
}

async function inviteFriend() {
    window.open(`https://t.me/share/url?url=https://t.me/wenworld_bot?startapp=${user_id}&text=Hey%20there!%F0%9F%8C%9F%0A%20Your%20go-to%20game%20for%20navigating%20the%20crypto%20market%20-%20travel%20the%20world,%20navigate%20the%20bull%20and%20bear%20market,%20and%20dodge%20the%20SEC!%20%F0%9F%8C%8D%F0%9F%93%88%F0%9F%9A%80.%0A%0A%20Start%20farming%20points%20now,%20and%20who%20knows%20what%20cool%20stuff%20you%27ll%20snag%20with%20them%20soon!%20%F0%9F%9A%80%0A%0A%20Got%20friends?%20Bring%20%27em%20in!%20The%20more,%20the%20errier!%20%F0%9F%8C%B1%0A%0A%20Remember:%20World%20of%20Wen%20is%20where%20growth%20thrives%20and%20endless%20opportunities%20are%20discovered!%20%F0%9F%8C%BC%0A%0A`);
}

async function learnClick() {
    window.open('https://triend.gitbook.io/triend-docs-and-litepaper', "_blank");
    await fetch(`${serverurl}/api/v2/learnAbout`, {
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
    window.open('https://t.me/triendapp', "_blank");
    await fetch(`${serverurl}/api/v2/followTelegram`, {
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
    window.open('https://x.com/triendapp', "_blank");
    await fetch(`${serverurl}/api/v2/joinX`, {
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
    window.open('https://www.tiktok.com/@triendapp', '_blank');
    await fetch(`${serverurl}/api/v2/joinTikTok`, {
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
    window.open('https://www.instagram.com/triend.app/?hl=en', '_blank');
    await fetch(`${serverurl}/api/v2/joinInstagram`, {
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
    window.open('https://www.instagram.com/triend.app/?hl=en', '_blank');
    await fetch(`${serverurl}/api/v2/joinInstagram`, {
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
    window.open('https://discord.gg/XZPwtfZjWq', '_blank');
    await fetch(`${serverurl}/api/v2/joinDiscord`, {
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
    if (window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        init();
    }
});