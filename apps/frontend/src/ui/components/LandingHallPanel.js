import { createElement as h } from '../../picojs/framework/core.js';
import { Leaderboard } from './Leaderboard.js';

export function LandingHallPanel({ scores = [] }) {
  return h('div', { class: 'w-full grid grid-cols-1 gap-4' },
    h('div', { class: 'flex justify-between items-center px-8 mb-2' },
      h('h2', { class: 'text-[10px] font-black uppercase tracking-[0.5em] text-slate-500' }, 'Hall of Fame'),
      h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' })
    ),
    Leaderboard({ scores })
  );
}