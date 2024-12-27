const board = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const previousScoreElement = document.getElementById("previous-score");
const boardSize = 600; 
const blockSize = 20;   
const directionMap = {
    ArrowUp: { dx: 0, dy: -blockSize },
    ArrowDown: { dx: 0, dy: blockSize },
    ArrowLeft: { dx: -blockSize, dy: 0 },
    ArrowRight: { dx: blockSize, dy: 0 }
};

let snake = [{ x: 300, y: 300 }]; 
let food = { x: 180, y: 180 };    
let direction = directionMap["ArrowRight"];
let isGameOver = false;
let score = 0;
let gameInterval;
let isPaused = false;

function createBlock(x, y, className) {
    const block = document.createElement("div");
    block.classList.add(className);
    block.style.width = block.style.height = `${blockSize}px`;
    block.style.left = `${x}px`;
    block.style.top = `${y}px`;
    return block;
}
function drawSnake() {
    board.innerHTML = ''; 
    snake.forEach(segment => {
        board.appendChild(createBlock(segment.x, segment.y, "snake"));
    });
}

function drawFood() {
    board.appendChild(createBlock(food.x, food.y, "food"));
}

function updateScore() {
    scoreElement.textContent = score;
}

function moveSnake() {
    if (isGameOver || isPaused) return;

    const head = { ...snake[0] };
    head.x += direction.dx;
    head.y += direction.dy;
    if (head.x < 0) head.x = boardSize - blockSize;
    if (head.x >= boardSize) head.x = 0;
    if (head.y < 0) head.y = boardSize - blockSize;
    if (head.y >= boardSize) head.y = 0;

    if (collision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head); 

    if (head.x === food.x && head.y === food.y) {
        score += 10;  
        generateFood();  
        updateScore(); 
    } else {
        snake.pop(); 
    }

    drawSnake();
    drawFood();
}

function collision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function generateFood() {
    const x = Math.floor(Math.random() * (boardSize / blockSize)) * blockSize;
    const y = Math.floor(Math.random() * (boardSize / blockSize)) * blockSize;
    food = { x, y };
}

function gameOver() {
    isGameOver = true;
    previousScoreElement.textContent = score; 
    const gameOverText = document.createElement("div");
    gameOverText.classList.add("game-over");
    gameOverText.innerText = "Game Over!";
    board.appendChild(gameOverText);
}

function resetGame() {
    isGameOver = false;
    isPaused = false;
    snake = [{ x: 300, y: 300 }];
    direction = directionMap["ArrowRight"];
    score = 0;
    updateScore();
    previousScoreElement.textContent = score;
    clearInterval(gameInterval); 
    gameLoop(); 
}

function pauseGame() {
    if (isGameOver) return;
    isPaused = !isPaused; 
}

document.addEventListener("keydown", (e) => {
    if (isGameOver) return;

    const newDirection = directionMap[e.key];
    if (newDirection && 
        (Math.abs(newDirection.dx) !== Math.abs(direction.dx) || Math.abs(newDirection.dy) !== Math.abs(direction.dy))) {
        direction = newDirection;
    }
});

function gameLoop() {
    if (isGameOver || isPaused) return;
    moveSnake();
    gameInterval = setTimeout(gameLoop, 150);
}
document.getElementById("start-button").addEventListener("click", () => {
    if (isGameOver) {
        resetGame(); 
    } else if (!gameInterval) {
        gameLoop(); 
    }
    isGameOver = false;
    isPaused = false;
});
document.getElementById("pause-button").addEventListener("click", pauseGame);
document.getElementById("reset-button").addEventListener("click", resetGame);
gameLoop();
