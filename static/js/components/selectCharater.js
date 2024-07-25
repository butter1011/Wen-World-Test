// Charact Selecter js
let selectedCharacter = null;
function selectCharacter(name, imageUrl) {
    selectedCharacter = { name, image: new Image() };
    selectedCharacter.image.src = imageUrl;
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}