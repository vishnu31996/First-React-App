import { useState } from "react";
import ChatInterface from "./ChatInterface";
import "./ChatWidget.css";

export default function ChatWidget({ initialMood }) {
  const [isOpen, setIsOpen] = useState(false);

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

      {/* Chat Modal */}
      {isOpen && (
        <div className="chat-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  );
}
