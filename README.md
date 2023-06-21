# Yahtzee Solitaire
#### Video Demo:  <URL HERE>
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