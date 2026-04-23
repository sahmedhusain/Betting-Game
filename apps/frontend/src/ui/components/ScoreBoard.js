import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, UI_CONFIG } from '../../utils/constants.js';

export function ScoreBoard({ state, engine }) {
  const isLocked = !!state.isResolvingBet;

  return h('div', { class: 'glass-panel p-5 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] animate-fade-in border border-white/10' },
    h('div', { class: 'flex flex-col gap-5 xl:gap-6' },
      h('div', { class: 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4' },
        h('div', { class: 'flex items-center gap-4' },
          h('div', { class: 'w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20' },
            h('div', { class: 'w-5 h-7 border-2 border-white rounded-sm relative' },
              h('div', { class: 'absolute top-1 left-1 w-1 h-1 bg-white rounded-full' }),
              h('div', { class: 'absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full' })
            )
          ),
          h('div', {},
            h('p', { class: 'text-xs font-black tracking-[0.28em] uppercase text-emerald-400' }, UI_CONFIG.GAME_BRANDING.TITLE),
            h('p', { class: 'text-[11px] font-black tracking-[0.2em] uppercase text-slate-400' }, `${TEXT.game.playerLabel}: ${state.playerName || TEXT.game.anonymousPlayer}`)
          )
        ),

        h('div', { class: 'grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6' },
          h('div', { class: 'text-left md:text-center' },
            h('p', { class: 'text-slate-500 uppercase tracking-[0.18em] text-[10px] font-black mb-1' }, TEXT.game.bankroll),
            h('h2', { class: 'text-2xl md:text-4xl font-black font-outfit text-white' }, state.score.toLocaleString())
          ),
          h('div', { class: 'text-left md:text-center' },
            h('p', { class: 'text-slate-500 uppercase tracking-[0.18em] text-[10px] font-black mb-1' }, TEXT.game.currentValue),
            h('p', { class: 'text-2xl md:text-3xl font-black text-emerald-400' }, `+${state.currentHandValue}`)
          ),
          h('div', { class: 'text-left md:text-center' },
            h('p', { class: 'text-slate-500 uppercase tracking-[0.18em] text-[10px] font-black mb-1' }, TEXT.game.reshuffles),
            h('p', { class: 'text-2xl md:text-3xl font-black text-white' }, String(state.reshuffleCount || 0))
          )
        )
      ),

      h('div', { class: 'flex flex-col sm:flex-row gap-3 w-full lg:w-auto' },
        h('button', {
          class: `w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLocked ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/10' : 'liquid-button'}`,
          disabled: isLocked,
          onclick: () => engine.betLower()
        }, TEXT.game.betLower),
        h('button', {
          class: `w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLocked ? 'bg-emerald-900/30 text-emerald-700 cursor-not-allowed border border-emerald-700/30' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20 active:scale-95'}`,
          disabled: isLocked,
          onclick: () => engine.betHigher()
        }, TEXT.game.betHigher)
      ),

      isLocked && h('p', { class: 'text-[10px] font-black uppercase tracking-[0.24em] text-amber-400 animate-pulse-slow' }, TEXT.game.resolvingHand)
    )
  );
}