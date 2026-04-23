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

  // Session state
  sessionChecked: false,
  sessionValid: false,
  backendDown: false,
  sessionError: '',
  isGameFinished: false,
  errorData: {
    code: '',
    title: '',
    message: '',
    buttonText: '',
    targetRoute: ''
  },

  // Animation scaffold
  isDrawing: false,
  drawQueue: [],
  animationNonce: 0,
  isResolvingBet: false,
  isHandExiting: false,
  handExitAnimationNonce: 0,
  handDistributionNonce: 0,

  floatingFeedback: {
    isVisible: false,
    isWin: false,
    position: { x: 0, y: 0 },
  },

  hasAttemptedStart: false,
  showJoinForm: false,
  deckState: null
};

export let store = null;

export function initStore(s) {
  store = s;
}