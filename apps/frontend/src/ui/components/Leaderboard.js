import { createElement as h } from '../../picojs/framework/core.js';
import { formatScore } from '../../utils/helpers.js';

function getPlayerName(entry) {
  return entry?.player_name || entry?.username || 'Unknown';
}

function getPlayerScore(entry) {
  return entry?.score ?? entry?.highest_score ?? 0;
}

export function Leaderboard({ scores = [] }) {
  return h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6' },
    scores.length > 0
      ? scores.slice(0, 3).map((player, i) => h('div', { class: 'glass-panel p-6 rounded-3xl flex flex-col items-center gap-2 min-w-0' },
        h('span', { class: 'text-[10px] font-black text-emerald-500' }, `RANK 0${i + 1}`),
        h('p', { class: 'font-black font-outfit text-lg md:text-xl truncate w-full text-center' }, getPlayerName(player)),
        h('p', { class: 'text-slate-500 font-mono text-sm font-bold' }, formatScore(getPlayerScore(player)))
      ))
      : h('div', { class: 'md:col-span-3 text-center py-8 text-slate-600 text-xs font-black uppercase tracking-widest' },
        'No legends recorded yet. Will you be the first?')
  );
}
