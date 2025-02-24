# 🏁 Checkers Game

A classic two-player checkers game with an interactive interface and rule-based logic.


![Checkers Board](https://media.istockphoto.com/id/155371886/photo/white-chess-king-among-lying-down-black-pawns-on-chessboard.webp?a=1&b=1&s=612x612&w=0&k=20&c=tgFD7BlBMA18O1JutbGdk5M-eFxsD0oHJqX7FLFJR04=)

---

## 🎯 Overview
This project implements a digital version of the checkers game with an 8x8 board, turn-based gameplay, and rule enforcement. Players move diagonally, capture opponents’ pieces, and promote checkers to kings when they reach the last row.

## 🎮 Game Features
- Interactive 8x8 board with a graphical interface.
- Player pieces are visually distinguishable.
- Turn-based mechanics with move validation.
- Capturing and king promotion.
- Game-over detection and winner display.
- Highlights last move for player clarity.

## 📜 Game Rules
- The game is played on an 8x8 board with alternating dark and light squares.
- Each player starts with 12 checkers on dark squares.
- Players can only move diagonally.
- A checker can jump over an opponent’s piece to capture it.
- When a checker reaches the opponent’s back row, it is promoted to a king and gains backward movement.
- The game ends when a player has no valid moves or loses all pieces.

## 🗂️ Game Data Structure
```json
{
  "board": [
    ["B", " ", "B", " ", "B", " ", "B", " "],
    [" ", "B", " ", "B", " ", "B", " ", "B"],
    ["B", " ", "B", " ", "B", " ", "B", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", "W", " ", "W", " ", "W", " ", "W"],
    ["W", " ", "W", " ", "W", " ", "W", " "],
    [" ", "W", " ", "W", " ", "W", " ", "W"]
  ],
  "currentPlayer": "W",
  "capturedPieces": { "W": 0, "B": 0 },
  "kingedPieces": { "W": [], "B": [] },
  "gameStatus": "ongoing"
}
```

## 🏗️ Game Functions
### 🔹 Initialize Game
```javascript
function initializeGame() {
    // Set up initial board and state
    setCurrentPlayer("W");
    setGameStatus("ongoing");
}
```
### 🔹 Move a Piece
```javascript
function movePiece(start, end) {
    if (checkValidMove(start, end)) {
        executeMove(start, end);
        updateTurn();
    } else {
        alert("Invalid Move");
    }
}
```
### 🔹 Capture a Piece
```javascript
function capturePiece(position) {
    removePiece(position);
    updateCapturedCount();
}
```
### 🔹 Check for Game Over
```javascript
function checkGameOver() {
    if (!hasValidMoves(currentPlayer) || allPiecesCaptured(currentPlayer)) {
        setGameStatus("ended");
        displayWinner();
    }
}
```

## 🚀 Future Enhancements
- 🎨 **Dark/Light mode toggle**
- 🎉 **Confetti animation on win**
- 🔊 **Sound effects for moves and captures**
- 🤖 **AI-powered computer opponent**
- 💾 **Local storage for game state persistence**

---
## 🎲 Play & Have Fun!
Ready to challenge your friends? Stay tuned for upcoming updates and improvements! 🎮✨



