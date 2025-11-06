import { useState, useEffect } from "react";

export default function App() {
  const [ballY, setBallY] = useState(0);
  const [ballX, setBallX] = useState(Math.random() * 90);
  const [playerX, setPlayerX] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Ball harakatlanishi
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBallY((y) => {
        if (y >= 90) {
          // o‘yinchi to‘pni ushladimi?
          if (Math.abs(playerX - ballX) < 10) {
            setScore((s) => s + 1);
            setBallX(Math.random() * 90);
            return 0;
          } else {
            setGameOver(true);
            return y;
          }
        }
        return y + 5;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [ballX, playerX, gameOver]);

  // O‘yinchini klaviatura bilan boshqarish
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft" && playerX > 0) {
        setPlayerX((x) => x - 5);
      } else if (e.key === "ArrowRight" && playerX < 90) {
        setPlayerX((x) => x + 5);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playerX]);

  return (
    <div className="game">
      <h1>🎮 Catch the Ball</h1>
      <p>Score: {score}</p>
      {gameOver && <h2>Game Over! 🔄 Refresh to restart</h2>}
      <div className="field">
        <div className="ball" style={{ top: `${ballY}%`, left: `${ballX}%` }} />
        <div className="player" style={{ left: `${playerX}%` }} />
      </div>
    </div>
  );
}









const field = document.getElementById("field");
const player = document.getElementById("player");
const gameOverText = document.getElementById("gameOver");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");

let score = 0;
let isGameOver = false;
let currentBall = null;

function createBall() {
  if (currentBall) return; // Agar shar bor bo‘lsa, yangi chiqmasin

  const ball = document.createElement("div");
  ball.classList.add("ball");

  ball.style.left = Math.random() * (field.clientWidth - 30) + "px";
  ball.style.top = "0px";
  field.appendChild(ball);
  currentBall = ball;

  let fall = setInterval(() => {
    if (isGameOver) {
      clearInterval(fall);
      return;
    }

    let ballTop = parseInt(ball.style.top);
    ball.style.top = ballTop + 2 + "px"; // sekin tushishi uchun

    // O'yinchi va sharni to'qnashuvini tekshirish
    let ballRect = ball.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();

    if (
      ballRect.bottom >= playerRect.top &&
      ballRect.left < playerRect.right &&
      ballRect.right > playerRect.left
    ) {
      clearInterval(fall);
      field.removeChild(ball);
      currentBall = null;
      score++;
      scoreEl.textContent = "Score: " + score;
      createBall(); // Yangi sharni yaratish
    }

    // Agar pastga tushib ketsa
    if (ballTop > field.clientHeight - 20) {
      clearInterval(fall);
      gameOver();
    }
  }, 20);
}

function gameOver() {
  isGameOver = true;
  gameOverText.style.display = "block";
}

restartBtn.addEventListener("click", () => {
  location.reload();
});

// Klaviatura orqali o‘yinchini harakatlantirish
document.addEventListener("keydown", (e) => {
  let left = parseInt(player.style.left) || 0;
  if (e.key === "ArrowLeft" && left > 0) {
    player.style.left = left - 20 + "px";
  } else if (e.key === "ArrowRight" && left < field.clientWidth - 60) {
    player.style.left = left + 20 + "px";
  }
});

// O'yinni boshlash
createBall();
