import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { ROUTES, TEXT, KEYS, UI_CONFIG } from '../../utils/constants.js';
import { PLAYER_NAME_MAX_LEN, PLAYER_NAME_MIN_LEN, normalizePlayerName, validatePlayerName } from '../../utils/helpers.js';

export function LandingNameForm({ state, engine }) {
  const normalizedName = normalizePlayerName(state.playerName);
  const nameError = validatePlayerName(normalizedName);
  const showNameError = state.hasAttemptedStart && nameError;
  const canStart = !nameError;

  const handleNameInput = (e) => {
    store.setState({ playerName: e.target.value.slice(0, PLAYER_NAME_MAX_LEN) });
  };

  const handleStart = async () => {
    store.setState({ hasAttemptedStart: true, sessionError: '' });

    if (!canStart) return;

    const success = await engine.startSession(normalizedName);
    if (success) {
      window.location.hash = ROUTES.PLAY;
      engine.startGame(normalizedName);
    }
  };

  const errorToShow = showNameError ? nameError : state.sessionError;
  const isBackendDown = state.backendDown;

  return h('div', { class: 'w-full max-w-md animate-fade-in', key: 'landing-form' },
    h('div', { class: 'relative mb-6' },
      h('p', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-3 ml-1' }, TEXT.landing.identifyPlayer),
      h('input', {
        type: 'text',
        placeholder: TEXT.landing.namePlaceholder,
        maxlength: PLAYER_NAME_MAX_LEN,
        spellcheck: false,
        autocomplete: 'off',
        'data-focuskey': 'player-name',
        class: 'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-left font-black tracking-widest text-white focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/10 text-lg',
        value: state.playerName,
        oninput: handleNameInput,
        onkeydown: (e) => {
          if (e.key === KEYS.ENTER) {
            e.preventDefault();
            e.stopPropagation();
            handleStart();
          }
        }
      })
    ),

    h('div', { class: 'min-h-[40px] mb-8' },
      isBackendDown
        ? h('p', { class: 'text-xs font-bold text-amber-400 flex items-center gap-2' },
          h('span', { class: 'w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50' }),
          TEXT.landing.serverUnavailable
        )
        : errorToShow
          ? h('p', { class: 'text-xs font-bold text-rose-400 flex items-center gap-2' },
            h('span', { class: 'w-1 h-1 rounded-full bg-rose-500' }),
            errorToShow
          )
          : h('p', { class: 'text-[10px] text-slate-500 uppercase tracking-[0.2em] leading-relaxed' },
            `${TEXT.landing.allowedNameChars} ${TEXT.landing.nameRules(PLAYER_NAME_MIN_LEN, PLAYER_NAME_MAX_LEN)}`)
    ),

    h('button', {
      class: `group relative overflow-hidden w-full sm:w-auto px-12 py-6 rounded-2xl font-black text-white transition-all shadow-2xl uppercase tracking-[0.2em] text-xs ${canStart ? 'bg-emerald-500 hover:bg-emerald-400 hover:scale-[1.02] active:scale-95 shadow-emerald-500/30' : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'}`,
      disabled: !canStart,
      onclick: handleStart
    },
      h('div', { class: 'relative z-10 flex items-center justify-center gap-3' },
        h('span', {}, TEXT.landing.startButton),
        canStart && h('span', { class: 'opacity-50 group-hover:translate-x-1 transition-transform' }, UI_CONFIG.SYMBOLS.ARROW_RIGHT)
      )
    )
  );
}