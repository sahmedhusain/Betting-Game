import { store } from './state/State.js';
import { engine } from './engine/Engine.js';
import { render } from './picojs/framework/vdom.js';
import { eventRegistry, attachDelegatedListener } from './picojs/framework/events.js';
import { LandingView } from './ui/views/LandingView.js';
import { GameView } from './ui/views/GameView.js';
import { PHASES } from './utils/constants.js';
import { EndView } from './ui/views/EndView.js';

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
// Global setup
const root = document.getElementById('root');
eventRegistry.root = root;
eventRegistry.events.forEach(ev => attachDelegatedListener(root, ev));
function updateUI() {
    render(view(store.getState()), root);
}
store.subscribe(updateUI);
updateUI();