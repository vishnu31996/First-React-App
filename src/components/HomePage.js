import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-content">
          <h2 className="logo">Morgan.</h2>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <p className="greeting">{greeting}, Morgan 👋</p>
          <h1 className="main-title">Welcome to Your Creative Space</h1>
          <p className="hero-subtitle">
            A professional portfolio and showcase of creativity. 
            This page is evolving into something extraordinary.
          </p>
          <div className="cta-buttons">
            <Link to="/game">
              <button className="primary-btn">Explore the Experience</button>
            </Link>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
        <div className="hero-date">
          <span className="date-box">📅 {today}</span>
        </div>
      </div>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🎨</span>
          <h3>Design</h3>
          <p>Crafted with attention to detail and modern aesthetics.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Performance</h3>
          <p>Fast, responsive, and optimized for all devices.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🚀</span>
          <h3>Innovation</h3>
          <p>Building something amazing every single day.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Morgan's Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
}
