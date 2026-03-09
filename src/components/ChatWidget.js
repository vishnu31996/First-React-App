import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatWidget.css";

export default function ChatWidget({ initialMood }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenChat = () => {
    navigate("/chat");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`chat-widget-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with MoodMatch"
      >
        💬
      </button>

      {/* Chat Widget Menu */}
      {isOpen && (
        <div className="chat-widget-menu">
          <h3>MoodMatch Chat</h3>
          <p>Talk to me about your mood and get personalized suggestions!</p>
          
          {initialMood ? (
            <button className="widget-action-btn" onClick={handleOpenChat}>
              Open Chat →
            </button>
          ) : (
            <div className="widget-message">
              <p>🎭 Select a mood first to start chatting!</p>
              <a href="/mood" className="widget-action-btn">
                Choose Mood →
              </a>
            </div>
          )}

          <button className="widget-close-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}
