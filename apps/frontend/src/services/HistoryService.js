import { GAME_CONFIG } from '../utils/constants.js';

const STORAGE_KEY = GAME_CONFIG.STORAGE_KEYS.HISTORY;

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, GAME_CONFIG.MAX_HISTORY_ITEMS)));
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
