# Yahtzee Solitaire
#### Video Demo:  https://youtu.be/96wRhNzc9J8
#### Description:
## Introduction

This project is a web-based implementation of the classic Yahtzee dice game. It is Yahtzee solitaire; solo-only. Players can roll dice, calculate scores, and try to get a high score.

## Features

- Roll dice with realistic animations
- Calculate scores based on standard Yahtzee rules
- Display an interactive game board

## File Structure

- `index.html`: The main HTML file containing the game board layout
- `style.css`: The CSS file for styling the game elements
- `table.css`: The CSS file for the scorecard table
- `gamecontrols.css`: The CSS file for the game controls
- `dicearea.css`: The CSS file for the dice area
- `howtoplay.css`: The CSS file for the how to play section
- `main.js`: The JavaScript file containing the game logic and interactions


## Installation and Setup

1. Clone the repository: `git clone https://github.com/cs50u/yahtzee-game/'
2. Open `index.html` in your favorite web browser

## Usage

- Click on the 'Roll Dice' button to roll the unlocked dice
- Click any dice to toggle lock/unlock state
- Select the scoring option from the scorecard

## Design Choices

Game Design Document: Yahtzee Solitaire 

Objective: Create a fun, intuitive solitaire Yahtzee game for web browsers adhering to good coding practices and high-quality, clean, modern user interface design. The game is designed for PC users with good vision and dexterity. 

1. User Interface
Divide interface into two sections: Scorecard Table (1/3 left center), Dice Rolling Area and Controls (2/3 right center). User interacts by clicking the mouse on buttons, dice, and scoring area. Roll Dice button centered below the dice. Rolls Remaining in top right corner. When the new game starts, the Roll Dice button should pulsate or glow, to indicate the player should click to start. We can also add an indicator to say "Click 'Roll Dice' to start." After dice are rolled, show the options "Roll again, lock dice, or pick score." Locked dice will be moved out of the grid, unless it is too complicated. If moving the locked dice is too complicated, we can make them visually distinct from unlocked dice.

Scorecard Table: 17 rows, 2 columns for scoring categories, descriptions, and cumulative player scores. Include rows for upper section bonus and Yahtzee bonuses. Total 13 areas for score entry.

Score Card rows should be as follows:
    'Aces',
    'Twos',
    'Threes',
    'Fours',
    'Fives',
    'Sixes',
    'Total',
    'Bonus (if over 63)',
    '3 of a kind',
    '4 of a kind',
    'Full house',
    'Small straight',
    'Large straight',
    'YAHTZEE',
    'Chance',
    'Grand Total'

Colors and Aesthetics: Muted warm palette, white dice with black dots, beige scorecard with shades of warm colors. Good contrast black text. Different color for preview scores. Make clear which scorecard boxes are usable.

Dice Rolling Area: Red felt-lined dark brown tray, dark brown border, wooden table background. Arranged dice, animated tumbling on roll. Two states for dice: 'locked' and 'unlocked'. Move locked dice to a holding area below the unlocked dice. Locked dice will be lined up either directly above or below the Roll Dice button, whichever is easier. Indicator for remaining rolls in the top right corner, sound controls, and any options in the lower right.

Dice Sides: Traditional arrangement of dots, 1 to 6.

The 'Roll Dice' button, an indicator showing remaining rolls, will be located directly below the dice, centered. Any sound control, and an 'Options' button will be in the lower right corner. Rolls Remaining indicator in the top right corner. After the 3rd roll in the turn (0 rolls remaining), the Roll Dice button should change color to indicate it is disabled. If a player tries to click Roll Dice while it is disabled, a message should indicate that the player must select a scoring category.

2. Game Mechanics and Flow
Initial game state: 'unlocked' dice, 'Roll Dice' active. Three rolls remaining to start each turn.

Rolling the Dice: On 'Roll Dice', animate tumbling dice, randomize face value with JavaScript. Use CSS3 method to animate.

Dice State Toggle: Toggle locked/unlocked states on dice click, move locked dice to bench area, lined up at the bottom of the dice area to mimic being held in the player's hands. While the dice are 'locked', the values remain fixed; they are not randomized by the Roll Dice button unless they are 'unlocked'.

Roll Limit: Deactivate 'Roll Dice' after three turns or scoring category selection. If the player tries to Roll Again, show a warning that no Rolls Remain and they must choose a scoring category.

Safeguard against game stalling: disable roll button during animation, re-enable afterwards. Use try/catch blocks for potential errors.

Scoring rules: 
Upper Section:
Aces (Ones): The total of all dice showing the number 1.
Twos: The total of all dice showing the number 2.
Threes: The total of all dice showing the number 3.
Fours: The total of all dice showing the number 4.
Fives: The total of all dice showing the number 5.
Sixes: The total of all dice showing the number 6.
If the total score in the upper section is 63 or more (equivalent to three of each number), a bonus of 35 points is added.
Lower Section Scoring:
Three-of-a-kind: If three dice show the same number, the player scores the total of all five dice.
Four-of-a-kind: If four dice show the same number, the player scores the total of all five dice.
Full House: If the dice show three of one number and two of another (for example, three 4s and two 2s), the player scores 25 points.
Small Straight: If the dice show any sequence of four numbers (for example, 1-2-3-4, 2-3-4-5, or 3-4-5-6), the player scores 30 points.
Large Straight: If the dice show a sequence of five numbers (either 1-2-3-4-5 or 2-3-4-5-6), the player scores 40 points.
Yahtzee: If all five dice show the same number, the player scores 50 points. If the player rolls another Yahtzee during the game, they score a bonus of 100 points for each additional Yahtzee.
Chance: The player scores the total of all five dice.
Additional Scoring Rules:
Each player gets 13 turns in a game (one for each scoring category).
The player must choose a scoring category after each roll, even if the score is zero.
Once a scoring category has been used in the game, it cannot be used again.
The objective is to maximize your total score (the sum of the upper and lower sections).
A Yahtzee occurs when all five dice are the same. If the player throws a Yahtzee and has already filled the Yahtzee box with a score of 50, they score a Yahtzee bonus and get an extra 100 points. However, if they throw a Yahtzee and have filled the Yahtzee category with a score of 0, they do not get a Yahtzee bonus.
In either case they then select a category, as usual. Scoring is the same as normal except that, if the Upper Section box corresponding to the Yahtzee has been used, the Full House, Small Straight and Large Straight categories can be used to score 25, 30 or 40 (respectively) even though the dice do not meet the normal requirement for those categories. In this case the Yahtzee is said to act as a "Joker".
Joker rules:
In the Joker rules the player must act in the following way:
If the corresponding Upper Section box is unused then that category must be used.
If the corresponding Upper Section box has been used already, a Lower Section box must be used. 3 of a kind, 4 of a kind, and chance are scored as normal. The Yahtzee acts as a Joker so that the Full House, Small Straight and Large Straight categories can be used to score 25, 30 or 40 (respectively).
If the corresponding Upper Section box and all Lower Section boxes have been used, an unused Upper Section box must be used, scoring 0.

End of Game:
The game ends once all 13 categories have been scored.
The player with the highest total score wins. If there's a tie, the player with the highest upper section score wins.

Preview Scores: After each roll, preview scores for each category are calculated and displayed in the 'Score' column of the Scorecard Table in Green. This allows the player to see what they could score if they clicked the Green preview. No undoing scores. Allow score entry in any order, once per category. A player may enter only 1 score per turn. After a player enters a score the color of the value will change from Green to the standard black font. no other scores can be entered until the next turn. 

Scoring Selection: After each turn, the player selects a scoring category by clicking the score box to make it their final choice. 

3. Sound Effects
No sound effects for now. It would only be 1 sound effect and it would get repetitive and annoying.

4. End of Game
Display game summary with Grand total score, category scores, and bonuses in an integrated window. Show the player's grade or some fictional local leaderboard to compare the player's score to. Include replay option to reset all states without needing to refresh the page.

5. Performance and Optimizations
Ensure smooth game running, optimize assets, and follow efficient coding practices.

Tech Stack: VS Code, HTML/CSS/JavaScript, HTML5 Canvas API, CSS Grid, CSS3 3D transform, flexbox.


The style was that of a classic casino or table game setting. The UI is clear, easy to read, dark backgrounds with light text. The dice animations were implemented using CSS animations inspired by [this source](https://codesandbox.io/s/animated-3d-dice-roll-eorl0). This choice was made because CSS animations provide smooth and realistic animations without the need for external libraries. The Roll Dice button was modeled to resemble the Amazon "Add to Cart" button.

## Credits

- Tina, for the idea for making Yahtzee and being awesome!
- CSS animations for dice rolls inspired by [this source](https://codesandbox.io/s/animated-3d-dice-roll-eorl0)

## Roadmap

- Add sound effects
- Add Interactive Tutorial for new players
- Add AI opponent
- Add multiplayer support
- Implement a leaderboard system
- Improve the user interface and design