// UnderConstructionGame.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  getGlobalHighScore,
  updateGlobalHighScoreIfHigher,
  submitScore,
  getLeaderboardTop10,
} from "../firebase";
import "./UnderConstructionGame.css";

export default function UnderConstructionGame() {
  // Constants
  const WIDTH = 640;
  const HEIGHT = 420;
  const PLAYER_SIZE = 48;
  const BRICK_SIZE = 40;

  // UI state
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [playerHigh, setPlayerHigh] = useState(0);
  const [globalHigh, setGlobalHigh] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [nowPlaying, setNowPlaying] = useState("");

  // Refs for game loop & state
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const playerX = useRef(WIDTH / 2 - PLAYER_SIZE / 2);
  const bricks = useRef([]);
  const scoreRef = useRef(0);
  const lastTime = useRef(0);
  const spawnTimer = useRef(0);
  const running = useRef(false);
  const rafId = useRef(null);

  // On mount: load name from localStorage, global high, leaderboard
  useEffect(() => {
    const stored = localStorage.getItem("uc_player_name");
    if (stored && stored.trim()) {
      setName(stored);
      setHasName(true);
      setNowPlaying(stored);
    }
    (async () => {
      const gh = await getGlobalHighScore();
      setGlobalHigh(gh || 0);
      const lb = await getLeaderboardTop10();
      setLeaderboard(lb);
    })();
  }, []);

  // Canvas setup
  useEffect(() => {
    const c = canvasRef.current;
    c.width = WIDTH;
    c.height = HEIGHT;
    ctxRef.current = c.getContext("2d");
    // set some basic font baseline for emoji drawing
    ctxRef.current.textBaseline = "top";
  }, []);

  // Utilities
  const resetGameState = () => {
    bricks.current = [];
    scoreRef.current = 0;
    setScoreDisplay(0);
    spawnTimer.current = 0;
    lastTime.current = 0;
    playerX.current = WIDTH / 2 - PLAYER_SIZE / 2;
    running.current = false;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const startGame = () => {
    resetGameState();
    setGameStarted(true);
    setGameOver(false);
    running.current = true;
    setNowPlaying(name);
    rafId.current = requestAnimationFrame(loop);
  };

  // Movement helpers (hold-to-move)
  const holdIntervalRef = useRef(null);
  const startHold = (dir) => {
    // dir: -1 left, 1 right
    if (!gameStarted || gameOver) return;
    clearInterval(holdIntervalRef.current);
    moveOnce(dir);
    holdIntervalRef.current = setInterval(() => moveOnce(dir), 120);
  };
  const stopHold = () => clearInterval(holdIntervalRef.current);
  const moveOnce = (dir) => {
    playerX.current = Math.max(0, Math.min(WIDTH - PLAYER_SIZE, playerX.current + dir * 18));
  };

  // Keyboard for desktop
  useEffect(() => {
    const onKey = (e) => {
      if (!gameStarted || gameOver) return;
      if (e.key === "ArrowLeft") moveOnce(-1);
      if (e.key === "ArrowRight") moveOnce(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameStarted, gameOver]);

  // Collision detection (strict, no-false-positive)
  const rectsCollide = (px, py, pw, ph, bx, by, bw, bh) => {
    // return true only if overlap area > 0
    return px < bx + bw && px + pw > bx && py < by + bh && py + ph > by;
  };

  // Main game loop
  const loop = (t) => {
    if (!running.current) return;
    if (!lastTime.current) lastTime.current = t;
    const delta = t - lastTime.current;
    lastTime.current = t;
    spawnTimer.current += delta;

    // score progression
    scoreRef.current += delta * 0.018; // tuned value ~7-8 pts/s
    setScoreDisplay(Math.floor(scoreRef.current));

    // spawn bricks every ~900ms
    if (spawnTimer.current > 900) {
      spawnTimer.current = 0;
      bricks.current.push({
        x: Math.random() * (WIDTH - BRICK_SIZE),
        y: -BRICK_SIZE - Math.random() * 60,
        speed: 1.6 + Math.random() * 2.2,
      });
    }

    // update bricks; check collision
    const rem = [];
    for (let i = 0; i < bricks.current.length; i++) {
      const b = bricks.current[i];
      b.y += b.speed + scoreRef.current * 0.0008; // small acceleration
      // collision rects: player anchored at bottom
      const pTop = HEIGHT - PLAYER_SIZE;
      const pLeft = playerX.current;
      const hit = rectsCollide(pLeft, pTop, PLAYER_SIZE, PLAYER_SIZE, b.x, b.y, BRICK_SIZE, BRICK_SIZE);
      if (hit) {
        // stop
        running.current = false;
        setGameOver(true);
        // finalize scores
        const final = Math.floor(scoreRef.current);
        setScoreDisplay(final);
        setPlayerHigh((prev) => Math.max(prev, final));

        // update firebase once
        (async () => {
          try {
            await updateGlobalHighScoreIfHigher(final);
            await submitScore(name || "Guest", final);
            const gh = await getGlobalHighScore();
            setGlobalHigh(gh || 0);
            const lb = await getLeaderboardTop10();
            setLeaderboard(lb);
          } catch (e) {
            console.error("submit/update error", e);
          }
        })();

        break; // exit update loop
      }
      if (b.y < HEIGHT) rem.push(b);
    }
    bricks.current = rem;

    // draw
    drawFrame();

    // next frame
    if (running.current) {
      rafId.current = requestAnimationFrame(loop);
    }
  };

  const drawFrame = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // background
    ctx.fillStyle = "#0b1223";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // player (emoji drawn with fillText; position tuned so it sits inside rectangle)
    ctx.font = `${PLAYER_SIZE}px serif`;
    ctx.fillText("👷", playerX.current, HEIGHT - PLAYER_SIZE - 4);

    // bricks
    ctx.font = `${BRICK_SIZE}px serif`;
    for (const b of bricks.current) ctx.fillText("🧱", b.x, b.y);

    // HUD (in canvas for crisp overlay)
    ctx.font = "14px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Score: ${Math.floor(scoreRef.current)}`, 8, 8);
    ctx.fillText(`Now Playing: ${name || "Guest"}`, 8, 26);
    ctx.fillText(`Your High: ${playerHigh}`, 8, 44);
    ctx.fillText(`Global High: ${globalHigh}`, 8, 62);
  };

  // Save name first time only (Option C)
  const confirmName = () => {
    const cleaned = (name || "").trim();
    if (!cleaned) return;
    localStorage.setItem("uc_player_name", cleaned);
    setHasName(true);
    setNowPlaying(cleaned);
  };

  // Manual restart button handler
  const handleRestart = () => {
    resetGameState();
    setGameOver(false);
    setGameStarted(false);
    // fetch latest leaderboard & global
    (async () => {
      const gh = await getGlobalHighScore();
      setGlobalHigh(gh || 0);
      const lb = await getLeaderboardTop10();
      setLeaderboard(lb);
    })();
  };

  // cleanup RAF on unmount
  useEffect(() => {
    return () => {
      running.current = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearInterval(holdIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Layout: game area + right-side leaderboard
  return (
    <div className="uc-container">
      {/* Left: Game & Controls */}
      <div className="uc-left">
        <h2>UNDER CONSTRUCTION</h2>

        {!hasName && (
          <div className="name-prompt">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <button className="uc-button" onClick={confirmName}>
              Save Name
            </button>
          </div>
        )}

        <div className="uc-hud">
          <div>Now Playing: <strong>{nowPlaying || "Guest"}</strong></div>
          <div>Score: <strong>{scoreDisplay}</strong></div>
          <div>Your High: <strong>{playerHigh}</strong></div>
          <div>Global High: <strong>{globalHigh}</strong></div>
        </div>

        <div className="uc-canvas-wrap">
          <canvas ref={canvasRef} className="uc-canvas-el" />
        </div>

        <div className="uc-controls">
          {/* Buttons support pointer & touch; pressing & holding moves repeatedly */}
          <button
            className="uc-button"
            onPointerDown={() => startHold(-1)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onMouseDown={() => startHold(-1)}
            onMouseUp={stopHold}
          >
            ◀
          </button>

          {!gameStarted || gameOver ? (
            <button
              className="uc-button start-btn"
              onClick={() => {
                if (!hasName) confirmName();
                startGame();
              }}
            >
              {gameOver ? "Restart" : "Start"}
            </button>
          ) : (
            <button
              className="uc-button"
              onClick={() => {
                // pause / resume behavior
                if (running.current) {
                  running.current = false;
                  if (rafId.current) cancelAnimationFrame(rafId.current);
                } else {
                  running.current = true;
                  rafId.current = requestAnimationFrame(loop);
                }
              }}
            >
              {running.current ? "Pause" : "Resume"}
            </button>
          )}

          <button
            className="uc-button"
            onPointerDown={() => startHold(1)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onMouseDown={() => startHold(1)}
            onMouseUp={stopHold}
          >
            ▶
          </button>

          <button className="uc-button small" onClick={handleRestart}>
            Reset
          </button>
        </div>
      </div>

      {/* Right: Leaderboard Sidebar */}
      <aside className="uc-sidebar">
        <h3>Top Players</h3>
        <div className="uc-now-playing">Now Playing: <strong>{nowPlaying || "Guest"}</strong></div>
        <ol className="uc-leaderboard">
          {leaderboard.length === 0 && <li className="muted">No scores yet</li>}
          {leaderboard.map((row, idx) => (
            <li key={idx}>
              <span className="rank">{idx + 1}.</span>
              <span className="playerName">{row.name}</span>
              <span className="playerScore">{row.score}</span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
