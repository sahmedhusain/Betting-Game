import { createStore } from '../picojs/framework/store.js';
import { PHASES, GAME_CONFIG } from '../utils/constants.js';

export const store = createStore({
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

  hasAttemptedStart: false
});