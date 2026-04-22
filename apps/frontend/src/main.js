import { store } from './state/State.js';
import { engine } from './engine/Engine.js';
import { render } from './picojs/framework/vdom.js';
import { eventRegistry, attachDelegatedListener } from './picojs/framework/events.js';
import { PHASES, ROUTES } from './utils/constants.js';
import { resolveView } from './ui/UI.js';

let lastPhase = null;

function handleRouting() {
  const hash = window.location.hash || ROUTES.LANDING;
  let phase = PHASES.LANDING;

  if (hash === ROUTES.PLAY) phase = PHASES.PLAYING;
  if (hash === ROUTES.GAME_OVER) phase = PHASES.GAME_OVER;

  if (store.getState().gamePhase !== phase) {
    store.setState({ gamePhase: phase });
  }
}

const root = document.getElementById('root');
eventRegistry.root = root;
eventRegistry.events.forEach(ev => attachDelegatedListener(root, ev));

function updateUI() {
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

  render(resolveView(state, engine), root);
  lastPhase = state.gamePhase;
}

store.subscribe(updateUI);
window.addEventListener('hashchange', handleRouting);

handleRouting();
updateUI();