import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ROUTES } from '../../utils/constants.js';
import { HistoryService } from '../../services/HistoryService.js';
import { EndSummaryPanel } from '../components/EndSummaryPanel.js';
import { EndHistoryPanel } from '../components/EndHistoryPanel.js';
import { allowPlayAgainTransition } from '../../services/AppController.js';
import { GlobalTopBar } from '../components/GlobalTopBar.js';
import { store } from '../../state/State.js';
import { RulesModal } from '../components/RulesModal.js';
import { MobileMenu } from '../components/MobileMenu.js';

export function EndView({ state, engine }) {
  const topScores = state.leaderboard || [];
  
  const rawHistory = state.lifetimeHistory.length > 0 ? state.lifetimeHistory : HistoryService.getHistory();
  
  const history = rawHistory.map(entry => ({
    id: entry._id || entry.id,
    score: entry.final_score ?? entry.score ?? 0,
    timestamp: entry.ended_at ?? entry.timestamp ?? new Date().toISOString(),
    playerName: entry.username ?? entry.playerName ?? state.playerName
  }));

  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : state.score;
  const currentScore = state.score;

  const sessionName = (state.playerName || '').trim();
  const playerEntry = sessionName ? topScores.find(entry => {
    const entryName = (entry.player_name || entry.username || '').trim();
    return entryName.toLowerCase() === sessionName.toLowerCase();
  }) : null;

  const playerRank = playerEntry ? topScores.indexOf(playerEntry) + 1 : 0;
  const highestScore = playerEntry ? (playerEntry.highest_score || playerEntry.score) : bestScore;

  const getRankBadge = (rank) => {
    if (rank <= 0 || rank > 5) {
      return h('div', { 
        class: 'flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-slate-400 shadow-xl backdrop-blur-md transition-all' 
      },
        h('div', { class: 'icon-wallet w-3.5 h-3.5' }),
        h('span', { class: 'text-[9px] font-black uppercase tracking-widest' }, TEXT.game.playerLabel)
      );
    }
    
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
      class: `flex items-center gap-1 px-2 py-0.5 rounded-md border shadow-lg backdrop-blur-md transition-all ${config.bg} ${config.border} ${config.color}` 
    },
      h('div', { class: `${config.icon} w-3 h-3` }),
      h('span', { class: 'text-[8px] font-black uppercase tracking-widest' }, config.label)
    );
  };

  const topScoresList = topScores.map(s => s.score || s.highest_score || 0);
  const firstPlaceScore = topScoresList[0] || 0;
  const fifthPlaceScore = topScoresList[4] || 0;

  const getComment = () => {
    const { comments } = TEXT.end;
    if (currentScore <= 0) return comments.bankrupt;
    if (currentScore >= bestScore && history.length > 1) return comments.newBest;
    if (firstPlaceScore > 0 && currentScore > firstPlaceScore * 0.9 && currentScore < firstPlaceScore) return comments.nearFirst;
    if (fifthPlaceScore > 0 && currentScore > fifthPlaceScore * 0.8 && currentScore < fifthPlaceScore) return comments.nearFifth;
    if (currentScore > 50) return comments.solid;
    return comments.keepUp;
  };

  const handlePlayAgain = async () => {
    allowPlayAgainTransition();
    const success = await engine.startSession(state.playerName);
    if (success) {
      engine.startGame(state.playerName);
      window.location.hash = ROUTES.PLAY;
    }
  };

  return h(
    'div',
    {
      class: 'play-shell no-scrollbar relative w-full h-screen overflow-hidden xl:overflow-hidden overflow-y-auto px-[var(--play-shell-x)] py-[var(--play-shell-y)] flex flex-col'
    },

    GlobalTopBar({
      playerName: state.playerName,
      highestScore: highestScore,
      rankBadge: getRankBadge(playerRank),
      isMenuOpen: state.isMobileMenuOpen,
      onMenuToggle: () => store.setState({ isMobileMenuOpen: !state.isMobileMenuOpen }),
      onRulesClick: () => store.setState({ isRulesOpen: true }),
      onLogoutClick: () => engine.logout()
    }),

    h(
      'div',
      {
        class: 'relative z-10 w-full max-w-[1480px] mx-auto flex flex-col gap-[var(--play-gap)] animate-fade-in pt-4 md:pt-8 pb-24'
      },

      h('div', { class: 'flex-1 min-h-0 flex items-center justify-center pt-8 lg:pt-0 pb-12' },
        h('div', { class: 'w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-stretch lg:h-[75vh] py-4' },
          EndSummaryPanel({
            score: currentScore,
            bestScore,
            comment: getComment(),
            onPlayAgain: handlePlayAgain,
            gameOverReason: state.gameOverReason
          }),
          EndHistoryPanel({
            history,
            bestScore,
            playerName: state.playerName
          })
        )
      )
    ),

    state.isRulesOpen ? RulesModal({
      onClose: () => store.setState({ isRulesOpen: false })
    }) : null,

    MobileMenu({
      isOpen: state.isMobileMenuOpen,
      onClose: () => store.setState({ isMobileMenuOpen: false }),
      playerName: state.playerName,
      highestScore: highestScore,
      rankBadge: getRankBadge(playerRank),
      onRulesClick: () => store.setState({ isRulesOpen: true }),
      onLogoutClick: () => engine.logout()
    })
  );
}
