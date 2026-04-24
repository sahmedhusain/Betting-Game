import { store } from '../state/State.js';
import { Api } from './Api.js';
import { PHASES } from '../utils/constants.js';

export const StateSyncService = {
  syncState() {
    const state = store.getState();
    if (!state.sessionValid || state.gamePhase === PHASES.LANDING) return;

    Api.saveGameState({
      state: {
        score: state.score,
        current_hand: state.currentHand,
        history: state.history,
        deck_state: state.deckState,
        reshuffle_count: state.reshuffleCount,
        game_phase: state.gamePhase,
        was_refreshed: state.wasRefreshed
      },
      is_game_finished: state.isGameFinished
    }).catch(err => console.warn('Failed to sync state:', err));
  }
};
