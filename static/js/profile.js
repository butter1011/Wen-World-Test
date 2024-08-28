let serverurl = "https://triend-wenworldgame-05ef17649d0d.herokuapp.com";
const user = window.Telegram.WebApp.initDataUnsafe.user;
const user_id = user?.id;

function convertToUnixTimestamp(dateString) {
  if (dateString != "") {
    const [datePart, timePart] = dateString.split(":");
    const [month, day, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split("-").map(Number);
    // 08/06/24:17-12-19
    const date = new Date(
      Date.UTC(`20${year}`, month - 1, day, hours, minutes, seconds)
    );
    console.log("------------>date", date);
    return date.getTime();
  } else return 0;
}

async function init() {
  const scoreElement = document.getElementById("total_score");
  const checkinCountElement = document.getElementById("check_ins");
  const highScoreElement = document.getElementById("high_score");
  const profileImage = document.getElementById("profile-img");
  const nickname = document.getElementById("nickname");

  await fetch(`${serverurl}/api/v1/getUserInfo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      scoreElement.innerHTML = "TP " + data.data.total_score;
      checkinCountElement.innerHTML = data.data.dailyCheckin;
      highScoreElement.innerHTML = data.data.high_score;
      profileImage.src =
        data.data.picture != ""
          ? `data:image/png;base64,${data.data.picture}`
          : "../static/img/profile.png";
      nickname.innerHTML =
        data.data.user_name == "" ? "-----" : data.data.user_name;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // startfarming button init
  const currentTime = await getCurrentTime();
  const lastTime = await getfarmingTime();

  if (lastTime === 0) {
    document.getElementById("farming-btn").classList.remove("claimed");
    document.getElementById("farming-btn").innerHTML = `Start Farming`;
    document.getElementById("farming-btn").onclick = startFarming;
  } else {
    const convert_lastTime = convertToUnixTimestamp(lastTime);
    const farmingDuration = currentTime - convert_lastTime;

    if (farmingDuration > 6 * 1000 * 3600) {
      document.getElementById("farming-btn").classList.add("claimed");
      document.getElementById("farming-btn").innerHTML = `CLAIM 1000 TP`;
      document.getElementById("farming-btn").onclick = claimPoints;
    } else {
      document.getElementById("farming-btn").classList.remove("claimed");
      document.getElementById(
        "farming-btn"
      ).innerHTML = `1000 TP IN ⌛<span id="farming-timer" class="timer">-- : -- : --</span> <span id="claim-point" class="timer"></span>`;
      document.getElementById("farming-btn").onclick = "";
      startFarmingTimer(6 * 1000 * 3600 - farmingDuration);
    }
  }

  dailyCheckIn();
}

document.getElementById("nickname").addEventListener("click", function () {
  const nicknameElement = document.getElementById("nickname");
  const currentNickname = nicknameElement.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("input-nickname");
  input.value = currentNickname;
  input.id = "nickname-input";

  nicknameElement.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => {
    const newNickname = input.value;
    nicknameElement.textContent =
      newNickname == "" ? currentNickname : newNickname;
    input.replaceWith(nicknameElement);

    // Send the updated nickname to the backend
    fetch(`${serverurl}/api/v2/updateName`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user_id, name: newNickname }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Nickname updated successfully");
        } else {
          console.error("Error updating nickname");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

// document.getElementById('upload-img').addEventListener('change', function () {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//         document.getElementById('profile-img').src = e.target.result;
//         localStorage.setItem('profileImage', e.target.result);
//     }
//     reader.readAsDataURL(this.files[0]);
// });

async function getCurrentTime() {
  const response = await fetch(
    `${serverurl}/api/v1/currentTime?user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );    
  const data = await response.json();
  return data.currentTime;
}

document.addEventListener("DOMContentLoaded", async (event) => {
  if (window.Telegram.WebApp) {
    Telegram.WebApp.ready();
    init();
  }

  // add touch event to profile-section
  const profileCard = document.querySelector(".profile-section");

  profileCard.addEventListener("touchstart", function () {
    profileCard.classList.add("selected");
  });

  profileCard.addEventListener("touchend", function () {
    profileCard.classList.remove("selected");
  });

  // add touch event to farming button
  const farmingBtn = document.querySelector(".farming-button");

  farmingBtn.addEventListener("touchstart", function () {
    farmingBtn.classList.add("selected");
  });

  farmingBtn.addEventListener("touchend", function () {
    farmingBtn.classList.remove("selected");
  });
});
