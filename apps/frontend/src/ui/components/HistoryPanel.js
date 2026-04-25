import { createElement as h } from '../../picojs/framework/core.js';
import { HAND_RESULTS, TEXT, ASSETS } from '../../utils/constants.js';

export function HistoryPanel({ history = [] }) {
  const safeHistory = history || [];
  const totalWins = safeHistory.filter(entry => entry.result === HAND_RESULTS.WIN).length;
  const totalLosses = safeHistory.filter(entry => entry.result === HAND_RESULTS.LOSS).length;
  const totalPushes = safeHistory.filter(entry => entry.result === HAND_RESULTS.PUSH).length;

  const renderMiniTile = (tile) => {
    const filename = tile.type === 'NUMBER'
      ? `${tile.faceValue}_${tile.suit}.svg`
      : `${tile.name}.svg`;
    const imagePath = `${ASSETS.TILES.BASE}${filename}`;
    const displayValue = tile.historicalValue !== undefined ? tile.historicalValue : (tile.type === 'NUMBER' ? tile.faceValue : 5);

    return h('div', {
      class: 'w-8 h-11 rounded-lg bg-white/10 border border-white/5 p-1 flex items-center justify-center shadow-inner group/tile transition-all hover:scale-110 hover:z-[100] hover:border-emerald-500/30 relative',
    },
      h('img', {
        src: imagePath,
        alt: tile.name,
        class: 'w-full h-full object-contain filter drop-shadow-sm'
      }),
      h('div', {
        class: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 backdrop-blur-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/tile:opacity-100 group-hover/tile:translate-y-0 transition-all duration-200 z-30 min-w-[100px] text-center'
      },
        h('p', { class: 'text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5' }, tile.name),
        h('div', { class: 'flex items-center justify-center gap-1.5' },
          h('span', { class: 'text-[10px] font-black text-emerald-400 font-outfit' }, displayValue),
          h('span', { class: 'text-[7px] font-bold text-slate-400 uppercase tracking-tighter' }, 'POINTS')
        ),
        h('div', { class: 'absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 border-r border-b border-white/10 rotate-45' })
      )
    );
  };

  return h(
    'div',
    { class: 'flex flex-col h-full min-h-0 animate-fade-in' },

    h('div', { class: 'mb-6 px-2' },
      h('div', { class: 'flex items-center justify-between mb-4' },
        h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500' }, TEXT.game.handHistory),
        h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' }),
        h('span', { class: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, TEXT.game.cards)
      ),

      h('div', { class: 'grid grid-cols-3 gap-2' },
        h('div', {
          class: 'relative overflow-hidden group bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30 shadow-xl'
        },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent' }),
          h('span', { class: 'text-[7px] font-black uppercase tracking-widest text-emerald-500/60 mb-1 block' }, TEXT.game.totalWins),
          h('span', { class: 'text-xl font-black font-outfit text-emerald-400 drop-shadow-lg' }, totalWins)
        ),

        h('div', {
          class: 'relative overflow-hidden group bg-slate-500/5 border border-slate-500/20 rounded-2xl p-3 transition-all hover:bg-slate-500/10 hover:border-slate-500/30 shadow-xl'
        },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent' }),
          h('span', { class: 'text-[7px] font-black uppercase tracking-widest text-slate-500/60 mb-1 block' }, 'TOTAL PUSHES'),
          h('span', { class: 'text-xl font-black font-outfit text-slate-300 drop-shadow-lg' }, totalPushes)
        ),

        h('div', {
          class: 'relative overflow-hidden group bg-rose-500/5 border border-rose-500/20 rounded-2xl p-3 transition-all hover:bg-rose-500/10 hover:border-rose-500/30 shadow-xl'
        },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent' }),
          h('span', { class: 'text-[7px] font-black uppercase tracking-widest text-rose-500/60 mb-1 block' }, TEXT.game.totalLosses),
          h('span', { class: 'text-xl font-black font-outfit text-rose-400 drop-shadow-lg' }, totalLosses)
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
          { class: 'h-full xl:max-h-[550px] space-y-3 overflow-y-auto px-6 py-4 custom-scrollbar', key: 'history-list' }, // Increased padding
          ...safeHistory.slice().reverse().map((entry, i) => {
            const isWin = entry.result === HAND_RESULTS.WIN;
            const isPush = entry.result === HAND_RESULTS.PUSH;
            const entryId = safeHistory.length - i;
            const numericValue = Number(entry.value);
            const displayValue = Number.isFinite(numericValue) ? `${numericValue}` : TEXT.game.notAvailable;

            let indicatorClass = 'bg-rose-500';
            if (isWin) indicatorClass = 'bg-emerald-500 shadow-[0_0_15px_#10b981]';
            else if (isPush) indicatorClass = 'bg-slate-500';

            return h(
              'div',
              {
                key: `hand-${entryId}`,
                class: `flex flex-col gap-3 bg-white/[0.03] p-4 md:p-5 rounded-3xl border border-white/5 hover:bg-white/5 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] relative ${i === 0 ? 'animate-history-entry' : ''}`
              },
              h('div', { class: 'flex items-center justify-between relative z-0' },
                h(
                  'div',
                  { class: 'flex items-center gap-3 md:gap-4' },
                  h('div', { class: `w-1 h-8 rounded-full ${indicatorClass}` }),
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
              ),
              entry.hand && h('div', { class: 'flex flex-wrap gap-2 pt-1 px-1 relative z-20 isolate' }, // Higher z-index + isolate
                ...entry.hand.map(renderMiniTile)
              )
            );
          })
        )
    )
  );
}