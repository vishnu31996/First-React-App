import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="container">
      <div className="background"></div>
      <h1 className="title">Hey you, Welcome :)</h1>
      <h2 className="subtitle">
        This page is under construction. <br></br> Play the Under Construction Game meanwhile!
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
