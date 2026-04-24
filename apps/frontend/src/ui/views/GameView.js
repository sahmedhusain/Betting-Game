import { createElement as h } from '../../picojs/framework/core.js';
import { store } from '../../state/State.js';
import { GAME_CONFIG, TEXT, UI_CONFIG, ASSETS } from '../../utils/constants.js';
import { ScoreBoard } from '../components/ScoreBoard.js';
import { HistoryPanel } from '../components/HistoryPanel.js';
import { HandDisplay } from '../components/HandDisplay.js';
import { DrawLane } from '../components/DrawLane.js';
import { FloatingFeedback } from '../components/FloatingFeedback.js';
import { RulesModal } from '../components/RulesModal.js';

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

      // Top Bar
      h('div', { class: 'flex items-center justify-between gap-6 px-2 md:px-4 shrink-0' },
        h('div', { class: 'flex items-center gap-8' },
          h('div', { class: 'flex items-center gap-4' },
            h('div', { class: 'w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 shadow-2xl overflow-hidden' },
              h('img', { 
                src: ASSETS.BRANDING.LOGO, 
                alt: TEXT.landing.logoAlt, 
                class: 'w-full h-full object-cover drop-shadow-xl' 
              })
            ),
            h('div', { class: 'hidden sm:flex flex-col' },
              h('span', { class: 'text-base font-black tracking-tighter text-white leading-none' }, TEXT.landing.branding),
              h('span', { class: 'text-[9px] font-bold tracking-[0.3em] text-emerald-500 uppercase mt-1' }, TEXT.landing.logoSubtitle)
            )
          ),
          
          h('div', { class: 'hidden md:block w-[1px] h-10 bg-white/10' }),
          
          h('div', { class: 'flex items-center gap-6' },
            h('div', { class: 'flex items-center gap-4' },
              h('span', { class: 'text-xl md:text-2xl font-black text-white tracking-tight font-outfit leading-none' }, state.playerName || TEXT.game.anonymousPlayer),
              
              h('div', { class: 'flex items-center gap-2' },
                highestScore > 0 && h('div', { 
                  class: 'flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-300 shadow-xl backdrop-blur-md transition-all' 
                },
                  h('div', { class: 'icon-star w-3.5 h-3.5' }),
                  h('span', { class: 'text-[9px] font-black tracking-widest leading-none' }, highestScore.toLocaleString())
                ),

                getRankBadge(playerRank)
              )
            )
          )
        ),
        
        // Right Side Top Bar: Rules + Leave
        h('div', { class: 'flex items-center gap-8' },
          h('button', {
            class: 'group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-400 transition-all active:scale-95 px-2 py-1',
            onclick: () => store.setState({ isRulesOpen: true })
          }, 
            IconWrapper(ASSETS.ICONS.INFO, 'w-3.5 h-3.5'),
            h('span', {}, 'How to Play?')
          ),

          h('button', {
            class: 'group flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden',
            title: TEXT.game.leaveGameTitle,
            disabled: isLocked,
            onclick: () => engine.logout()
          }, 
            h('div', { class: 'absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-400/40 to-transparent' }),
            h('span', { class: 'text-[10px] font-black uppercase tracking-[0.2em] hidden md:block' }, TEXT.game.leaveGame),
            h('div', { class: 'w-5 h-5 flex items-center justify-center' },
              h('img', { 
                src: ASSETS.ICONS.LEAVE, 
                alt: TEXT.game.leaveGameTitle, 
                class: 'w-full h-full opacity-80 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all' 
              })
            )
          )
        )
      ),

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

            h('div', { class: 'px-2 shrink-0' },
              h('h3', { class: 'text-[10px] font-black uppercase tracking-[0.34em] text-emerald-400' }, TEXT.game.bettingArena)
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
                      class: `group flex-1 flex items-center justify-center gap-4 px-10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${isLocked ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/10' : 'bg-slate-800/40 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-white/20 shadow-2xl active:scale-95'}`,
                      disabled: isLocked,
                      onclick: () => engine.betLower()
                    }, 
                      IconWrapper(ASSETS.ICONS.LOWER),
                      h('span', {}, TEXT.game.betLower)
                    ),
                    h('button', {
                      class: `group flex-1 flex items-center justify-center gap-4 px-10 py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${isLocked ? 'bg-emerald-900/30 text-emerald-700 cursor-not-allowed border border-emerald-700/30' : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/20 active:scale-95'}`,
                      disabled: isLocked,
                      onclick: () => engine.betHigher()
                    }, 
                      IconWrapper(ASSETS.ICONS.HIGHER),
                      h('span', {}, TEXT.game.betHigher)
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