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
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function Leaderboard({ scores = [] }) {
  const topScores = scores.slice(0, 5);

  return h('div', { class: 'flex flex-col gap-4' },
    topScores.length > 0
      ? topScores.map((player, i) => h('div', {
        class: `glass-panel group w-full flex items-center justify-between p-6 rounded-[2rem] border border-white/5 transition-[background-color,border-color] duration-300 hover:bg-white/10 hover:border-white/20 ${i === 0 ? 'bg-white/5 border-emerald-500/20' : ''}`,
        key: `rank-${getPlayerName(player)}-${getPlayerScore(player)}-${i}`
      },
        h('div', { class: 'flex items-center gap-6 flex-1 min-w-0' },
          h('div', { class: `w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl ${i < 3 ? 'bg-white/5 shadow-xl transition-transform' : 'bg-white/5'}` },
            h('div', {
              class: i === 0 ? 'icon-medal icon-medal-gold scale-125' :
                i === 1 ? 'icon-medal icon-medal-silver scale-110' :
                  i === 2 ? 'icon-medal icon-medal-bronze scale-105' :
                    'icon-star text-slate-500'
            })
          ),
          h('div', { class: 'flex flex-col min-w-0' },
            h('p', { class: `font-black font-outfit text-base tracking-tight truncate ${i === 0 ? 'text-white' : 'text-slate-200'}` }, getPlayerName(player)),
            h('div', { class: 'flex items-center gap-2' },
              h('span', { class: 'text-[10px] font-bold text-slate-500 uppercase tracking-widest' }, getOrdinal(i + 1)),
              i === 0 && h('span', { class: 'text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-tighter' }, TEXT.leaderboard.legend)
            )
          )
        ),
        h('div', { class: 'text-right flex flex-col items-end shrink-0 ml-4' },
          h('p', { class: `font-black font-mono text-lg ${i === 0 ? 'text-emerald-400' : 'text-emerald-600'}` }, formatScore(getPlayerScore(player)))
        )
      ))
      : h('div', { class: 'glass-panel p-12 rounded-[2.5rem] text-center border border-dashed border-white/10' },
        h('p', { class: 'text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto' }, TEXT.leaderboard.emptyState)
      )
  );
}
