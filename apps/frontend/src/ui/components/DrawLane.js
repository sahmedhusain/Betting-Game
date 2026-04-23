import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, UI_CONFIG, GAME_CONFIG } from '../../utils/constants.js';

/**
 * DrawLane - Displays draw pile with preview cards and reshuffle animation support
 * Shows animated warning when pile is running low
 *
 * @param {Object} props
 * @param {Object} props.state - Game state with drawPileCount, etc
 * @param {boolean} props.isReshuffling - Trigger reshuffle animation
 */
export function DrawLane({ state, isReshuffling = false }) {
  const previewCount = Math.min(UI_CONFIG.DRAW_LANE_PREVIEW_MAX, state.drawPileCount);
  const isLowPile = state.drawPileCount <= 5;
  const isEmptyPile = state.drawPileCount === 0;

  const reshuffleClass = isReshuffling ? 'animate-pile-shrink' : '';
  const lowPileClass = isLowPile && !isEmptyPile ? 'ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/20' : '';

  return h(
    'div',
    {
      class: `glass-panel p-4 rounded-2xl h-full ${UI_CONFIG.DRAW_LANE_MIN_HEIGHT_CLASS} flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300 ${lowPileClass}`,
    },

    // Title
    h('p', { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-slate-500' }, TEXT.game.drawLane),

    // Preview Cards Area
    h(
      'div',
      { class: `relative w-full flex-1 flex items-center justify-center ${reshuffleClass}` },
      previewCount > 0
        ? Array.from({ length: previewCount }).map((_, i) => {
          const animClass = isReshuffling
            ? `animate-card-reshuffle-out animate-distribute-delay-${i + 1}`
            : '';

          return h('div', {
            class: `absolute draw-preview-card draw-preview-card-${i + 1} ${animClass}`,
            style: {
              animationFillMode: 'forwards',
            }
          });
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

    // Card Count Display
    h(
      'div',
      { class: 'flex items-center gap-2' },
      h('p', { class: 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-500' }, `${TEXT.game.cards}:`),
      h('span', {
        class: `text-sm font-black text-emerald-400 animate-count-update ${isLowPile ? 'text-amber-500' : ''}`
      }, state.drawPileCount)
    )
  );
}