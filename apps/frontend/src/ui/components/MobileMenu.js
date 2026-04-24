import { createElement as h } from '../../picojs/framework/core.js';
import { ASSETS, TEXT } from '../../utils/constants.js';


export function MobileMenu({
  isOpen,
  onClose,
  playerName,
  highestScore,
  rankBadge,
  onRulesClick,
  onLogoutClick
}) {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  if (!isOpen) return null;

  const MenuItem = ({ label, icon, onClick, colorClass = 'text-white' }) => h('button', {
    class: `w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 group`,
    onclick: () => {
      onClose();
      onClick();
    }
  },
    h('div', { class: 'flex items-center gap-4' },
      h('div', { class: 'w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center border border-white/5 shadow-inner' },
        h('div', {
          class: `w-5 h-5 bg-current opacity-60 group-hover:opacity-100 transition-opacity ${colorClass}`,
          style: `-webkit-mask: url("${icon}") no-repeat center / contain; mask: url("${icon}") no-repeat center / contain;`
        })
      ),
      h('span', { class: 'text-sm font-black uppercase tracking-widest text-slate-300 group-hover:text-white' }, label)
    )
  );

  return h('div', {
    class: 'fixed inset-0 z-[200] bg-[#020617] lg:hidden animate-fade-in flex flex-col',
    key: 'mobile-menu-modal'
  },
    h('div', { class: 'absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none' }),
    h('div', { class: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] pointer-events-none' }),
    h('div', { class: 'absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full pointer-events-none' }),

    h('div', { class: 'relative flex items-center justify-between p-8 border-b border-white/5 shrink-0 backdrop-blur-md bg-white/[0.02]' },
      h('div', { class: 'flex flex-col' },
        h('span', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-1' }, TEXT.menu.systemNavigation),
        h('h2', { class: 'text-2xl font-black text-white tracking-tight font-outfit uppercase' }, playerName || TEXT.game.anonymousPlayer)
      ),
      h('button', {
        class: 'w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all hover:bg-white/10 hover:border-white/20 shadow-xl',
        onclick: onClose
      }, '✕')
    ),

    h('div', { class: 'relative flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12' },
      h('div', { class: 'flex flex-col gap-4' },
        h('div', { class: 'relative group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 shadow-2xl overflow-hidden' },
          h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent' }),
          h('div', { class: 'relative flex items-center justify-between' },
            h('div', { class: 'flex flex-col' },
              h('span', { class: 'text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1' }, TEXT.menu.currentStanding),
              h('span', { class: 'text-3xl font-black text-white font-outfit' }, highestScore.toLocaleString())
            ),
            h('div', { class: 'scale-110 pr-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]' }, rankBadge)
          )
        )
      ),

      h('div', { class: 'flex flex-col gap-4' },
        h('p', { class: 'text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2 px-2' }, TEXT.menu.controls),

        MenuItem({
          label: TEXT.menu.howToPlay,
          icon: ASSETS.ICONS.INFO,
          onClick: onRulesClick,
          colorClass: 'text-emerald-400'
        }),

        MenuItem({
          label: TEXT.game.leaveGame,
          icon: ASSETS.ICONS.LEAVE,
          onClick: onLogoutClick,
          colorClass: 'text-rose-500'
        })
      )
    ),

    h('div', { class: 'relative p-8 text-center shrink-0 border-t border-white/5 bg-black/40 backdrop-blur-md' },
      h('p', { class: 'text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]' }, TEXT.landing.logoSubtitle)
    )
  );
}
