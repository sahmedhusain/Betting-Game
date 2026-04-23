import { PHASES, GAME_CONFIG } from '../utils/constants.js';

export const initialState = {
  playerName: '',
  score: GAME_CONFIG.INITIAL_SCORE,
  currentHand: [],
  currentHandValue: 0,
  drawPileCount: 0,
  discardPileCount: 0,
  reshuffleCount: 0,
  history: [],
  gamePhase: PHASES.LANDING,
  leaderboard: [],

  // Animation scaffold
  isDrawing: false,
  drawQueue: [],
  animationNonce: 0,

  floatingFeedback: {
    isVisible: false,
    isWin: false,
    position: { x: 0, y: 0 },
  },

  hasAttemptedStart: false,
  showJoinForm: false
};

export let store = null;

export function initStore(s) {
  store = s;
}