import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFavorites, removeFavorite } from "../utils/localStorage";
import "./FavoritesManager.css";

export default function FavoritesManager() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const filtered = favorites.filter(f => filter === "all" || f.type === filter);
  const typeEmojis = { movie: "🎬", music: "🎵", book: "📚", activity: "🎯" };

  const exportAsText = () => {
    const text = filtered.map(f => `${typeEmojis[f.type]} ${f.title}\n${f.reason}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moodmatch-favorites.txt";
    a.click();
  };

  return (
    <div className="favorites-container">
      <Link to="/" className="back-nav">← Home</Link>
      <h1>❤️ Your Favorites</h1>
      <p className="fav-count">{filtered.length} saved items</p>

      <div className="filter-buttons">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "movie" ? "active" : ""} onClick={() => setFilter("movie")}>🎬 Movies</button>
        <button className={filter === "music" ? "active" : ""} onClick={() => setFilter("music")}>🎵 Music</button>
        <button className={filter === "book" ? "active" : ""} onClick={() => setFilter("book")}>📚 Books</button>
        <button className={filter === "activity" ? "active" : ""} onClick={() => setFilter("activity")}>🎯 Activities</button>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="favorites-grid">
            {filtered.map((item, i) => (
              <div key={i} className="favorite-card">
                <button className="remove-fav-btn" onClick={() => { removeFavorite(item.title); setFavorites(getFavorites()); }}>✕</button>
                <span className="fav-emoji">{typeEmojis[item.type]}</span>
                <h3>{item.title}</h3>
                <p>{item.reason}</p>
              </div>
            ))}
          </div>
          <button onClick={exportAsText} className="export-btn">📥 Export as Text</button>
        </>
      ) : (
        <div className="empty-state">
          <p>No favorites yet! Start chatting and save your favorites ❤️</p>
        </div>
      )}
    </div>
  );
}
