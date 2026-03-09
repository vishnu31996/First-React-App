import { Link } from "react-router-dom";
import { useState } from "react";
import "./Results.css";

export default function Results({ mood, recommendations }) {
  const [copied, setCopied] = useState(false);

  if (!mood || !recommendations) {
    return (
      <div className="results-container">
        <p className="error">No recommendations found. Please select a mood first.</p>
        <Link to="/mood">
          <button className="back-btn">← Go Back</button>
        </Link>
      </div>
    );
  }

  const shareText = `I'm feeling ${mood.mood.label} on MoodMatch! Check out what I'm watching, listening to, and doing. 🎭`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MoodMatch - Find Your Vibe",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <Link to="/mood" className="back-button">← Change Mood</Link>
        <h1>Your Perfect Match 🎯</h1>
        <p className="mood-display">
          {mood.mood.emoji} {mood.mood.label} • {mood.intensity} Intensity
        </p>
      </div>

      <div className="results-grid">
        <section className="recommendation-section">
          <h2>🎬 Movies & Shows</h2>
          <div className="rec-cards">
            {recommendations.movies.map((item, idx) => (
              <div key={idx} className="rec-card">
                <div className="rec-title">{item.title}</div>
                <p className="rec-reason">💡 {item.reason}</p>
                <button className="watch-btn" onClick={() => window.open('https://www.google.com/search?q=' + encodeURIComponent(item.title + ' watch online'))}>Watch Now</button>
              </div>
            ))}
          </div>
        </section>

        <section className="recommendation-section">
          <h2>🎵 Music Playlists</h2>
          <div className="rec-cards">
            {recommendations.music.map((item, idx) => (
              <div key={idx} className="rec-card">
                <div className="rec-title">{item.title}</div>
                <p className="rec-reason">💡 {item.reason}</p>
                <button className="watch-btn" onClick={() => window.open('https://open.spotify.com/search/' + encodeURIComponent(item.title))}>Listen Now</button>
              </div>
            ))}
          </div>
        </section>

        <section className="recommendation-section">
          <h2>📚 Books & Reading</h2>
          <div className="rec-cards">
            {recommendations.books.map((item, idx) => (
              <div key={idx} className="rec-card">
                <div className="rec-title">{item.title}</div>
                <p className="rec-reason">💡 {item.reason}</p>
                <button className="watch-btn" onClick={() => window.open('https://www.goodreads.com/search?q=' + encodeURIComponent(item.title))}>Read Now</button>
              </div>
            ))}
          </div>
        </section>

        <section className="recommendation-section">
          <h2>🎯 Activities</h2>
          <div className="rec-cards">
            {recommendations.activities.map((item, idx) => (
              <div key={idx} className="rec-card">
                <div className="rec-title">{item.title}</div>
                <p className="rec-reason">💡 {item.reason}</p>
                <button className="watch-btn">Do It!</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="share-section">
        <p>Love your recommendations? Share them with friends! 👇</p>
        <div className="share-buttons">
          <button className="share-btn twitter" title="Share on Twitter">
            <span>𝕏</span> Share
          </button>
          <button className="share-btn facebook" title="Share on Facebook">
            <span>f</span> Share
          </button>
          <button className="share-btn copy" onClick={handleCopyLink}>
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </button>
          <button className="share-btn native" onClick={handleShare} title="Share">
            <span>📤</span> Share
          </button>
        </div>
      </div>

      <div className="cta-section">
        <Link to="/mood">
          <button className="explore-again">Explore Another Mood ✨</button>
        </Link>
      </div>
    </div>
  );
}
