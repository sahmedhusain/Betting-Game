import { createApp, createElement as h } from './picojs/framework/core.js';
import { store } from './state/State.js';

function view(state) {
    return h('div', { class: 'app-wrapper' },
        h('h1', {}, 'Mahjong Game Initialized!'),
        h('p', {}, `Current Phase: ${state.gamePhase}`),
        h('button', {
            onclick: () => store.setState({ gamePhase: 'READY_TO_PLAY' })
        }, 'Update State')
    );
}
// Start the PicoJS app
createApp({
    view,
    initialState: store.getState(),
    rootElement: document.getElementById('root')
});