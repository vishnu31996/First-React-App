import { Link } from "react-router-dom";
import ChatInterface from "./ChatInterface";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <div className="stars"></div>
      
      <nav className="landing-nav">
        <h1 className="brand">🎭 MoodMatch</h1>
        <p className="tagline">Find your vibe in seconds</p>
      </nav>

      <div className="landing-content">
        <div className="hero-section">
          <h2 className="hero-title">
            Tell us your <span className="highlight">mood</span>.<br />
            We'll find your <span className="highlight">perfect match</span>.
          </h2>
          
          <p className="hero-description">
            Movies, music, books, and activities tailored to exactly how you're feeling right now.
          </p>

          <Link to="/mood">
            <button className="cta-button">✨ Start Exploring</button>
          </Link>

          <div className="features">
            <div className="feature">
              <span className="feature-icon">🎬</span>
              <p>Movies & Shows</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎵</span>
              <p>Music Playlists</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📚</span>
              <p>Books & Reading</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <p>Activities</p>
            </div>
          </div>
        </div>

        <div className="mood-preview">
          <Link to="/mood" className="preview-card happy">😊 Happy</Link>
          <Link to="/mood" className="preview-card sad">😢 Sad</Link>
          <Link to="/mood" className="preview-card anxious">😰 Anxious</Link>
          <Link to="/mood" className="preview-card calm">😌 Calm</Link>
          <Link to="/mood" className="preview-card excited">🤩 Excited</Link>
          <Link to="/mood" className="preview-card focused">🧠 Focused</Link>
        </div>
      </div>

      <div className="chat-section">
        <ChatInterface />
      </div>

      <footer className="landing-footer">
        <p>✨ 100% Free • No Login Required • AI-Powered Recommendations</p>
      </footer>
    </div>
  );
}
