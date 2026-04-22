import { createElement as h } from '../../picojs/framework/core.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';

function DrawLane({ state }) {
  const previewCount = Math.min(5, state.drawPileCount);

  return h(
    'div',
    {
      class:
        'glass-panel p-4 rounded-2xl h-full min-h-[180px] flex flex-col items-center justify-between relative overflow-hidden'
    },
    h(
      'p',
      { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-slate-500' },
      'Draw Lane'
    ),

    h(
      'div',
      { class: 'relative w-full flex-1 flex items-center justify-center' },
      previewCount > 0
        ? Array.from({ length: previewCount }).map((_, i) =>
          h('div', {
            class: `absolute draw-preview-card draw-preview-card-${i + 1}`
          })
        )
        : h(
          'p',
          { class: 'text-xs font-bold uppercase tracking-widest text-slate-600' },
          'Deck Empty'
        )
    ),

    h(
      'p',
      { class: 'text-[10px] font-black uppercase tracking-[0.2em] text-slate-500' },
      `Cards: ${state.drawPileCount}`
    )
  );
}

export function GameView({ state, engine }) {
  return h(
    'div',
    {
      class:
        'w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 animate-fade-in px-2 sm:px-0'
    },

    // Main Game Area
    h(
      'div',
      { class: 'xl:col-span-8 space-y-6 md:space-y-8' },
      ScoreBoard({ state, engine }),

      h(
        'div',
        { class: 'grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-4 md:gap-6 items-stretch' },
        DrawLane({ state }),
        HandDisplay({ tiles: state.currentHand })
      ),

      h(
        'div',
        {
          class:
            'flex flex-wrap justify-center gap-4 md:gap-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'
        },
        h('span', {}, `Draw Pile: ${state.drawPileCount}`),
        h('span', {}, `Discarded: ${state.discardPileCount}`),
        h('span', {}, `Reshuffles: ${state.reshuffleCount}/3`)
      )
    ),

    // History Sidebar
    h(
      'div',
      { class: 'xl:col-span-4' },
      h(
        'div',
        {
          class:
            'glass-panel p-8 rounded-[2.5rem] h-[640px] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden'
        },
        HistoryPanel({ history: state.history })
      )
    )
  );
}