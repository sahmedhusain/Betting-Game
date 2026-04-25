import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ROUTES, GAME_OVER_REASONS } from '../../utils/constants.js';
import { formatScore } from '../../utils/helpers.js';
import { store } from '../../state/State.js';

export function EndSummaryPanel({ score, bestScore, comment, onPlayAgain, gameOverReason }) {
  const state = store.getState();
  const isCheat = gameOverReason === GAME_OVER_REASONS.CHEAT_DETECTED || !!state.wasRefreshed;
  const isBoundary = gameOverReason === GAME_OVER_REASONS.BOUNDARY_HIT;
  const isExhausted = gameOverReason === GAME_OVER_REASONS.DECK_EXHAUSTED;

  let titlePart1 = TEXT.end.gameOverMain;
  let titlePart2 = TEXT.end.gameOverSub;
  let termColor = 'text-emerald-500';
  let part2Color = 'text-white';

  if (isCheat) {
    titlePart1 = TEXT.end.cheatMain;
    titlePart2 = TEXT.end.cheatSub;
    termColor = 'text-rose-500';
    part2Color = 'text-rose-500';
  } else if (isBoundary) {
    titlePart1 = TEXT.end.limitReachedMain;
    titlePart2 = TEXT.end.limitReachedSub;
    termColor = 'text-amber-400';
    part2Color = 'text-amber-400';
  } else if (isExhausted) {
    titlePart1 = TEXT.end.deckExhaustedMain;
    titlePart2 = TEXT.end.deckExhaustedSub;
    termColor = 'text-amber-400';
    part2Color = 'text-amber-400';
  }

  const displayScore = isCheat ? 0 : score;
  const displayComment = isCheat ? 'Try again!' : comment;
  const scoreColorClass = isCheat ? 'text-rose-500' : 'text-white';
  const commentColorClass = isCheat ? 'text-rose-500' : 'text-emerald-400';
  const accentColorClass = isCheat ? 'bg-rose-500' : 'bg-emerald-500';

  return h('div', { class: 'lg:col-span-7 flex flex-col h-full min-h-0 p-1 shrink-0' },
    h('div', { class: 'glass-panel p-8 sm:p-10 rounded-[3rem] border border-white/5 relative overflow-hidden h-full flex flex-col justify-center min-h-[500px] lg:min-h-0' },
      h('div', { class: 'absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full' }),

      h('div', { class: 'relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left overflow-y-auto no-scrollbar max-h-full' },
        h('div', { class: 'mb-4 sm:mb-8' },
          h('p', { class: `${termColor} font-black uppercase tracking-[0.4em] mb-2 text-[10px]` }, TEXT.end.sessionTerminated),
          h('div', { class: 'flex flex-col' },
            h('span', { class: 'text-5xl sm:text-6xl lg:text-[70px] font-black font-outfit tracking-tighter leading-[0.8] text-white opacity-40 uppercase' }, titlePart1),
            h('span', { class: `text-2xl sm:text-3xl lg:text-[40px] font-black font-outfit tracking-tighter leading-[1.1] ${part2Color} mt-2 uppercase` }, titlePart2)
          )
        ),

        h('div', { class: 'w-full py-6 sm:py-8 border-y border-white/5 mb-6 sm:mb-8 flex flex-col items-center lg:items-start' },
          h('p', { class: 'text-slate-500 uppercase text-[10px] font-black tracking-widest mb-2' }, TEXT.end.finalBankroll),
          h('div', { class: 'flex items-center gap-4 mb-2' },
            h('div', { class: `hidden lg:block w-1.5 h-10 ${accentColorClass} rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]` }),
            h('h2', { class: `text-6xl sm:text-7xl lg:text-8xl font-black ${scoreColorClass} font-outfit tracking-tighter` },
              formatScore(displayScore)
            )
          ),
          h('p', { class: `${commentColorClass} text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em]` }, displayComment)
        ),

        h('div', { class: 'flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto' },
          h('button', {
            class: 'w-full sm:w-auto px-12 py-6 bg-emerald-500 text-white rounded-[2rem] font-black hover:bg-emerald-400 hover:scale-105 transition-all uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-500/20 active:scale-95',
            onclick: onPlayAgain
          }, TEXT.end.playAgain),
          h('button', {
            class: 'w-full sm:w-auto px-10 py-6 bg-white/5 text-slate-400 border border-white/10 rounded-[2rem] font-black hover:bg-white/10 hover:text-white transition-all uppercase tracking-[0.2em] text-xs active:scale-95',
            onclick: () => {
              window.location.hash = ROUTES.LANDING;
            }
          }, TEXT.end.returnToLobby)
        )
      )
    )
  );
}
