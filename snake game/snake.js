// === ELEMENTS ===
const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const ScoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

// === CONFIG ===
const blockHeight = 50;
const blockWidth = 50;

let highScore = Number(localStorage.getItem("highScore")) || 0;
let score = 0;
let time = `00-00`;

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalID = null;
let timerIntervalId = null;

const blocks = []; // indexed by "row-col"
let snake = [{ x: 1, y: 3 }];
let direction = "right"; // use lowercase consistently
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

// build grid
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

// Helper: place food not on snake
function placeFood() {
  let fx, fy;
  do {
    fx = Math.floor(Math.random() * rows);
    fy = Math.floor(Math.random() * cols);
    // repeat if cell is on the snake
  } while (snake.some(seg => seg.x === fx && seg.y === fy));
  // remove old food if present
  Object.values(blocks).forEach(b => b && b.classList && b.classList.remove("food"));
  food = { x: fx, y: fy };
  if (blocks[`${fx}-${fy}`]) blocks[`${fx}-${fy}`].classList.add("food");
}

// Helper: stop game intervals
function stopIntervals() {
  if (intervalID) {
    clearInterval(intervalID);
    intervalID = null;
  }
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

// Self-collision test
function isSelfCollision(head) {
  return snake.some(seg => seg.x === head.x && seg.y === head.y);
}

// RENDER / GAME TICK
function render() {
  // ensure food exists visually
  if (blocks[`${food.x}-${food.y}`] && !blocks[`${food.x}-${food.y}`].classList.contains("food")) {
    blocks[`${food.x}-${food.y}`].classList.add("food");
  }

  // compute next head based on direction
  const currentHead = snake[0];
  let head;
  if (direction === "right") {
    head = { x: currentHead.x, y: currentHead.y + 1 };
  } else if (direction === "left") {
    head = { x: currentHead.x, y: currentHead.y - 1 };
  } else if (direction === "up") {
    head = { x: currentHead.x - 1, y: currentHead.y };
  } else if (direction === "down") {
    head = { x: currentHead.x + 1, y: currentHead.y };
  } else {
    head = { x: currentHead.x, y: currentHead.y + 1 };
  }

  // wall collision
  if (!head || head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    stopIntervals();
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  // self collision
  if (isSelfCollision(head)) {
    stopIntervals();
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  // food consume?
  if (head.x === food.x && head.y === food.y) {
    // remove old food class
    if (blocks[`${food.x}-${food.y}`]) blocks[`${food.x}-${food.y}`].classList.remove("food");

    // grow snake by adding head (don't pop tail)
    snake.unshift(head);

    // increase score
    score += 10;
    ScoreElement.textContent = score;

    // update high score (numeric)
    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = highScore;
      localStorage.setItem("highScore", String(highScore));
    }

    // place new food (not on snake)
    placeFood();
  } else {
    // normal move: remove tail visually, then move
    const tail = snake[snake.length - 1];
    if (tail && blocks[`${tail.x}-${tail.y}`]) blocks[`${tail.x}-${tail.y}`].classList.remove("fill");

    snake.pop();
    snake.unshift(head);
  }

  // render snake segments (head + body)
  snake.forEach((segment) => {
    if (blocks[`${segment.x}-${segment.y}`]) blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

// Start the main tick (safe starter that clears any existing interval first)
function startGameLoop(speed = 400) {
  if (intervalID) clearInterval(intervalID);
  intervalID = setInterval(render, speed);
}

// Start the timer (safe)
function startTimer() {
  if (timerIntervalId) clearInterval(timerIntervalId);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    if (Number.isNaN(min)) min = 0;
    if (Number.isNaN(sec)) sec = 0;
    if (sec === 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    const mm = String(min).padStart(2, "0");
    const ss = String(sec).padStart(2, "0");
    time = `${mm}-${ss}`;
    timeElement.innerHTML = time;
  }, 1000);
}

// INITIALIZE visuals
placeFood();
snake.forEach(seg => {
  if (blocks[`${seg.x}-${seg.y}`]) blocks[`${seg.x}-${seg.y}`].classList.add("fill");
});
ScoreElement.innerText = score;
timeElement.innerText = time;

// START button
startButton.addEventListener("click", () => {
  modal.style.display = "none";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "none";
  stopIntervals(); // avoid duplicates
  startGameLoop(400);
  startTimer();
});

// RESTART button (reset state)
restartButton.addEventListener("click", restartGame);

function restartGame() {
  // Clear intervals first
  stopIntervals();

  // clear previous food & snake visuals
  if (blocks[`${food.x}-${food.y}`]) blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach(segment => {
    if (blocks[`${segment.x}-${segment.y}`]) {
      blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    }
  });

  // reset state
  score = 0;
  time = `00-00`;
  ScoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore; // don't reset high score

  direction = "down"; // starting direction
  snake = [{ x: 1, y: 3 }];

  placeFood();
  snake.forEach(seg => {
    if (blocks[`${seg.x}-${seg.y}`]) blocks[`${seg.x}-${seg.y}`].classList.add("fill");
  });

  modal.style.display = "none";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "none";

  // start game
  startGameLoop(300);
  startTimer();
}

// KEY HANDLING: keep values lowercase and prevent immediate reverse
addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    if (direction !== "down") direction = "up";
  } else if (event.key === "ArrowRight") {
    if (direction !== "left") direction = "right";
  } else if (event.key === "ArrowLeft") {
    if (direction !== "right") direction = "left";
  } else if (event.key === "ArrowDown") {
    if (direction !== "up") direction = "down";
  }
});
