// Info modal script
const infoButton = document.getElementById("info-button");
const infoClose = document.getElementById("info-close");
const infoModal = document.getElementById("info-modal");

infoButton.onclick = function () {
  infoButton.style.display = "none";
  infoModal.style.display = "flex";
  infoClose.style.display = "flex";
};

infoClose.onclick = function () {
  infoModal.style.display = "none";
  infoButton.innerHTML = "i";
  infoButton.style.display = "flex";
  infoClose.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === infoModal) {
    infoModal.style.display = "none";
    infoButton.innerHTML = "i";
    infoButton.style.display = "flex";
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  if (window.Telegram.WebApp) {
    Telegram.WebApp.ready();
  }

  // Select all character cards
  const infoBtns = document.querySelectorAll(".infoBtn");

  infoBtns.forEach(function (infoBtn) {
    // Add touchstart event listener
    infoBtn.addEventListener("touchstart", function () {
      infoBtn.classList.add("selected");
    });

    infoBtn.addEventListener("touchend", function () {
      infoBtn.classList.remove("selected");
    });
  });
});
