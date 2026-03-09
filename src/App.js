import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./components/Landing";
import MoodSelector from "./components/MoodSelector";
import Results from "./components/Results";
import ChatBot from "./components/ChatBot";
import "./App.css";

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/mood" 
          element={<MoodSelector setSelectedMood={setSelectedMood} setRecommendations={setRecommendations} />} 
        />
        <Route 
          path="/results" 
          element={<Results mood={selectedMood} recommendations={recommendations} />} 
        />
        <Route 
          path="/chat" 
          element={<ChatBot initialMood={selectedMood} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
