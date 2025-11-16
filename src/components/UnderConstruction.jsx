import React, { useState, useEffect, useRef } from "react";
import "./UnderConstructionGame.css";

export default function ConstructionGame() {
  const gameAreaRef = useRef(null);
  const playerRef = useRef(null);
  const bricksRef = useRef([]); // brick data
  const animationRef = useRef(null);

  const [playerPos, setPlayerPos] = useState(250); // px
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle player movement
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKey = (e) => {
      const gameWidth = gameAreaRef.current.offsetWidth;
      if (e.key === "ArrowLeft") setPlayerPos((p) => Math.max(p - 20, 0));
      if (e.key === "ArrowRight") setPlayerPos((p) => Math.min(p + 20, gameWidth - 50));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameStarted, gameOver]);

  // Start / Restart
  const handleRestart = () => {
    setPlayerPos(250);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    bricksRef.current = [];
    cancelAnimationFrame(animationRef.current);
  };

  const startGame = () => {
    setGameStarted(true);
    bricksRef.current = [];
    setScore(0);
    setGameOver(false);
  };

  // Spawn bricks
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = setInterval(() => {
      const gameWidth = gameAreaRef.current.offsetWidth;
      const id = Date.now();
      const left = Math.random() * (gameWidth - 50);
      const brick = { id, left, top: 0 };

      // Create brick element directly in DOM
      const brickEl = document.createElement("div");
      brickEl.className = "brick";
      brickEl.id = "brick-" + id;
      brickEl.style.left = left + "px";
      brickEl.style.top = "0px";
      brickEl.textContent = "🧱";
      gameAreaRef.current.appendChild(brickEl);

      bricksRef.current.push({ ...brick, el: brickEl });
    }, 900);

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver]);

  // Animate bricks
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const animate = () => {
      const gameHeight = gameAreaRef.current.offsetHeight;
      const playerWidth = 50;
      const playerHeight = 50;
      const brickSize = 40;
      let newScore = score;

      const remainingBricks = [];

      bricksRef.current.forEach((brick) => {
        brick.top += 4; // pixels per frame
        brick.el.style.top = brick.top + "px";

        // Collision detection
        if (
          brick.top + brickSize >= gameHeight - playerHeight &&
          brick.left + brickSize > playerPos &&
          brick.left < playerPos + playerWidth
        ) {
          setGameOver(true);
        } else if (brick.top < gameHeight) {
          remainingBricks.push(brick);
        } else {
          newScore += 1;
          // Remove element from DOM
          brick.el.remove();
        }
      });

      bricksRef.current = remainingBricks;

      if (newScore !== score) setScore(newScore);

      if (!gameOver) animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameStarted, gameOver, playerPos, score]);

  return (
    <div className="uc-wrapper">
      <h1 className="neon-sign">UNDER CONSTRUCTION 🏗️</h1>
      <p className="uc-text">
        Move 👷‍♂️ with <strong>← →</strong> to dodge the falling bricks 🧱
      </p>

      {!gameStarted && !gameOver && (
        <button className="uc-button" onClick={startGame}>
          🚀 Start Game
        </button>
      )}

      <div className="uc-game-area" ref={gameAreaRef}>
        <div className="crane">🏗️</div>

        {gameStarted && !gameOver && (
          <div className="player" ref={playerRef} style={{ left: playerPos + "px" }}>
            👷‍♂️
          </div>
        )}

        {gameOver && (
          <div className="game-over">
            💥 Game Over! Score: {score}
            <br />
            <button className="uc-button" onClick={handleRestart}>
              🔄 Restart
            </button>
          </div>
        )}
      </div>

      {gameStarted && !gameOver && <div className="uc-score">Score: {score}</div>}
    </div>
  );
}
