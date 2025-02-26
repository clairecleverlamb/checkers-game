// planning 
// Generate the 8x8 board programmatically.
// Place the initial pieces (12 red, 12 black).
// Add click-based movement with legal move validation.
// style pieces later 

// //1) Define the required variables used to track the state of the game.

let boardState = Array(32).fill(null);
let currentPlayer = 'black';
let selectedPiece = null;
let validMoves = [];

//2) Store cached element references.

const grid = document.querySelector('.grid');
const squares = Array.from(grid.querySelectorAll('div'));
const playableSquares = [
  1, 3, 5, 7,      // Row 8: B8, D8, F8, H8
  8, 10, 12, 14,   // Row 7: A7, C7, E7, G7
  17, 19, 21, 23,  // Row 6: B6, D6, F6, H6
  24, 26, 28, 30,  // Row 5: A5, C5, E5, G5
  33, 35, 37, 39,  // Row 4: B4, D4, F4, H4
  40, 42, 44, 46,  // Row 3: A3, C3, E3, G3
  49, 51, 53, 55,  // Row 2: B2, D2, F2, H2
  56, 58, 60, 62   // Row 1: A1, C1, E1, G1
];


// generate the checkers board
function generateBoard(){
    grid.textContent = '';
    for (let row = 8; row >= 1; row--) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement('div');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            grid.appendChild(square);
        }
    }
}
//3) Upon loading, the game state should be initialized, and a function should 
//   be called to render this game state.

function initBoard() {
    generateBoard();
    // place 12 black pieces 0-11
    for (let i = 0; i < 12; i++) {
        boardState[i] = { player: 'black', king: false };
    }
    for (let i = 20; i < 32; i++){
        boardState[i] = { player: "white", king: false };
    }
    renderBoard();
}

function renderBoard(){
    // clear current pieces
    squares.forEach(squares => {
        while (squares.firstChild) {
            squares.removeChild(square.firstChild);
        }
    });
    // place pieces
    playableSquares.forEach((gridIdx, boardIdx) => {
        if (boardState[boardIdx]) {
            const piece = document.createElement('div');
            piece.classList.add('piece', `${boardState[boardIdx].player}-piece`);
            if (boardState[boardIdx].king){
                piece.classList.add('king');
            }
            squares[gridIdx].appendChild(piece);
        }
    });
}

playableSquares.forEach((gridIdx, boardIdx) => {
    squares[gridIdx].dataset.boardIdx = boardIdx;
})
//4) The state of the game should be rendered to the user.

//5) Define the required constants.

//6) Handle a player clicking a square with a `handleClick` function.

//7) Create Reset functionality.




// Initial setup 
initBoard();