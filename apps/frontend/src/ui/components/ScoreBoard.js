import { createElement as h } from '../../picojs/framework/core.js';
export function ScoreBoard({ state, engine }) {
    return h('div', { class: 'flex justify-between items-end bg-slate-900/40 p-8 rounded-3xl border border-white/5' },
        // Left Side total score
        h('div', {},
            h('p', { class: 'text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black' }, 'Accumulated Score'),
            h('h2', { class: 'text-6xl font-black font-outfit' }, state.score)
        ),

        // Right Side controls
        h('div', { class: 'flex flex-col items-end space-y-4' },
            h('div', { class: 'text-right' },
                h('p', { class: 'text-slate-500 uppercase text-[10px] font-bold' }, 'Current Hand Value'),
                h('p', { class: 'text-2xl font-bold text-emerald-400' }, `+${state.currentHandValue}`)
            ),
            h('div', { class: 'flex gap-3' },
                h('button', {
                    class: 'px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-dark rounded-xl font-black transition-all',
                    onclick: () => engine.betLower()
                }, 'Bet Lower'),
                h('button', {
                    class: 'px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black shadow-lg shadow-emerald-500/20 transition-all',
                    onclick: () => engine.betHigher()
                }, 'Bet Higher')
            )
        )
    );
}