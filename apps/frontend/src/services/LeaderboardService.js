import { store } from '../state/State.js';
import { Api } from './Api.js';
import { TEXT, GAME_CONFIG } from '../utils/constants.js';

let lastLeaderboardFetch = 0;

export const LeaderboardService = {
  async loadLeaderboard(force = false) {
    const now = Date.now();
    if (!force && (now - lastLeaderboardFetch < GAME_CONFIG.LEADERBOARD_FETCH_INTERVAL)) {
      return;
    }

    try {
      lastLeaderboardFetch = now;
      const scores = await Api.getLeaderboard();
      if (Array.isArray(scores)) {
        store.setState({ leaderboard: scores, backendDown: false });
      }
    } catch (err) {
      const isNetworkError = err.message === 'Failed to fetch' || err.message.includes('network');
      if (isNetworkError) {
        store.setState({ backendDown: true });
        console.error(TEXT.engine.errors.loadLeaderboardFailed, err);
      }
    }
  }
};
