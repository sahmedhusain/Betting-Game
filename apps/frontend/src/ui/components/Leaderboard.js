import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT } from '../../utils/constants.js';
import { formatScore } from '../../utils/helpers.js';

function getPlayerName(entry) {
  return entry?.player_name || entry?.username || TEXT.leaderboard.unknownPlayer;
}

function getPlayerScore(entry) {
  return entry?.highest_score ?? entry?.score ?? 0;
}

function getOrdinal(n) {
  const s = TEXT.leaderboard.ordinals;
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function Leaderboard({ scores = [] }) {
  const topScores = scores.slice(0, 5);

  return h('div', { class: 'flex flex-col gap-3' },
    topScores.length > 0
      ? topScores.map((player, i) => {
          const score = getPlayerScore(player);
          const name = getPlayerName(player);
          const isTop = i === 0;

          return h('div', {
            class: `relative flex items-center justify-between p-5 rounded-[2.5rem] border transition-all duration-500
              ${isTop 
                ? 'bg-gradient-to-br from-emerald-500/15 via-emerald-500/[0.03] to-transparent border-emerald-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(16,185,129,0.05)]' 
                : 'bg-white/[0.03] border-white/5 shadow-xl'
              }`,
            key: `rank-${name}-${score}-${i}`
          },
            // Left: Rank & Avatar
            h('div', { class: 'flex items-center gap-5 min-w-0' },
              h('div', { class: 'relative shrink-0' },
                h('div', { class: `w-14 h-14 flex items-center justify-center rounded-[1.25rem] border shadow-2xl transition-all duration-500
                  ${isTop ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-white/5 border-white/10'}` 
                },
                  h('div', {
                    class: i === 0 ? 'icon-medal icon-medal-gold w-8 h-8 scale-110' :
                      i === 1 ? 'icon-medal icon-medal-silver w-7 h-7' :
                        i === 2 ? 'icon-medal icon-medal-bronze w-7 h-7' :
                          'icon-star text-slate-600 w-5 h-5 opacity-40 transition-opacity'
                  })
                ),
                // Rank Badge Overlay
                h('div', { class: `absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border shadow-xl
                  ${isTop ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-white/10 text-slate-400'}` 
                }, i + 1)
              ),

              h('div', { class: 'flex flex-col min-w-0' },
                h('p', { class: 'text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1' }, 
                  i < 3 ? 'LEGENDARY' : 'CHALLENGER'
                ),
                h('p', { class: `text-base font-black font-outfit tracking-tight leading-none truncate ${isTop ? 'text-white' : 'text-slate-200'}` }, name)
              )
            ),

            // Right: Score
            h('div', { class: 'flex flex-col items-end gap-1 shrink-0 ml-4' },
              h('span', { class: 'text-[8px] font-black text-slate-700 uppercase tracking-widest' }, 'Earnings'),
              h('p', { class: `text-lg font-black font-mono leading-none ${isTop ? 'text-emerald-400' : 'text-emerald-600'}` }, 
                formatScore(score)
              )
            )
          );
        })
      : h('div', { class: 'glass-panel p-12 rounded-[2.5rem] text-center border border-dashed border-white/10' },
        h('p', { class: 'text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto' }, TEXT.leaderboard.emptyState)
      )
  );
}
