// Initialize the number of rolls remaining and the values of the dice
let rollsRemaining = 3;
let diceValues = [0, 0, 0, 0, 0];
let diceLocked = [false, false, false, false, false];

// Function to roll the dice
function rollDice() {
  // Select all dice on the screen
  const dice = [...document.querySelectorAll(".die-list")];
  // For each die, toggle its state and set its roll value to a random number between 1 and 6
  dice.forEach((die, i) => {
    if (!diceLocked[i]) {
      toggleClasses(die);
      diceValues[i] = die.dataset.roll = getRandomNumber(1, 6);
    }
  });
}

// Function to toggle the class of a die. This can be used to change its visual state.
function toggleClasses(die) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}

// Function gets a random number between min and max, inclusive.
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

// Function to reset the dice, number of rolls remaining, and re-enable the Roll Dice button for a new turn
function startNewTurn() {
  // Reset the class of all dice elements
  for (let i = 0; i < 5; i++) {
    let die = document.getElementById(`die-${i}`);
    die.className = "die unlocked";
    diceLocked[i] = false;
  }

  // Reset the number of rolls remaining and update its value in the UI
  rollsRemaining = 3;
  document.getElementById(
    "rolls-remaining"
  ).textContent = `Rolls Remaining: ${rollsRemaining}`;

  // Enable or disable the Roll Dice button based on the number of rolls remaining
  document.getElementById("roll-button").disabled = rollsRemaining === 0;
}

// Add click event listeners to each die to lock or unlock it when clicked
for (let i = 0; i < 5; i++) {
  document.getElementById(`die-${i}`).addEventListener("click", function () {
    this.classList.toggle("locked");
    this.classList.toggle("unlocked");
    diceLocked[i] = !diceLocked[i];
  });
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
      case "chance":
        score = diceValues.reduce((a, b) => a + b, 0);
        break;
      case "yahtzee":
        if ([...diceCount.values()].includes(5)) {
          score = 50;
        }
        break;
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
        if (
          [...diceCount.values()].includes(2) &&
          [...diceCount.values()].includes(3)
        ) {
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
    // If this category has already been scored, do nothing
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
