import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ROUTES } from '../../utils/constants.js';
import { formatScore } from '../../utils/helpers.js';

export function EndSummaryPanel({ score, bestScore, comment, onPlayAgain }) {
  return h('div', { class: 'lg:col-span-7 flex flex-col h-full min-h-0 p-1 shrink-0' },
    h('div', { class: 'glass-panel p-8 sm:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden h-full flex flex-col justify-center min-h-[500px] lg:min-h-0' },
      h('div', { class: 'absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full' }),

      h('div', { class: 'relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left' },
        h('div', { class: 'mb-8 sm:mb-12' },
          h('p', { class: 'text-emerald-500 font-black uppercase tracking-[0.4em] mb-4 text-[10px]' }, TEXT.end.sessionTerminated),
          h('div', { class: 'flex flex-col' },
            h('span', { class: 'text-6xl sm:text-7xl lg:text-[90px] font-black font-outfit tracking-tighter leading-[0.8] text-white opacity-40' }, 'CAUGHT'),
            h('span', { class: 'text-6xl sm:text-7xl lg:text-[90px] font-black font-outfit tracking-tighter leading-[0.8] text-white' }, 'UP!')
          )
        ),

        h('div', { class: 'w-full py-8 sm:py-10 border-y border-white/5 mb-8 sm:mb-10 flex flex-col items-center lg:items-start' },
          h('p', { class: 'text-slate-500 uppercase text-[10px] font-black tracking-widest mb-4' }, TEXT.end.finalBankroll),
          h('div', { class: 'flex items-center gap-4 mb-3' },
            h('div', { class: 'hidden lg:block w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]' }),
            h('h2', { class: 'text-7xl sm:text-8xl lg:text-9xl font-black text-white font-outfit tracking-tighter' },
              formatScore(score)
            )
          ),
          h('p', { class: 'text-emerald-400 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em]' }, comment)
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
