import { API_CONFIG, API_ENDPOINTS } from '../utils/constants.js';

export const Api = {
  async getLeaderboard() {
    const params = new URLSearchParams({ limit: String(API_CONFIG.LEADERBOARD_LIMIT) });
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCORES}?${params.toString()}`);
    return res.json();
  },

  async saveScore(playerName, score) {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCORES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: playerName, score })
    });
    return res.json();
  },

  async logGameSession(data) {
    return fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GAMES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};