// Save/load favorites
export const saveFavorite = (item, type) => {
  const favorites = JSON.parse(localStorage.getItem("moodmatch_favorites")) || [];
  if (!favorites.find(f => f.title === item.title)) {
    favorites.push({ ...item, type, savedAt: new Date() });
    localStorage.setItem("moodmatch_favorites", JSON.stringify(favorites));
  }
};

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("moodmatch_favorites")) || [];
};

export const saveHistory = (mood) => {
  const history = JSON.parse(localStorage.getItem("moodmatch_history")) || [];
  history.unshift({ mood: mood.label, emoji: mood.emoji, timestamp: new Date() });
  localStorage.setItem("moodmatch_history", JSON.stringify(history.slice(0, 20)));
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem("moodmatch_history")) || [];
};

export const removeFavorite = (title) => {
  const favorites = JSON.parse(localStorage.getItem("moodmatch_favorites")) || [];
  const updated = favorites.filter(f => f.title !== title);
  localStorage.setItem("moodmatch_favorites", JSON.stringify(updated));
};
