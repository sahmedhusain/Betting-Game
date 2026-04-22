import { createElement as h } from '../../picojs/framework/core.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';

export function GameView({ state, engine }) {
  return h('div', { class: 'w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 animate-fade-in px-2 sm:px-0' },
    // Main Game Area (Left)
    h('div', { class: 'xl:col-span-8 space-y-6 md:space-y-8' },
      ScoreBoard({ state, engine }),

      HandDisplay({ tiles: state.currentHand }),

      h('div', { class: 'flex flex-wrap justify-center gap-4 md:gap-12 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]' },
        h('span', {}, `Draw Pile: ${state.drawPileCount}`),
        h('span', {}, `Discarded: ${state.discardPileCount}`),
        h('span', {}, `Reshuffles: ${state.reshuffleCount}/3`)
      )
    ),

    // History Sidebar
    h('div', { class: 'xl:col-span-4' },
      h('div', { class: 'glass-panel p-8 rounded-[2.5rem] h-full flex flex-col' },
        HistoryPanel({ history: state.history })
      )
    )
  );
}
