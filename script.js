const gameButtons = document.querySelectorAll('.game-button');
const statusDiv = document.getElementById('status');
let currentPlayer = '○';

gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentPlayer === '○' && button.textContent === '?') {
            button.textContent = currentPlayer;
            updateGame();
            setTimeout(() => computerMove(), 500);
        }
    });
});

function switchPlayer() {
    currentPlayer = currentPlayer === '○' ? '✕' : '○';
    statusDiv.textContent = `次のプレイヤー: ${currentPlayer}`;
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (
            gameButtons[a].textContent === gameButtons[b].textContent &&
            gameButtons[a].textContent === gameButtons[c].textContent &&
            gameButtons[a].textContent !== '?'
        ) {
            return gameButtons[a].textContent;
        }
    }
    if ([...gameButtons].every(button => button.textContent !== '?')) {
        return '引き分け';
    }
    return null;
}

function updateGame() {
    let winner = checkWinner();
    if (winner) {
        statusDiv.textContent = winner === '引き分け' ? '引き分けです!' : `${winner}の勝ちです!`;
        gameButtons.forEach(button => button.disabled = true);
    } else {
        switchPlayer();
    }
}

function resetGame() {
    gameButtons.forEach(button => {
        button.textContent = '?';
        button.disabled = false;
    });
    currentPlayer = '○';
    statusDiv.textContent = "次のプレイヤー: あなた (○)";
}

function minimax(board, depth, isMaximizing) {
    let winner = checkWinner();
    if (winner !== null) {
        return winner === '✕' ? 10 : winner === '○' ? -10 : 0;
    }

    if ([...board].every(button => button.textContent !== '?')) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell.textContent === '?') {
                cell.textContent = '✕';
                let score = minimax(board, depth + 1, false);
                cell.textContent = '?';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell.textContent === '?') {
                cell.textContent = '○';
                let score = minimax(board, depth + 1, true);
                cell.textContent = '?';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let move;
    gameButtons.forEach((cell, index) => {
        if (cell.textContent === '?') {
            cell.textContent = '✕';
            let score = minimax(gameButtons, 0, false);
            cell.textContent = '?';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    if (move !== undefined) gameButtons[move].textContent = '✕';
    updateGame();
}
