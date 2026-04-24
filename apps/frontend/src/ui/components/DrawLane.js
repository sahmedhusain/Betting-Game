import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ASSETS, UI_CONFIG } from '../../utils/constants.js';

/**
 * @param {Object} props
 * @param {Object} props.state
 * @param {boolean} props.isDistributing
 */
export function DrawLane({ state, isDistributing = false }) {
  const previewCount = Math.min(UI_CONFIG.DRAW_LANE_PREVIEW_MAX, state.drawPileCount);
  const isLowPile = state.drawPileCount <= 5;
  const isEmptyPile = state.drawPileCount === 0;

  const distributingClass = isDistributing ? 'animate-pile-shrink' : '';
  const lowPileClass = isLowPile && !isEmptyPile ? 'ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20' : '';

  return h(
    'div',
    {
      class: `glass-panel p-[max(0.75rem,1.1vw)] rounded-[var(--play-panel-radius)] h-full ${UI_CONFIG.DRAW_LANE_MIN_HEIGHT_CLASS} flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300 ${lowPileClass}`,
    },

    h('p', { class: 'text-[10px] md:text-[11px] font-black uppercase tracking-[0.26em] text-slate-500 text-center' }, TEXT.game.drawLaneWithCount(state.drawPileCount)),

    h(
      'div',
      { class: `relative w-full flex-1 flex items-center justify-center ${distributingClass}` },
      previewCount > 0
        ? Array.from({ length: previewCount }).map((_, i) => {
          const animClass = isDistributing
            ? `animate-card-reshuffle-out animate-distribute-delay-${i + 1}`
            : '';

          return h(
            'div',
            {
              class: `absolute draw-preview-card draw-preview-card-${i + 1} ${animClass} flex items-center justify-center overflow-hidden`,
              style: {
                animationFillMode: 'forwards',
              }
            },
            h('img', { 
              src: ASSETS.TILES.BACK,
              alt: 'Card Back',
              class: 'w-full h-full object-cover rounded-[0.82rem]'
            })
          );
        })
        : h('div', { class: 'flex flex-col items-center gap-2' },
          h('p', { class: 'text-xs font-bold uppercase tracking-widest text-slate-600' }, TEXT.game.deckEmpty),
          isLowPile && h(
            'div',
            { class: 'text-[10px] font-black text-amber-500 animate-pulse-slow' },
            TEXT.game.reshuffles ? '↻ Reshuffling...' : ''
          )
        )
    ),

    isDistributing && h('div', { class: 'w-full flex items-center justify-center gap-2 py-2 border-t border-white/5 animate-fade-in' },
      h('div', { class: 'w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse' }),
      h('p', { class: 'text-[9px] font-black uppercase tracking-[0.2em] text-amber-500/80' }, TEXT.game.resolvingHand)
    )
  );
}
