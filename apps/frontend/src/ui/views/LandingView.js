import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { TEXT, UI_CONFIG, ASSETS } from '../../utils/constants.js';
import { LandingNameForm } from '../components/LandingNameForm.js';
import { LandingHallPanel } from '../components/LandingHallPanel.js';
import { RulesModal } from '../components/RulesModal.js';

export function LandingView({ state, engine }) {
  const topScores = state.leaderboard || [];
  const { showJoinForm } = state;

  const handlePlayNow = () => {
    store.setState({ showJoinForm: true, hasAttemptedStart: false });
  };

  const handleOpenRules = () => {
    store.setState({ isRulesOpen: true });
  };

  const IconWrapper = (src, size = 'w-6 h-6') => h('span', {
    class: `inline-block ${size} bg-current transition-all duration-300`,
    style: `-webkit-mask: url("${src}") no-repeat center / contain; mask: url("${src}") no-repeat center / contain;`
  });

  const Leaderboard = (isMobile) => h('div', {
    class: `${isMobile ? 'lg:hidden mb-12' : 'hidden lg:block lg:col-span-5'} w-full h-full`
  },
    h('div', { class: 'lg:sticky lg:top-0 h-full lg:overflow-y-auto no-scrollbar pr-2' },
      LandingHallPanel({ scores: topScores })
    )
  );

  return h('div', { class: 'relative w-full h-screen overflow-hidden xl:overflow-hidden overflow-y-auto no-scrollbar flex flex-col' },
    h('div', { class: 'w-full max-w-7xl mx-auto px-6 pt-10 pb-20 md:pt-24 md:pb-32 xl:h-[90vh] xl:max-h-[800px] flex flex-col animate-fade-in flex-1' },
      h('div', { class: 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start h-full' },

        h('div', { class: 'lg:col-span-7 flex flex-col h-full' },

          h('div', { class: 'flex flex-col items-start mb-10 shrink-0' },
            h('div', { class: 'flex items-center gap-5 mb-10 group cursor-default' },
              h('div', { class: 'w-14 h-14 flex items-center justify-center group-hover:rotate-12 transition-transform' },
                h('img', {
                  src: ASSETS.BRANDING.LOGO,
                  alt: TEXT.landing.logoAlt,
                  class: 'w-full h-full drop-shadow-2xl'
                })
              ),
              h('div', { class: 'flex flex-col' },
                h('span', { class: 'text-2xl font-black tracking-tighter text-white leading-none' }, TEXT.landing.branding),
                h('span', { class: 'text-[9px] font-bold tracking-[0.3em] text-emerald-500 uppercase mt-1' },
                  h('span', { class: 'hidden lg:inline' }, TEXT.landing.logoSubtitle),
                  h('span', { class: 'lg:hidden inline' }, TEXT.landing.logoSubtitleShort)
                )
              )
            ),
            h('h1', { class: 'text-5xl sm:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-none whitespace-pre-line text-white mb-6' }, TEXT.landing.title),
            h('div', { class: 'flex items-center gap-4 mb-6' },
              h('p', { class: 'text-slate-400 text-lg lg:text-xl max-w-xl leading-relaxed' }, TEXT.landing.subtitle),
              state.backendDown && h('div', { class: 'px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse' }, TEXT.landing.serverOffline)
            )
          ),

          Leaderboard(true),

          h('div', { class: 'relative min-h-[400px] flex-1' },
            !showJoinForm ? (
              h('div', { class: 'animate-slide-up w-full relative' },
                h('div', { class: 'flex flex-wrap items-center gap-4' },
                  h('button', {
                    class: 'group flex items-center gap-6 px-10 py-6 bg-emerald-500 hover:bg-emerald-400 rounded-3xl font-black text-white transition-all shadow-2xl shadow-emerald-500/20 active:scale-95',
                    onclick: handlePlayNow
                  },
                    h('span', { class: 'uppercase tracking-[0.2em] text-sm' }, TEXT.landing.playNow),
                    h('div', { class: 'w-8 h-[1px] bg-white/50 group-hover:w-12 transition-all' })
                  ),

                  h('button', {
                    class: 'group flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-all active:scale-95 px-4 py-2',
                    onclick: handleOpenRules
                  },
                    IconWrapper(ASSETS.ICONS.INFO, 'w-3.5 h-3.5'),
                    h('span', {}, TEXT.landing.rulesTitle || 'How to Play')
                  )
                )
              )
            ) : (
              h('div', { class: 'animate-slide-up w-full relative' },
                h('div', { class: 'flex items-center gap-4 mb-8' },
                  h('button', {
                    class: 'group flex items-center gap-2 text-slate-500 hover:text-white transition-colors group',
                    onclick: () => store.setState({ showJoinForm: false })
                  },
                    h('div', { class: 'w-6 h-6 flex items-center justify-center rounded-full border border-slate-700 group-hover:border-white transition-colors text-xs' }, UI_CONFIG.SYMBOLS.ARROW_LEFT),
                    h('span', { class: 'text-[9px] font-black uppercase tracking-[0.2em]' }, TEXT.landing.goBack)
                  ),
                  h('div', { class: 'h-[1px] w-12 bg-white/10' }),
                  h('span', { class: 'text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500' }, TEXT.landing.registration)
                ),
                LandingNameForm({ state, engine })
              )
            )
          )
        ),

        Leaderboard(false)
      )
    ),
    state.isRulesOpen ? RulesModal({
      onClose: () => store.setState({ isRulesOpen: false })
    }) : null
  );
}