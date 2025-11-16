import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import UnderConstructionGame from "./components/game/UnderConstructionGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<UnderConstructionGame />} />
      </Routes>
    </Router>
  );
}

export default App;
