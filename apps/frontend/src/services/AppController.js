import { store } from '../state/State.js';
import { engine } from '../engine/Engine.js';
import { PHASES, ROUTES, KEYS, TEXT } from '../utils/constants.js';
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
  if (phase === PHASES.ERROR) return ROUTES.ERROR;
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
  if (!state.sessionChecked) return true;

  if (phase === PHASES.PLAYING) {
    return state.sessionValid && !state.isGameFinished;
  }

  if (phase === PHASES.GAME_OVER) {
    return state.sessionValid;
  }

  if (phase === PHASES.LANDING || phase === PHASES.ERROR) {
    return !state.sessionValid || state.gamePhase === PHASES.GAME_OVER || state.gamePhase === PHASES.ERROR;
  }

  return true;
}

function getPhaseResetPatch(phase) {
  if (phase === PHASES.LANDING) {
    return {
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
  if (hash === ROUTES.ERROR) return PHASES.ERROR;

  return PHASES.ERROR;
}

export function handleRouting() {
  const normalizedHash = normalizeHash(window.location.hash || ROUTES.LANDING);
  if (window.location.hash !== normalizedHash) {
    navigateToHash(normalizedHash, { replace: true });
    return;
  }

  const state = store.getState();
  if (!state.sessionChecked) return; // Wait for bootstrap

  const phase = phaseFromHash();

  if (!isValidPhaseState(phase, state)) {
    if (state.sessionValid) {
      if (state.isGameFinished) {
        navigateToHash(ROUTES.GAME_OVER, { replace: true });
      } else {
        navigateToHash(ROUTES.PLAY, { replace: true });
      }
    } else {
      if (phase === PHASES.PLAYING || phase === PHASES.GAME_OVER) {
        store.setState({ 
          gamePhase: PHASES.ERROR,
          errorData: { ...TEXT.error.unauthorized, targetRoute: ROUTES.LANDING }
        });
        navigateToHash(ROUTES.ERROR, { replace: true });
      } else {
        store.setState({ 
          gamePhase: PHASES.ERROR,
          errorData: { ...TEXT.error.notFound, targetRoute: ROUTES.LANDING }
        });
        navigateToHash(ROUTES.ERROR, { replace: true });
      }
    }
    return;
  }

  if (state.gamePhase !== phase) {
    const patch = getPhaseResetPatch(phase);
    
    if (phase === PHASES.ERROR && !state.errorData.code) {
      patch.errorData = { ...TEXT.error.notFound, targetRoute: ROUTES.LANDING };
    }
    
    store.setState({ gamePhase: phase, ...patch });
  }
}

let lastPhase = null;
let allowGameOverReplayTransition = false;

export function allowPlayAgainTransition() {
  allowGameOverReplayTransition = true;
  store.setState({ isGameFinished: false });
}

export async function handleBootstrap() {
  await engine.validateSession();
  handleRouting();
}

export function handleSideEffects() {
  const state = store.getState();
  const previousPhase = lastPhase;

  const targetHash = routeFromPhase(state.gamePhase);
  const currentHash = normalizeHash(window.location.hash || ROUTES.LANDING);

  if (currentHash !== targetHash && state.gamePhase !== PHASES.ERROR) {

    navigateToHash(targetHash, { replace: state.gamePhase === PHASES.GAME_OVER });
  }

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

  // Handle unauthorized errors from API (session expired)
  if (state.sessionChecked && state.sessionValid === false && state.gamePhase !== PHASES.LANDING && state.gamePhase !== PHASES.ERROR) {
    store.setState({ 
      gamePhase: PHASES.ERROR,
      errorData: { ...TEXT.error.unauthorized, targetRoute: ROUTES.LANDING }
    });
    navigateToHash(ROUTES.ERROR, { replace: true });
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
        store.setState({ hasAttemptedStart: true });
        engine.startSession(name).then(success => {
          if (success) {
            navigateToHash(ROUTES.PLAY);
            engine.startGame(name);
          }
        });
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
