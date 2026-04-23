import { createElement as h } from '../../picojs/framework/core.js';
import { TEXT, ROUTES } from '../../utils/constants.js';
import { HistoryService } from '../../services/HistoryService.js';
import { EndSummaryPanel } from '../components/EndSummaryPanel.js';
import { EndHistoryPanel } from '../components/EndHistoryPanel.js';
import { allowPlayAgainTransition } from '../../services/AppController.js';

export function EndView({ state, engine }) {
  const topScores = state.leaderboard || [];
  const history = HistoryService.getHistory();
  const bestScore = HistoryService.getBestScore();
  const currentScore = state.score;

  // Dynamic Commentary Logic
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

  return h('div', { class: 'w-full h-screen p-[8vh] flex flex-col items-center justify-center animate-fade-in overflow-hidden' },
    h('div', { class: 'w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-stretch flex-1 min-h-0' },
      EndSummaryPanel({
        score: currentScore,
        bestScore,
        comment: getComment(),
        onPlayAgain: handlePlayAgain
      }),
      EndHistoryPanel({
        history,
        bestScore,
        playerName: state.playerName
      })
    )
  );
}
