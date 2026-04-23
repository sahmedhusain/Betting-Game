import { store } from '../state/State.js';
import { engine } from '../engine/Engine.js';
import { PHASES, ROUTES, KEYS } from '../utils/constants.js';
import { normalizePlayerName, validatePlayerName } from '../utils/helpers.js';

function normalizeHash(rawHash = '') {
  const hash = rawHash || '';
  if (!hash) return ROUTES.LANDING;

  if (hash.startsWith('#/')) {
    return `#${hash.slice(2)}`;
  }

  return hash;
}

function routeFromPhase(phase) {
  if (phase === PHASES.PLAYING) return ROUTES.PLAY;
  if (phase === PHASES.GAME_OVER) return ROUTES.GAME_OVER;
  if (phase === PHASES.NOT_FOUND) return ROUTES.NOT_FOUND;
  return ROUTES.LANDING;
}

function navigateToHash(targetHash, { replace = false } = {}) {
  if (window.location.hash === targetHash) return;

  if (replace) {
    history.replaceState(null, '', targetHash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }

  window.location.hash = targetHash;
}

function isValidPhaseState(phase, state) {
  if (phase === PHASES.PLAYING) {
    return Boolean(state.playerName) && Array.isArray(state.currentHand) && state.currentHand.length > 0;
  }

  if (phase === PHASES.GAME_OVER) {
    return Boolean(state.playerName);
  }

  return true;
}

function getPhaseResetPatch(phase) {
  if (phase === PHASES.LANDING) {
    return {
      showJoinForm: false,
      hasAttemptedStart: false,
      floatingFeedback: { isVisible: false, isWin: false, position: { x: 0, y: 0 } }
    };
  }

  if (phase === PHASES.PLAYING) {
    return {
      showJoinForm: false,
      hasAttemptedStart: false,
      floatingFeedback: { isVisible: false, isWin: false, position: { x: 0, y: 0 } }
    };
  }

  if (phase === PHASES.GAME_OVER) {
    return {
      showJoinForm: false,
      hasAttemptedStart: false,
      floatingFeedback: { isVisible: false, isWin: false, position: { x: 0, y: 0 } }
    };
  }

  return {};
}

export function phaseFromHash() {
  const hash = normalizeHash(window.location.hash || ROUTES.LANDING);
  if (hash === ROUTES.PLAY) return PHASES.PLAYING;
  if (hash === ROUTES.GAME_OVER) return PHASES.GAME_OVER;
  if (hash === ROUTES.LANDING) return PHASES.LANDING;
  if (hash === ROUTES.NOT_FOUND) return PHASES.NOT_FOUND;

  return PHASES.NOT_FOUND;
}

export function handleRouting() {
  const normalizedHash = normalizeHash(window.location.hash || ROUTES.LANDING);
  if (window.location.hash !== normalizedHash) {
    navigateToHash(normalizedHash, { replace: true });
    return;
  }

  const state = store.getState();
  const phase = phaseFromHash();

  if (!isValidPhaseState(phase, state)) {
    navigateToHash(ROUTES.LANDING, { replace: true });
    return;
  }

  if (state.gamePhase !== phase) {
    store.setState({ gamePhase: phase, ...getPhaseResetPatch(phase) });
  }
}

let lastPhase = null;
let allowGameOverReplayTransition = false;

export function allowPlayAgainTransition() {
  allowGameOverReplayTransition = true;
}

export function handleSideEffects() {
  const state = store.getState();
  const previousPhase = lastPhase;

  // Keep URL and state in sync with normalized route format
  const targetHash = routeFromPhase(state.gamePhase);
  const currentHash = normalizeHash(window.location.hash || ROUTES.LANDING);

  if (currentHash !== targetHash && state.gamePhase !== PHASES.NOT_FOUND) {

    navigateToHash(targetHash, { replace: state.gamePhase === PHASES.GAME_OVER });
  }

  // If user presses Back from game over send them to landing
  // but allow explicit Play Again transitions
  if (previousPhase === PHASES.GAME_OVER && state.gamePhase === PHASES.PLAYING) {
    if (allowGameOverReplayTransition) {
      allowGameOverReplayTransition = false;
    } else {
      navigateToHash(ROUTES.LANDING, { replace: true });
      store.setState({ gamePhase: PHASES.LANDING, ...getPhaseResetPatch(PHASES.LANDING) });
      return;
    }
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
      if (!state.showJoinForm) {
        store.setState({ showJoinForm: true, hasAttemptedStart: false });
        return;
      }

      const name = normalizePlayerName(state.playerName);
      if (!validatePlayerName(name)) {
        store.setState({ playerName: name, hasAttemptedStart: true });
        navigateToHash(ROUTES.PLAY);
        engine.startGame(name);
      } else {
        store.setState({ hasAttemptedStart: true });
      }
    } else if (phase === PHASES.GAME_OVER) {
      navigateToHash(ROUTES.LANDING, { replace: true });
    }
  }

  // Shortcuts
  if (phase === PHASES.PLAYING) {
    if (state.isResolvingBet) {
      return;
    }

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
