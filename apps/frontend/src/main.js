import { store } from './state/State.js';
import { engine } from './engine/Engine.js';
import { render } from './picojs/framework/vdom.js';
import { eventRegistry, attachDelegatedListener } from './picojs/framework/events.js';
import { LandingView } from './ui/views/LandingView.js';
import { GameView } from './ui/views/GameView.js';
import { EndView } from './ui/views/EndView.js';
import { PHASES } from './utils/constants.js';

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

function view(state) {
    switch (state.gamePhase) {
        case PHASES.LANDING:
            return LandingView({ state, engine });
        case PHASES.PLAYING:
            return GameView({ state, engine });
        case PHASES.GAME_OVER:
            return EndView({ state, engine });
        default:
            return LandingView({ state, engine });
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

    render(view(state), root);
}

store.subscribe(updateUI);
window.addEventListener('hashchange', handleRouting);

// Initialization
handleRouting();
engine.loadLeaderboard();
updateUI();