const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');
const historyElement = document.getElementById('history');
const clearHistoryButton = document.getElementById('clearHistory');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let isGameOver = false;

// Cargar el progreso guardado desde localStorage
function loadProgress() {
    const savedBoard = localStorage.getItem('trikiBoard');
    const savedPlayer = localStorage.getItem('trikiPlayer');
    if (savedBoard) {
        board = JSON.parse(savedBoard);
        board.forEach((value, index) => {
            if (value) {
                boardElement.children[index].textContent = value;
            }
        });
    }
    if (savedPlayer) {
        currentPlayer = savedPlayer;
        statusElement.textContent = `Es el turno de ${currentPlayer}`;
    }
}

// Guardar el progreso en localStorage
function saveProgress() {
    localStorage.setItem('trikiBoard', JSON.stringify(board));
    localStorage.setItem('trikiPlayer', currentPlayer);
}

// Guardar resultado de la partida en el historial
function saveToHistory(result) {
    const history = JSON.parse(localStorage.getItem('trikiHistory')) || [];
    history.push({
        board: [...board],
        result: result,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('trikiHistory', JSON.stringify(history));
    updateHistory();
}

// Mostrar el historial de partidas
function updateHistory() {
    const history = JSON.parse(localStorage.getItem('trikiHistory')) || [];
    historyElement.innerHTML = history.map(entry => {
        return `<p><strong>${entry.result}</strong> - ${entry.timestamp}</p>`;
    }).join('');
}

// Comprobar si hay un ganador
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusElement.textContent = `¡${board[a]} ha ganado!`;
            isGameOver = true;
            saveToHistory(`${board[a]} ha ganado`);
            return;
        }
    }

    if (!board.includes(null)) {
        statusElement.textContent = '¡Empate!';
        isGameOver = true;
        saveToHistory('Empate');
    }
}

// Manejar clic en las celdas
function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] || isGameOver) {
        return;
    }

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    checkWinner();

    if (!isGameOver) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Es el turno de ${currentPlayer}`;
    }

    saveProgress();
}

// Borrar el historial
function clearHistory() {
    localStorage.removeItem('trikiHistory');
    updateHistory();
}

// Event listeners
boardElement.addEventListener('click', handleCellClick);
resetButton.addEventListener('click', () => {
    board = Array(9).fill(null);
    Array.from(boardElement.children).forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
    isGameOver = false;
    statusElement.textContent = `Es el turno de ${currentPlayer}`;
    saveProgress();
});
clearHistoryButton.addEventListener('click', clearHistory);

// Cargar el progreso al iniciar
loadProgress();
updateHistory();