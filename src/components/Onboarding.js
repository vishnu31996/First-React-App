import { useState } from "react";
import "./Onboarding.css";

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      emoji: "🎭",
      title: "Welcome to MoodMatch",
      desc: "Your personalized companion for movies, music, books & activities",
    },
    {
      emoji: "😊",
      title: "Tell Your Mood",
      desc: "Choose from 13 moods or describe how you're feeling",
    },
    {
      emoji: "✨",
      title: "Get Recommendations",
      desc: "Instant personalized suggestions just for you",
    },
    {
      emoji: "❤️",
      title: "Save Favorites",
      desc: "Keep your favorites in one place to access anytime",
    },
  ];

  const current = slides[step];

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        <div className="onboarding-emoji">{current.emoji}</div>
        <h2>{current.title}</h2>
        <p>{current.desc}</p>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <div key={i} className={`dot ${i === step ? "active" : ""}`} />
          ))}
        </div>

        <div className="onboarding-buttons">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary">
              Back
            </button>
          )}
          {step < slides.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-primary">
              Next
            </button>
          ) : (
            <button onClick={onComplete} className="btn-primary">
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
