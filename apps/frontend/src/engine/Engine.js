import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { calculateHandValue, updateDynamicValue } from './TileConfig.js';
import { TILE_TYPES } from '../utils/constants.js';
import { GAME_CONFIG, PHASES, BET_TYPES, GAME_ACTIONS, TEXT } from '../utils/constants.js';
import { Api } from '../services/Api.js';
import { soundService } from '../services/SoundService.js';
import {
  applyDynamicAdjustments,
  calculateScoreDelta,
  clampScore,
  createHistoryEntry,
  isWinningBet
} from './gameRules.js';
import { HistoryService } from '../services/HistoryService.js';

class GameEngine {
  constructor() {
    this.deck = new Deck();
  }

  async loadLeaderboard() {
    try {
      const scores = await Api.getLeaderboard();
      store.setState({ leaderboard: scores });
    } catch (err) {
      console.error(TEXT.engine.errors.loadLeaderboardFailed, err);
    }
  }

  startGame(playerName) {
    this.deck = new Deck();
    const initialHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);

    soundService.playAmbient();
    soundService.playClick();

    store.setState({
      playerName,
      gamePhase: PHASES.PLAYING,
      currentHand: initialHand,
      currentHandValue: calculateHandValue(initialHand),
      score: GAME_CONFIG.INITIAL_SCORE,
      history: [],
      isResolvingBet: false,
      handExitAnimationNonce: 0,
      isHandExiting: false,
      handDistributionNonce: (store.getState().handDistributionNonce || 0) + 1,
      ...this.deck.getStats()
    });

    Api.logGameSession({ player_name: playerName, action: GAME_ACTIONS.START_GAME })
      .catch((err) => console.warn(TEXT.engine.errors.logSessionFailed, err));
  }

  betHigher() {
    if (store.getState().isResolvingBet) return;
    soundService.playBet();
    this.processBet(BET_TYPES.HIGHER);
  }

  betLower() {
    if (store.getState().isResolvingBet) return;
    soundService.playBet();
    this.processBet(BET_TYPES.LOWER);
  }

  async processBet(betType) {
    const state = store.getState();
    if (state.isResolvingBet) return;

    const currentVal = state.currentHandValue;
    const nextHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);

    if (nextHand.length < GAME_CONFIG.HAND_SIZE) {
      this.endGame();
      return;
    }

    const nextVal = calculateHandValue(nextHand);
    const isWin = isWinningBet({ betType, currentVal, nextVal });

    if (isWin) {
      soundService.playWin();
    } else {
      soundService.playLoss();
    }

    const boundaryHit = applyDynamicAdjustments({
      hand: nextHand,
      isWin,
      tileTypes: TILE_TYPES,
      updateDynamicValue,
      dynamicMin: GAME_CONFIG.DYNAMIC_MIN,
      dynamicMax: GAME_CONFIG.DYNAMIC_MAX
    });

    const scoreDelta = calculateScoreDelta({
      isWin,
      currentVal,
      nextVal,
      winScoreBase: GAME_CONFIG.WIN_SCORE_BASE,
      lossPenalty: GAME_CONFIG.LOSS_PENALTY
    });

    const newScore = clampScore(state.score + scoreDelta);

    // 1) Lock interactions, show feedback, and animate current hand out.
    store.setState({
      isResolvingBet: true,
      floatingFeedback: {
        isVisible: true,
        isWin,
        position: GAME_CONFIG.DEFAULT_FEEDBACK_POSITION
      }
    });

    // 2) After feedback is visible, animate current hand out.
    await this.sleep(GAME_CONFIG.BET_ANIMATION_TIMELINE_MS.FEEDBACK);

    store.setState({
      handExitAnimationNonce: (store.getState().handExitAnimationNonce || 0) + 1,
      isHandExiting: true,
    });

    await this.sleep(GAME_CONFIG.BET_ANIMATION_TIMELINE_MS.EXIT);

    // 3) Swap to next hand and run distribution animation.
    store.setState({
      score: newScore,
      currentHand: nextHand,
      currentHandValue: nextVal,
      history: [...state.history, createHistoryEntry({ hand: state.currentHand, value: currentVal, isWin })],
      handDistributionNonce: (state.handDistributionNonce || 0) + 1,
      floatingFeedback: {
        isVisible: false,
        isWin,
        position: GAME_CONFIG.DEFAULT_FEEDBACK_POSITION
      },
      ...this.deck.getStats(),
      isHandExiting: false,
    });

    await this.sleep(GAME_CONFIG.BET_ANIMATION_TIMELINE_MS.DISTRIBUTION);

    // 4) Unlock interactions once new hand has settled.
    store.setState({ isResolvingBet: false });

    this.deck.discard(state.currentHand);
    if (boundaryHit) this.endGame();
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async endGame() {
    const state = store.getState();
    soundService.stopAmbient();
    soundService.playGameOver();

    store.setState({ gamePhase: PHASES.GAME_OVER });
    HistoryService.saveGame(state.playerName, state.score);

    try {
      await Api.saveScore(state.playerName, state.score, state.history.length);
    } catch (err) {
      console.error(TEXT.engine.errors.saveScoreFailed, err);
    }

    await this.loadLeaderboard();

  }
}

export const engine = new GameEngine();