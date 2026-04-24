import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, GAME_CONFIG } from '../../utils/constants.js';

export function ScoreBoard({ state }) {
  const currentHandValue = Number.isFinite(Number(state.currentHandValue))
    ? Number(state.currentHandValue)
    : 0;
  const formattedCurrentHandValue = `${currentHandValue}`;

  const StatBlock = ({ iconClass, label, value, colorClass = 'text-white', iconColorClass = 'text-white/50', bgColor = 'bg-white/5' }) => h(
    'div',
    { class: `flex items-center gap-4 ${bgColor} border border-white/5 rounded-2xl px-5 py-4 transition-all hover:bg-white/10 hover:border-white/10` },
    h('div', { class: 'w-10 h-10 flex items-center justify-center rounded-xl bg-black/20 shrink-0' },
      h('div', { class: `${iconClass} ${iconColorClass}` })
    ),
    h('div', { class: 'flex flex-col' },
      h('span', { class: 'text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5' }, label),
      h('span', { class: `text-xl md:text-2xl font-black font-outfit tracking-tighter leading-none ${colorClass}` }, value)
    )
  );

  return h('div', { class: 'animate-fade-in' },
    h('div', { class: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
      
      StatBlock({
        iconClass: 'icon-bankroll',
        iconColorClass: 'text-blue-400',
        label: TEXT.game.bankroll,
        value: state.score.toLocaleString(),
        colorClass: 'text-white'
      }),

      StatBlock({
        iconClass: 'icon-wallet',
        iconColorClass: 'text-emerald-400',
        label: TEXT.game.currentValue,
        value: formattedCurrentHandValue,
        colorClass: 'text-emerald-400',
        bgColor: 'bg-emerald-500/[0.03]'
      }),

      StatBlock({
        iconClass: 'icon-refresh',
        iconColorClass: 'text-amber-400',
        label: TEXT.game.reshuffles,
        value: `${state.reshuffleCount || 0}/${GAME_CONFIG.MAX_RESHUFFLES}`,
        colorClass: 'text-amber-400',
        bgColor: 'bg-amber-500/[0.03]'
      }),

      StatBlock({
        iconClass: 'icon-discarded',
        iconColorClass: 'text-slate-400',
        label: TEXT.game.discarded,
        value: state.discardPileCount,
        colorClass: 'text-slate-300'
      })
    )
  );
}