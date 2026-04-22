import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { ROUTES, TEXT, KEYS } from '../../utils/constants.js';
import { PLAYER_NAME_MAX_LEN, PLAYER_NAME_MIN_LEN, normalizePlayerName, validatePlayerName } from '../../utils/helpers.js';

export function LandingNameForm({ state, engine }) {
  const normalizedName = normalizePlayerName(state.playerName);
  const nameError = validatePlayerName(normalizedName);
  const showNameError = state.hasAttemptedStart && nameError;
  const canStart = !nameError;

  const handleNameInput = (e) => {
    store.setState({ playerName: e.target.value.slice(0, PLAYER_NAME_MAX_LEN) });
  };

  const handleStart = () => {
    store.setState({ hasAttemptedStart: true });

    if (!canStart) return;

    store.setState({ playerName: normalizedName });
    window.location.hash = ROUTES.PLAY;
    engine.startGame(normalizedName);

  };

  return h('div', { class: 'max-w-sm mx-auto mb-10 group', key: 'landing-form' },
    h('p', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4' }, TEXT.landing.identifyPlayer),
    h('input', {
      type: 'text',
      placeholder: TEXT.landing.namePlaceholder,
      maxlength: PLAYER_NAME_MAX_LEN,
      spellcheck: false,
      autocomplete: 'off',
      'data-focuskey': 'player-name',
      class: 'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center font-black tracking-widest text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10',
      value: state.playerName,
      oninput: handleNameInput,
      onkeydown: (e) => {
        if (e.key === KEYS.ENTER) handleStart();
      }
    }),
    showNameError
      ? h('p', { class: 'mt-3 text-xs font-bold text-rose-300 text-left' }, nameError)
      : h('p', { class: 'mt-3 text-[10px] text-slate-500 text-left uppercase tracking-[0.2em]' },
        `${TEXT.landing.allowedNameChars} ${TEXT.landing.nameRules(PLAYER_NAME_MIN_LEN, PLAYER_NAME_MAX_LEN)}`),
    h('button', {
      class: `mt-6 w-full sm:w-auto px-10 sm:px-16 py-5 sm:py-6 rounded-3xl font-black text-white transition-all shadow-2xl uppercase tracking-[0.2em] text-xs ${canStart ? 'bg-emerald-500 hover:scale-105 active:scale-95 shadow-emerald-500/40' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`,
      disabled: !canStart,
      onclick: handleStart
    }, TEXT.landing.startButton)
  );
}