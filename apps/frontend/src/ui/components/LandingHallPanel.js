import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT } from '../../utils/constants.js';
import { Leaderboard } from './Leaderboard.js';

export function LandingHallPanel({ scores = [] }) {
  return h('div', { class: 'w-full animate-fade-in delay-200' },
    h('div', { class: 'flex items-center gap-4 mb-8 px-2' },
      h('div', { class: 'flex items-center gap-2' },
        h('div', { class: 'w-1 h-1 rounded-full bg-emerald-500 animate-pulse' }),
        h('h2', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap' }, TEXT.landing.hallOfFame)
      ),
      h('div', { class: 'h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent' })
    ),
    Leaderboard({ scores })
  );
}