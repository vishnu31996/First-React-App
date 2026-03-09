import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./components/Landing";
import MoodSelector from "./components/MoodSelector";
import Results from "./components/Results";
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
      </Routes>
    </Router>
  );
}

export default App;
