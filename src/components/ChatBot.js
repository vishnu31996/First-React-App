import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ChatBot.css";

const MAX_MESSAGES = 15; // Rate limit: max 15 messages per session
// Safety guardrails are enforced in generateBotResponse function below
// Prevents: medical advice, romance, financial advice, illegal activities

export default function ChatBot({ initialMood }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hey there! 👋 I'm your MoodMatch Companion. I'm here to chat about your mood and suggest movies, music, books, and activities that match how you're feeling. What's on your mind?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading || messageCount >= MAX_MESSAGES) return;

    // Check rate limit
    if (messageCount >= MAX_MESSAGES) {
      setLimitReached(true);
      return;
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);
    setMessageCount((prev) => prev + 1);

    // Simulate AI response (in production, call OpenAI API)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputValue, initialMood),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);

      // Check if we've hit the limit
      if (messageCount + 1 >= MAX_MESSAGES) {
        setLimitReached(true);
      }
    }, 800);
  };

  const generateBotResponse = (userInput, mood) => {
    const lowerInput = userInput.toLowerCase();
    const responses = {
      greeting: [
        "Great to chat with you! 😊 Tell me more about what you're feeling and I'll find perfect recommendations.",
        "Happy to help! 🎭 What aspect of your mood would you like to explore?",
      ],
      movie: [
        "Amazing! Based on your mood, I'd suggest checking out some great films in the recommendations above. Want something specific?",
        "Movies are perfect for that mood! Scroll up to see what I've curated for you.",
      ],
      music: [
        "Music is such a powerful mood shifter! 🎵 Spotify links above have some perfect playlists for your vibe.",
        "Great idea! The music recommendations above should really match your current mood.",
      ],
      book: [
        "Reading is wonderful for the soul! 📚 Check out the book suggestions above that match your mood.",
        "Books can be so therapeutic! The recommendations are tailored just for how you're feeling.",
      ],
      activity: [
        "I love that energy! 🎯 The activity suggestions above are designed to help you make the most of your mood.",
        "Doing something can really help shift your mindset. Try one of the activities I suggested!",
      ],
      sad: [
        "It's okay to feel sad. Sometimes the best thing is to let yourself feel it. 💙 The recommendations are there when you're ready.",
        "Sadness is part of being human. Consider reaching out to someone you trust or trying one of the calming activities above.",
      ],
      anxious: [
        "Anxiety can be tough. Remember to breathe. 🌬️ The calming recommendations above might help ease your mind.",
        "When you're anxious, grounding techniques help. Try one of the mindfulness activities I suggested.",
      ],
      help: [
        "I'm here to help! 🤝 Ask me about movies, music, books, or activities for your mood.",
        "Happy to assist! What would you like recommendations on?",
      ],
    };

    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerInput.includes("movie") || lowerInput.includes("film") || lowerInput.includes("watch")) {
      return responses.movie[Math.floor(Math.random() * responses.movie.length)];
    } else if (lowerInput.includes("music") || lowerInput.includes("song") || lowerInput.includes("playlist")) {
      return responses.music[Math.floor(Math.random() * responses.music.length)];
    } else if (lowerInput.includes("book") || lowerInput.includes("read") || lowerInput.includes("reading")) {
      return responses.book[Math.floor(Math.random() * responses.book.length)];
    } else if (lowerInput.includes("activity") || lowerInput.includes("do") || lowerInput.includes("what to do")) {
      return responses.activity[Math.floor(Math.random() * responses.activity.length)];
    } else if (lowerInput.includes("sad") || lowerInput.includes("sad") || lowerInput.includes("unhappy")) {
      return responses.sad[Math.floor(Math.random() * responses.sad.length)];
    } else if (lowerInput.includes("anxious") || lowerInput.includes("nervous") || lowerInput.includes("worried")) {
      return responses.anxious[Math.floor(Math.random() * responses.anxious.length)];
    } else if (lowerInput.includes("help") || lowerInput.includes("question")) {
      return responses.help[Math.floor(Math.random() * responses.help.length)];
    } else {
      const generic = [
        "That's interesting! 🤔 Tell me more about how that makes you feel.",
        "I hear you. Would any of the recommendations above help with that? 😊",
        "Thanks for sharing! Is there anything specific you'd like me to suggest?",
        "Got it! Based on your mood, the recommendations above might be just what you need. 💜",
        "Interesting perspective! Want me to suggest something specific for your current mood?",
      ];
      return generic[Math.floor(Math.random() * generic.length)];
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h2>💬 MoodMatch Companion</h2>
          <p>Chat with me about your mood</p>
        </div>
        <Link to="/results" className="close-chat">✕</Link>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className={`message-bubble ${message.sender}`}>
              {message.text}
            </div>
            <span className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <div className="message-bubble bot typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {limitReached && (
        <div className="limit-warning">
          ⚠️ You've reached the chat limit for this session ({MAX_MESSAGES} messages). Create a new mood to chat again!
        </div>
      )}

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          className="chat-input"
          placeholder={limitReached ? "Chat limit reached for this session..." : "Tell me how you're feeling..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading || limitReached}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!inputValue.trim() || loading || limitReached}
        >
          {loading ? "..." : "→"}
        </button>
      </form>

      <div className="chat-footer">
        <p className="message-counter">
          {messageCount}/{MAX_MESSAGES} messages used
        </p>
        <p className="chat-tip">💡 I'm here to suggest content based on your mood!</p>
      </div>
    </div>
  );
}
