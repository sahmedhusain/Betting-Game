import { createElement as h } from '../../picojs/framework/core.js';
import { GAME_CONFIG, TEXT, UI_CONFIG, ASSETS } from '../../utils/constants.js';
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
      class: 'play-shell relative w-full min-h-screen overflow-hidden px-[var(--play-shell-x)] py-[var(--play-shell-y)]'
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
        class: 'relative z-10 w-full max-w-[1480px] mx-auto flex flex-col gap-[var(--play-gap)] animate-fade-in'
      },

      // Redesigned Top Bar with Player Name on Left and Leave Button on Right
      h('div', { class: 'flex items-center justify-between gap-6 px-2 md:px-4 mb-4' },
        
        // Left Section: Logo + Branding + Player Name
        h('div', { class: 'flex items-center gap-6' },
          h('div', { class: 'flex items-center gap-4' },
            h('div', { class: 'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 shadow-2xl overflow-hidden' },
              h('img', { 
                src: ASSETS.BRANDING.LOGO, 
                alt: 'Logo', 
                class: 'w-full h-full object-cover drop-shadow-xl' 
              })
            ),
            h('div', { class: 'hidden sm:flex flex-col' },
              h('span', { class: 'text-base font-black tracking-tighter text-white leading-none' }, TEXT.landing.branding),
              h('span', { class: 'text-[9px] font-bold tracking-[0.3em] text-emerald-500 uppercase mt-1' }, TEXT.landing.logoSubtitle)
            )
          ),
          
          // Separator
          h('div', { class: 'hidden md:block w-[1px] h-8 bg-white/10 mx-2' }),

          // Player Name Section
          h('div', { class: 'flex items-center gap-3' },
            h('span', { class: 'text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase' }, `${TEXT.game.playerLabel}:`),
            h('span', { class: 'text-lg font-black text-white tracking-tight font-outfit' }, state.playerName || TEXT.game.anonymousPlayer)
          )
        ),
        
        // Right Section: Leave Button
        h('div', { class: 'flex items-center' },
          h('button', {
            class: 'group flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed',
            title: TEXT.game.leaveGameTitle,
            disabled: state.isResolvingBet,
            onclick: () => engine.logout()
          }, 
            h('span', { class: 'text-[10px] font-black uppercase tracking-[0.2em] hidden md:block' }, TEXT.game.leaveGame),
            h('div', { class: 'w-5 h-5 flex items-center justify-center' },
              h('img', { 
                src: ASSETS.ICONS.LEAVE, 
                alt: TEXT.game.leaveGameTitle, 
                class: 'w-full h-full opacity-80 group-hover:opacity-100 transition-opacity' 
              })
            )
          )
        )
      ),

      h(
        'div',
        { class: 'grid grid-cols-1 xl:grid-cols-12 gap-[var(--play-gap)] items-start' },

        h(
          'div',
          { class: 'xl:col-span-8 space-y-[var(--play-gap)]' },

          h(
            'div',
            {
              class: 'glass-panel p-[var(--play-panel-pad)] rounded-[var(--play-panel-radius)] border border-white/10 overflow-hidden'
            },

            ScoreBoard({ state, engine }),

            h(
              'div',
              { class: 'grid grid-cols-1 lg:grid-cols-[minmax(160px,200px)_1fr] gap-[var(--play-gap)] items-stretch mt-[var(--play-gap)]' },
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
                class: 'grid grid-cols-2 gap-4 mt-[var(--play-gap)] pt-6 border-t border-white/5'
              },

              h(
                'div',
                { class: 'text-center' },
                h('div', { class: 'text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2' }, TEXT.game.discarded),
                h('div', { class: 'text-3xl md:text-4xl font-black text-slate-300 font-outfit tracking-tighter' }, state.discardPileCount)
              ),

              h(
                'div',
                { class: 'text-center' },
                h('div', { class: 'text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2' }, TEXT.game.reshuffles),
                h('div', { class: 'text-3xl md:text-4xl font-black text-emerald-400 font-outfit tracking-tighter' }, `${state.reshuffleCount}/${GAME_CONFIG.MAX_RESHUFFLES}`)
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
              class: `glass-panel p-[var(--play-panel-pad)] rounded-[var(--play-panel-radius)] border border-white/10 ${UI_CONFIG.GAME_HISTORY_PANEL_HEIGHT_CLASS} ${UI_CONFIG.GAME_HISTORY_PANEL_MAX_HEIGHT_CLASS} flex flex-col overflow-hidden`
            },
            HistoryPanel({ history: state.history })
          )
        )
      )
    )
  );
}