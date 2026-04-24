import { createElement as h } from '../../picojs/framework/core.js';
import { HAND_RESULTS, TEXT } from '../../utils/constants.js';

export function HistoryPanel({ history }) {
  if (!history || history.length === 0) {
    return h(
      'div',
      {
        class:
          'text-center p-12 border-2 border-dashed border-white/5 rounded-[2rem] text-slate-600 flex-1 flex items-center justify-center'
      },
      h('p', { class: 'text-xs font-black uppercase tracking-widest' }, TEXT.game.waitingForFirstBet)
    );
  }

  return h(
    'div',
    { class: 'flex flex-col h-full min-h-0 animate-fade-in' },
    h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.34em] text-emerald-400 mb-5 px-2' }, TEXT.game.handHistory),

    h(
      'div',
      { class: 'flex-1 min-h-0 space-y-3 overflow-y-auto pr-2 custom-scrollbar', key: 'history-list' },
      ...history.slice().reverse().map((entry, i) => {
        const isWin = entry.result === HAND_RESULTS.WIN;
        const entryId = history.length - i;
        const numericValue = Number(entry.value);
        const displayValue = Number.isFinite(numericValue)
          ? `${numericValue >= 0 ? '+' : ''}${numericValue}`
          : '--';

        return h(
          'div',
          {
            key: `hand-${entryId}`,
            class:
              'flex items-center justify-between bg-white/[0.03] p-4 md:p-5 rounded-3xl border border-white/5 hover:bg-white/5 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]'
          },
          h(
            'div',
            { class: 'flex items-center gap-3 md:gap-4' },
            h('div', {
              class: `w-1 h-8 rounded-full ${isWin ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500'}`
            }),
            h(
              'div',
              {},
              h('p', { class: 'text-[9px] text-slate-500 font-black' }, TEXT.game.sessionHand(history.length - i)),
              h('p', { class: 'font-black text-xs md:text-sm uppercase tracking-wide' }, entry.result)
            )
          ),

          h(
            'div',
            { class: 'text-right' },
            h('p', { class: 'text-[9px] text-slate-500 font-black uppercase' }, TEXT.game.handValue),
            h('p', { class: `font-outfit font-black text-lg md:text-xl ${isWin ? 'text-emerald-400' : 'text-slate-200'}` }, displayValue)
          )
        );
      })
    )
  );
}