import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS } from '../../utils/constants.js';
import { TileRenderer } from './TileRenderer.js';

export function RulesModal({ onClose }) {

  const honorTiles = [
    { type: 'WIND', name: 'EAST', value: 5, label: TEXT.rules.winds },
    { type: 'DRAGON', name: 'RED', value: 5, label: TEXT.rules.dragons },
    { type: 'WIND', name: 'WEST', value: 5, label: TEXT.rules.winds }
  ];

  const suitTiles = [
    { type: 'NUMBER', suit: 'BAMBOO', faceValue: 1, label: TEXT.rules.bamboo },
    { type: 'NUMBER', suit: 'CHARACTERS', faceValue: 7, label: TEXT.rules.characters },
    { type: 'NUMBER', suit: 'DOTS', faceValue: 5, label: TEXT.rules.dots }
  ];

  const keyboardControls = [
    { icon: ASSETS.ICONS.KEY_H, action: TEXT.game.betHigherAction, desc: TEXT.game.keyboardH },
    { icon: ASSETS.ICONS.KEY_L, action: TEXT.game.betLowerAction, desc: TEXT.game.keyboardL },
    { icon: ASSETS.ICONS.ENTER, action: TEXT.game.confirmAction, desc: TEXT.game.keyboardEnter }
  ];

  const RuleSection = (title, items) => h('div', { class: 'flex flex-col gap-8' },
    h('h4', { class: 'text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/50' }, title),
    h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
      items.map(item => h('div', { class: 'p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-all' },
        h('h5', { class: 'text-xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors' }, item.t),
        h('p', { class: 'text-sm text-slate-400 leading-relaxed' }, item.d)
      ))
    )
  );

  const TileInfoCard = (tile, value) => h('div', {
    class: 'flex flex-col items-center p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group'
  },
    h('div', { class: 'scale-90 mb-4 transition-transform group-hover:scale-100 duration-500' },
      TileRenderer({ tile, compact: true })
    ),
    h('div', { class: 'flex flex-col items-center gap-1' },
      h('span', { class: 'text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]' }, tile.label || tile.suit || tile.type),
      h('div', { class: 'flex items-baseline gap-1 mt-1' },
        h('span', { class: 'text-2xl font-black text-white font-outfit' }, value),
        h('span', { class: 'text-[9px] font-black text-emerald-500 uppercase tracking-widest' }, TEXT.rules.pointsLabel)
      )
    )
  );

  return h(
    'div',
    {
      class: 'fixed inset-0 z-[100000] flex items-center justify-center p-3 md:p-8 animate-fade-in',
      onclick: (e) => e.target === e.currentTarget && onClose()
    },

    h('div', { class: 'absolute inset-0 backdrop-blur-3xl' }),

    h(
      'div',
      {
        class: 'relative w-full max-w-4xl lg:max-w-6xl h-[95vh] lg:h-auto lg:max-h-[92vh] bg-[#020617] border border-white/10 rounded-[2.5rem] lg:rounded-[3.5rem] flex flex-col lg:flex-row overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] animate-modal-enter'
      },

      h('div', { class: 'hidden lg:flex w-80 bg-white/[0.02] border-r border-white/5 flex-col p-12 shrink-0' },
        h('div', { class: 'flex flex-col items-start gap-8' },
          h('div', { class: 'w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden' },
            h('img', { src: ASSETS.BRANDING.LOGO, alt: TEXT.landing.logoAlt, class: 'w-full h-full object-cover' })
          ),
          h('div', { class: 'flex flex-col items-start' },
            h('h1', { class: 'text-3xl font-black tracking-tighter text-white leading-none font-outfit' }, TEXT.landing.branding),
            h('p', { class: 'text-[10px] font-bold tracking-[0.4em] text-emerald-500 uppercase mt-4 text-left' }, TEXT.landing.logoSubtitle)
          )
        )
      ),

      h('div', { class: 'flex-1 flex flex-col min-w-0 overflow-hidden bg-black/20' },

        h('div', { class: 'p-6 lg:p-12 pb-4 lg:pb-6 flex items-center justify-between' },
          h('div', { class: 'flex flex-col' },
            h('h2', { class: 'text-2xl lg:text-4xl font-black text-white tracking-tight' }, TEXT.rules.guideTitle),
            h('div', { class: 'flex items-center gap-3 mt-2 lg:mt-3' },
              h('div', { class: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
              h('span', { class: 'text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]' }, TEXT.rules.protocolLabel)
            )
          ),
          h('button', {
            class: 'w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90',
            onclick: onClose
          }, '✕')
        ),

        h('div', { class: 'flex-1 overflow-y-auto p-6 lg:p-12 pt-4 lg:pt-6 no-scrollbar flex flex-col gap-10 lg:gap-16' },

          RuleSection(TEXT.rules.sections.core, TEXT.rules.mechanics),

          h('div', { class: 'flex flex-col gap-8' },
            h('h4', { class: 'text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/50' }, TEXT.rules.sections.registry),

            h('div', { class: 'flex flex-col gap-6' },
              h('div', { class: 'flex items-center gap-4' },
                h('span', { class: 'text-[9px] font-black text-slate-600 uppercase tracking-widest' }, TEXT.rules.honorTiles),
                h('div', { class: 'h-px flex-1 bg-white/5' })
              ),
              h('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6' },
                honorTiles.map(t => TileInfoCard(t, t.value))
              )
            ),

            h('div', { class: 'flex flex-col gap-6' },
              h('div', { class: 'flex items-center gap-4' },
                h('span', { class: 'text-[9px] font-black text-slate-600 uppercase tracking-widest' }, TEXT.rules.suitSeries),
                h('div', { class: 'h-px flex-1 bg-white/5' })
              ),
              h('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6' },
                suitTiles.map(t => TileInfoCard(t, t.faceValue))
              )
            )
          ),

          RuleSection(TEXT.rules.sections.valuation, TEXT.rules.dynamicScaling),

          RuleSection(TEXT.rules.sections.termination, TEXT.rules.termination),

          h('div', { class: 'flex flex-col gap-8 mb-8' },
            h('h4', { class: 'text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/50' }, TEXT.rules.sections.inputs),
            h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
              keyboardControls.map(ctrl => h('div', { class: 'flex items-center gap-6 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5' },
                h('div', { class: 'w-16 h-16 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl' },
                  h('img', { src: ctrl.icon, class: 'w-7 h-7 invert opacity-80', alt: ctrl.action })
                ),
                h('div', { class: 'flex flex-col' },
                  h('span', { class: 'text-[13px] font-black text-white uppercase' }, ctrl.action),
                  h('span', { class: 'text-[9px] text-slate-500 uppercase tracking-widest mt-1' }, ctrl.desc)
                )
              ))
            )
          )
        ),

        h('div', { class: 'p-6 lg:p-12 pt-6 lg:pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between bg-black/40 gap-4' },
          h('p', { class: 'text-[8px] lg:text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] text-center lg:text-left' }, TEXT.rules.systemReady),
          h('button', {
            class: 'w-full lg:w-auto px-10 lg:px-14 py-4 rounded-2xl lg:rounded-3xl bg-emerald-500 text-white font-black text-[10px] lg:text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20',
            onclick: onClose
          }, TEXT.rules.gotIt)
        )
      )
    )
  );
}
