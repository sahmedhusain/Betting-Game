import { createElement as h } from '../../picojs/framework/core.js';
import { HAND_RESULTS, TEXT } from '../../utils/constants.js';

export function HistoryPanel({ history = [] }) {
  const safeHistory = history || [];
  const totalWins = safeHistory.filter(entry => entry.result === HAND_RESULTS.WIN).length;
  const totalLosses = safeHistory.length - totalWins;

  return h(
    'div',
    { class: 'flex flex-col h-full min-h-0 animate-fade-in' },

    h('div', { class: 'mb-6 px-2' },
      h('div', { class: 'flex items-center justify-between mb-4' },
        h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500' }, TEXT.game.handHistory),
        h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' }),
        h('span', { class: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, TEXT.game.cards)
      ),

      h('div', { class: 'grid grid-cols-2 gap-3' },
        h('div', {
          class: 'relative overflow-hidden group bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 shadow-xl'
        },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent' }),
          h('span', { class: 'text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mb-2 block' }, TEXT.game.totalWins),
          h('span', { class: 'text-2xl font-black font-outfit text-emerald-400 drop-shadow-lg' }, totalWins)
        ),

        h('div', {
          class: 'relative overflow-hidden group bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 shadow-xl'
        },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent' }),
          h('span', { class: 'text-[8px] font-black uppercase tracking-widest text-rose-500/60 mb-2 block' }, TEXT.game.totalLosses),
          h('span', { class: 'text-2xl font-black font-outfit text-rose-400 drop-shadow-lg' }, totalLosses)
        )
      )
    ),

    h(
      'div',
      { class: 'flex-1 min-h-0 relative' },
      safeHistory.length === 0
        ? h(
          'div',
          {
            class: 'absolute inset-0 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/5 rounded-[2rem]'
          },
          h('p', { class: 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-700' }, TEXT.game.waitingForFirstBet)
        )
        : h(
          'div',
          { class: 'h-full space-y-3 overflow-y-auto pr-2 custom-scrollbar', key: 'history-list' },
          ...safeHistory.slice().reverse().map((entry, i) => {
            const isWin = entry.result === HAND_RESULTS.WIN;
            const entryId = safeHistory.length - i;
            const numericValue = Number(entry.value);
            const displayValue = Number.isFinite(numericValue) ? `${numericValue}` : TEXT.game.notAvailable;

            return h(
              'div',
              {
                key: `hand-${entryId}`,
                class: `flex items-center justify-between bg-white/[0.03] p-4 md:p-5 rounded-3xl border border-white/5 hover:bg-white/5 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] ${i === 0 ? 'animate-history-entry' : ''}`
              },
              h(
                'div',
                { class: 'flex items-center gap-3 md:gap-4' },
                h('div', { class: `w-1 h-8 rounded-full ${isWin ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500'}` }),
                h('div', {},
                  h('p', { class: 'text-[9px] text-slate-500 font-black' }, TEXT.game.sessionHand(safeHistory.length - i)),
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
    )
  );
}