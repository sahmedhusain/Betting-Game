import { createElement as h } from '../../picojs/framework/core.js';
import { LandingNameForm } from '../components/LandingNameForm.js';
import { LandingHallPanel } from '../components/LandingHallPanel.js';

export function LandingView({ state, engine }) {
  const topScores = state.leaderboard || [];

  return h('div', { class: 'flex flex-col items-center gap-8 md:gap-12 animate-fade-in w-full max-w-4xl px-2 sm:px-0' },
    h('div', { class: 'glass-panel p-8 sm:p-12 lg:p-20 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] text-center w-full relative overflow-hidden' },
      h('div', { class: 'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[80px] -z-10' }),
      h('h1', { class: 'text-5xl sm:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 font-outfit tracking-tighter leading-none whitespace-pre-line' }, 'MAHJONG\nBETTING'),
      h('p', { class: 'text-slate-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10' }, 'High-fidelity strategy powered by dynamic tile scaling.'),
      LandingNameForm({ state, engine })
    ),
    LandingHallPanel({ scores: topScores })
  );
}