import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS, KEYS } from '../../utils/constants.js';
import { TileRenderer } from './TileRenderer.js';

export function RulesModal({ onClose }) {

  const honorTiles = [
    { type: 'WIND', name: 'EAST', value: 10, label: 'Winds' },
    { type: 'DRAGON', name: 'RED', value: 10, label: 'Dragons' },
    { type: 'FLOWER', name: 'PLUM', value: 20, label: 'Flowers / Seasons' }
  ];

  const suitTiles = [
    { type: 'NUMBER', suit: 'BAMBOO', faceValue: 1, label: 'Bamboo' },
    { type: 'NUMBER', suit: 'CHARACTERS', faceValue: 7, label: 'Characters' },
    { type: 'NUMBER', suit: 'DOTS', faceValue: 5, label: 'Dots' }
  ];

  const keyboardControls = [
    { icon: ASSETS.ICONS.KEY_H, action: 'Bet Higher', desc: 'KEYBOARD: H' },
    { icon: ASSETS.ICONS.KEY_L, action: 'Bet Lower', desc: 'KEYBOARD: L' },
    { icon: ASSETS.ICONS.ENTER, action: 'Confirm', desc: 'KEYBOARD: ENTER' }
  ];

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
        h('span', { class: 'text-[9px] font-black text-emerald-500 uppercase tracking-widest' }, 'Points')
      )
    )
  );

  return h(
    'div',
    {
      class: 'fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-8 animate-fade-in',
      onclick: (e) => e.target === e.currentTarget && onClose()
    },
    
    // Deep Cinematic Backdrop
    h('div', { class: 'absolute inset-0 backdrop-blur-3xl' }),

    // Modal Architecture
    h(
      'div',
      {
        class: 'relative w-full max-w-6xl h-full max-h-[92vh] bg-[#020617] border border-white/10 rounded-[3.5rem] flex flex-col md:flex-row overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] animate-modal-enter'
      },
      
      // Sidebar Branding (Left)
      h('div', { class: 'w-full md:w-80 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-12 shrink-0' },
        h('div', { class: 'flex flex-col items-center md:items-start gap-8' },
          h('div', { class: 'w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden' },
            h('img', { src: ASSETS.BRANDING.LOGO, alt: 'Logo', class: 'w-full h-full object-cover' })
          ),
          h('div', { class: 'flex flex-col items-center md:items-start' },
            h('h1', { class: 'text-3xl font-black tracking-tighter text-white leading-none font-outfit' }, TEXT.landing.branding),
            h('p', { class: 'text-[10px] font-bold tracking-[0.4em] text-emerald-500 uppercase mt-4 text-center md:text-left' }, TEXT.landing.logoSubtitle)
          )
        )
      ),

      // Main Content Area
      h('div', { class: 'flex-1 flex flex-col min-w-0 overflow-hidden bg-black/20' },
        
        // Header
        h('div', { class: 'p-12 pb-6 flex items-center justify-between' },
          h('div', { class: 'flex flex-col' },
            h('h2', { class: 'text-4xl font-black text-white tracking-tight' }, 'Strategic Guide'),
            h('div', { class: 'flex items-center gap-3 mt-3' },
              h('div', { class: 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' }),
              h('span', { class: 'text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]' }, 'Protocol & Operations')
            )
          ),
          h('button', {
            class: 'w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90',
            onclick: onClose
          }, '✕')
        ),

        // Scrollable Content
        h('div', { class: 'flex-1 overflow-y-auto p-12 pt-6 custom-scrollbar flex flex-col gap-16' },
          
          // Section 1: mechanics
          h('div', { class: 'flex flex-col gap-8' },
            h('h4', { class: 'text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/50' }, 'SYSTEM_CORE // 01'),
            h('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
              [
                { t: 'Analysis', d: 'The sum of all 5 tiles in your hand determines your Current Score.' },
                { t: 'Prediction', d: 'Forecast if the next hand value will exceed or fall below your current total.' },
                { t: 'Resolution', d: 'Correct forecasts award bankroll. Failed attempts trigger penalties.' }
              ].map((item, i) => h('div', { class: 'p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5' },
                h('h5', { class: 'text-xl font-black text-white mb-3' }, item.t),
                h('p', { class: 'text-sm text-slate-400 leading-relaxed' }, item.d)
              ))
            )
          ),

          // Section 2: Tile Values
          h('div', { class: 'flex flex-col gap-8' },
            h('h4', { class: 'text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/50' }, 'TILE_REGISTRY // 02'),
            
            // Tier 1: Honors
            h('div', { class: 'flex flex-col gap-6' },
              h('div', { class: 'flex items-center gap-4' },
                h('span', { class: 'text-[9px] font-black text-slate-600 uppercase tracking-widest' }, 'Honor Tiles'),
                h('div', { class: 'h-px flex-1 bg-white/5' })
              ),
              h('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6' },
                honorTiles.map(t => TileInfoCard(t, t.value))
              )
            ),

            // Tier 2: Suits
            h('div', { class: 'flex flex-col gap-6' },
              h('div', { class: 'flex items-center gap-4' },
                h('span', { class: 'text-[9px] font-black text-slate-600 uppercase tracking-widest' }, 'Suit Series'),
                h('div', { class: 'h-px flex-1 bg-white/5' })
              ),
              h('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6' },
                suitTiles.map(t => TileInfoCard(t, t.faceValue))
              )
            )
          ),

          // Section 3: Keyboard Controls (H/L KEYS)
          h('div', { class: 'flex flex-col gap-8 mb-8' },
            h('h4', { class: 'text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/50' }, 'INPUT_MATRIX // 03'),
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

        // Footer
        h('div', { class: 'p-12 pt-8 border-t border-white/5 flex items-center justify-between bg-black/40' },
          h('p', { class: 'text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]' }, 'System ready for strategic engagement'),
          h('button', {
            class: 'px-14 py-4 rounded-3xl bg-emerald-500 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20',
            onclick: onClose
          }, 'Got It')
        )
      )
    )
  );
}
