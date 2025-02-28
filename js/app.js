
// CHEKCERS game!! HAVE FUN!

let boardState = Array(32).fill(null);
let currentPlayer = 'black';
let selectedPiece = null;
let validMoves = [];
let moveHistory = [];

const grid = document.querySelector('.grid');
const status = document.querySelector('.status');

// grid index 
const playableSquares = [
    0, 2, 4, 6,     // Row 0
    9, 11, 13, 15,  // Row 1
    16, 18, 20, 22, // Row 2
    25, 27, 29, 31, // Row 3
    32, 34, 36, 38, // Row 4
    41, 43, 45, 47, // Row 5
    48, 50, 52, 54, // Row 6
    57, 59, 61, 63  // Row 7
];

// boardIdx 
// [  
//     0, 1, 2, 3, 
//     4, 5, 6, 7,
//     8, 9, 10, 11, 
//     12, 13, 14, 15, 
//     16, 17, 18, 19,
//     20, 21, 22, 23, 
//     24, 25, 26, 27,
//     28, 29, 30, 31,
//   ]

const selectSound = new Audio('sounds/select.mp3');
const moveSound = new Audio('sounds/move.mp3');
const kingSound = new Audio('sounds/king.mp3');
const winSound = new Audio('sounds/win.mp3');
const undoSound = new Audio('sounds/undo.mp3');
const resetSound = new Audio('sounds/reset.mp3');


// generate the checkers board
function generateBoard() {
    grid.innerHTML = '';
    for (let row = 8; row >= 1; row--) {
        for (let col = 0; col < 8; col++) {
            let square = document.createElement('div');
            square.classList.add((row + col) % 2 === 0 ? 'dark' : 'light');
            grid.appendChild(square);
        }
    }
}
generateBoard();

const squares = Array.from(grid.querySelectorAll('div'));

// Upon loading, the game state should be initialized, and a function should 
//   be called to render this game state.

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


// The state of the game should be rendered to the user.
function renderBoard() {
    squares.forEach(square => {
        while (square.firstChild) {
            square.removeChild(square.firstChild);
        }
    });
    // place pieces
    for (let boardIdx = 0; boardIdx < boardState.length; boardIdx++) {
        if (boardState[boardIdx]) {
            const gridIdx = getGridIdxFromBoardIdx(boardIdx);
            const piece = document.createElement('div');
            piece.classList.add('piece', `${boardState[boardIdx].player}-piece`);
            if (boardState[boardIdx].king) {
                piece.classList.add('king');
            }
            squares[gridIdx].appendChild(piece);
        }
    }
}
//---------------------- addEventListener ---------------------------//
playableSquares.forEach((gridIdx, arrayIdx) => {
    const square = squares[gridIdx];
    if (square) {
        square.setAttribute('board-idx', arrayIdx);
        square.addEventListener('click', handleSquareClick);
    } else {
        console.log(`${gridIdx} is undefined`);
    }
});

function selectPiece(boardIdx) {
    selectedPiece = boardIdx;
    const gridIdx = getGridIdxFromBoardIdx(boardIdx);
    if (gridIdx === null || !squares[gridIdx].firstChild) return;
    squares[gridIdx].firstChild.classList.add('selected');
    
    validMoves = getValidMoves(boardIdx);
    // console.log(`Selected piece at ${boardIdx}, validMoves:`, validMoves);
    validMoves.forEach(moveIdx => {
        const moveGridIdx = getGridIdxFromBoardIdx(moveIdx);
        if (moveGridIdx !== null) squares[moveGridIdx].classList.add('valid-move');
    });
    selectSound.play();
}

function deselectPiece() {
    if (selectedPiece !== null) {
        const gridIdx = getGridIdxFromBoardIdx(selectedPiece);
        if (gridIdx !== null && squares[gridIdx].firstChild) {
            squares[gridIdx].firstChild.classList.remove('selected');
        }
        validMoves.forEach(moveIdx => {
            const moveGridIdx = getGridIdxFromBoardIdx(moveIdx);
            if (moveGridIdx !== null) squares[moveGridIdx].classList.remove('valid-move');
        });
        selectedPiece = null;
        validMoves = [];
    }
}

// Handle square clicks
function handleSquareClick(el) {
    const square = el.currentTarget;
    const boardIdx = parseInt(square.getAttribute('board-idx'));

    if (selectedPiece === null) {
        if (boardState[boardIdx] && boardState[boardIdx].player === currentPlayer) {
            selectPiece(boardIdx);
        } 
    } else {        
        if (validMoves.includes(boardIdx)) {
            movePiece(boardIdx);
        } else {
            deselectPiece();
        }
    }
}
// Convert boardIdx to gridIdx 
function getGridIdxFromBoardIdx(boardIdx) {
    const row = Math.floor(boardIdx / 4);
    const offset = boardIdx % 4;
    const col = row % 2 === 0 ? 2 * offset : 2 * offset + 1;
    return row * 8 + col;
}


// helper functions for getValidMoves 
function getRowColFromBoardIdx(boardIdx) {
    const row = Math.floor(boardIdx / 4);
    const offset = boardIdx % 4;
    const col = row % 2 === 0 ? 2 * offset : 2 * offset + 1;
    return [row, col];
}

function getBoardIndex(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    if ((row % 2 === 0 && col % 2 !== 0) || (row % 2 === 1 && col % 2 !== 1)) return null; // Not playable
    const offset = Math.floor(col / 2);
    return row * 4 + offset;
}


function getValidMoves(boardIdx) {
    const piece = boardState[boardIdx];
    if (!piece) return [];
    const [row, col] = getRowColFromBoardIdx(boardIdx);
    const forward = piece.player === 'black' ? -1 : 1;
    const directions = piece.king ? [1, -1] : [forward];
    let moves = [];

    for (const dir of directions) {
        // Capture moves
        const leftMid = getBoardIndex(row + dir, col - 1);
        if (leftMid !== null && boardState[leftMid] && boardState[leftMid].player !== piece.player) {
            const jumpLeft = getBoardIndex(row + 2 * dir, col - 2);
            if (jumpLeft !== null && !boardState[jumpLeft]) moves.push(jumpLeft);
        }
        const rightMid = getBoardIndex(row + dir, col + 1);
        if (rightMid !== null && boardState[rightMid] && boardState[rightMid].player !== piece.player) {
            const jumpRight = getBoardIndex(row + 2 * dir, col + 2);
            if (jumpRight !== null && !boardState[jumpRight]) moves.push(jumpRight);
        }

        // Regular moves
        const leftMove = getBoardIndex(row + dir, col - 1);
        if (leftMove !== null && !boardState[leftMove]) moves.push(leftMove);
        const rightMove = getBoardIndex(row + dir, col + 1);
        if (rightMove !== null && !boardState[rightMove]) moves.push(rightMove);
    }
    return moves;
}


function movePiece(toIndex) {
    const fromIndex = selectedPiece;
    const piece = boardState[fromIndex];
    if (!piece) return;
    const [rowFrom, colFrom] = getRowColFromBoardIdx(fromIndex);
    const [rowTo, colTo] = getRowColFromBoardIdx(toIndex);

    let capturedIdx = null;
    let capturedPiece = null;

    // captures 
    if (Math.abs(rowTo - rowFrom) === 2 && Math.abs(colTo - colFrom) === 2) {
        const midRow = (rowFrom + rowTo) / 2;
        const midCol = (colFrom + colTo) / 2;
        capturedIdx = getBoardIndex(midRow, midCol);
        if (capturedIdx !== null && boardState[capturedIdx]) {
            capturedPiece = boardState[capturedIdx]; // store before remove;
            removeCapturedPiece(capturedIdx);
        }
    }
    // Record move
    recordMove(fromIndex, toIndex, capturedIdx !== null ? {index: capturedIdx, piece: capturedPiece} : null, piece);
    // Move piece
    movePieceOnBoard(fromIndex, toIndex, piece);
    // King Promotion
    if ((piece.player === 'black' && rowTo === 0) || (piece.player === 'white' && rowTo === 7)) {
        makeKing(piece, toIndex);
    }
    handleMultiJumpOrEndTurn(toIndex, rowTo);
    moveSound.play();
}


// helper functions for movePiece()
function removeCapturedPiece(midIdx) {
    boardState[midIdx] = null;
    const midGridIdx = getGridIdxFromBoardIdx(midIdx);
    squares[midGridIdx].removeChild(squares[midGridIdx].firstChild);
}

function getBoardIndex(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    if ((row % 2 === 0 && col % 2 !== 0) || (row % 2 === 1 && col % 2 !== 1)) return null; // Not playable
    const offset = Math.floor(col / 2);
    return row * 4 + offset;
}

function recordMove(fromIndex, toIndex, captured, piece) {
    moveHistory.push({
        from: fromIndex,
        to: toIndex,
        captured: captured, //contains { index: capturedIdx, piece: { player, king } } or null
        player: currentPlayer,
        becameKing: (piece.player === 'black' && Math.floor(toIndex / 4) === 7) || 
        (piece.player === 'white' && Math.floor(toIndex / 4) === 0)
    });
    console.log('Stored captured:', moveHistory[moveHistory.length - 1].captured);
}

function movePieceOnBoard(fromIndex, toIndex, piece) {
    const fromGridIdx = getGridIdxFromBoardIdx(fromIndex);
    const toGridIdx = getGridIdxFromBoardIdx(toIndex);
    const fromSquare = squares[fromGridIdx];
    const toSquare = squares[toGridIdx];
    toSquare.appendChild(fromSquare.firstChild);
    boardState[toIndex] = piece;
    boardState[fromIndex] = null;
}

function makeKing(piece, toIndex) {
    piece.king = true;
    const toGridIdx = getGridIdxFromBoardIdx(toIndex);
    squares[toGridIdx].firstChild.classList.add('king');
    // console.log(`Promoted to king at ${toIndex}, king: ${piece.king}`);
    kingSound.play();

}


function handleMultiJumpOrEndTurn() {
        deselectPiece();
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        renderBoard();
        checkWin();
    }
// }

// undo button: 
document.querySelector('.undo').addEventListener('click', () => {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const { from, to, captured, player, becameKing } = lastMove;

        // Reverse the move
        boardState[from] = boardState[to];
        boardState[to] = null;

        if (captured !== null) {
            boardState[captured.index] = captured.piece; // Restore the actual piece;
        }

        if (becameKing) boardState[from].king = false;

        currentPlayer = player;
        deselectPiece();
        renderBoard();
        checkWin();
    }
    undoSound.play();
});


function createPiece(player) {
    const piece = document.createElement('div');
    piece.classList.add('piece', `${player}-piece`);
    return piece;
}


function checkWin() {
    const blackPieces = boardState.filter(piece => piece && piece.player === 'black').length;
    const whitePieces = boardState.filter(piece => piece && piece.player === 'white').length;
    let winner = null;

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
        winSound.play();
        playableSquares.forEach(gridIdx => squares[gridIdx].removeEventListener('click', handleSquareClick));
    } else {
        status.textContent = `${currentPlayer === 'black' ? 'Black' : 'White'}'s Turn`;
    }
}

// Create Reset functionality.
document.querySelector('.reset').addEventListener('click', () => {
    resetSound.play();
    moveHistory = [];
    currentPlayer = 'black';
    selectedPiece = null;
    validMoves = [];
    initBoard();
    playableSquares.forEach(gridIdx => {
        squares[gridIdx].addEventListener('click', handleSquareClick);
    })
});


initBoard();