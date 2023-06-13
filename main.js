// Initialize the number of rolls remaining and the values of the dice
let rollsRemaining = 3;
let diceValues = [0, 0, 0, 0, 0];
let diceLocked = [false, false, false, false, false];

// Store DOM references for elements accessed multiple times
let diceContainer, diceLocker, rollsRemainingDisplay, rollButton;
let diceElements = Array(5);

document.addEventListener("DOMContentLoaded", () => {
  // Cache the DOM elements here
  diceContainer = document.getElementById("dice-container");
  diceLocker = document.getElementById("dice-locker");
  rollsRemainingDisplay = document.getElementById("rolls-remaining");
  rollButton = document.getElementById("roll-button");

  diceContainer.innerHTML =
    createDie("die-0", "even") +
    createDie("die-1", "odd") +
    createDie("die-2", "even") +
    createDie("die-3", "odd") +
    createDie("die-4", "even");

  // Cache dice elements and add click event listeners to each die
  for (let i = 0; i < 5; i++) {
    diceElements[i] = document.getElementById(`die-${i}`);
    diceElements[i].addEventListener("click", function () {
      if (rollsRemaining < 3) {
        this.classList.toggle("locked");
        this.classList.toggle("unlocked");
        diceLocked[i] = !diceLocked[i];
        (diceLocked[i] ? diceLocker : diceContainer).append(this);
      }
    });
  }
});

// Function to create a die with a given id and even or odd roll class
function createDie(id, evenOrOddRoll) {
  let die = "";

  // Iterate through numbers 1 to 6 to create die items with corresponding dots
  for (let i = 1; i <= 6; i++) {
    let dieItem = "";

    // Add the required number of dots for the current die item
    for (let j = 1; j <= i; j++) {
      dieItem += '<span class="dot"></span>';
    }

    // Wrap the die item with li tag and append it to the die variable
    die += `<li class="die-item" data-side="${i}">${dieItem}</li>`;
  }

  // Wrap the die variable with ol tag and return the complete die element
  return `<ol class="die-list ${evenOrOddRoll}-roll unlocked" data-roll="1" id="${id}">${die}</ol>`;
}

function rollDice() {
  // Select all dice on the screen
  const dice = [...document.querySelectorAll(".die-list")];
  // For each die, toggle its state and set its roll value to a random number between 1 and 6
  dice.forEach((die) => {
    // Get the index of the die from its id
    const i = Number(die.id.slice(4));
    if (!diceLocked[i]) {
      toggleClasses(die);
      diceValues[i] = die.dataset.roll = getRandomNumber(1, 6);
    }
  });
}

// Function to toggle the class of a die.
function toggleClasses(die) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}

// Function gets a random number 1 - 6
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add a click listener for the Roll Dice button
document.getElementById("roll-button").addEventListener("click", function () {
  // If no rolls remaining, alert the user and exit the function
  if (rollsRemaining <= 0) {
    alert("No more rolls left! Please score a category.");
    return;
  }

  // Roll the dice
  rollDice();

  // Decrease the number of rolls remaining and update its value in the UI
  rollsRemaining--;
  document.getElementById(
    "rolls-remaining"
  ).textContent = `Rolls Remaining: ${rollsRemaining}`;
});

function startNewTurn() {
  // Reset the class of all dice elements
  for (let i = 0; i < 5; i++) {
    let die = diceElements[i];
    die.className = `die-list ${i % 2 === 0 ? "even" : "odd"}-roll unlocked`;
    diceLocked[i] = false;

    // Ensure all dice are in the dice container
    diceContainer.append(die);
  }

  // Reset the number of rolls remaining and update its value in the UI
  rollsRemaining = 3;
  rollsRemainingDisplay.textContent = `Rolls Remaining: ${rollsRemaining}`;

  // Enable or disable the Roll Dice button based on the number of rolls remaining
  rollButton.disabled = rollsRemaining === 0;
}

// Function to calculate the score for a given category
function calculateScore(category) {
  let score = 0;
  let diceCount = new Map();

  // Count the number of each die value
  diceValues.forEach((value) => {
    diceCount.set(value, (diceCount.get(value) || 0) + 1);
  });

  // Define the multipliers for the number categories
  const categoryMultipliers = {
    aces: 1,
    twos: 2,
    threes: 3,
    fours: 4,
    fives: 5,
    sixes: 6,
  };

  // If the category is a number category, calculate the score
  if (categoryMultipliers.hasOwnProperty(category)) {
    score =
      categoryMultipliers[category] *
      (diceCount.get(categoryMultipliers[category]) || 0);
  } else {
    // If the category is a special category, calculate the score based on its rules
    switch (category) {
      case "threeOfKind":
        for (let count of diceCount.values()) {
          if (count >= 3) {
            score = diceValues.reduce((a, b) => a + b, 0);
          }
        }
        break;
      case "fourOfKind":
        for (let count of diceCount.values()) {
          if (count >= 4) {
            score = diceValues.reduce((a, b) => a + b, 0);
          }
        }
        break;
      case "fullHouse":
        let counts = [...diceCount.values()];
        if ((counts.includes(2) && counts.includes(3)) || counts.includes(5)) {
          score = 25;
        }
        break;
      case "smallStraight":
        if (
          [1, 2, 3, 4].every((i) => diceValues.includes(i)) ||
          [2, 3, 4, 5].every((i) => diceValues.includes(i)) ||
          [3, 4, 5, 6].every((i) => diceValues.includes(i))
        ) {
          score = 30;
        }
        break;
      case "largeStraight":
        if (
          [1, 2, 3, 4, 5].every((i) => diceValues.includes(i)) ||
          [2, 3, 4, 5, 6].every((i) => diceValues.includes(i))
        ) {
          score = 40;
        }
        break;
      case "chance":
        score = diceValues.reduce((a, b) => a + b, 0);
        break;
      case "yahtzee":
        if ([...diceCount.values()].includes(5)) {
          score = 50;
        }
        break;
      default:
        score = 0;
        break;
    }
  }
  return score;
}

// Add click Event Listeners for each row on the scorecard
let scorecardRows = document.querySelectorAll("#scorecard tr[data-category]");
scorecardRows.forEach((row) => {
  row.addEventListener("click", function () {
    if (this.classList.contains("scored")) {
      return;
    }

    // Calculate and display the score for this category
    let category = this.dataset.category;
    let score = calculateScore(category);
    document.getElementById(`${category}-score`).textContent = score;

    // Mark this category as scored
    this.classList.add("scored");
    this.classList.add("disabled"); // Disable this row

    // Start a new turn if there are unscored categories remaining
    if (
      document.querySelectorAll("#scorecard tr[data-category]:not(.scored)")
        .length > 0
    ) {
      startNewTurn();
    } else {
      alert("Game Over! Thanks for playing.");
    }
  });
});
