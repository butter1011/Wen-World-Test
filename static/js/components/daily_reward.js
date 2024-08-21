// daily_checkin js
const dailyLoginRewards = [100, 200, 400, 800, 1600, 3200, 5000];
async function dailyCheckIn() {
  const rewards_list = document.getElementsByClassName("reward");
  const claim_btn = document.getElementById("daily_claim");
  const rewards_div = document.getElementById("rewards");
  const checkinCountElement = document.getElementById("check_ins");

  const response = await fetch(`${serverurl}/api/v2/dailyCheckin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user_id }),
  });

  const data = await response.json();
  const claimable = data.claimable;
  let checkinCount = data.dailyCheckin;
  checkinCountElement.innerHTML = checkinCount;

  if (checkinCount > 7) {
    const streak_img = document.createElement("img");
    streak_img.src = "../static/img/daily_reward.png";
    streak_img.classList.add("daily_reward");
    rewards_div.innerHTML = "";
    rewards_div.appendChild(streak_img);
  } else {
    // delete the class
    for (let i = 0; i < rewards_list.length; i++) {
      rewards_list[i].classList.remove("current");
      rewards_list[i].classList.remove("past");
    }

    // add the class
    for (let i = 0; i < checkinCount; i++) {
      if (i == checkinCount - 1) rewards_list[i].classList.add("current");
      else rewards_list[i].classList.add("past");
    }
  }
  // disable the claimbutton
  if (claimable) {
    if (!claim_btn.classList.contains("claimed")) {
      claim_btn.classList.remove("claimed");
      claim_btn.innerHTML = "CLAIM";
    }
    // claim_btn.removeAttribute('disabled');
  } else {
    claim_btn.classList.add("claimed");
    claim_btn.innerHTML = "CLAIMED";
    // claim_btn.setAttribute('disabled', 'disabled');
  }
}

async function dailyClaim() {
  const response = await fetch(`${serverurl}/api/v2/dailyClaim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user_id }),
  });

  await dailyCheckIn();
}

// function updateCheckinCount(count) {
//     document.getElementById('checkin-count').innerText = `Check-ins: ${count}`;
// }

function showModal() {
  document.getElementById("daily-checkin-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("daily-checkin-modal").style.display = "none";
}
