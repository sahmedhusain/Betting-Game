import { createElement as h } from '../../picojs/framework/core.js';
import { GAME_CONFIG, TEXT, UI_CONFIG } from '../../utils/constants.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';
import { DrawLane } from '../components/DrawLane.js';
import { FloatingFeedback } from '../components/FloatingFeedback.js';
import { store } from '../../state/State.js';

export function GameView({ state, engine }) {
  // Floating feedback state (triggered by game events)
  const floatingFeedback = state.floatingFeedback || {
    isVisible: false,
    isWin: false,
    position: { x: 0, y: 0 },
  };

  const handleFeedbackEnd = () => {
    store.setState({
      floatingFeedback: {
        isVisible: false,
        isWin: false,
        position: { x: 0, y: 0 },
      },
    });
  };

  return h(
    'div',
    {
      class: 'w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 md:py-10'
    },

    // Floating Feedback Overlay
    FloatingFeedback({
      isVisible: floatingFeedback.isVisible,
      isWin: floatingFeedback.isWin,
      position: floatingFeedback.position,
      onAnimationEnd: handleFeedbackEnd,
    }),

    // Main Content
    h(
      'div',
      {
        class: 'w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 animate-fade-in'
      },

      // Left Section: Game Play Area
      h(
        'div',
        { class: 'xl:col-span-8 space-y-6 md:space-y-8' },

        h(
          'div',
          { class: 'glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/5' },
          ScoreBoard({ state, engine })
        ),

        // Game Playing Area - Cards and Betting
        h(
          'div',
          {
            class: 'space-y-6 md:space-y-8'
          },

          // Draw and Hand Display Section
          h(
            'div',
            {
              class: 'glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/5'
            },

            h(
              'div',
              { class: 'grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 md:gap-8 items-stretch' },
              DrawLane({ state }),
              HandDisplay({ tiles: state.currentHand })
            ),

            // Game Stats
            h(
              'div',
              {
                class: 'grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10'
              },
              h(
                'div',
                { class: 'text-center' },
                h('div', { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2' }, TEXT.game.drawPile),
                h('div', { class: 'text-2xl font-black text-emerald-400 font-outfit' }, state.drawPileCount)
              ),

              h(
                'div',
                { class: 'text-center' },
                h('div', { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2' }, TEXT.game.discarded),
                h('div', { class: 'text-2xl font-black text-slate-300 font-outfit' }, state.discardPileCount)
              ),

              h(
                'div',
                { class: 'text-center' },
                h('div', { class: 'text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2' }, TEXT.game.reshuffles),
                h('div', { class: 'text-2xl font-black text-emerald-400 font-outfit' }, `${state.reshuffleCount}/${GAME_CONFIG.MAX_RESHUFFLES}`)
              )
            )
          )
        )
      ),

      // History Panel
      h(
        'div',
        { class: 'xl:col-span-4' },
        h(
          'div',
          {
            class: `glass-panel p-8 rounded-[2.5rem] border border-white/5 ${UI_CONFIG.GAME_HISTORY_PANEL_HEIGHT_CLASS} ${UI_CONFIG.GAME_HISTORY_PANEL_MAX_HEIGHT_CLASS} flex flex-col overflow-hidden`
          },
          HistoryPanel({ history: state.history })
        )
      )
    )
  );
}