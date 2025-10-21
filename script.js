const gameButtons = document.querySelectorAll(".game-button");
const statusDiv = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
let currentPlayer = "○";
let gameOver = false;

gameButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (gameOver) return;
    if (currentPlayer === "○" && button.textContent === "-") {
      button.innerHTML = `<span class="mark-o">○</span>`;
      button.disabled = true;
      updateGame();
      if (!gameOver) setTimeout(() => computerMove(), 500);
    }
  });
});

resetBtn.addEventListener("click", resetGame);

function switchPlayer() {
  currentPlayer = currentPlayer === "○" ? "✕" : "○";
  statusDiv.textContent = `次のプレイヤー: ${
    currentPlayer === "○" ? "あなた (○)" : "コンピュータ (✕)"
  }`;
}

function getCellSymbol(button) {
  // HTML要素内のシンボルを抽出
  if (button.innerHTML.includes("mark-o")) return "○";
  if (button.innerHTML.includes("mark-x")) return "✕";
  return "-";
}

function checkWinner() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    const va = getCellSymbol(gameButtons[a]);
    const vb = getCellSymbol(gameButtons[b]);
    const vc = getCellSymbol(gameButtons[c]);
    if (va === vb && vb === vc && va !== "-") {
      return va;
    }
  }
  if ([...gameButtons].every((b) => getCellSymbol(b) !== "-")) {
    return "引き分け";
  }
  return null;
}

function updateGame() {
  const winner = checkWinner();
  if (winner) {
    statusDiv.textContent =
      winner === "引き分け" ? "引き分けです!" : `${winner}の勝ちです!`;
    gameOver = true;
    gameButtons.forEach((b) => (b.disabled = true));
  } else {
    switchPlayer();
  }
}

function resetGame() {
  gameButtons.forEach((button) => {
    button.textContent = "-";
    button.classList.remove("mark-o", "mark-x");
    button.disabled = false;
  });
  currentPlayer = "○";
  gameOver = false;
  statusDiv.textContent = "次のプレイヤー: あなた (○)";
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner();
  if (winner !== null) {
    return winner === "✕" ? 10 - depth : winner === "○" ? depth - 10 : 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    board.forEach((cell) => {
      if (getCellSymbol(cell) === "-") {
        cell.innerHTML = `<span class="mark-x">✕</span>`;
        const score = minimax(board, depth + 1, false);
        cell.textContent = "-";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    board.forEach((cell) => {
      if (getCellSymbol(cell) === "-") {
        cell.innerHTML = `<span class="mark-o">○</span>`;
        const score = minimax(board, depth + 1, true);
        cell.textContent = "-";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function computerMove() {
  if (gameOver) return;
  let bestScore = -Infinity;
  let move;
  gameButtons.forEach((cell, index) => {
    if (getCellSymbol(cell) === "-") {
      cell.innerHTML = `<span class="mark-x">✕</span>`;
      const score = minimax(gameButtons, 0, false);
      cell.textContent = "-";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  if (move !== undefined) {
    gameButtons[move].innerHTML = `<span class="mark-x">✕</span>`;
    gameButtons[move].disabled = true;
  }
  updateGame();
}
