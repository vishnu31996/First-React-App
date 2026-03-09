import { useState, useEffect } from "react";
import { getHistory } from "../utils/localStorage";
import "./StatsBoard.css";

export default function StatsBoard() {
  const [moodStats, setMoodStats] = useState({});

  useEffect(() => {
    const history = getHistory();
    const stats = {};
    history.forEach(h => {
      stats[h.mood] = (stats[h.mood] || 0) + 1;
    });
    setMoodStats(stats);
  }, []);

  const sorted = Object.entries(moodStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const total = Object.values(moodStats).reduce((a, b) => a + b, 0);
  const topMood = sorted[0]?.[0] || "No data";

  return (
    <div className="stats-container">
      <h1>📊 Your Mood Stats</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Sessions</p>
          <h2 className="stat-value">{total}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-label">Most Common</p>
          <h2 className="stat-value">{topMood}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-label">Unique Moods</p>
          <h2 className="stat-value">{Object.keys(moodStats).length}</h2>
        </div>
      </div>

      <div className="chart-section">
        <h3>Mood Frequency</h3>
        <div className="mood-bars">
          {sorted.length > 0 ? (
            sorted.map(([mood, count]) => (
              <div key={mood} className="mood-bar">
                <label>{mood}</label>
                <div className="bar-container">
                  <div className="bar" style={{ width: `${(count / (sorted[0][1] || 1)) * 100}%` }}></div>
                </div>
                <span>{count}x</span>
              </div>
            ))
          ) : (
            <p>Start using MoodMatch to see your stats!</p>
          )}
        </div>
      </div>
    </div>
  );
}
