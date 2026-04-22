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

  hasAttemptedStart: false
};

export let store = null;

export function initStore(s) {
  store = s;
}