import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, GAME_CONFIG } from '../../utils/constants.js';

export function ScoreBoard({ state }) {
  const currentHandValue = Number.isFinite(Number(state.currentHandValue))
    ? Number(state.currentHandValue)
    : 0;
  const formattedCurrentHandValue = `${currentHandValue}`;

  const StatBlock = ({ iconClass, label, value, colorClass = 'text-white', iconColorClass = 'text-white/50', bgColor = 'bg-white/5' }) => {
    let highlightColor = 'via-white/20';
    if (iconColorClass.includes('blue')) highlightColor = 'via-blue-400/40';
    if (iconColorClass.includes('emerald')) highlightColor = 'via-emerald-400/40';
    if (iconColorClass.includes('amber')) highlightColor = 'via-amber-400/40';
    if (iconColorClass.includes('slate')) highlightColor = 'via-slate-400/40';

    return h(
      'div',
      { 
        class: `relative overflow-hidden group flex items-center gap-2 lg:gap-4 ${bgColor} border border-white/10 rounded-xl lg:rounded-2xl px-2 py-1.5 lg:px-5 lg:py-5 transition-all hover:bg-white/[0.08] hover:border-white/20 shadow-xl flex-1 lg:flex-none min-w-0` 
      },
      h('div', { class: `absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${highlightColor} to-transparent opacity-50 group-hover:opacity-100 transition-opacity` }),
      
      h('div', { class: 'w-7 h-7 lg:w-11 lg:h-11 flex items-center justify-center rounded-lg lg:rounded-xl bg-black/30 shrink-0 border border-white/5 shadow-inner' },
        h('div', { class: `${iconClass} ${iconColorClass} scale-[0.65] lg:scale-100` })
      ),
      h('div', { class: 'flex flex-col' },
        h('span', { class: 'hidden lg:block text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1' }, label),
        h('span', { class: `text-sm lg:text-2xl font-black font-outfit tracking-tighter leading-none ${colorClass}` }, value)
      )
    );
  };

  return h('div', { class: 'animate-fade-in' },
    h('div', { class: 'flex flex-row lg:grid lg:grid-cols-4 gap-2 lg:gap-4 overflow-x-auto no-scrollbar' },
      
      StatBlock({
        iconClass: 'icon-bankroll',
        iconColorClass: 'text-blue-400',
        label: TEXT.game.bankroll,
        value: state.score.toLocaleString(),
        colorClass: 'text-white',
        bgColor: 'bg-blue-500/[0.02]'
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

      h('div', { class: 'hidden md:block flex-1' },
        StatBlock({
          iconClass: 'icon-discarded',
          iconColorClass: 'text-slate-400',
          label: TEXT.game.discarded,
          value: state.discardPileCount,
          colorClass: 'text-slate-300',
          bgColor: 'bg-slate-500/[0.02]'
        })
      )
    )
  );
}