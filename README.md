# 🏁 Checkers Game - Project 1 

A classic two-player checkers game with an interactive interface and rule-based logic. Play [CHECKERS](https://clairecleverlamb.github.io/checkers-game/) here!

---

## 🗺 Overview
This project implements a digital version of the checkers game with an 8x8 board, turn-based gameplay, and rule enforcement. The sentimental value about this game is that it really brought me back to the childhood where I watched my grandpa played with his friends in the parks during the weekends 🏡🌴 we would hang out at the parks and chit-chating 💬, walking our dogs 🐕, having picnics 🧺🍿, and much more, that was one of the best memories for the little me 👧🏻 💌

## 🛠️ Techonologies Used
- HTML5 Canvas
- JavaScript
- CSS
- [Rawpixel](https://www.rawpixel.com/) for designing my theme background 


## Interface theme (Screenshots)
![classic-themed Checkers Board](classic-theme.png)

## Bonus: Interface theme #2 (Screenshots)
![animal-themed Checkers Board](animal-theme.png)


## 🎮 Game Features
- Player pieces are visually distinguishable in the style of Black vs White & 🐶 vs 🐱.
- Turn-based mechanics with move validation, valid pathes are provided for each piece.
- Capturing and king promotion, king pieces are crowned with 👑 or become a 🦁
- Sound effects for selecting, jumping/capturing, kinging, undo, reset, and winning!
- Undo & Reset: undo last move and reset the game at any time.
- Game-over detection and winner display in the messaging box 💬.

## 📜 Rules
- The game is played on an 8x8 board with alternating dark and light squares.
- Each player starts with 12 checkers on dark squares.
- Players can only move diagonally.
- A checker can jump over an opponent’s piece to capture it.
- When a checker reaches the opponent’s back row, it is promoted to a king and gains backward movement(only kings).
- The game ends when a player has no valid moves or loses all pieces.

## 🚀 Stretch Goals 
- 📲 **Mobile version**
- 🌈 **More theme options and piece movement suggestions**
- 🔊 **Forced Jump options for advanced players**
- 🤖 **AI-powered computer opponent**
- 💾 **Local storage for game state persistence**


## 🚁 Attributions

- Sound from [freesound_community](https://pixabay.com/users/freesound_community-46691455/) on pixabay;
- Font from [Google Fonts](https://fonts.google.com/);
- Graphics from [Graphic River](https://graphicriver.net/);
- Icon generator [favicon](https://favicon.io/emoji-favicons/);

Thanks for supporting! 💙

---

## 🏗️ Some Code Snippets & Simple Logics 👩🏼‍💻
### 🔹 Initialize Game
```javascript
function initBoard() {
    boardState = Array(32).fill(null);
    for (let i = 0; i < 12; i++) {
        boardState[i] = { player: 'white', king: false };
    }
    for (let i = 20; i < 32; i++) {
        boardState[i] = { player: "black", king: false };
    }
    renderBoard();
    status.textContent = "Black's Turn";
}
```
### 🔹 Move a Piece
```javascript
function movePiece(toIndex) {

    recordMove(fromIndex, toIndex, capturedIdx !== null ? {index: capturedIdx, piece: capturedPiece} : null, piece);
    movePieceOnBoard(fromIndex, toIndex, piece);

    boardState[toIndex] = piece;
    boardState[fromIndex] = null;
    // King Promotion
    if ((piece.player === 'black' && rowTo === 0) || (piece.player === 'white' && rowTo === 7)) {
        makeKing(piece, toIndex);
    }

}
```
### 🔹 Capture a Piece
```javascript
    if (Math.abs(rowTo - rowFrom) === 2 && Math.abs(colTo - colFrom) === 2) {
        const midRow = (rowFrom + rowTo) / 2;
        const midCol = (colFrom + colTo) / 2;
        capturedIdx = getBoardIndex(midRow, midCol);
        if (capturedIdx !== null && boardState[capturedIdx]) {
            capturedPiece = boardState[capturedIdx]; // store before remove;
            removeCapturedPiece(capturedIdx);
        }
    }
```
### 🔹 Check for Game Over
```javascript
function checkWin() {

    if (blackPieces === 0) winner = 'White';
    else if (whitePieces === 0) winner = 'Black';
    else {
        const hasMoves = boardState.some((piece, idx) => 
            piece && piece.player === currentPlayer && getValidMoves(idx).length > 0
        );
        if (!hasMoves) winner = currentPlayer === 'black' ? 'White' : 'Black';
    }

    if (winner) {
        status.textContent = `${winner} Wins!`;
        playSound(winSound);
        playableSquares.forEach(gridIdx => squares[gridIdx].removeEventListener('click', handleSquareClick));
    } else {
        status.textContent = `${currentPlayer === 'black' ? 'Black' : 'White'}'s Turn`;
    }
}

```


---

