import { store } from '../state/State.js';
import { Api } from './Api.js';
import { soundService } from './SoundService.js';
import { PHASES, GAME_CONFIG } from '../utils/constants.js';

export const SessionService = {
  async validateSession() {
    const localName = localStorage.getItem(GAME_CONFIG.STORAGE_KEYS.PLAYER_NAME);
    if (!localName) {
      store.setState({
        sessionChecked: true,
        sessionValid: false,
        backendDown: false
      });
      return false;
    }

    try {
      const response = await Api.validateSession();
      store.setState({
        sessionChecked: true,
        sessionValid: true,
        playerName: response.username,
        backendDown: false,
        isGameFinished: response.is_game_finished
      });

      return response;
    } catch (err) {
      const isNetworkError = err.message === 'Failed to fetch' || err.message.includes('network');
      store.setState({
        sessionChecked: true,
        sessionValid: false,
        backendDown: isNetworkError
      });
      return false;
    }
  },

  async startSession(username) {
    try {
      const session = await Api.startSession(username);
      store.setState({
        sessionValid: true,
        playerName: session.username,
        sessionError: '',
        backendDown: false,
        isGameFinished: false
      });
      localStorage.setItem(GAME_CONFIG.STORAGE_KEYS.PLAYER_NAME, session.username);
      return session;
    } catch (err) {
      const isNetworkError = err.message === 'Failed to fetch' || err.message.includes('network');
      store.setState({
        sessionError: err.message,
        backendDown: isNetworkError
      });
      return false;
    }
  },

  async logout() {
    try {
      await Api.logoutSession();
    } catch (err) {
      console.error('Logout failed:', err);
    }
    store.setState({
      sessionValid: false,
      playerName: '',
      gamePhase: PHASES.LANDING,
      currentHand: [],
      history: [],
      score: GAME_CONFIG.INITIAL_SCORE,
      isGameFinished: false
    });
    localStorage.clear();
    soundService.stopAmbient();
  }
};
