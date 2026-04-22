import { createElement as h } from '../picojs/framework/core.js';
export function LandingView({ state, engine }) {
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