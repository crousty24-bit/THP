const HUMAN_PLAYER = "J1";
const AI_PLAYER = "J2";
const STORAGE_KEY = "thp-tic-tac-toe-state";

const cloneState = (state) => {
  if (typeof structuredClone === "function") {
    return structuredClone(state);
  }

  return JSON.parse(JSON.stringify(state));
};

const WINNING_LINES = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [2, 0],
    [1, 1],
    [0, 2],
  ],
];

class BoardHelpers {
  static createEmptyBoard() {
    return [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  static clone(board) {
    return board.map((row) => [...row]);
  }

  static isValidBoard(board) {
    const validValues = [HUMAN_PLAYER, AI_PLAYER, null];

    return (
      Array.isArray(board) &&
      board.length === 3 &&
      board.every(
        (row) =>
          Array.isArray(row) &&
          row.length === 3 &&
          row.every((cell) => validValues.includes(cell)),
      )
    );
  }

  static getAvailableMoves(board) {
    const moves = [];

    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === null) {
          moves.push({ x, y });
        }
      });
    });

    return moves;
  }

  static getWinner(board) {
    for (const line of WINNING_LINES) {
      const values = line.map(([x, y]) => board[y][x]);

      if (values[0] !== null && values[0] === values[1] && values[1] === values[2]) {
        return values[0];
      }
    }

    return BoardHelpers.getAvailableMoves(board).length === 0 ? "tie" : null;
  }

  static countMoves(board, player) {
    return board.flat().filter((cell) => cell === player).length;
  }

  static getNextPlayer(board) {
    const humanMoves = BoardHelpers.countMoves(board, HUMAN_PLAYER);
    const aiMoves = BoardHelpers.countMoves(board, AI_PLAYER);

    return humanMoves <= aiMoves ? HUMAN_PLAYER : AI_PLAYER;
  }
}

class HistoryManager {
  constructor(snapshot = cloneState) {
    this.snapshot = snapshot;
    this.undoStack = [];
    this.redoStack = [];
  }

  record(state) {
    this.undoStack.push(this.snapshot(state));
    this.redoStack = [];
  }

  undo(currentState) {
    if (!this.canUndo()) {
      return null;
    }

    this.redoStack.push(this.snapshot(currentState));
    return this.undoStack.pop();
  }

  redo(currentState) {
    if (!this.canRedo()) {
      return null;
    }

    this.undoStack.push(this.snapshot(currentState));
    return this.redoStack.pop();
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

class StorageService {
  static load() {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);

      if (!serializedState) {
        return null;
      }

      const state = JSON.parse(serializedState);

      if (!BoardHelpers.isValidBoard(state.board) || !DIFFICULTY_LEVELS[state.difficulty]) {
        return null;
      }

      return {
        board: BoardHelpers.clone(state.board),
        difficulty: state.difficulty,
        gameOver: Boolean(state.gameOver),
        status: typeof state.status === "string" ? state.status : "À vous de jouer.",
        awaitingAi: Boolean(state.awaitingAi),
      };
    } catch (error) {
      return null;
    }
  }

  static save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // localStorage can be unavailable in private or restricted browser contexts.
    }
  }

  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // localStorage can be unavailable in private or restricted browser contexts.
    }
  }
}

const getRandomMove = (board) => {
  const moves = BoardHelpers.getAvailableMoves(board);

  if (moves.length === 0) {
    return null;
  }

  return moves[Math.floor(Math.random() * moves.length)];
};

const findWinningMove = (board, player) => {
  for (const move of BoardHelpers.getAvailableMoves(board)) {
    const simulatedBoard = BoardHelpers.clone(board);
    simulatedBoard[move.y][move.x] = player;

    if (BoardHelpers.getWinner(simulatedBoard) === player) {
      return move;
    }
  }

  return null;
};

const getIntermediateMove = (board) => (
  findWinningMove(board, AI_PLAYER) ||
  findWinningMove(board, HUMAN_PLAYER) ||
  getRandomMove(board)
);

const scoreBoard = (board, depth) => {
  const winner = BoardHelpers.getWinner(board);

  if (winner === AI_PLAYER) {
    return 10 - depth;
  }

  if (winner === HUMAN_PLAYER) {
    return depth - 10;
  }

  if (winner === "tie") {
    return 0;
  }

  return null;
};

const minimax = (board, depth, isMaximizing, alpha, beta) => {
  const terminalScore = scoreBoard(board, depth);

  if (terminalScore !== null) {
    return { score: terminalScore, move: null };
  }

  let bestMove = null;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (const move of BoardHelpers.getAvailableMoves(board)) {
      board[move.y][move.x] = AI_PLAYER;
      const result = minimax(board, depth + 1, false, alpha, beta);
      board[move.y][move.x] = null;

      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }

      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha) {
        break;
      }
    }

    return { score: bestScore, move: bestMove };
  }

  let bestScore = Infinity;

  for (const move of BoardHelpers.getAvailableMoves(board)) {
    board[move.y][move.x] = HUMAN_PLAYER;
    const result = minimax(board, depth + 1, true, alpha, beta);
    board[move.y][move.x] = null;

    if (result.score < bestScore) {
      bestScore = result.score;
      bestMove = move;
    }

    beta = Math.min(beta, bestScore);

    if (beta <= alpha) {
      break;
    }
  }

  return { score: bestScore, move: bestMove };
};

const getAdvancedMove = (board) => (
  minimax(BoardHelpers.clone(board), 0, true, -Infinity, Infinity).move ||
  getRandomMove(board)
);

const getScoredAiMoves = (board) => BoardHelpers.getAvailableMoves(board).map((move) => {
  const simulatedBoard = BoardHelpers.clone(board);
  simulatedBoard[move.y][move.x] = AI_PLAYER;

  return {
    move,
    score: minimax(simulatedBoard, 1, false, -Infinity, Infinity).score,
  };
});

const isSameMove = (firstMove, secondMove) => (
  firstMove?.x === secondMove?.x && firstMove?.y === secondMove?.y
);

const getMasterMoveRank = (board, move) => {
  const simulatedBoard = BoardHelpers.clone(board);
  simulatedBoard[move.y][move.x] = AI_PLAYER;

  if (BoardHelpers.getWinner(simulatedBoard) === AI_PLAYER) {
    return 0;
  }

  if (isSameMove(move, findWinningMove(board, HUMAN_PLAYER))) {
    return 1;
  }

  if (move.x === 1 && move.y === 1) {
    return 2;
  }

  if (
    (move.x === 0 && move.y === 0) ||
    (move.x === 2 && move.y === 0) ||
    (move.x === 0 && move.y === 2) ||
    (move.x === 2 && move.y === 2)
  ) {
    return 3;
  }

  return 4;
};

const getMasterMove = (board) => {
  const scoredMoves = getScoredAiMoves(board);

  if (scoredMoves.length === 0) {
    return null;
  }

  const bestScore = Math.max(...scoredMoves.map(({ score }) => score));
  const optimalMoves = scoredMoves
    .filter(({ score }) => score === bestScore)
    .map(({ move }) => move);
  const bestRank = Math.min(...optimalMoves.map((move) => getMasterMoveRank(board, move)));
  const bestRankedMoves = optimalMoves.filter((move) => (
    getMasterMoveRank(board, move) === bestRank
  ));

  return bestRankedMoves[Math.floor(Math.random() * bestRankedMoves.length)];
};

const DIFFICULTY_LEVELS = {
  beginner: {
    label: "Débutant",
    getMove: getRandomMove,
  },
  intermediate: {
    label: "Intermédiaire",
    getMove: getIntermediateMove,
  },
  advanced: {
    label: "Avancé",
    getMove: getAdvancedMove,
  },
  master: {
    label: "Master",
    getMove: getMasterMove,
  },
};

class Morpion {
  constructor() {
    const savedState = StorageService.load();

    this.board = savedState?.board || BoardHelpers.createEmptyBoard();
    this.difficulty = savedState?.difficulty || "advanced";
    this.gameOver = savedState?.gameOver || false;
    this.status = savedState?.status || "À vous de jouer.";
    this.isAiThinking = Boolean(savedState?.awaitingAi && !this.gameOver);
    this.aiTimerId = null;
    this.history = new HistoryManager();

    this.cells = Array.from(document.querySelectorAll(".cell"));
    this.statusElement = document.getElementById("game-status");
    this.undoButton = document.getElementById("undo-button");
    this.redoButton = document.getElementById("redo-button");
    this.restartButton = document.getElementById("restart-button");
    this.difficultyOptions = document.querySelector(".difficulty-options");

    this.renderDifficultyOptions();
    this.bindEvents();
    this.syncStatusWithBoard();

    if (!this.gameOver && BoardHelpers.getNextPlayer(this.board) === AI_PLAYER) {
      this.isAiThinking = true;
      this.syncStatusWithBoard();
    }

    this.render();

    if (this.isAiThinking) {
      this.queueAiMove({ recordHistory: false });
    }
  }

  bindEvents() {
    this.cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        this.playHumanMove(Number(cell.dataset.x), Number(cell.dataset.y));
      });
    });

    this.difficultyOptions.addEventListener("click", (event) => {
      const button = event.target.closest(".difficulty-button");

      if (button) {
        this.setDifficulty(button.dataset.difficulty);
      }
    });

    this.undoButton.addEventListener("click", () => {
      this.undo();
    });

    this.redoButton.addEventListener("click", () => {
      this.redo();
    });

    this.restartButton.addEventListener("click", () => {
      this.restart();
    });
  }

  renderDifficultyOptions() {
    const buttons = Object.entries(DIFFICULTY_LEVELS).map(([difficulty, { label }]) => {
      const button = document.createElement("button");
      button.className = "difficulty-button";
      button.type = "button";
      button.dataset.difficulty = difficulty;
      button.textContent = label;
      return button;
    });

    this.difficultyOptions.replaceChildren(...buttons);
  }

  setDifficulty(difficulty) {
    if (!DIFFICULTY_LEVELS[difficulty]) {
      return;
    }

    this.difficulty = difficulty;
    this.render();
    this.save();
  }

  playHumanMove(x, y) {
    if (!this.canHumanPlay() || this.board[y][x] !== null) {
      return;
    }

    this.applyMove(x, y, HUMAN_PLAYER, { recordHistory: true });

    if (this.gameOver) {
      this.render();
      this.save();
      return;
    }

    this.isAiThinking = true;
    this.status = "L'IA réfléchit...";
    this.render();
    this.save();
    this.queueAiMove({ recordHistory: true });
  }

  queueAiMove({ recordHistory }) {
    window.clearTimeout(this.aiTimerId);
    this.aiTimerId = window.setTimeout(() => {
      this.playAiMove({ recordHistory });
    }, 220);
  }

  playAiMove({ recordHistory }) {
    if (this.gameOver || BoardHelpers.getNextPlayer(this.board) !== AI_PLAYER) {
      this.isAiThinking = false;
      this.syncStatusWithBoard();
      this.render();
      this.save();
      return;
    }

    const move = DIFFICULTY_LEVELS[this.difficulty].getMove(BoardHelpers.clone(this.board));

    if (move) {
      this.applyMove(move.x, move.y, AI_PLAYER, { recordHistory });
    }

    this.isAiThinking = false;
    this.syncStatusWithBoard();
    this.render();
    this.save();
  }

  applyMove(x, y, player, { recordHistory }) {
    if (this.board[y][x] !== null) {
      return false;
    }

    if (recordHistory) {
      this.history.record(this.board);
    }

    this.board[y][x] = player;
    this.syncStatusWithBoard();
    return true;
  }

  undo() {
    if (this.isAiThinking) {
      return;
    }

    const previousBoard = this.history.undo(this.board);

    if (!previousBoard) {
      return;
    }

    this.board = previousBoard;
    this.syncStatusWithBoard();
    this.render();
    this.save();
  }

  redo() {
    if (this.isAiThinking) {
      return;
    }

    const nextBoard = this.history.redo(this.board);

    if (!nextBoard) {
      return;
    }

    this.board = nextBoard;
    this.syncStatusWithBoard();
    this.render();
    this.save();
  }

  restart() {
    window.clearTimeout(this.aiTimerId);
    this.board = BoardHelpers.createEmptyBoard();
    this.gameOver = false;
    this.isAiThinking = false;
    this.status = "À vous de jouer.";
    this.history.clear();
    StorageService.clear();
    this.render();
  }

  canHumanPlay() {
    return (
      !this.gameOver &&
      !this.isAiThinking &&
      BoardHelpers.getNextPlayer(this.board) === HUMAN_PLAYER
    );
  }

  syncStatusWithBoard() {
    const winner = BoardHelpers.getWinner(this.board);

    if (winner === HUMAN_PLAYER) {
      this.gameOver = true;
      this.status = "Tu as battu l'IA !";
      return;
    }

    if (winner === AI_PLAYER) {
      this.gameOver = true;
      this.status = "L'IA a gagné !";
      return;
    }

    if (winner === "tie") {
      this.gameOver = true;
      this.status = "Match nul.";
      return;
    }

    this.gameOver = false;

    if (this.isAiThinking) {
      this.status = "L'IA réfléchit...";
      return;
    }

    this.status =
      BoardHelpers.getNextPlayer(this.board) === HUMAN_PLAYER
        ? "À vous de jouer."
        : "Annulez encore ou rétablissez le coup de l'IA.";
  }

  save() {
    StorageService.save({
      board: this.board,
      difficulty: this.difficulty,
      gameOver: this.gameOver,
      status: this.status,
      awaitingAi: this.isAiThinking,
    });
  }

  render() {
    this.statusElement.textContent = this.status;

    this.cells.forEach((cell) => {
      const x = Number(cell.dataset.x);
      const y = Number(cell.dataset.y);
      const value = this.board[y][x];
      const cellName = cell.id;

      cell.classList.toggle("filled-J1", value === HUMAN_PLAYER);
      cell.classList.toggle("filled-J2", value === AI_PLAYER);
      cell.disabled = !this.canHumanPlay() || value !== null;

      if (value === HUMAN_PLAYER) {
        cell.setAttribute("aria-label", `Case ${cellName}, joueur`);
      } else if (value === AI_PLAYER) {
        cell.setAttribute("aria-label", `Case ${cellName}, IA`);
      } else {
        cell.setAttribute("aria-label", `Case ${cellName}, vide`);
      }
    });

    this.difficultyOptions.querySelectorAll(".difficulty-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.difficulty === this.difficulty));
    });

    this.undoButton.disabled = this.isAiThinking || !this.history.canUndo();
    this.redoButton.disabled = this.isAiThinking || !this.history.canRedo();
  }
}
