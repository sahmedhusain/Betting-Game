import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, UI_CONFIG } from '../../utils/constants.js';

export function ScoreBoard({ state, engine }) {
  const isLocked = !!state.isResolvingBet;
  const currentHandValue = Number.isFinite(Number(state.currentHandValue))
    ? Number(state.currentHandValue)
    : 0;
  const formattedCurrentHandValue = `${currentHandValue >= 0 ? '+' : ''}${currentHandValue}`;

  return h('div', { class: 'glass-panel p-[var(--play-panel-pad)] rounded-[var(--play-panel-radius)] animate-fade-in border border-white/10 shadow-[0_18px_40px_-22px_rgba(16,184,166,0.25)]' },
    h('div', { class: 'flex flex-col gap-[max(1rem,1.5vw)]' },
      h('div', { class: 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6' },
        
        // Betting Stats Grid
        h('div', { class: 'flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5' },
          h('div', { class: 'text-left md:text-center bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 shadow-sm' },
            h('p', { class: 'text-slate-500 uppercase tracking-[0.3em] text-[9px] font-black mb-2' }, TEXT.game.bankroll),
            h('h2', { class: 'text-[var(--play-stat-value)] font-black font-outfit text-white leading-none tracking-tighter' }, state.score.toLocaleString())
          ),
          h('div', { class: 'text-left md:text-center bg-emerald-500/[0.05] border border-emerald-400/10 rounded-2xl px-4 py-3 shadow-sm' },
            h('p', { class: 'text-slate-400 uppercase tracking-[0.3em] text-[9px] font-black mb-2' }, TEXT.game.currentValue),
            h('p', { class: 'text-[clamp(1.5rem,2.5vw,2.5rem)] font-black text-emerald-400 leading-none tracking-tighter' }, formattedCurrentHandValue)
          ),
          h('div', { class: 'hidden md:block text-left md:text-center bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-3' },
            h('p', { class: 'text-slate-600 uppercase tracking-[0.3em] text-[9px] font-black mb-2' }, TEXT.game.reshuffles),
            h('p', { class: 'text-[clamp(1.5rem,2.3vw,2.3rem)] font-black text-slate-400 leading-none tracking-tighter' }, String(state.reshuffleCount || 0))
          )
        ),

        // Action Buttons
        h('div', { class: 'flex flex-col sm:flex-row gap-3 w-full lg:w-auto' },
          h('button', {
            class: `w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLocked ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/10' : 'liquid-button shadow-xl'}`,
            disabled: isLocked,
            onclick: () => engine.betLower()
          }, TEXT.game.betLower),
          h('button', {
            class: `w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isLocked ? 'bg-emerald-900/30 text-emerald-700 cursor-not-allowed border border-emerald-700/30' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20 active:scale-95'}`,
            disabled: isLocked,
            onclick: () => engine.betHigher()
          }, TEXT.game.betHigher)
        )
      ),

      isLocked && h('div', { class: 'flex items-center gap-3 pt-2' },
        h('div', { class: 'w-2 h-2 rounded-full bg-amber-500 animate-pulse' }),
        h('p', { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/80 animate-pulse' }, TEXT.game.resolvingHand)
      )
    )
  );
}