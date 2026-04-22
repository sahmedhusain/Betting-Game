import { createApp, createElement as h } from './picojs/framework/core.js';
import { store } from './state/State.js';
import { engine } from './engine/Engine.js';
import { Tile } from './ui/Tile.js';
import { render } from './picojs/framework/vdom.js';
import { eventRegistry, attachDelegatedListener } from './picojs/framework/events.js';

function view(state) {
    // Landing Screen
    if (state.gamePhase === 'LANDING') {
        return h('div', { class: 'flex flex-col items-center justify-center' },
            h('div', { class: 'glass-panel p-16 rounded-[3rem] text-center max-w-2xl' },
                h('h1', { class: 'text-7xl font-black mb-6 font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-emerald-400' },
                    'Mahjong Betting'
                ),
                h('p', { class: 'text-slate-400 text-lg mb-10' }, 'A high-stakes strategy game powered by dynamic scaling and reactive state.'),
                h('button', {
                    class: 'px-12 py-5 bg-emerald-500 rounded-2xl font-black text-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20',
                    onclick: () => engine.startGame('Player1')
                }, 'Enter Game Session')
            )
        );
    }

    // Game Screen
    return h('div', { class: 'w-full space-y-12' },
        // Top Bar
        h('div', { class: 'flex justify-between items-end bg-slate-900/40 p-8 rounded-3xl border border-white/5' },
            h('div', {},
                h('p', { class: 'text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black' }, 'Accumulated Score'),
                h('h2', { class: 'text-6xl font-black font-outfit' }, state.score)
            ),
            h('div', { class: 'flex flex-col items-end space-y-4' },
                h('div', { class: 'text-right' },
                    h('p', { class: 'text-slate-500 uppercase text-[10px] font-bold' }, 'Current Hand Value'),
                    h('p', { class: 'text-2xl font-bold text-emerald-400' }, `+${state.currentHandValue}`)
                ),
                h('button', {
                    class: 'px-8 py-3 bg-white text-dark rounded-xl font-black hover:bg-emerald-400 transition-colors',
                    onclick: () => engine.submitHand()
                }, 'Submit Hand')
            )
        ),

        // Hand
        h('div', { class: 'flex gap-6 justify-center items-center py-16' },
            ...state.currentHand.map(tile => Tile({ tile }))
        ),

        // Footer
        h('div', { class: 'flex justify-center gap-12 text-slate-500 text-xs font-bold uppercase tracking-widest' },
            h('span', {}, `Draw Pile: ${state.drawPileCount}`),
            h('span', {}, `Discarded: ${state.discardPileCount}`),
            h('span', {}, `Reshuffles: ${state.reshuffleCount}/3`)
        )
    );
}

// Start the PicoJS app
createApp({
    view,
    initialState: store.getState(),
    rootElement: document.getElementById('root')
});

const root = document.getElementById('root');
eventRegistry.root = root;
eventRegistry.events.forEach(ev => attachDelegatedListener(root, ev));
function updateUI() {
    const state = store.getState();
    const vNode = view(state);
    render(vNode, root);
}
store.subscribe(updateUI);
updateUI();