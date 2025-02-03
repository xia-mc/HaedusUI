function createCard(name, parentContainer) {
    // Create a new div element for the card
    const card = document.createElement('div');

    // Set the class of the new div to 'card'
    card.className = 'card';

    // Set the inner text of the new div to the name parameter
    card.innerText = name;

    // Append the new div to the parent container
    parentContainer.prepend(card);
}

window.onload = createInitialCards;

function createInitialCards() {
    const parentContainer = document.querySelector('.arr-container');
    const cardNames = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

    cardNames.forEach(name => createCard(name, parentContainer));
}

// Get the button element
const button = document.getElementById("addcard");

// Add an event listener for the "click" event
button.addEventListener("click", function() {
    // Code to execute when the button is clicked
    let randomNumber = Math.random();
    const parentContainer = document.querySelector('.arr-container');
    createCard(randomNumber,parentContainer);
});