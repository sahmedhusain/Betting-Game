import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, UI_CONFIG } from '../../utils/constants.js';

export function DrawLane({ state }) {
  const previewCount = Math.min(UI_CONFIG.DRAW_LANE_PREVIEW_MAX, state.drawPileCount);

  return h(
    'div',
    {
      class: `glass-panel p-4 rounded-2xl h-full ${UI_CONFIG.DRAW_LANE_MIN_HEIGHT_CLASS} flex flex-col items-center justify-between relative overflow-hidden`,
    },
    h('p', { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-slate-500' }, TEXT.game.drawLane),
    h(
      'div',
      { class: 'relative w-full flex-1 flex items-center justify-center' },
      previewCount > 0
        ? Array.from({ length: previewCount }).map((_, i) =>
          h('div', { class: `absolute draw-preview-card draw-preview-card-${i + 1}` })
        )
        : h('p', { class: 'text-xs font-bold uppercase tracking-widest text-slate-600' }, TEXT.game.deckEmpty)
    ),
    h('p', { class: 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-500' }, `${TEXT.game.cards}: ${state.drawPileCount}`)
  );
}