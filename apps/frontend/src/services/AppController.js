import { store } from '../state/State.js';
import { engine } from '../engine/Engine.js';
import { PHASES, ROUTES, KEYS } from '../utils/constants.js';
import { normalizePlayerName, validatePlayerName } from '../utils/helpers.js';

export function phaseFromHash() {
  const hash = window.location.hash || ROUTES.LANDING;
  if (hash === ROUTES.PLAY) return PHASES.PLAYING;
  if (hash === ROUTES.GAME_OVER) return PHASES.GAME_OVER;
  return PHASES.LANDING;
}

export function handleRouting() {
  const phase = phaseFromHash();
  if (store.getState().gamePhase !== phase) {
    store.setState({ gamePhase: phase });
  }
}

let lastPhase = null;

export function handleSideEffects() {
  const state = store.getState();

  const hash = state.gamePhase === PHASES.PLAYING
    ? ROUTES.PLAY
    : state.gamePhase === PHASES.GAME_OVER
      ? ROUTES.GAME_OVER
      : ROUTES.LANDING;

  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }

  if (state.gamePhase === PHASES.LANDING && lastPhase !== PHASES.LANDING) {
    engine.loadLeaderboard();
  }

  lastPhase = state.gamePhase;
}

export function handleKeyboard(e) {
  const state = store.getState();
  const phase = state.gamePhase;
  if (e.key === KEYS.ENTER) {
    if (phase === PHASES.LANDING) {
      const name = normalizePlayerName(state.playerName);
      if (!validatePlayerName(name)) {
        store.setState({ playerName: name, hasAttemptedStart: true });
        window.location.hash = ROUTES.PLAY;
        engine.startGame(name);
      } else {
        store.setState({ hasAttemptedStart: true });
      }
    } else if (phase === PHASES.GAME_OVER) {
      window.location.hash = ROUTES.LANDING;
    }
  }

  // Shortcuts
  if (phase === PHASES.PLAYING) {
    const key = e.key.toLowerCase();
    if (key === KEYS.ARROW_UP || key === KEYS.H) {
      e.preventDefault();
      engine.betHigher();
    } else if (key === KEYS.ARROW_DOWN || key === KEYS.L) {
      e.preventDefault();
      engine.betLower();
    }
  }
}
