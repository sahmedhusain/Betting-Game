import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT } from '../../utils/constants.js';

export function ScoreBoard({ state, engine }) {
  return h('div', { class: 'glass-panel p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between lg:items-center animate-fade-in' },
    // Left Side: Total Score
    h('div', { class: 'flex items-center gap-4 sm:gap-6 w-full lg:w-auto' },
      h('div', { class: 'w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10' },
        h('span', { class: 'text-3xl' }, '🧧')
      ),
      h('div', {},
        h('p', { class: 'text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black mb-1' }, TEXT.game.bankroll),
        h('h2', { class: 'text-3xl sm:text-5xl font-black font-outfit bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400' },
          state.score.toLocaleString()
        )
      )
    ),

    // Center: Stats
    h('div', { class: 'hidden md:flex gap-8 lg:gap-12' },
      h('div', { class: 'text-center' },
        h('p', { class: 'text-slate-500 uppercase text-[10px] font-bold tracking-widest' }, TEXT.game.currentValue),
        h('p', { class: 'text-2xl font-black text-emerald-400' }, `+${state.currentHandValue}`)
      )
    ),

    // Right Side: Liquid Betting Controls
    h('div', { class: 'flex flex-col sm:flex-row gap-3 w-full lg:w-auto' },
      h('button', {
        class: 'w-full sm:w-auto px-8 py-4 liquid-button rounded-2xl font-black text-xs uppercase tracking-widest',
        onclick: () => engine.betLower()
      }, TEXT.game.betLower),
      h('button', {
        class: 'w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95',
        onclick: () => engine.betHigher()
      }, TEXT.game.betHigher)
    )
  );
}