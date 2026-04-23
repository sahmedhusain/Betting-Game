import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { TEXT, UI_CONFIG } from '../../utils/constants.js';
import { LandingNameForm } from '../components/LandingNameForm.js';
import { LandingHallPanel } from '../components/LandingHallPanel.js';

export function LandingView({ state, engine }) {
  const topScores = state.leaderboard || [];
  const { showJoinForm } = state;

  const handlePlayNow = () => {
    store.setState({ showJoinForm: true, hasAttemptedStart: false });
  };

  return h('div', { class: 'w-full max-w-7xl mx-auto px-6 py-8 md:py-12 lg:h-[90vh] lg:max-h-[800px] flex flex-col justify-center animate-fade-in' },
    h('div', { class: 'grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start h-full' },
      // Left: Content Column
      h('div', { class: 'lg:col-span-7 flex flex-col h-full' },
        // Persistent Header (Logo + Title)
        h('div', { class: 'flex flex-col items-start mb-10 shrink-0' },
          // Branding
          h('div', { class: 'flex items-center gap-4 mb-8 group cursor-default' },
            h('div', { class: 'w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform' },
              h('div', { class: 'w-5 h-7 border-2 border-white rounded-sm relative' },
                h('div', { class: 'absolute top-1 left-1 w-1 h-1 bg-white rounded-full' }),
                h('div', { class: 'absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full' })
              )
            ),
            h('div', { class: 'flex flex-col' },
              h('span', { class: 'text-base font-black tracking-tighter text-white leading-none' }, TEXT.landing.branding),
              h('span', { class: 'text-[9px] font-bold tracking-[0.3em] text-emerald-500 uppercase' }, TEXT.landing.logoSubtitle)
            )
          ),
          // Persistent Title
          h('h1', { class: 'text-5xl sm:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-none whitespace-pre-line text-white mb-6' }, TEXT.landing.title),
          h('p', { class: 'text-slate-400 text-lg lg:text-xl max-w-xl leading-relaxed' }, TEXT.landing.subtitle)
        ),

        // Interactive Section - Stable Height
        h('div', { class: 'relative min-h-[400px] flex-1' },
          !showJoinForm ? (
            h('div', { class: 'animate-slide-up w-full absolute top-0 left-0' },
              // Rules Panel
              h('div', { class: 'glass-panel p-8 rounded-[2rem] mb-10 w-full max-w-lg border border-white/5' },
                h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6' }, TEXT.landing.rulesTitle),
                h('ul', { class: 'space-y-4' },
                  TEXT.landing.rules.map(rule =>
                    h('li', { class: 'flex items-center gap-4 text-slate-300' },
                      h('div', { class: 'w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50' }),
                      h('span', { class: 'text-sm font-medium' }, rule)
                    )
                  )
                )
              ),

              h('button', {
                class: 'group flex items-center gap-6 px-10 py-6 bg-emerald-500 hover:bg-emerald-400 rounded-3xl font-black text-white transition-all shadow-2xl shadow-emerald-500/20 active:scale-95',
                onclick: handlePlayNow
              },
                h('span', { class: 'uppercase tracking-[0.2em] text-sm' }, TEXT.landing.playNow),
                h('div', { class: 'w-8 h-[1px] bg-white/50 group-hover:w-12 transition-all' })
              )
            )
          ) : (
            h('div', { class: 'animate-slide-up w-full absolute top-0 left-0' },
              h('div', { class: 'flex items-center gap-4 mb-8' },
                h('button', {
                  class: 'flex items-center gap-2 text-slate-500 hover:text-white transition-colors group',
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

      // Right: Leaderboard Container
      h('div', { class: 'lg:col-span-5 w-full h-full' },
        h('div', { class: 'lg:sticky lg:top-0 h-full lg:overflow-y-auto custom-scrollbar pr-2' },
          LandingHallPanel({ scores: topScores })
        )
      )
    )
  );
}