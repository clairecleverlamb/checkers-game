
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
    56, 58, 60, 62,  // Row 1: A1=0, C1=1, E1=2, G1=3
    49, 51, 53, 55,  // Row 2: B2=4, D2=5, F2=6, H2=7
    40, 42, 44, 46,  // Row 3: A3=8, C3=9, E3=10, G3=11
    33, 35, 37, 39,  // Row 4: B4=12, D4=13, F4=14, H4=15
    24, 26, 28, 30,  // Row 5: A5=16, C5=17, E5=18, G5=19
    17, 19, 21, 23,  // Row 6: B6=20, D6=21, F6=22, H6=23
    8, 10, 12, 14,   // Row 7: A7=24, C7=25, E7=26, G7=27
    1, 3, 5, 7       // Row 8: B8=28, D8=29, F8=30, H8=31
];

// board-index 
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
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
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
    console.log("trying to select piece at index: ",boardIdx);

    const gridIdx = getGridIdxFromBoardIdx(boardIdx);
    if (gridIdx === null || !squares[gridIdx].firstChild) return;
    squares[gridIdx].firstChild.classList.add('selected');
    validMoves = getValidMoves(boardIdx);
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
function handleSquareClick(evt) {
    // console.log("square clicked: ", el.currentTarget); great it works!
    const square = evt.currentTarget;
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
    const idxInPlayable = playableSquares.findIndex(gridIdx => 
        parseInt(squares[gridIdx].getAttribute('board-idx')) === boardIdx
    );
    if(idxInPlayable === -1) {
        console.error(`No grid found for boardIdx" ${boardIdx}`);
        return null;
    }
    return playableSquares[idxInPlayable];
}


function getValidMoves(boardIdx) {
    const piece = boardState[boardIdx];
    if (!piece) return [];
    const isKing = piece.king;
    const player = piece.player;
    const row = Math.floor(boardIdx / 4);
    const offset = boardIdx % 4;  // 0,1,2,3, help keep track
    const col = row % 2 === 0 ? 2 * offset + 1 : 2 * offset; // col where pieces go
    const forward = player === 'black' ? -1 : 1; // black down(row -1) and white up
    const directions = isKing ? [1, -1] : [forward];
    let moves = [];
    let captures = [];

    for (let dir of directions) {
        const leftCol = col - 1;
        const rightCol = col + 1;
        const targetRow = row + dir;
        if (targetRow >= 0 && targetRow < 8) {
            // left jump 
            if (leftCol >= 0) {
                const targetIdx = getBoardIndex(targetRow, leftCol);
                if (targetIdx !== null) {
                    if (!boardState[targetIdx]) {  //check if already occupied 
                        moves.push(targetIdx);
                    } else if (boardState[targetIdx].player !== player) {
                        const jumpRow = targetRow + dir;
                        const jumpCol = leftCol - 1; // -2 in total 
                        if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0) {
                            const jumpIdx = getBoardIndex(jumpRow, jumpCol);
                            if (jumpIdx !== null && !boardState[jumpIdx]) {
                                captures.push(jumpIdx);
                            }
                        }
                    }
                }
            }
            // right jump 
            if (rightCol < 8) {
                const targetIdx = getBoardIndex(targetRow, rightCol);
                if (targetIdx !== null) {
                    if (!boardState[targetIdx]) {
                        moves.push(targetIdx);
                    } else if (boardState[targetIdx].player !== player) {
                        const jumpRow = targetRow + dir;
                        const jumpCol = rightCol + 1;
                        if (jumpRow >= 0 && jumpRow < 8 && jumpCol < 8) {
                            const jumpIdx = getBoardIndex(jumpRow, jumpCol);
                            if (jumpIdx !== null && !boardState[jumpIdx]) {
                                captures.push(jumpIdx);
                            }
                        }
                    }
                }
            }
        }
    }
    return captures.length > 0 ? captures : moves;   // prioritize captures 
    console.log("checking valid moves for: ", boardIdx);
}


// convert row and col to board index 
function getBoardIndex(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    // reach Row 8, col 1, we need getBoardIndex(7,1) offset = 1/2 = 0; idx = 7 * 4 + 0 = 28; 
    const isDark = (row % 2 === col % 2);
    if (!isDark) return null;
    const offset = Math.floor(col / 2);
    return row * 4 + offset
}


function movePiece(toIndex) {
    const fromIndex = selectedPiece;
    // const piece = boardState[fromIndex];
    const rowFrom = Math.floor(fromIndex / 4);
    const rowTo = Math.floor(toIndex / 4);
    let capturedIdx = null;

    // captures 
    if (Math.abs(rowTo - rowFrom) === 2) {
        const possibleMidIndices = [
            fromIndex - 5, fromIndex - 3, fromIndex + 3, fromIndex + 5
        ].filter(index =>
            index >= 0 && index < 32 &&
            Math.floor(index / 4) === (rowFrom + rowTo) / 2 &&
            Math.abs(toIndex - index) === Math.abs(fromIndex - index)
        );
        const midIndex = possibleMidIndices.find(index =>
            boardState[index] && boardState[index].player !== piece.player
        );
        if (midIndex !== undefined) {
            capturedIdx = midIndex;
            boardState[midIndex] = null;
            const midGridIdx = getGridIdxFromBoardIdx(midIndex);
            squares[midGridIdx].removeChild(squares[midGridIdx].firstChild);
        }
    }

    // store the move 
    moveHistory.push({
        from: fromIndex,
        to: toIndex,
        captured: capturedIdx,
        player: piece.player,
        becameKing: (piece.player === 'black' && rowTo === 0) || (piece.player === 'white' && rowTo === 7)
    })

    // move piece here 
    boardState[toIndex] = piece;
    boardState[fromIndex] = null;
    const fromGridIdx = getGridIdxFromBoardIdx(fromIndex);
    const toGridIdx = getGridIdxFromBoardIdx(toIndex);
    const fromSquare = squares[fromGridIdx];
    const toSquare = squares[toGridIdx];
    toSquare.appendChild(fromSquare.firstChild);

    // King promotion
    if ((piece.player === 'black' && rowTo === 0) || (piece.player === 'white' && rowTo === 7)) {
        piece.king = true;
        toSquare.firstChild.classList.add('king');
    }

    // enforcing multi-jumps and turn management 
    // const newCaptures = getValidMoves(toIndex);
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
        const {from, to, captured, player, becameKing} = lastMove;

        // Reverse the move
        boardState[from] = boardState[to];
        boardState[to] = null;

        if (captured !== null) {
            boardState[captured] = {player: player === 'black' ? 'white' : 'black', king: false };
            const capturedGridIdx = getGridIdxFromBoardIdx(captured);
            squares[capturedGridIdx].appendChild(createPiece(player === 'black' ? 'white' : 'black'));
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
    selectPiece = null;
    validMoves = [];
    initBoard();
});


initBoard();