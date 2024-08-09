let serverurl = "https://telegram-1-triend.replit.app";
// let serverurl = "http://localhost:80";
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
                    document.getElementById('followTelegram').innerHTML = 'Completed';
                    document.getElementById('followTelegram').onclick = '';
                }

                if (data.data.inviteFriend != null) {
                    if (data.data.inviteFriend > 9) {
                        document.getElementById('inviteFriend').classList.add('claim');
                        document.getElementById('inviteFriend').innerHTML = 'Completed';
                        document.getElementById('inviteFriend').onclick = '';
                    }
                        
                    document.getElementById('inviteText').innerHTML = `${10 - data.data.inviteFriend} / 10`;
                }

                if (data.data.joinDiscord) {
                    document.getElementById('joinDiscord').classList.add('claim');
                    document.getElementById('joinDiscord').innerHTML = 'Completed';
                    document.getElementById('joinDiscord').onclick = '';
                }

                if (data.data.joinInstagram) {
                    document.getElementById('joinInstagram').classList.add('claim');
                    document.getElementById('joinInstagram').innerHTML = 'Completed';
                    document.getElementById('joinInstagram').onclick = '';
                }

                if (data.data.joinTikTok) {
                    document.getElementById('joinTikTok').classList.add('claim');
                    document.getElementById('joinTikTok').innerHTML = 'Completed';
                    document.getElementById('joinTikTok').onclick = '';
                }

                if (data.data.joinX) {
                    document.getElementById('joinX').classList.add('claim');
                    document.getElementById('joinX').innerHTML = 'Completed';
                    document.getElementById('joinX').onclick = '';
                }

                if (data.data.learnAbout) {
                    document.getElementById('learnAbout').classList.add('claim');
                    document.getElementById('learnAbout').innerHTML = 'Completed';
                    document.getElementById('learnAbout').onclick = '';
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function inviteFriend() {
    const text = `🚀 Get in on This! 🚀

I'm hooked on this WenWorld game! Navigate the market, grab Wen Coins, and dodge Sammy and the Bear. Verified coins keep it legit, but the risky ones are where the thrill’s at.

Every coin is Triend-verified for trust. High scores and airdrop points up for grabs!

Join the community and let’s see who can top the leaderboard! 🎮💰`

    const encodedText = encodeURIComponent(text);
    window.open(`https://t.me/share/url?url=https://t.me/wen_worldbot?start=${user_id}&text=${encodedText}`);
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

document.addEventListener('DOMContentLoaded', async (event) => {
    if (window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        init();
    }
});