import { useState, useRef, useEffect } from "react";
import { generateRecommendations } from "../utils/recommendationEngine";
import "./ChatInterface.css";

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

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! 👋 I'm your MoodMatch AI. Tell me how you're feeling, and I'll find movies, music, books, and activities that match your vibe.",
      sender: "bot",
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    
    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: `I'm feeling ${mood.label} ${mood.emoji}`,
      sender: "user",
      type: "text",
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Generate recommendations
    const recs = generateRecommendations(mood, "Moderate");
    setRecommendations(recs);

    // Bot responds with recommendations
    setTimeout(() => {
      const botMsg = {
        id: messages.length + 2,
        text: `Perfect! I found some great options for your ${mood.label} mood. Here are my top picks:`,
        sender: "bot",
        type: "text",
      };
      setMessages(prev => [...prev, botMsg]);

      // Add recommendations as cards
      const recsMsg = {
        id: messages.length + 3,
        text: recs,
        sender: "bot",
        type: "recommendations",
        mood: mood,
      };
      setMessages(prev => [...prev, recsMsg]);

      setLoading(false);
    }, 800);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMsg = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      type: "text",
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    // AI response
    setTimeout(() => {
      let botResponse = "";

      const lower = inputValue.toLowerCase();

      if (!selectedMood) {
        botResponse = "First, tell me your mood! You can pick from the options below, or describe how you're feeling. 😊";
      } else if (lower.includes("movie") || lower.includes("film")) {
        const movies = recommendations.movies.slice(0, 2);
        botResponse = `Great choice! Here are my top movie picks for your ${selectedMood.label} mood:\n\n${movies.map(m => `🎬 ${m.title}\n${m.reason}`).join("\n\n")}`;
      } else if (lower.includes("music") || lower.includes("song")) {
        const music = recommendations.music.slice(0, 2);
        botResponse = `Perfect! Try these tracks:\n\n${music.map(m => `🎵 ${m.title}\n${m.reason}`).join("\n\n")}`;
      } else if (lower.includes("book")) {
        const books = recommendations.books.slice(0, 2);
        botResponse = `Excellent idea! Here are my book recommendations:\n\n${books.map(b => `📚 ${b.title}\n${b.reason}`).join("\n\n")}`;
      } else if (lower.includes("activity") || lower.includes("do")) {
        const activity = recommendations.activities[Math.floor(Math.random() * recommendations.activities.length)];
        botResponse = `🎯 ${activity.title}\n\n${activity.reason}`;
      } else {
        botResponse = `Got it! Want me to recommend some ${selectedMood.label} vibes? Ask me about movies 🎬, music 🎵, books 📚, or activities 🎯!`;
      }

      const botMsg = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        type: "text",
      };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>💬 MoodMatch Chat</h2>
        <p>Tell me your mood, get recommendations instantly</p>
      </div>

      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.type === "text" && (
              <div className={`message-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            )}
            {msg.type === "recommendations" && (
              <div className="recommendations-display">
                <div className="rec-grid">
                  <div className="rec-section">
                    <h4>🎬 Movies</h4>
                    {msg.text.movies.slice(0, 2).map((m, i) => (
                      <div key={i} className="rec-item">
                        <strong>{m.title}</strong>
                        <p>{m.reason}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rec-section">
                    <h4>🎵 Music</h4>
                    {msg.text.music.slice(0, 2).map((m, i) => (
                      <div key={i} className="rec-item">
                        <strong>{m.title}</strong>
                        <p>{m.reason}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rec-section">
                    <h4>📚 Books</h4>
                    {msg.text.books.slice(0, 2).map((b, i) => (
                      <div key={i} className="rec-item">
                        <strong>{b.title}</strong>
                        <p>{b.reason}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rec-section">
                    <h4>🎯 Activities</h4>
                    {msg.text.activities.slice(0, 2).map((a, i) => (
                      <div key={i} className="rec-item">
                        <strong>{a.title}</strong>
                        <p>{a.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="message-bubble bot typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!selectedMood && (
        <div className="mood-selector-chat">
          <p>Pick your mood or describe how you're feeling:</p>
          <div className="mood-grid-chat">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                className="mood-btn-chat"
                onClick={() => handleMoodSelect(mood)}
                style={{ borderColor: mood.color }}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder={selectedMood ? "Ask for movies, music, books, or activities..." : "Pick a mood above..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!selectedMood || loading}
        />
        <button type="submit" disabled={!inputValue.trim() || loading || !selectedMood}>
          {loading ? "..." : "→"}
        </button>
      </form>
    </div>
  );
}
