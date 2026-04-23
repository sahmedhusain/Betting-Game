import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ROUTES } from '../../utils/constants.js';
import { formatScore } from '../../utils/helpers.js';

export function EndSummaryPanel({ score, bestScore, comment, onPlayAgain }) {
  return h('div', { class: 'lg:col-span-7 flex flex-col h-full min-h-0 p-1' },
    h('div', { class: 'glass-panel p-10 sm:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden h-full flex flex-col justify-center min-h-0' },
      // Glow background
      h('div', { class: 'absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full' }),

      h('div', { class: 'relative z-10' },
        h('p', { class: 'text-emerald-500 font-black uppercase tracking-[0.4em] mb-6 text-[10px]' }, TEXT.end.sessionTerminated),
        h('h1', { class: 'text-6xl sm:text-8xl font-black mb-10 font-outfit tracking-tighter leading-none whitespace-pre-line text-white' }, TEXT.end.gameOver),

        h('div', { class: 'py-10 border-y border-white/5 mb-10' },
          h('p', { class: 'text-slate-500 uppercase text-[10px] font-black tracking-widest mb-4' }, TEXT.end.finalBankroll),
          h('div', { class: 'flex items-baseline gap-4 mb-3' },
            h('h2', { class: 'text-6xl sm:text-8xl font-black text-white font-outfit tracking-tight' },
              formatScore(score)
            )
          ),
          h('p', { class: 'text-emerald-400 text-sm font-black uppercase tracking-[0.2em] animate-pulse' }, comment)
        ),

        h('div', { class: 'flex flex-col sm:flex-row items-center gap-6' },
          h('button', {
            class: 'w-full sm:w-auto px-12 py-6 bg-emerald-500 text-white rounded-3xl font-black hover:bg-emerald-400 transition-all uppercase tracking-[0.2em] text-xs shadow-2xl shadow-emerald-500/20 active:scale-95',
            onclick: onPlayAgain
          }, TEXT.end.playAgain),
          h('button', {
            class: 'w-full sm:w-auto px-10 py-6 bg-white/5 text-slate-400 border border-white/5 rounded-3xl font-black hover:bg-white/10 hover:text-white transition-all uppercase tracking-[0.2em] text-xs active:scale-95',
            onclick: () => {
              window.location.hash = ROUTES.LANDING;
            }
          }, TEXT.end.returnToLobby)
        )
      )
    )
  );
}
