let rollsRemaining = 3;
let diceValues = [0, 0, 0, 0, 0];

function rollDice() {
  const dice = [...document.querySelectorAll(".die-list")];
  dice.forEach((die) => {
    toggleClasses(die);
    die.dataset.roll = getRandomNumber(1, 6);
  });
}

function toggleClasses(die) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add a click listener for the Roll Dice button
document.getElementById("roll-button").addEventListener("click", function () {
  // If no rolls remaining, alert and return
  if (rollsRemaining <= 0) {
    alert("No more rolls left! Please score a category.");
    return;
  }

  // Call the rollDice function to roll the dice
  rollDice();

  // Update the number of rolls remaining
  rollsRemaining--;
  document.getElementById(
    "rolls-remaining"
  ).textContent = `Rolls Remaining: ${rollsRemaining}`;
});

// Reset the dice, rolls remaining, and re-enable roll button
function startNewTurn() {
  for (let i = 0; i < 5; i++) {
    document.getElementById(`dice-${i}`).className = "die unheld";
  }

  rollsRemaining = 3;
  document.getElementById(
    "rolls-remaining"
  ).textContent = `Rolls Remaining: ${rollsRemaining}`;

  // Disable the button here, when a new turn is starting
  if (rollsRemaining === 0) {
    document.getElementById("roll-button").disabled = true;
  } else {
    document.getElementById("roll-button").disabled = false;
  }
}

// Calculate the score for a category
function calculateScore(category) {
  let score = 0;
  let diceCount = new Map();

  diceValues.forEach((value) => {
    diceCount.set(value, (diceCount.get(value) || 0) + 1);
  });

  switch (category) {
    case "aces":
      score = diceCount.get(1) || 0;
      break;
    case "twos":
      score = 2 * (diceCount.get(2) || 0);
      break;
    case "threes":
      score = 3 * (diceCount.get(3) || 0);
      break;
    case "fours":
      score = 4 * (diceCount.get(4) || 0);
      break;
    case "fives":
      score = 5 * (diceCount.get(5) || 0);
      break;
    case "sixes":
      score = 6 * (diceCount.get(6) || 0);
      break;
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

  return score;
}

// Add Event Listeners for each row on the scorecard
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
