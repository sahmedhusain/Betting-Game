import { createElement as h } from '../../picojs/framework/core.js';
import { ASSETS, TEXT } from '../../utils/constants.js';

export function GlobalTopBar({ playerName, highestScore, rankBadge, onRulesClick, onLogoutClick, isMenuOpen, onMenuToggle }) {
  return h('div', { class: 'sticky top-0 z-50 w-full bg-transparent py-4 md:py-0' },
    h('div', { class: 'relative flex items-center justify-between gap-6 px-2 md:px-4 shrink-0' },
      h('div', { class: 'flex items-center gap-8' },
        h('div', { class: 'flex items-center gap-4' },
          h('div', { class: 'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 shadow-2xl overflow-hidden' },
            h('img', {
              src: ASSETS.BRANDING.LOGO,
              alt: TEXT.landing.logoAlt,
              class: 'w-full h-full object-cover drop-shadow-xl'
            })
          ),
          h('div', { class: 'flex flex-col' },
            h('span', { class: 'text-sm md:text-base font-black tracking-tighter text-white leading-none' }, TEXT.landing.branding),
            h('span', { class: 'text-[8px] md:text-[9px] font-bold tracking-[0.3em] text-emerald-500 uppercase mt-1' },
              h('span', { class: 'hidden lg:inline' }, TEXT.landing.logoSubtitle),
              h('span', { class: 'lg:hidden inline' }, TEXT.landing.logoSubtitleShort)
            )
          )
        ),

        h('div', { class: 'hidden md:block w-[1px] h-10 bg-white/10' }),

        h('div', { class: 'hidden md:flex items-center gap-6' },
          h('div', { class: 'flex items-center gap-4' },
            h('span', { class: 'text-xl md:text-2xl font-black text-white tracking-tight font-outfit leading-none' }, playerName || TEXT.game.anonymousPlayer),

            h('div', { class: 'flex items-center gap-2' },
              highestScore > 0 && h('div', {
                class: 'flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-300 shadow-xl backdrop-blur-md transition-all'
              },
                h('div', { class: 'icon-star w-3.5 h-3.5' }),
                h('span', { class: 'text-[9px] font-black tracking-widest leading-none' }, highestScore.toLocaleString())
              ),

              rankBadge
            )
          )
        )
      ),

      h('div', { class: 'hidden md:flex items-center gap-8' },
        h('button', {
          class: 'group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-all active:scale-95 px-2 py-1',
          onclick: onRulesClick
        },
          h('span', {
            class: 'inline-block w-5 h-5 bg-current transition-all duration-300',
            style: `-webkit-mask: url("${ASSETS.ICONS.INFO}") no-repeat center / contain; mask: url("${ASSETS.ICONS.INFO}") no-repeat center / contain;`
          }),
          h('span', {}, TEXT.game.howToPlay)
        ),

        h('button', {
          class: 'group flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10 active:scale-95 relative overflow-hidden',
          title: TEXT.game.leaveGameTitle,
          onclick: onLogoutClick
        },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent' }),
          h('span', { class: 'text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block' },
            h('span', { class: 'hidden lg:inline' }, TEXT.game.leaveGame),
            h('span', { class: 'lg:hidden inline' }, TEXT.game.leaveGameShort)
          ),
          h('div', { class: 'w-5 h-5 flex items-center justify-center' },
            h('img', {
              src: ASSETS.ICONS.LEAVE,
              alt: TEXT.game.leaveGameTitle,
              class: 'w-full h-full opacity-80 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all'
            })
          )
        )
      ),

      h('button', {
        class: 'md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-all z-[110]',
        onclick: onMenuToggle
      },
        h('div', { class: `w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}` }),
        h('div', { class: `w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}` }),
        h('div', { class: `w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}` })
      )
    )
  );
}
