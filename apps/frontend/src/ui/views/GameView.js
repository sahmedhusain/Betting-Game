import { createElement as h } from '../../picojs/framework/core.js';
import { GAME_CONFIG, TEXT, UI_CONFIG } from '../../utils/constants.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';
import { DrawLane } from '../components/DrawLane.js';
import { FloatingFeedback } from '../components/FloatingFeedback.js';

export function GameView({ state, engine }) {
  const floatingFeedback = state.floatingFeedback || {
    isVisible: false,
    isWin: false,
    position: { x: 0, y: 0 },
  };

  return h(
    'div',
    {
      class: 'w-full min-h-screen bg-gradient-to-br from-slate-900 via-[#131f2d] to-slate-900 px-4 py-5 md:py-8'
    },

    FloatingFeedback({
      isVisible: floatingFeedback.isVisible,
      isWin: floatingFeedback.isWin,
      position: floatingFeedback.position,
      onAnimationEnd: null,
    }),

    h(
      'div',
      {
        class: 'w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-7 animate-fade-in'
      },

      h('div', { class: 'glass-panel border border-white/10 rounded-[1.6rem] px-5 py-4 md:px-7 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4' },
        h('div', { class: 'flex items-center gap-4' },
          h('div', { class: 'w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30' },
            h('div', { class: 'w-5 h-7 border-2 border-white rounded-sm relative' },
              h('div', { class: 'absolute top-1 left-1 w-1 h-1 bg-white rounded-full' }),
              h('div', { class: 'absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full' })
            )
          ),
          h('div', {},
            h('h1', { class: 'text-xl md:text-2xl font-black text-white tracking-tight font-outfit' }, UI_CONFIG.GAME_BRANDING.TITLE),
            h('p', { class: 'text-[10px] uppercase tracking-[0.26em] font-black text-emerald-400' }, UI_CONFIG.GAME_BRANDING.SUBTITLE)
          )
        ),
        h('div', { class: 'flex items-center gap-3 text-right' },
          h('span', { class: 'text-[10px] uppercase tracking-[0.2em] font-black text-slate-500' }, TEXT.game.playerLabel),
          h('span', { class: 'px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm md:text-base font-black text-white tracking-wide' }, state.playerName || TEXT.game.anonymousPlayer)
        )
      ),

      h(
        'div',
        { class: 'grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-7' },

        h(
          'div',
          { class: 'xl:col-span-8 space-y-6' },

          h(
            'div',
            {
              class: 'glass-panel p-5 md:p-7 rounded-[2rem] border border-white/10'
            },

            ScoreBoard({ state, engine }),

            h(
              'div',
              { class: 'grid grid-cols-1 lg:grid-cols-[185px_1fr] gap-6 md:gap-7 items-stretch mt-6 md:mt-7' },
              DrawLane({ state, isDistributing: state.isResolvingBet }),
              HandDisplay({
                tiles: state.currentHand,
                showDistributionAnimation: true,
                isExiting: state.isHandExiting,
                distributionSeed: state.handDistributionNonce || 0
              })
            ),

            h(
              'div',
              {
                class: 'grid grid-cols-2 gap-4 mt-7 pt-6 border-t border-white/10'
              },

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
        ),

        h(
          'div',
          {
            class: 'xl:col-span-4'
          },
          h(
            'div',
            {
              class: `glass-panel p-6 md:p-7 rounded-[2rem] border border-white/10 ${UI_CONFIG.GAME_HISTORY_PANEL_HEIGHT_CLASS} ${UI_CONFIG.GAME_HISTORY_PANEL_MAX_HEIGHT_CLASS} flex flex-col overflow-hidden`
            },
            HistoryPanel({ history: state.history })
          )
        )
      )
    )
  );
}