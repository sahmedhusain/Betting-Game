import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { calculateHandValue, updateDynamicValue } from './TileConfig.js';
import { TILE_TYPES } from '../utils/constants.js';
import { GAME_CONFIG, PHASES, BET_TYPES, TEXT } from '../utils/constants.js';
import { Api } from '../services/Api.js';
import { soundService } from '../services/SoundService.js';
import { SessionService } from '../services/SessionService.js';
import { LeaderboardService } from '../services/LeaderboardService.js';
import { StateSyncService } from '../services/StateSyncService.js';
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

  async validateSession() {
    const response = await SessionService.validateSession();
    if (response && response.game_state) {
      this.restoreSession(response.game_state);
    }
    return !!response;
  }

  async startSession(username) {
    const session = await SessionService.startSession(username);
    if (session) {
      LeaderboardService.loadLeaderboard(true);
      return true;
    }
    return false;
  }

  async logout() {
    await SessionService.logout();
    LeaderboardService.loadLeaderboard(true);
  }

  syncState() {
    StateSyncService.syncState();
  }

  async loadLeaderboard(force = false) {
    return LeaderboardService.loadLeaderboard(force);
  }

  startGame(playerName) {
    this.deck = new Deck();
    const initialHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);

    soundService.playAmbient();
    soundService.playClick();
    sessionStorage.setItem('game_active', 'true');

    store.setState({
      playerName,
      wasRefreshed: false,
      gamePhase: PHASES.PLAYING,
      currentHand: initialHand,
      currentHandValue: calculateHandValue(initialHand),
      score: GAME_CONFIG.INITIAL_SCORE,
      history: [],
      isResolvingBet: false,
      handExitAnimationNonce: 0,
      isHandExiting: false,
      isGameFinished: false,
      handDistributionNonce: (store.getState().handDistributionNonce || 0) + 1,
      deckState: this.deck.exportState(),
      ...this.deck.getStats()
    });

    this.syncState();
    this.loadLeaderboard();
  }

  restoreSession(gameState) {
    if (gameState && gameState.deck_state) {
      this.deck.importState(gameState.deck_state);
      
      store.setState({
        score: gameState.score,
        currentHand: gameState.current_hand,
        currentHandValue: calculateHandValue(gameState.current_hand),
        history: gameState.history,
        reshuffleCount: gameState.reshuffle_count,
        gamePhase: gameState.game_phase,
        deckState: gameState.deck_state,
        isGameFinished: gameState.game_phase === PHASES.GAME_OVER,
        wasRefreshed: !!gameState.was_refreshed,
        ...this.deck.getStats()
      });

      if (gameState.game_phase === PHASES.PLAYING) {
        soundService.playAmbient();
        sessionStorage.setItem('game_active', 'true');
      }
      
      this.loadLeaderboard();
    }
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
    const prevReshuffleCount = state.reshuffleCount || 0;
    const nextHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);
    const deckStats = this.deck.getStats();
    
    if (deckStats.reshuffleCount > prevReshuffleCount) {
      store.setState({ isReshuffling: true });
      setTimeout(() => store.setState({ isReshuffling: false }), GAME_CONFIG.RESHUFFLE_DELAY_MS);
    }

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

    store.setState({
      isResolvingBet: true,
      floatingFeedback: {
        isVisible: true,
        isWin,
        position: GAME_CONFIG.DEFAULT_FEEDBACK_POSITION
      }
    });

    await this.sleep(GAME_CONFIG.BET_ANIMATION_TIMELINE_MS.FEEDBACK);

    store.setState({
      handExitAnimationNonce: (store.getState().handExitAnimationNonce || 0) + 1,
      isHandExiting: true,
    });

    await this.sleep(GAME_CONFIG.BET_ANIMATION_TIMELINE_MS.EXIT);

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
      deckState: this.deck.exportState(),
      ...this.deck.getStats(),
      isHandExiting: false,
    });

    this.syncState();

    await this.sleep(GAME_CONFIG.BET_ANIMATION_TIMELINE_MS.DISTRIBUTION);

    store.setState({ isResolvingBet: false });

    this.deck.discard(state.currentHand);
    if (boundaryHit) this.endGame();
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async endGame() {
    sessionStorage.removeItem('game_active');
    const state = store.getState();
    soundService.stopAmbient();
    soundService.playGameOver();

    try {
      await Api.saveScore(state.playerName, state.score, state.history.length);
    } catch (err) {
      console.error(TEXT.engine.errors.saveScoreFailed, err);
    }

    try {
      const dbHistory = await Api.getGameHistory();
      store.setState({ lifetimeHistory: dbHistory || [] });
    } catch (err) {
      console.warn('Failed to load DB history:', err);
      store.setState({ lifetimeHistory: HistoryService.getHistory() });
    }

    store.setState({ gamePhase: PHASES.GAME_OVER, isGameFinished: true });
    this.syncState();
    await this.loadLeaderboard(true);
  }
}

export const engine = new GameEngine();