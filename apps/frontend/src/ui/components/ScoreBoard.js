import { createElement as h } from '../../picojs/framework/core.js';

export function ScoreBoard({ state, engine }) {
    return h('div', { class: 'glass-panel p-8 rounded-[2.5rem] flex justify-between items-center animate-fade-in' },
        // Left Side: Total Score
        h('div', { class: 'flex items-center gap-6' },
            h('div', { class: 'w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10' },
                h('span', { class: 'text-3xl' }, '🧧')
            ),
            h('div', {},
                h('p', { class: 'text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black mb-1' }, 'Bankroll'),
                h('h2', { class: 'text-5xl font-black font-outfit bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400' }, 
                    state.score.toLocaleString()
                )
            )
        ),
        
        // Center: Stats
        h('div', { class: 'hidden md:flex gap-12' },
             h('div', { class: 'text-center' },
                h('p', { class: 'text-slate-500 uppercase text-[10px] font-bold tracking-widest' }, 'Current Value'),
                h('p', { class: 'text-2xl font-black text-emerald-400' }, `+${state.currentHandValue}`)
            )
        ),

        // Right Side: Liquid Betting Controls
        h('div', { class: 'flex gap-3' },
            h('button', { 
                class: 'px-8 py-4 liquid-button rounded-2xl font-black text-xs uppercase tracking-widest',
                onclick: () => engine.betLower() 
            }, 'Bet Lower'),
            h('button', { 
                class: 'px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95',
                onclick: () => engine.betHigher() 
            }, 'Bet Higher')
        )
    );
}