// Info modal script
const infoButton = document.getElementById("info-button");
const infoClose = document.getElementById("info-close");
const infoModal = document.getElementById("info-modal");

infoButton.onclick = function () {
    infoModal.style.display = "flex";
    infoButton.style.display = "none";
    infoClose.style.display = "flex";
}

infoClose.onclick = function () {
    infoModal.style.display = "none";
    infoButton.innerHTML = "i";
    infoButton.style.display = "flex";
    infoClose.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === infoModal) {
        infoModal.style.display = "none";
        infoButton.innerHTML = "i";
        infoButton.style.display = "flex";
    }
}