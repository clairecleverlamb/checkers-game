
// CHEKCERS game!! HAVE FUN!

// Define the required variables used to track the state of the game.

let boardState = Array(32).fill(null);
let currentPlayer = 'black';
let selectedPiece = null;
let validMoves = [];
let moveHistory = [];

// Store cached element references.

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
    // place 12 black pieces 0-11
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
    playableSquares.forEach((gridIdx, arrayIdx) => {
        const boardIdx = arrayIdx;
        if (boardState[boardIdx]) {
            const piece = document.createElement('div');
            piece.classList.add('piece', `${boardState[boardIdx].player}-piece`);
            if (boardState[boardIdx].king) {
                piece.classList.add('king');
            }
            squares[gridIdx].appendChild(piece);
        }
    });
}


playableSquares.forEach((gridIdx, arrayIdx) => {
    const square = squares[gridIdx];
    if (square) {
        square.setAttribute('board-idx', arrayIdx);
        // console.log(`Assigned board-idx: ${arrayIdx} to grid index: ${gridIdx}`); 
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
    console.log(`Selected piece at ${boardIdx}, validMoves:`, validMoves);
    validMoves.forEach(moveIdx => {
        const moveGridIdx = getGridIdxFromBoardIdx(moveIdx);
        if (moveGridIdx !== null) squares[moveGridIdx].classList.add('valid-move');
    });
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
        } else {
            // console.log(`No piece to select at boardIdx: ${boardIdx} or not current player's piece`);
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

function getBoardIdxFromGridIdx(gridIdx) {
    const row = Math.floor(gridIdx / 8);
    const col = gridIdx % 8;
    // Check if it’s a playable dark square
    if ((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
        const offset = Math.floor(col / 2);
        return row * 4 + offset;
    }
    return null; // Not a playable square
}

// let boardIdx = 5;
// console.log(`Assigned board-idx: ${boardIdx} to grid index: ${getGridIdxFromBoardIdx(boardIdx)}`);
// console.log("Trying to select piece at index: ", boardIdx, " (grid index: ", getGridIdxFromBoardIdx(boardIdx), ")");


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
    // console.log(`getValidMoves called with boardIdx: ${boardIdx}`);
    const piece = boardState[boardIdx];
    if (!piece) return [];
    // console.log(`Piece at boardIdx ${boardIdx}:`, piece);
    // console.log(`Calling getBoardIdxFromGridIdx with: ${boardIdx}`);
    const [row, col] = getRowColFromBoardIdx(boardIdx);
    const forward = piece.player === 'black' ? -1 : 1;
    const directions = piece.king ? [1, -1] : [forward];
    let regularMoves = [];
    let captures = [];

    for (const dir of directions) {
        // capture 
        const leftMid = getBoardIndex(row + dir, col - 1);
        if (leftMid !== null && boardState[leftMid] && boardState[leftMid].player !== piece.player) {
            const jumpLeft = getBoardIndex(row + 2 * dir, col - 2);
            if (jumpLeft !== null && !boardState[jumpLeft]) captures.push(jumpLeft);
        }
        const rightMid = getBoardIndex(row + dir, col + 1);
        if (rightMid !== null && boardState[rightMid] && boardState[rightMid].player !== piece.player) {
            const jumpRight = getBoardIndex(row + 2 * dir, col + 2);
            if (jumpRight !== null && !boardState[jumpRight]) captures.push(jumpRight);
        }

        // Regular moves
        const leftMove = getBoardIndex(row + dir, col - 1);
        if (leftMove !== null && !boardState[leftMove]) regularMoves.push(leftMove);
        const rightMove = getBoardIndex(row + dir, col + 1);
        if (rightMove !== null && !boardState[rightMove]) regularMoves.push(rightMove);
    }
    return captures.length > 0 ? captures : regularMoves;
}



function movePiece(toIndex) {
    console.log(`movePiece from ${selectedPiece} to ${toIndex}`);

    const fromIndex = selectedPiece;
    const piece = boardState[fromIndex];
    if (!piece) return;
    const [rowFrom, colFrom] = getRowColFromBoardIdx(fromIndex);
    const [rowTo, colTo] = getRowColFromBoardIdx(toIndex);

    let capturedIdx = null;

    // captures 
    if (Math.abs(rowTo - rowFrom) === 2 && Math.abs(colTo - colFrom) === 2) {
        const midRow = (rowFrom + rowTo) / 2;
        const midCol = (colFrom + colTo) / 2;
        const midIdx = getBoardIndex(midRow, midCol);
        if (midIdx !== null && boardState[midIdx] && boardState[midIdx].player !== piece.player) {
            capturedIdx = midIdx;
            removeCapturedPiece(midIdx);
        }
    }
    // Record move
    recordMove(fromIndex, toIndex, capturedIdx, piece);
    // Move piece
    movePieceOnBoard(fromIndex, toIndex, piece);

    // King Promotion
    if ((piece.player === 'black' && rowTo === 7) || (piece.player === 'white' && rowTo === 0)) {
        makeKing(piece, toIndex);
    }
    handleMultiJumpOrEndTurn(toIndex, rowTo);
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

function recordMove(fromIndex, toIndex, capturedIdx, piece) {
    moveHistory.push({
        from: fromIndex,
        to: toIndex,
        captured: capturedIdx,
        player: piece.player,
        becameKing: piece.king
    });
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
}


function handleMultiJumpOrEndTurn(toIndex, rowTo) {
    const newCaptures = getValidMoves(toIndex).filter(
        move => Math.abs(Math.floor(move / 4) - rowTo) === 2
    );
    if (newCaptures.length > 0) {
        selectedPiece = toIndex;
        validMoves = newCaptures;
        deselectPiece();
        selectPiece(toIndex);
    } else {
        deselectPiece();
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        renderBoard();
        checkWin();
    }
}

// undo button: 
document.querySelector('.undo').addEventListener('click', () => {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const { from, to, captured, player, becameKing } = lastMove;

        // Reverse the move
        boardState[from] = boardState[to];
        boardState[to] = null;

        if (captured !== null) {
            boardState[captured.index] = captured.piece; // Restore full piece state
            const capturedGridIdx = getGridIdxFromBoardIdx(captured.index);
            const pieceElement = createPiece(captured.piece.player);
            if (captured.piece.king) pieceElement.classList.add('king');
            squares[capturedGridIdx].appendChild(pieceElement);
            // boardState[captured] = { player: player === 'black' ? 'white' : 'black', king: false };
            // const capturedGridIdx = getGridIdxFromBoardIdx(captured);
            // squares[capturedGridIdx].appendChild(createPiece(player === 'black' ? 'white' : 'black'));
        }

        const fromGridIdx = getGridIdxFromBoardIdx(from);
        const toGridIdx = getGridIdxFromBoardIdx(to);
        const fromSquare = squares[fromGridIdx];
        const toSquare = squares[toGridIdx];
        fromSquare.appendChild(toSquare.firstChild);

        if (becameKing) boardState[from].king = false;

        currentPlayer = player;
        deselectPiece();
        renderBoard();
        checkWin();
    }
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
        const playerPieces = boardState.filter(piece => piece && piece.player === currentPlayer);
        const hasMoves = playerPieces.some(pieceIdx => {  // using some()
            const idx = boardState.indexOf(pieceIdx);
            return getValidMoves(idx).length > 0;
        });
        if (!hasMoves) winner = currentPlayer === 'black' ? 'White' : 'Black';
    }

    if (winner) {
        status.textContent = `${winner} Wins!`;
        playableSquares.forEach(gridIdx => squares[gridIdx].removeEventListener('click', handleSquareClick));
    } else {
        status.textContent = `${currentPlayer === 'black' ? 'Black' : 'White'}'s Turn`;
    }
}

// Create Reset functionality.
document.querySelector('.reset').addEventListener('click', () => {
    moveHistory = [];
    // boardState = Array(32).fill(null);
    currentPlayer = 'black';
    selectedPiece = null;
    validMoves = [];
    initBoard();
});


initBoard();