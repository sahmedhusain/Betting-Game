import { initialState, initStore } from './state/State.js';
import { engine } from './engine/Engine.js';
import { createApp } from './picojs/framework/core.js';
import { PHASES, ROUTES } from './utils/constants.js';
import { resolveView } from './ui/UI.js';


function phaseFromHash() {
  const hash = window.location.hash || ROUTES.LANDING;
  if (hash === ROUTES.PLAY) return PHASES.PLAYING;
  if (hash === ROUTES.GAME_OVER) return PHASES.GAME_OVER;
  return PHASES.LANDING;
}

function handleRouting() {
  const phase = phaseFromHash();
  if (store.getState().gamePhase !== phase) {
    store.setState({ gamePhase: phase });
  }
}

let lastPhase = null;

function handleSideEffects() {
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

const store = createApp({
  view: (state) => resolveView(state, engine),
  initialState: { ...initialState, gamePhase: phaseFromHash() },
  rootElement: document.getElementById('root')
});

initStore(store);

store.subscribe(handleSideEffects);
window.addEventListener('hashchange', handleRouting);

handleSideEffects();