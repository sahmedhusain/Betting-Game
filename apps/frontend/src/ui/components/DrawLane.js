import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS, UI_CONFIG } from '../../utils/constants.js';

/**
 * @param {Object} props
 * @param {Object} props.state
 * @param {boolean} props.isDistributing
 */
export function DrawLane({ state, isDistributing = false }) {
  const isReshuffling = !!state.isReshuffling;
  const previewCount = Math.min(UI_CONFIG.DRAW_LANE_PREVIEW_MAX, state.drawPileCount);
  const isLowPile = state.drawPileCount <= 5;
  const isEmptyPile = state.drawPileCount === 0;

  const pileAnimClass = isReshuffling
    ? 'animate-pile-reshuffle'
    : (isDistributing ? 'animate-pile-shake' : '');

  const lowPileClass = isLowPile && !isEmptyPile ? 'ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20' : '';

  return h(
    'div',
    {
      class: `glass-panel p-[max(0.75rem,1.1vw)] rounded-[var(--play-panel-radius)] h-full ${UI_CONFIG.DRAW_LANE_MIN_HEIGHT_CLASS} flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300 ${lowPileClass}`,
    },

    h('p', { class: 'text-[10px] md:text-[11px] font-black uppercase tracking-[0.26em] text-slate-500 text-center z-10' }, TEXT.game.drawLaneWithCount(state.drawPileCount)),

    h(
      'div',
      { class: 'relative w-full flex-1 flex items-center justify-center' },
      previewCount > 0
        ? Array.from({ length: previewCount }).map((_, i) => {
          const offset = i * 1.5;

          return h(
            'div',
            {
              class: `absolute w-[var(--play-tile-w)] h-[var(--play-tile-h)] ${pileAnimClass} rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden bg-[#f8fafc]`,
              style: {
                transform: `translate(${offset}px, -${offset}px)`,
                zIndex: previewCount - i,
                animationDelay: isReshuffling ? `${i * 100}ms` : `${i * 30}ms`,
                animationFillMode: 'forwards',
              }
            },

            h('div', { class: 'absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none' }),

            h('img', {
              src: ASSETS.TILES.BACK,
              alt: TEXT.game.cardBackAlt,
              class: 'w-full h-full object-cover'
            }),

            h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60' })
          );
        })
        : h('div', { class: 'flex flex-col items-center gap-2 z-10' },
          h('p', { class: 'text-xs font-bold uppercase tracking-widest text-slate-600' }, TEXT.game.deckEmpty),
          (isLowPile || isReshuffling) && h(
            'div',
            { class: 'text-[10px] font-black text-amber-500 animate-pulse-slow' },
            isReshuffling ? TEXT.game.reshuffling : TEXT.game.reloading
          )
        )
    ),

    (isDistributing || isReshuffling) && h('div', { class: 'w-full flex items-center justify-center gap-2 py-4 border-t border-white/5 animate-fade-in z-10' },
      h('div', { class: `w-1.5 h-1.5 rounded-full ${isReshuffling ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse` }),
      h('p', { class: `text-[9px] font-black uppercase tracking-[0.2em] ${isReshuffling ? 'text-amber-500' : 'text-emerald-400'}` },
        isReshuffling ? TEXT.game.resolvingDeck : TEXT.game.resolvingHand
      )
    )
  );
}
