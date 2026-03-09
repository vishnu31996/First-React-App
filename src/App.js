import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./components/Landing";
import MoodSelector from "./components/MoodSelector";
import Results from "./components/Results";
import ChatBot from "./components/ChatBot";
import ChatWidget from "./components/ChatWidget";
import Onboarding from "./components/Onboarding";
import FavoritesManager from "./components/FavoritesManager";
import StatsBoard from "./components/StatsBoard";
import "./App.css";

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("moodmatch_onboarded") !== "true";
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem("moodmatch_onboarded", "true");
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Router>
      <ChatWidget initialMood={selectedMood} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/mood" element={<MoodSelector setSelectedMood={setSelectedMood} setRecommendations={setRecommendations} />} />
        <Route path="/results" element={<Results mood={selectedMood} recommendations={recommendations} />} />
        <Route path="/chat" element={<ChatBot initialMood={selectedMood} />} />
        <Route path="/favorites" element={<FavoritesManager />} />
        <Route path="/stats" element={<StatsBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
