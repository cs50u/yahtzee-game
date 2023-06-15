// Initialize game variables for number of rolls, dice values, dice lock state,
// yahtzee score, and the state of the upper section.
let rollsRemaining = 3;
let diceValues = Array(5).fill(0);
let diceLocked = Array(5).fill(false);
let hasRolled = false;
let yahtzeeScore = null; // null means Yahtzee category is not filled yet
let upperSectionUsed = {
  aces: false,
  twos: false,
  threes: false,
  fours: false,
  fives: false,
  sixes: false,
};

// Store DOM references for elements accessed multiple times
let diceContainer, diceLocker, rollsRemainingDisplay, rollButton;
let diceElements = Array(5);

function startNewTurn() {
  // Reset hasRolled to false
  hasRolled = false;

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
        if (yahtzeeScore !== null && upperSectionUsed[diceValues[0]]) {
          // If Yahtzee box is filled and the corresponding Upper Section box has been used
          score = 25;
        } else {
          let counts = [...diceCount.values()];
          if (
            (counts.includes(2) && counts.includes(3)) ||
            counts.includes(5)
          ) {
            score = 25;
          }
        }
        break;
      case "smallStraight":
        if (yahtzeeScore !== null && upperSectionUsed[diceValues[0]]) {
          // If Yahtzee box is filled and the corresponding Upper Section box has been used
          score = 30;
        } else {
          if (
            [1, 2, 3, 4].every((i) => diceValues.includes(i)) ||
            [2, 3, 4, 5].every((i) => diceValues.includes(i)) ||
            [3, 4, 5, 6].every((i) => diceValues.includes(i))
          ) {
            score = 30;
          }
        }
        break;
      case "largeStraight":
        if (yahtzeeScore !== null && upperSectionUsed[diceValues[0]]) {
          // If Yahtzee box is filled and the corresponding Upper Section box has been used
          score = 40;
        } else {
          if (
            [1, 2, 3, 4, 5].every((i) => diceValues.includes(i)) ||
            [2, 3, 4, 5, 6].every((i) => diceValues.includes(i))
          ) {
            score = 40;
          }
        }
        break;
      case "chance":
        score = diceValues.reduce((a, b) => a + b, 0);
        break;

      // If a Yahtzee is rolled (all dice have the same value), the scoring depends on the current state of the Yahtzee score:
      //   If the Yahtzee score box is empty, the score is 50.
      //   If the Yahtzee score box already contains a 50, the score is incremented by 100.
      //   If the Yahtzee score box contains a 0, the score remains 0.
      case "yahtzee":
        if ([...diceCount.values()].includes(5)) {
          if (yahtzeeScore === null) {
            // If Yahtzee box has not yet been filled
            yahtzeeScore = score = 50;
          } else if (yahtzeeScore >= 50) {
            // If Yahtzee box has been filled with a score of 50
            score += 100;
            yahtzeeScore += 100;
          } else if (yahtzeeScore === 0) {
            // If Yahtzee box has been filled with a score of 0
            score = 0;
          }
        }
        break;
    }
  }
  return score;
}

// This function calculates the total score for the upper half categories in the game of Yahtzee.
// The upper half categories are: aces, twos, threes, fours, fives, and sixes.
function calculateTotalUpperHalfScore() {
  let totalScore = 0; // Initialize the total score to 0
  let upperHalfCategories = [
    // Define the categories for the upper half of the scorecard
    "aces",
    "twos",
    "threes",
    "fours",
    "fives",
    "sixes",
  ];

  // For each category in the upper half, get the score from the scorecard and add it to the total score
  upperHalfCategories.forEach((category) => {
    let categoryScore =
      parseInt(document.getElementById(`${category}-score`).textContent) || 0; // If the score is not a number, default to 0
    totalScore += categoryScore;
  });

  return totalScore; // Return the total score for the upper half categories
}

// This function calculates the bonus score.
// In Yahtzee, if the total score for the upper half categories is 63 or more, the player is awarded a bonus of 35 points.
function calculateBonusScore(totalScore) {
  return totalScore >= 63 ? 35 : 0; // Return 35 if the total score is 63 or more, otherwise return 0
}

// This function calculates the grand total score for all categories in the game of Yahtzee.
function calculateGrandTotalScore() {
  let grandTotalScore = 0; // Initialize the grand total score to 0

  // Get all the rows in the scorecard that correspond to a scoring category
  let allCategories = [
    ...document.querySelectorAll("#scorecard tr[data-category]"),
  ];

  // For each category, get the score from the scorecard and add it to the grand total score
  allCategories.forEach((categoryRow) => {
    let categoryScore =
      parseInt(categoryRow.querySelector("td:nth-child(2)").textContent) || 0; // If the score is not a number, default to 0
    grandTotalScore += categoryScore;
  });

  return grandTotalScore; // Return the grand total score
}

// The DOMContentLoaded event is used to ensure that the HTML is fully loaded before the script runs.
document.addEventListener("DOMContentLoaded", () => {
  // Cache the DOM elements here
  diceContainer = document.getElementById("dice-container");
  diceLocker = document.getElementById("dice-locker");
  rollsRemainingDisplay = document.getElementById("rolls-remaining");
  rollButton = document.getElementById("roll-button");

  // The initial HTML for the diceContainer is created and added.
  diceContainer.innerHTML =
    createDie("die-0", "even") +
    createDie("die-1", "odd") +
    createDie("die-2", "even") +
    createDie("die-3", "odd") +
    createDie("die-4", "even");

  // Add a click event listener to each die. Clicking a die after the first roll in a turn will "lock" that die,
  // preventing it from being rolled in the next roll(s) of the current turn. The die can be "unlocked" by clicking it again.
  for (let i = 0; i < 5; i++) {
    diceElements[i] = document.getElementById(`die-${i}`);
    diceElements[i].addEventListener("click", function () {
      // If rolls Remaining is less than 3 and the die is locked, move it to the diceLocker element. Otherwise, move it back to the diceContainer.
      if (rollsRemaining < 3) {
        this.classList.toggle("locked");
        this.classList.toggle("unlocked");
        diceLocked[i] = !diceLocked[i];
        (diceLocked[i] ? diceLocker : diceContainer).append(this);
      }
    });
  }
  // Add a click listener for the Roll Dice button
  rollButton.addEventListener("click", function () {
    // If no rolls remaining, alert the user and exit the function
    if (rollsRemaining <= 0) {
      alert("No more rolls left! Please score a category.");
      return;
    }

    // Roll the dice
    rollDice();

    // Decrease the number of rolls remaining and update its value in the UI
    rollsRemaining--;
    rollsRemainingDisplay.textContent = `Rolls Left: ${rollsRemaining}`;

    // Disable the button if no rolls left
    if (rollsRemaining === 0) {
      rollButton.disabled = true;
    }
  });

  // Add click Event Listeners for the second column of each row on the scorecard
  let scorecardRows = document.querySelectorAll("#scorecard tr[data-category]");

  scorecardRows.forEach((row) => {
    let secondColumn = row.children[1]; // Get the second column. Note that indexing starts at 0

    secondColumn.addEventListener("click", function () {
      // If the scorecard row has already been scored or no dice have been rolled this turn, ignore the click event.
      // This prevents a category from being scored multiple times and ensures that a category can only be scored after the dice have been rolled.
      if (row.classList.contains("scored") || !hasRolled) {
        return;
      }

      // Calculate and display the score for this category
      let category = row.dataset.category;
      let score = calculateScore(category);
      if (category !== "yahtzee") {
        upperSectionUsed[diceValues[0]] = true; // Mark the corresponding Upper Section box as used
      }
      document.getElementById(`${category}-score`).textContent = score;

      // Mark this category as scored
      row.classList.add("scored");
      row.classList.add("disabled"); // Disable this row

      // Calculate and update the total upper half score and the bonus score
      let totalUpperHalfScore = calculateTotalUpperHalfScore();
      document.getElementById("upper-total-score").textContent =
        totalUpperHalfScore;

      let bonusScore = calculateBonusScore(totalUpperHalfScore);
      document.getElementById("bonus-score").textContent = bonusScore;

      // Start a new turn if there are unscored categories remaining
      if (
        document.querySelectorAll("#scorecard tr[data-category]:not(.scored)")
          .length > 0
      ) {
        startNewTurn();
      } else {
        // Calculate and update the grand total score
        let grandTotalScore = calculateGrandTotalScore();
        document.getElementById("grand-total-score").textContent =
          grandTotalScore;

        // Update the game over message with the final score
        document.getElementById(
          "game-over-message"
        ).textContent = `Game Over! Your Grand Total score is ${grandTotalScore}. Thanks for playing.`;

        // Display the modal
        document.getElementById("myModal").style.display = "block";
      }
      rollButton.disabled = false;
    });
  });

  // Add click event listeners for the Play Again and Quit buttons in the modal
  document.getElementById("play-again").addEventListener("click", function () {
    // Reload the page to start a new game
    location.reload();
  });

  document.getElementById("quit").addEventListener("click", function () {
    // Close the modal
    document.getElementById("myModal").style.display = "none";
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
    // Set hasRolled to true
    hasRolled = true;

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

  rollsRemainingDisplay.textContent = `Rolls Left: ${rollsRemaining}`;
});
