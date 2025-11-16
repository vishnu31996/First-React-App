"use client";

import React, { useState, useEffect, useRef } from "react";
import { updatePlayerScore, subscribeLeaderboard, checkPlayerNameExists } from "../../firebase";
import "./UnderConstructionGame.css";
import { getPlayerData } from "../../firebase";

export default function UnderConstructionGame() {
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 50;
  const BRICK_WIDTH = 40;
  const BRICK_HEIGHT = 40;

  // --- State ---
  const [playerName, setPlayerName] = useState("");
  const [existingName, setExistingName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameModalVisible, setNameModalVisible] = useState(true);
  const [allNamesChecked, setAllNamesChecked] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerHighScore, setPlayerHighScore] = useState(0);
  const [playerPlays, setPlayerPlays] = useState(0);
  const [playerXPos, setPlayerXPos] = useState(200);
  const [leaderboard, setLeaderboard] = useState([]);

  // --- Refs ---
  const gameRef = useRef({
    bricks: [],
    score: 0,
    highScore:0,    playerX: 200,
    lastUpdate: 0,
    lastSpawn: 0,
    running: false,
  });
  const requestRef = useRef();
  const holdIntervalRef = useRef();

  // --- Leaderboard subscription ---
  useEffect(() => {
    const unsubscribe = subscribeLeaderboard((top) => {
      setLeaderboard(top);
    });
    return () => unsubscribe();
  }, []);

  // --- Collision detection ---
  const isColliding = (brick) => {
    const playerTop = GAME_HEIGHT - PLAYER_HEIGHT;
    const playerBottom = GAME_HEIGHT;
    const playerLeft = gameRef.current.playerX;
    const playerRight = gameRef.current.playerX + PLAYER_WIDTH;

    const brickTop = brick.y;
    const brickBottom = brick.y + BRICK_HEIGHT;
    const brickLeft = brick.x;
    const brickRight = brick.x + BRICK_WIDTH;

    return !(
      playerRight < brickLeft ||
      playerLeft > brickRight ||
      playerBottom < brickTop ||
      playerTop > brickBottom
    );
  };

  // --- Game loop ---
  const gameLoop = (timestamp) => {
    if (!gameRef.current.running) return;

    const delta = timestamp - gameRef.current.lastUpdate;
    if (delta > 50) {
      gameRef.current.score += 1;
      setScore(gameRef.current.score);
      gameRef.current.lastUpdate = timestamp;
    }

    // Spawn bricks
    if (timestamp - gameRef.current.lastSpawn > 1000) {
      const x = Math.floor(Math.random() * (GAME_WIDTH - BRICK_WIDTH));
      gameRef.current.bricks.push({
        x,
        y: -BRICK_HEIGHT,
        speedOffset: Math.random(),
      });
      gameRef.current.lastSpawn = timestamp;
    }

    // Move bricks
    gameRef.current.bricks = gameRef.current.bricks.map((brick) => ({
      ...brick,
      y: brick.y + 2 + brick.speedOffset + gameRef.current.score * 0.02,
    }));

    // Collision & remove off-screen bricks
    const remainingBricks = [];
    for (let brick of gameRef.current.bricks) {
      if (isColliding(brick)) {
        setGameOver(true);
        gameRef.current.running = false;
        cancelAnimationFrame(requestRef.current);
        stopHold();
        return;
      }
      if (brick.y < GAME_HEIGHT) remainingBricks.push(brick);
    }
    gameRef.current.bricks = remainingBricks;

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // --- Reset / Restart ---
  const resetGame = () => {
    cancelAnimationFrame(requestRef.current);
    stopHold();
    gameRef.current = {
      bricks: [],
      score: 0,
      playerX: 200,
      lastUpdate: performance.now(),
      lastSpawn: performance.now(),
      running: false,
    };
    setScore(0);
    setPlayerXPos(200);
    setGameOver(false);
  };

  const startGame = () => {
    if (!playerName) return;
    resetGame();
    setGameStarted(true);
    gameRef.current.running = true;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // --- Player movement ---
  const movePlayer = (delta) => {
    gameRef.current.playerX = Math.max(
      0,
      Math.min(GAME_WIDTH - PLAYER_WIDTH, gameRef.current.playerX + delta)
    );
    setPlayerXPos(gameRef.current.playerX);
  };
useEffect(() => {
  if (score > playerHighScore) {
    setPlayerHighScore(score);
  }
}, [score, playerHighScore]);
  // --- Keyboard ---
  useEffect(() => {
    const handleKey = (e) => {
      if (!gameStarted || gameOver) return;
      if (e.key === "ArrowLeft") movePlayer(-20);
      if (e.key === "ArrowRight") movePlayer(20);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameStarted, gameOver]);

  // --- Touch / pointer hold ---
  const startHold = (delta) => {
    stopHold();
    holdIntervalRef.current = setInterval(() => movePlayer(delta), 50);
  };
  const stopHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  };

  // --- Update score continuously ---
useEffect(() => {
  if (gameOver && playerName) {
    updatePlayerScore(playerName, score).then(async () => {
      const updatedData = await getPlayerData(playerName);
      setPlayerHighScore(updatedData.score || 0);
      setPlayerPlays(updatedData.plays || 0);
    });
  }
}, [gameOver, playerName, score]);

useEffect(() => {
  if (gameOver && playerName) {
    // Update high score and plays in Firebase only once
    updatePlayerScore(playerName, score).then(async () => {
      const updatedData = await getPlayerData(playerName);
      setPlayerHighScore(updatedData.score || 0);
      setPlayerPlays(updatedData.plays || 0);
    });
  }
}, [gameOver, playerName, score]);

  useEffect(() => {
  if (playerName) {
    getPlayerData(playerName).then(data => {
      setPlayerHighScore(data.score || 0);
      setPlayerPlays(data.plays || 0);
    });
  }
}, [playerName]);

  // --- Name modal logic ---
  const handleNameSubmit = async () => {
    if (!nameInput.trim()) return;
    const exists = await checkPlayerNameExists(nameInput.trim());
    if (exists) {
      setExistingName(nameInput.trim());
      setAllNamesChecked(true);
    } else {
      setPlayerName(nameInput.trim());
      setExistingName(nameInput.trim());
      setNameModalVisible(false);
    }
  };
  const handleYesExistingName = () => {
    setPlayerName(existingName);
    setNameModalVisible(false);
  };
  const handleNoExistingName = () => {
    setExistingName("");
    setNameInput("");
    setAllNamesChecked(false);
  };

  // --- Render ---
  return (
    <div className="uc-wrapper">
      {/* Game area */}
      <div className="game-left">
        <h2 className="neon-sign">UNDER CONSTRUCTION</h2>
        <div className="scores">
          <div className="uc-score">Score: {score}</div>
            <div className="player-stats">
                <div>Your High Score: {playerHighScore}</div>
                <div>Number of Plays: {playerPlays}</div>
                </div>  
        </div>

        {(gameOver || !gameStarted) && (
          <button className="uc-button" onClick={startGame}>
            {gameOver ? "Restart Game" : "Start Game"}
          </button>
        )}

        <div className="uc-game-area">
          <div className="player" style={{ left: playerXPos }}>
            👷
          </div>
          {gameRef.current.bricks.map((brick, i) => (
            <div key={i} className="brick" style={{ left: brick.x, top: brick.y }}>
              🧱
            </div>
          ))}
          {gameOver && <div className="game-over">Game Over!</div>}
        </div>

        {/* Touch buttons */}
        {gameStarted && !gameOver && (
          <div className="uc-touch-controls">
            <button
              className="uc-touch-btn"
              onPointerDown={() => startHold(-20)}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
            >
              ◀
            </button>
            <button
              className="uc-touch-btn"
              onPointerDown={() => startHold(20)}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="uc-leaderboard-right">
        <h3>Leaderboard</h3>
        <div className="now-playing">Playing: {playerName || "N/A"}</div>
        <ul className="uc-leaderboard">
          {leaderboard.length === 0 && <li className="lb-item muted">No scores yet</li>}
          {leaderboard.map((p, idx) => (
            <li key={p.name} className="lb-item">
              <span className="rank">{idx + 1}.</span>
              <span className="playerName">{p.name}</span>
              <span className="playerScore">{p.score}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Name modal */}
      {nameModalVisible && (
        <div className="name-modal">
          {!allNamesChecked ? (
            <>
              <p>Enter your player name:</p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <button onClick={handleNameSubmit}>Submit</button>
            </>
          ) : (
            <>
              <p>Name aready Exists, Is that you? <b>{existingName}</b>?</p>
              <button onClick={handleYesExistingName}>Yes</button>
              <button onClick={handleNoExistingName}>No</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
