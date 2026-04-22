const STORAGE_KEY = 'mahjong_betting_history';

export const HistoryService = {
  saveGame(playerName, score) {
    const history = this.getHistory();
    const newEntry = {
      id: Date.now(),
      playerName,
      score,
      timestamp: new Date().toISOString()
    };

    history.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50
    return newEntry;
  },

  getHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse history', e);
      return [];
    }
  },

  getBestScore() {
    const history = this.getHistory();
    if (history.length === 0) return 0;
    return Math.max(...history.map(h => h.score));
  }
};
