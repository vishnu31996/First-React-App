import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { generateRecommendations } from "../utils/recommendationEngine";
import "./MoodSelector.css";

const MOODS = [
  { emoji: "😊", label: "Happy", color: "#FFD93D" },
  { emoji: "😢", label: "Sad", color: "#6C5CE7" },
  { emoji: "😰", label: "Anxious", color: "#E17055" },
  { emoji: "😌", label: "Calm", color: "#00B894" },
  { emoji: "🤩", label: "Excited", color: "#FF6348" },
  { emoji: "🧠", label: "Focused", color: "#0984E3" },
  { emoji: "😴", label: "Tired", color: "#2D3436" },
  { emoji: "🤔", label: "Thoughtful", color: "#A29BFE" },
  { emoji: "😡", label: "Angry", color: "#D63031" },
  { emoji: "🥰", label: "Loved", color: "#FD79A8" },
  { emoji: "😎", label: "Confident", color: "#FDCB6E" },
];

const INTENSITY_LEVELS = [
  { label: "Mild", color: "#light" },
  { label: "Moderate", color: "#medium" },
  { label: "Intense", color: "#dark" },
];

export default function MoodSelector({ setSelectedMood, setRecommendations }) {
  const [selectedMood, setLocalSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState("Moderate");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateRecommendationsAndNavigate = async () => {
    if (!selectedMood) return;

    setLoading(true);

    // Generate dynamic recommendations based on mood and intensity
    const recommendations = generateRecommendations(selectedMood, intensity);

    setSelectedMood({ mood: selectedMood, intensity });
    setRecommendations(recommendations);

    // Simulate AI thinking delay
    setTimeout(() => {
      setLoading(false);
      navigate("/results");
    }, 1200);
  };

  return (
    <div className="mood-selector-container">
      <div className="selector-header">
        <Link to="/" className="back-button">← Back</Link>
        <h1>How are you feeling?</h1>
      </div>

      <div className="mood-grid">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            className={`mood-button ${selectedMood?.label === mood.label ? "selected" : ""}`}
            style={
              selectedMood?.label === mood.label
                ? { backgroundColor: mood.color, boxShadow: `0 0 30px ${mood.color}` }
                : { borderColor: mood.color }
            }
            onClick={() => setLocalSelectedMood(mood)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="intensity-section">
          <p className="intensity-label">How intense is this feeling?</p>
          <div className="intensity-buttons">
            {INTENSITY_LEVELS.map((level) => (
              <button
                key={level.label}
                className={`intensity-btn ${intensity === level.label ? "active" : ""}`}
                onClick={() => setIntensity(level.label)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className={`generate-button ${selectedMood ? "active" : ""}`}
        onClick={generateRecommendationsAndNavigate}
        disabled={!selectedMood || loading}
      >
        {loading ? "✨ Finding your match..." : "✨ Get Recommendations"}
      </button>
    </div>
  );
}
