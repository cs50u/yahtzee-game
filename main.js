// Initialize a game state object with various properties to track the game status.
let gameState = {
  rollsRemaining: 3, // Number of dice rolls remaining for the current turn
  diceValues: Array(5).fill(0), // Stores the current values of the dice
  diceLocked: Array(5).fill(false), // Flags to determine which dice are locked
  hasRolled: false, // Flag to check if the player has rolled the dice at least once in the current turn
  isYahtzeeRoll: false, // Flag to check if the current roll is a Yahtzee (all dice showing the same number)
  yahtzeeScore: null, // Stores the score if a Yahtzee has been rolled, null otherwise
  upperSection: {
    // Tracks the used state and score for each category in the upper section
    aces: { used: false, score: null },
    twos: { used: false, score: null },
    threes: { used: false, score: null },
    fours: { used: false, score: null },
    fives: { used: false, score: null },
    sixes: { used: false, score: null },
  },
  lowerSection: {
    // Tracks the used state and score for each category in the lower section
    threeOfKind: { used: false, score: null },
    fourOfKind: { used: false, score: null },
    fullHouse: { used: false, score: null },
    smallStraight: { used: false, score: null },
    largeStraight: { used: false, score: null },
    yahtzee: { used: false, score: null },
    chance: { used: false, score: null },
  },
  totalScore: 0, // The total score of the player
  turnsTaken: 0, // Tracks the number of turns taken by the player
  upperSectionBonus: false, // Flag to track if the bonus for upper section is obtained
};

// Reference the SVG circles
let rollIndicators = [
  document.getElementById("circle-0"),
  document.getElementById("circle-1"),
  document.getElementById("circle-2"),
];

// Get the game instruction element from the DOM
let gameInstructions = document.getElementById("game-instructions");

// Define the array of instruction prompts
let prompts = [
  "Click 'Roll Dice' button",
  "Roll again, click to lock/unlock dice, or pick a score.",
  "No more rolls left. Click a cell on the scorecard.",
  "Category already scored, pick another.",
];

// Store DOM references for elements accessed multiple times
let diceContainer, diceLocker, rollsRemainingDisplay, rollButton;
let diceElements = Array(5);

function startNewTurn() {
  // Reset hasRolled to false
  gameState.hasRolled = false;

  // Reset the class of all dice elements
  for (let i = 0; i < 5; i++) {
    let die = diceElements[i];
    die.className = `die-list ${i % 2 === 0 ? "even" : "odd"}-roll unlocked`;
    gameState.diceLocked[i] = false;

    // Ensure all dice are in the dice container
    diceContainer.append(die);
  }

  // Reset the number of rolls remaining and update its value in the UI
  gameState.rollsRemaining = 3;
  rollsRemainingDisplay.textContent = `Rolls Remaining: ${gameState.rollsRemaining}`;
  rollIndicators.forEach((circle) => circle.setAttribute("fill", "#D4AF37")); // Yellow color

  // Enable or disable the Roll Dice button based on the number of rolls remaining
  rollButton.disabled = gameState.rollsRemaining === 0;

  gameInstructions.textContent = prompts[0];
}

function isYahtzee() {
  let firstDice = gameState.diceValues[0];
  return gameState.diceValues.every((dice) => dice === firstDice);
}

// Calculates and returns the score based on the category and the current dice values
function calculateScore(category) {
  // Count the occurrences of each dice value
  let diceCounts = Array(7).fill(0);
  let sortedDiceValues = [...gameState.diceValues].sort();

  gameState.diceValues.forEach((value) => diceCounts[value]++);

  // Switch case to handle different scoring rules for each category
  switch (category) {
    case "aces":
    case "twos":
    case "threes":
    case "fours":
    case "fives":
    case "sixes":
      let number =
        category === "aces"
          ? 1
          : category === "twos"
          ? 2
          : category === "threes"
          ? 3
          : category === "fours"
          ? 4
          : category === "fives"
          ? 5
          : 6;
      return diceCounts[number] * number;

    case "threeOfKind":
      return diceCounts.some((count) => count >= 3)
        ? gameState.diceValues.reduce((a, b) => a + b, 0)
        : 0;

    case "fourOfKind":
      return diceCounts.some((count) => count >= 4)
        ? gameState.diceValues.reduce((a, b) => a + b, 0)
        : 0;

    case "fullHouse":
      return diceCounts.some((count) => count === 3) &&
        diceCounts.some((count) => count === 2)
        ? 25
        : 0;

    case "smallStraight":
      // Return 30 for small straight if there are 4 consecutive dice
      return /1.*2.*3.*4|2.*3.*4.*5|3.*4.*5.*6/.test(sortedDiceValues.join(""))
        ? 30
        : 0;

    case "largeStraight":
      // Return 40 for large straight if there are 5 consecutive dice
      return /1.*2.*3.*4.*5|2.*3.*4.*5.*6/.test(sortedDiceValues.join(""))
        ? 40
        : 0;

    case "yahtzee":
      // Special handling for yahtzee category
      if (diceCounts.some((count) => count === 5)) {
        if (gameState.yahtzeeScore === null) {
          gameState.yahtzeeScore = 50;
          return 50;
        } else if (gameState.yahtzeeScore === 50) {
          return 100; // 100 extra points for additional Yahtzees
        }
      }
      return 0;

    case "chance":
      return gameState.diceValues.reduce((a, b) => a + b, 0);

    default:
      return 0;
  }
}

function calculateScoreWithJoker(category) {
  let yahtzeeNumber = gameState.diceValues[0]; // All dice have the same number
  let upperBox = numberToCategory(yahtzeeNumber); // Convert number to corresponding upper box category name

  // Check if category is in upper section
  if (Object.keys(gameState.upperSection).includes(category)) {
    // If the category is the same as the Yahtzee number's category
    if (category === upperBox) {
      // If the corresponding Upper Section box is unused then that category must be used.
      if (!gameState.upperSection[category].used) {
        return yahtzeeNumber * 5;
      } else {
        return 0;
      }
    } else {
      // For all other categories that don't match the Yahtzee number's category, return 0
      return 0;
    }
  }

  // If the corresponding Upper Section box has been used already, a Lower Section box must be used.
  else if (Object.keys(gameState.lowerSection).includes(category)) {
    // If all Lower Section boxes have been used, use an unused Upper Section box and score 0.
    if (
      Object.values(gameState.lowerSection).every((section) => section.used)
    ) {
      return 0;
    }

    switch (category) {
      // 3 of a kind, 4 of kind, and chance are scored as normal.
      case "threeOfKind":
      case "fourOfKind":
      case "chance":
        return calculateScore(category);

      // The Yahtzee acts as a Joker so that the Full House, Small Straight and Large Straight categories can be used to score 25, 30 or 40 (respectively).
      case "fullHouse":
        return 25;
      case "smallStraight":
        return 30;
      case "largeStraight":
        return 40;

      default:
        return 0;
    }
  }
}

// This function converts the dice value to its corresponding category name
function numberToCategory(number) {
  switch (number) {
    case 1:
      return "aces";
    case 2:
      return "twos";
    case 3:
      return "threes";
    case 4:
      return "fours";
    case 5:
      return "fives";
    case 6:
      return "sixes";
    default:
      return null;
  }
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
    let categoryScore = gameState.upperSection[category].score || 0;
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
    let category = categoryRow.getAttribute("data-category");
    let categoryScore;
    if (gameState.upperSection.hasOwnProperty(category)) {
      categoryScore = gameState.upperSection[category].score || 0;
    } else if (gameState.lowerSection.hasOwnProperty(category)) {
      categoryScore = gameState.lowerSection[category].score || 0;
    }
    grandTotalScore += categoryScore;
  });
  return grandTotalScore;
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

  // Display the initial instruction
  gameInstructions.textContent = prompts[0];

  // Add a click event listener to each die. Clicking a die after the first roll in a turn will "lock" that die,
  // preventing it from being rolled in the next roll(s) of the current turn. The die can be "unlocked" by clicking it again.
  for (let i = 0; i < 5; i++) {
    diceElements[i] = document.getElementById(`die-${i}`);
    diceElements[i].addEventListener("click", function () {
      if (gameState.rollsRemaining < 3) {
        this.classList.toggle("locked");
        this.classList.toggle("unlocked");
        gameState.diceLocked[i] = !gameState.diceLocked[i];
        (gameState.diceLocked[i] ? diceLocker : diceContainer).append(this);
      }
    });
  }

  // Add a click listener for the Roll Dice button
  rollButton.addEventListener("click", function () {
    try {
      if (gameState.rollsRemaining <= 0) {
        return;
      }
      // Roll the dice
      rollDice();
      // Check if it's a Yahtzee roll
      gameState.isYahtzeeRoll = isYahtzee();
      // Decrease the number of rolls remaining and update its value in the UI
      gameState.rollsRemaining--;
      rollsRemainingDisplay.textContent = `Rolls Left: ${gameState.rollsRemaining}`;

      // Update the visual indicator
      rollIndicators[gameState.rollsRemaining].setAttribute("fill", "#8b0013"); // Same as table color

      // Disable the button if no rolls left
      if (gameState.rollsRemaining === 0) {
        rollButton.disabled = true;
      }
      if (gameState.rollsRemaining <= 0) {
        gameInstructions.textContent = prompts[2];
        return;
      }
    } catch (error) {
      console.error("An error occurred during the roll:", error);
      // Handle the error appropriately, such as displaying an error message to the user
    } finally {
      // Move the disabling of the button here.
      rollButton.disabled = true;
      setTimeout(() => {
        // Only re-enable the button if there are rolls left.
        if (gameState.rollsRemaining > 0) {
          rollButton.disabled = false;
        }
      }, 1200);
    }
  });

  // Add click Event Listeners for the second column of each row on the scorecard
  let scorecardRows = document.querySelectorAll("#scorecard tr[data-category]");

  scorecardRows.forEach((row) => {
    let secondColumn = row.children[1]; // Get the second column. Note that indexing starts at 0

    secondColumn.addEventListener("click", function () {
      // If the scorecard row has already been scored or no dice have been rolled this turn, ignore the click event.
      // This prevents a category from being scored multiple times and ensures that a category can only be scored after the dice have been rolled.
      if (row.classList.contains("scored") || !gameState.hasRolled) {
        gameInstructions.textContent = prompts[3]; // Display the appropriate message to the user
        return;
      }

      // Calculate and display the score for this category
      let category = row.dataset.category; // Get the category from the clicked row
      let score;

      // Check if the roll is a Yahtzee roll and a Yahtzee score exists
      if (gameState.isYahtzeeRoll && gameState.yahtzeeScore !== null) {
        // If so, calculate the score using the joker rules
        score = calculateScoreWithJoker(category);
      } else {
        // Otherwise, calculate the score normally
        score = calculateScore(category);
      }

      // If the category isn't yahtzee, set the upperSectionUsed for the category corresponding to the first dice value to true
      if (category !== "yahtzee") {
        let numberCategory = numberToCategory(gameState.diceValues[0]); // Convert the dice value to its corresponding category name
        gameState.upperSection[numberCategory].used = true; // Set the upperSection's used property for the corresponding category to true
      }

      // Set the displayed score for the selected category
      document.getElementById(`${category}-score`).textContent = score;

      // Check if the category belongs to the upper section, and if so, update the gameState
      if (Object.keys(gameState.upperSection).includes(category)) {
        gameState.upperSection[category].used = true; // Mark the category as used
        gameState.upperSection[category].score = score; // Update the score for the category
      }
      // Check if the category belongs to the lower section, and if so, update the gameState
      else if (Object.keys(gameState.lowerSection).includes(category)) {
        gameState.lowerSection[category].used = true; // Mark the category as used
        gameState.lowerSection[category].score = score; // Update the score for the category
      }

      // Add the score for the current category to the total score
      gameState.totalScore += score;

      // Reset the isYahtzeeRoll flag
      gameState.isYahtzeeRoll = false;

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

        // Get the leaderboard and its items
        let leaderboard = document.getElementById("leaderboard");
        let scores = Array.from(leaderboard.getElementsByTagName("li"));

        // Find the first score that's lower than the player's score
        let lowerScoreIndex = scores.findIndex((scoreItem) => {
          let score = parseInt(scoreItem.textContent.split(" - ")[1]);
          return grandTotalScore > score;
        });

        // Create the player's leaderboard item
        let playerItem = document.createElement("li");
        playerItem.textContent = `Your Score - ${grandTotalScore}`;
        playerItem.style.color = "yellow"; // Highlight the player's score

        // If the player's score is higher than all leaderboard scores, insert it at the start
        if (lowerScoreIndex === -1) {
          leaderboard.appendChild(playerItem);
        } else {
          // Otherwise, insert it before the first lower score
          leaderboard.insertBefore(playerItem, scores[lowerScoreIndex]);
        }

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
    gameState.hasRolled = true;

    // Select all dice on the screen
    const dice = [...document.querySelectorAll(".die-list")];
    // For each die, toggle its state and set its roll value to a random number between 1 and 6
    dice.forEach((die) => {
      // Get the index of the die from its id
      const i = Number(die.id.slice(4));
      if (!gameState.diceLocked[i]) {
        toggleClasses(die);
        gameState.diceValues[i] = die.dataset.roll = getRandomNumber(1, 6);
      }
    });
    if (gameState.hasRolled) {
      gameInstructions.textContent = prompts[1];
    }
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

  rollsRemainingDisplay.textContent = `Rolls Left: ${gameState.rollsRemaining}`;
});
