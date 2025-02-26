// planning 
// Generate the 8x8 board programmatically.
// Place the initial pieces (12 red, 12 black).
// Add click-based movement with legal move validation.
// style pieces later 

// Define the required variables used to track the state of the game.

let boardState = Array(32).fill(null);
let currentPlayer = 'black';
let selectedPiece = null;
let validMoves = [];

// Store cached element references.

const grid = document.querySelector('.grid');
const squares = Array.from(grid.querySelectorAll('div'));
const playableSquares = [
                   // these are checkers notation 
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
// Upon loading, the game state should be initialized, and a function should 
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


// The state of the game should be rendered to the user.
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
    squares[gridIdx].addEventListener('click', handleSquareClick);
});


// Handle a player clicking a square with a `handleClick` function.
function handleSquareClick(el){
    const boardIdx = parseInt(el.target.dataset.boardIdx);
}


function selectPiece(boardIdx) {
    selectedPiece = boardIdx; 
    const gridIdx = playableSquares[boardIdx];
    squares[gridIdx].firstChild.classList.add('selected');
    validMoves = getValidMoves(boardIdx);
}


function getValidMoves(boardIdx){
    const piece = boardState[boardIdx];
    if (!piece) return [];
    const isKing = piece.king;
    const player = piece.player;
    const row = Math.floor(boardIdx / 4);
    const offset = boardIdx % 4;  // 0,1,2,3, help styling 
    const col = row % 2 === 0 ? 2*offset + 1 : 2*offset; // col where pieces go
    const forward = player === 'black'? -1 : 1; // black down and white up
    const directions = isKing? [-1,1] : [forward];
    let moves = [];
    let captures = [];

    for (let dir of directions){

    }


}

function getBoardIndex(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    // reach Row 8, col 1, we need getBoardIndex(7,1) offset = 1/2 = 0; idx = 7 * 4 + 0 = 28; 
    const isDark = (row % 2 === 0 && col % 2 === 1) || (row % 2 === 1 && col % 2 === 0);
    if (!isDark) return null;
    const offset = Math.floor(col/2);
    return row * 4 + offset
}

// Create Reset functionality.
document.querySelector('.reset').addEventListener('click', () =>{
    boardState = Array(32).fill(null);
    currentPlayer = 'black';
    selectPiece = null;
    validMoves = [];
    initBoard();
});



// Initial setup 
initBoard();