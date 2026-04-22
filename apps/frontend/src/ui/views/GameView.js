import { createElement as h } from '../../picojs/framework/core.js';
import { GAME_CONFIG, UI_CONFIG } from '../../utils/constants.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';
import { DrawLane } from '../components/DrawLane.js';

export function GameView({ state, engine }) {
  return h(
    'div',
    {
      class: 'w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 animate-fade-in px-2 sm:px-0'
    },

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
          class: 'flex flex-wrap justify-center gap-4 md:gap-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'
        },
        h('span', {}, `Draw Pile: ${state.drawPileCount}`),
        h('span', {}, `Discarded: ${state.discardPileCount}`),
        h('span', {}, `Reshuffles: ${state.reshuffleCount}/${GAME_CONFIG.MAX_RESHUFFLES}`)
      )
    ),

    h(
      'div',
      { class: 'xl:col-span-4' },
      h(
        'div',
        {
          class: `glass-panel p-8 rounded-[2.5rem] ${UI_CONFIG.GAME_HISTORY_PANEL_HEIGHT_CLASS} ${UI_CONFIG.GAME_HISTORY_PANEL_MAX_HEIGHT_CLASS} flex flex-col overflow-hidden`
        },
        HistoryPanel({ history: state.history })
      )
    )

  );
}