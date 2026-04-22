import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { Leaderboard } from '../components/Leaderboard.js';
import { PLAYER_NAME_MAX_LEN, normalizePlayerName, validatePlayerName } from '../../utils/helpers.js';

export function LandingView({ state, engine }) {
  const topScores = state.leaderboard || [];
  const normalizedName = normalizePlayerName(state.playerName);
  const validationError = validatePlayerName(normalizedName);
  const minLengthError = normalizedName && normalizedName.length < 3
    ? 'Player name must be at least 3 characters.'
    : null;
  const nameError = validationError || minLengthError;
  const canStart = !nameError;

  const handleNameInput = (e) => {
    store.setState({ playerName: e.target.value.slice(0, PLAYER_NAME_MAX_LEN) });
  };

  return h('div', { class: 'flex flex-col items-center gap-8 md:gap-12 animate-fade-in w-full max-w-4xl px-2 sm:px-0' },
    // Hero Section
    h('div', { class: 'glass-panel p-8 sm:p-12 lg:p-20 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] text-center w-full relative overflow-hidden' },
      h('div', { class: 'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[80px] -z-10' }),
      h('h1', { class: 'text-5xl sm:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 font-outfit tracking-tighter leading-none whitespace-pre-line' }, 'MAHJONG\nBETTING'),
      h('p', { class: 'text-slate-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10' }, 'High-fidelity strategy powered by dynamic tile scaling.'),

      // Name Input
      h('div', { class: 'max-w-sm mx-auto mb-10 group' },
        h('p', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4' }, 'Identify Player'),
        h('input', {
          type: 'text',
          placeholder: 'ENTER YOUR NAME',
          maxlength: PLAYER_NAME_MAX_LEN,
          spellcheck: false,
          autocomplete: 'off',
          class: 'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center font-black tracking-widest text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10',
          value: state.playerName,
          oninput: handleNameInput
        }),
        nameError
          ? h('p', { class: 'mt-3 text-xs font-bold text-rose-300 text-left' }, nameError)
          : h('p', { class: 'mt-3 text-[10px] text-slate-500 text-left uppercase tracking-[0.2em]' },
            `Allowed: A-Z, 0-9, dot, underscore, hyphen. Max ${PLAYER_NAME_MAX_LEN} chars.`)
      ),

      h('button', {
        class: `w-full sm:w-auto px-10 sm:px-16 py-5 sm:py-6 rounded-3xl font-black text-white transition-all shadow-2xl uppercase tracking-[0.2em] text-xs ${canStart ? 'bg-emerald-500 hover:scale-105 active:scale-95 shadow-emerald-500/40' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`,
        disabled: !canStart,
        onclick: () => {
          if (!canStart) return;

          store.setState({ playerName: normalizedName });
          window.location.hash = '#/play';
          engine.startGame(normalizedName);
        }
      }, 'Initialize Session')
    ),

    // Hall of Fame
    h('div', { class: 'w-full grid grid-cols-1 gap-4' },
      h('div', { class: 'flex justify-between items-center px-8 mb-2' },
        h('h2', { class: 'text-[10px] font-black uppercase tracking-[0.5em] text-slate-500' }, 'Hall of Fame'),
        h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' })
      ),
      Leaderboard({ scores: topScores })
    )
  );
}
