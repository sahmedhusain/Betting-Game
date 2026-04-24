import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { GAME_CONFIG, TEXT, UI_CONFIG, ASSETS } from '../../utils/constants.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';
import { DrawLane } from '../components/DrawLane.js';
import { FloatingFeedback } from '../components/FloatingFeedback.js';
import { RulesModal } from '../components/RulesModal.js';
import { GlobalTopBar } from '../components/GlobalTopBar.js';

export function GameView({ state, engine }) {
  const isLocked = !!state.isResolvingBet;
  const floatingFeedback = state.floatingFeedback || {
    isVisible: false,
    isWin: false,
    position: { x: 0, y: 0 },
  };

  const leaderboard = state.leaderboard || [];
  const sessionName = (state.playerName || '').trim();
  
  const playerEntry = sessionName ? leaderboard.find(entry => {
    const entryName = (entry.player_name || entry.username || '').trim();
    return entryName.toLowerCase() === sessionName.toLowerCase();
  }) : null;

  const playerRank = playerEntry ? leaderboard.indexOf(playerEntry) + 1 : 0;
  const highestScore = playerEntry ? (playerEntry.highest_score || playerEntry.score) : 0;
  
  const getRankBadge = (rank) => {
    if (rank <= 0 || rank > 5) return null;
    
    const configs = {
      1: { label: TEXT.leaderboard.legend, icon: 'icon-medal', color: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
      2: { label: TEXT.leaderboard.rank(2), icon: 'icon-medal', color: 'text-slate-200', bg: 'bg-slate-300/20', border: 'border-slate-300/40' },
      3: { label: TEXT.leaderboard.rank(3), icon: 'icon-medal', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' },
      4: { label: TEXT.leaderboard.rank(4), icon: 'icon-star', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
      5: { label: TEXT.leaderboard.rank(5), icon: 'icon-star', color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' }
    };
    
    const config = configs[rank];
    if (!config) return null;

    return h('div', { 
      class: `flex items-center gap-1.5 px-3 py-1 rounded-lg border shadow-xl backdrop-blur-md transition-all ${config.bg} ${config.border} ${config.color}` 
    },
      h('div', { class: `${config.icon} w-3.5 h-3.5` }),
      h('span', { class: 'text-[9px] font-black uppercase tracking-widest' }, config.label)
    );
  };

  const IconWrapper = (src, size = 'w-6 h-6') => h('span', {
    class: `inline-block ${size} bg-current transition-all duration-300`,
    style: `-webkit-mask: url("${src}") no-repeat center / contain; mask: url("${src}") no-repeat center / contain;`
  });

  return h(
    'div',
    {
      class: 'play-shell relative w-full h-screen overflow-hidden px-[var(--play-shell-x)] py-[var(--play-shell-y)] flex flex-col'
    },

    h(
      'div',
      {
        class: 'relative z-10 w-full max-w-[1480px] mx-auto flex flex-col gap-[var(--play-gap)] h-full animate-fade-in'
      },

      GlobalTopBar({
        playerName: state.playerName,
        highestScore: highestScore,
        rankBadge: getRankBadge(playerRank),
        onRulesClick: () => store.setState({ isRulesOpen: true }),
        onLogoutClick: () => engine.logout()
      }),

      h(
        'div',
        { class: 'grid grid-cols-1 xl:grid-cols-12 gap-[var(--play-gap)] items-start shrink-0 mb-4' },

        // Game Engine (Arena)
        h(
          'div',
          { class: 'xl:col-span-8' },

          h(
            'div',
            {
              id: 'game-arena-panel',
              class: 'glass-panel p-[var(--play-panel-pad)] rounded-[var(--play-panel-radius)] border border-white/10 overflow-hidden flex flex-col gap-6'
            },

            h('div', { class: 'flex items-center justify-between px-2 shrink-0' },
              h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.4em] text-slate-500' }, TEXT.game.bettingArena),
              h('div', { class: 'h-[1px] flex-1 mx-6 bg-white/5' }),
              h('span', { class: 'text-[9px] font-bold text-slate-500 uppercase tracking-widest' }, 'ARENA')
            ),

            ScoreBoard({ state }),

            h(
              'div',
              { class: 'grid grid-cols-1 lg:grid-cols-[minmax(160px,200px)_1fr] gap-[var(--play-gap)] items-stretch' },
              
              DrawLane({ state, isDistributing: isLocked }),
              
              h('div', { class: 'flex flex-col gap-4 relative w-full' },
                
                h('div', { class: 'relative w-full' },
                  HandDisplay({
                    tiles: state.currentHand,
                    showDistributionAnimation: true,
                    isExiting: state.isHandExiting,
                    distributionSeed: state.handDistribution_nonce || 0
                  }),

                  FloatingFeedback({
                    isVisible: floatingFeedback.isVisible,
                    isWin: floatingFeedback.isWin,
                    position: floatingFeedback.position,
                    onAnimationEnd: null,
                  })
                ),

                h('div', { class: 'shrink-0 mt-2' },
                  h('div', { class: 'flex flex-col sm:flex-row gap-4 w-full' },
                    h('button', {
                      class: `group flex-1 flex items-center justify-center gap-2.5 px-8 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                        isLocked 
                        ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5 opacity-50' 
                        : 'bg-slate-800/60 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-indigo-500/50 shadow-2xl active:scale-95'
                      }`,
                      disabled: isLocked,
                      onclick: () => engine.betLower()
                    }, 
                      !isLocked && h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent' }),
                      IconWrapper(ASSETS.ICONS.LOWER, 'w-7 h-7'),
                      h('span', { class: 'leading-none' }, TEXT.game.betLower)
                    ),
                    h('button', {
                      class: `group flex-1 flex items-center justify-center gap-2.5 px-8 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                        isLocked 
                        ? 'bg-emerald-900/20 text-emerald-800 cursor-not-allowed border border-emerald-900/30' 
                        : 'bg-emerald-600 border border-emerald-400/30 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95'
                      }`,
                      disabled: isLocked,
                      onclick: () => engine.betHigher()
                    }, 
                      !isLocked && h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent' }),
                      IconWrapper(ASSETS.ICONS.HIGHER, 'w-7 h-7'),
                      h('span', { class: 'leading-none' }, TEXT.game.betHigher)
                    )
                  )
                )
              )
            )
          )
        ),

        // History Panel
        h(
          'div',
          {
            class: 'xl:col-span-4 self-stretch relative'
          },
          h(
            'div',
            {
              class: 'absolute inset-0'
            },
            h(
              'div',
              {
                class: 'glass-panel p-[var(--play-panel-pad)] rounded-[var(--play-panel-radius)] border border-white/10 flex flex-col overflow-hidden h-full'
              },
              HistoryPanel({ history: state.history })
            )
          )
        )
      )
    ),

    // Rules Modal
    state.isRulesOpen ? RulesModal({
      onClose: () => store.setState({ isRulesOpen: false })
    }) : null
  );
}