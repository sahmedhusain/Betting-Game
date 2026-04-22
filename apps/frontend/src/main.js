import { store } from './state/State.js';
import { engine } from './engine/Engine.js';
import { render } from './picojs/framework/vdom.js';
import { eventRegistry, attachDelegatedListener } from './picojs/framework/events.js';
import { PHASES } from './utils/constants.js';
import { resolveView } from './ui/UI.js';

let lastPhase = null;

// --- Routing Logic ---
function handleRouting() {
  const hash = window.location.hash || '#/landing';
  let phase = PHASES.LANDING;

  if (hash === '#/play') phase = PHASES.PLAYING;
  if (hash === '#/gameover') phase = PHASES.GAME_OVER;

  if (store.getState().gamePhase !== phase) {
    store.setState({ gamePhase: phase });
  }
}

const root = document.getElementById('root');
eventRegistry.root = root;
eventRegistry.events.forEach(ev => attachDelegatedListener(root, ev));

function updateUI() {
  const state = store.getState();

  // Sync Phase -> Hash
  const hash = state.gamePhase === PHASES.PLAYING ? '#/play' :
    state.gamePhase === PHASES.GAME_OVER ? '#/gameover' : '#/landing';

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

// Initialization
handleRouting();
updateUI();