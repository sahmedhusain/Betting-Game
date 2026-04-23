import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT } from '../../utils/constants.js';
import { formatScore } from '../../utils/helpers.js';

export function EndHistoryPanel({ history, bestScore, playerName }) {
  return h('div', { class: 'lg:col-span-5 flex flex-col h-full min-h-0 p-1' },
    h('div', { class: 'glass-panel p-8 rounded-[2.5rem] h-full flex flex-col border border-white/5 overflow-hidden min-h-0' },
      h('div', { class: 'flex items-center justify-between mb-8' },
        h('div', { class: 'flex flex-col' },
          h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1' }, TEXT.end.activityHistory),
          h('span', { class: 'text-sm font-black text-emerald-400 font-outfit uppercase' }, playerName || TEXT.end.anonymous)
        ),
        h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' }),
        h('span', { class: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, TEXT.end.records)
      ),

      // Lifetime Stats Summary
      h('div', { class: 'grid grid-cols-2 gap-4 mb-8' },
        h('div', { class: 'p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col justify-center' },
          h('div', { class: 'flex items-center gap-3 mb-2' },
            h('div', { class: 'icon-wallet text-slate-500 w-4 h-4' }),
            h('p', { class: 'text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]' }, TEXT.end.lifetimeEarnings)
          ),
          h('p', { class: 'text-2xl font-black text-white font-mono leading-none' }, formatScore(history.reduce((sum, entry) => sum + (entry.score || 0), 0)))
        ),
        h('div', { class: 'p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col justify-center' },
          h('div', { class: 'flex items-center gap-3 mb-2' },
            h('div', { class: 'icon-star text-emerald-500 w-3 h-3' }),
            h('p', { class: 'text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]' }, TEXT.end.personalBest)
          ),
          h('p', { class: 'text-2xl font-black text-white font-mono leading-none' }, formatScore(bestScore))
        )
      ),

      h('div', { class: 'flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-12 min-h-0' },
        history.length > 0 ? history.map((entry, i) => {
          const isBest = entry.score === bestScore;
          const date = new Date(entry.timestamp);
          const isFirst = i === 0;

          return h('div', {
            class: `group relative p-7 rounded-[2rem] border transition-all duration-300 ${isFirst
                ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
              }`,
            key: `history-${entry.id || i}`
          },
            h('div', { class: 'flex justify-between items-center' },
              h('div', { class: 'flex items-center gap-6' },
                isBest && h('div', { class: 'icon-star text-emerald-400 w-6 h-6' }),
                h('div', { class: 'flex flex-col' },
                  h('div', { class: 'flex items-center gap-3' },
                    h('span', { class: 'text-xl font-black text-white leading-none font-mono' }, formatScore(entry.score)),
                    isFirst && h('span', { class: 'text-[8px] font-black bg-emerald-500 text-white px-2 py-1 rounded-md uppercase tracking-tighter' }, TEXT.end.newTag)
                  )
                )
              ),
              h('div', { class: 'flex items-center gap-4 text-right' },
                h('span', { class: 'text-xs font-black text-slate-400 uppercase tracking-tighter' }, date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
                h('div', { class: 'w-[1px] h-4 bg-white/10' }),
                h('span', { class: 'text-[10px] font-bold text-slate-600' }, date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
              )
            )
          );
        }) : h('div', { class: 'flex-1 flex flex-col items-center justify-center opacity-30 py-20' },
          h('p', { class: 'text-slate-500 text-[10px] uppercase tracking-[0.4em]' }, TEXT.end.noHistory)
        )
      )
    )
  );
}
