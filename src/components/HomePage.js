import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container">
      <div className="background"></div>
      <h1 className="title">Hey you, Welcome :)</h1>
      <p className="date-display">📅 {today}</p>
      <h2 className="subtitle">
        Today is a great day to build something amazing! 🚀 <br></br> 
        This page is under construction. Play the game meanwhile!
      </h2>
      <Link to="/game">
        <button className="play-button">Play Under Construction Game</button>
      </Link>

      {/* Floating bricks */}
      <div className="brick brick1">🧱</div>
      <div className="brick brick2">🧱</div>
      <div className="brick brick3">🧱</div>
    </div>
  );
}
