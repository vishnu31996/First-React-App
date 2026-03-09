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
    
    // Import recommendations from database (in real app, would be from recommendationEngine)
    const mockRecommendations = {
      Happy: { movies: ["The Grand Budapest Hotel", "Knives Out", "Spirited Away"], music: ["Walking on Sunshine", "Good as Hell - Lizzo", "Don't Stop Me Now - Queen"], books: ["The House in the Cerulean Sea", "Eleanor Oliphant Is Completely Fine", "A Man Called Ove"], activities: ["Dance like nobody's watching", "Call a friend and laugh together", "Cook your favorite meal"] },
      Sad: { movies: ["Life is Beautiful", "About Time", "Moonlight"], music: ["The Night We Met - Lord Huron", "Skinny Love - Bon Iver", "Hurt - Johnny Cash"], books: ["The Fault in Our Stars", "A Little Life", "Crying in H Mart"], activities: ["Write in a journal", "Listen to sad songs", "Call someone you trust"] },
      Anxious: { movies: ["Mr. Rogers Documentary", "Amélie", "Spirited Away"], music: ["Calm Down - Rema", "Weightless - Marconi Union", "Ambient by Eno"], books: ["The Courage to Be Disliked", "Educated", "Braiding Sweetgrass"], activities: ["Practice deep breathing", "Try meditation or yoga", "Go outside in nature"] },
      Calm: { movies: ["Lost in Translation", "My Neighbor Totoro", "A Quiet Place"], music: ["Spiegel im Spiegel - Arvo Pärt", "Gymnopédies - Erik Satie", "Moon River"], books: ["Norwegian Wood - Murakami", "The Remains of the Day", "Braiding Sweetgrass"], activities: ["Meditate for 10 minutes", "Go for a slow walk", "Read poetry"] },
      Excited: { movies: ["Top Gun: Maverick", "Mad Max: Fury Road", "The Greatest Showman"], music: ["Uptown Funk", "Shut Up and Dance", "Mr. Brightside - The Killers"], books: ["Shoe Dog - Phil Knight", "The Autobiography of Malcolm X", "Grit"], activities: ["Go for a run or workout", "Start a new project", "Plan something fun"] },
      Focused: { movies: ["The Social Network", "Whiplash", "Steve Jobs"], music: ["Lo-fi Hip Hop Mix", "Focus Spotify Playlist", "Hans Zimmer Scores"], books: ["Deep Work - Cal Newport", "Atomic Habits - James Clear", "The War of Art"], activities: ["Work in a quiet space", "Use the Pomodoro Technique", "Turn off notifications"] },
    };

    const currentMoodRecs = mood && mockRecommendations[mood.mood?.label] ? mockRecommendations[mood.mood?.label] : null;

    // Movie/Film recommendations
    if (lowerInput.includes("movie") || lowerInput.includes("film") || lowerInput.includes("watch") || lowerInput.includes("cinema")) {
      if (currentMoodRecs) {
        const movies = currentMoodRecs.movies.slice(0, 2).join(", ");
        return `🎬 Perfect! For your mood, I'd recommend: ${movies}. These should really resonate with how you're feeling right now!`;
      }
      return "🎬 For movies, select a mood first and I'll give you personalized suggestions!";
    }

    // Music recommendations
    if (lowerInput.includes("music") || lowerInput.includes("song") || lowerInput.includes("playlist") || lowerInput.includes("listen")) {
      if (currentMoodRecs) {
        const music = currentMoodRecs.music.slice(0, 2).join(", ");
        return `🎵 Great choice! Try: ${music}. These should match your current vibe perfectly!`;
      }
      return "🎵 For music suggestions, select a mood first and I'll recommend some perfect tracks!";
    }

    // Book recommendations
    if (lowerInput.includes("book") || lowerInput.includes("read") || lowerInput.includes("reading") || lowerInput.includes("novel")) {
      if (currentMoodRecs) {
        const books = currentMoodRecs.books.slice(0, 2).join(", ");
        return `📚 I love that! Check out: ${books}. Both are perfect for what you're feeling!`;
      }
      return "📚 For book suggestions, choose a mood first and I'll recommend some great reads!";
    }

    // Activity recommendations
    if (lowerInput.includes("activity") || lowerInput.includes("do") || lowerInput.includes("what to do") || lowerInput.includes("thing to do")) {
      if (currentMoodRecs) {
        const activity = currentMoodRecs.activities[Math.floor(Math.random() * currentMoodRecs.activities.length)];
        return `🎯 Great idea! Try this: ${activity}. It should help shift your mood in a positive way! 💜`;
      }
      return "🎯 For activities, select a mood first and I'll suggest something perfect for you!";
    }

    // Greeting
    if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
      return "Hey there! 👋 Tell me what you're looking for — movies, music, books, or activities? I'll give you personalized recommendations based on your mood!";
    }

    // Help
    if (lowerInput.includes("help") || lowerInput.includes("how") || lowerInput.includes("what can")) {
      return "I can help you find 🎬 movies, 🎵 music, 📚 books, or 🎯 activities that match your mood! Just ask me for any of these and I'll give real suggestions!";
    }

    // Default: ask what they want
    const defaults = [
      "What are you in the mood for? 🎬 Movies, 🎵 music, 📚 books, or 🎯 activities?",
      "Tell me what sounds good to you and I'll recommend something! 💜",
      "What can I suggest for you right now? Movies, music, books, or activities?",
      "Looking for something specific? Let me know and I'll give you real recommendations! ✨",
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
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
