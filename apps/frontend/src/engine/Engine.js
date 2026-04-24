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

  async validateSession() {
    try {
      const response = await Api.validateSession();
      store.setState({ 
        sessionChecked: true, 
        sessionValid: true, 
        playerName: response.username,
        backendDown: false,
        isGameFinished: response.is_game_finished
      });

      if (response.game_state) {
        this.restoreSession(response.game_state);
      }

      return true;
    } catch (err) {
      const isNetworkError = err.message === 'Failed to fetch' || err.message.includes('network');
      store.setState({ 
        sessionChecked: true, 
        sessionValid: false,
        backendDown: isNetworkError
      });
      return false;
    }
  }

  async startSession(username) {
    try {
      const session = await Api.startSession(username);
      store.setState({ 
        sessionValid: true, 
        playerName: session.username,
        sessionError: '',
        backendDown: false,
        isGameFinished: false
      });
      localStorage.setItem('mahjong_player_name', session.username);
      
      this.loadLeaderboard();
      
      return true;
    } catch (err) {
      const isNetworkError = err.message === 'Failed to fetch' || err.message.includes('network');
      store.setState({ 
        sessionError: err.message,
        backendDown: isNetworkError
      });
      return false;
    }
  }

  async logout() {
    try {
      await Api.logoutSession();
    } catch (err) {
      console.error('Logout failed:', err);
    }
    store.setState({ 
      sessionValid: false, 
      playerName: '', 
      gamePhase: PHASES.LANDING,
      currentHand: [],
      history: [],
      score: GAME_CONFIG.INITIAL_SCORE,
      isGameFinished: false
    });
    localStorage.clear();
    soundService.stopAmbient();
    
    this.loadLeaderboard();
  }

  syncState() {
    const state = store.getState();
    if (!state.sessionValid || state.gamePhase === PHASES.LANDING) return;

    Api.saveGameState({
      state: {
        score: state.score,
        current_hand: state.currentHand,
        history: state.history,
        deck_state: state.deckState,
        reshuffle_count: state.reshuffleCount,
        game_phase: state.gamePhase
      },
      is_game_finished: state.isGameFinished
    }).catch(err => console.warn('Failed to sync state:', err));
  }

  async loadLeaderboard() {
    try {
      const scores = await Api.getLeaderboard();
      if (Array.isArray(scores)) {
        store.setState({ leaderboard: scores, backendDown: false });
      }
    } catch (err) {
      console.error(TEXT.engine.errors.loadLeaderboardFailed, err);
      const isNetworkError = err.message === 'Failed to fetch' || err.message.includes('network');
      if (isNetworkError) {
        store.setState({ backendDown: true });
      }
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
        ...this.deck.getStats()
      });

      if (gameState.game_phase === PHASES.PLAYING) {
        soundService.playAmbient();
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
    const state = store.getState();
    soundService.stopAmbient();
    soundService.playGameOver();

    HistoryService.saveGame(state.playerName, state.score);
    store.setState({ gamePhase: PHASES.GAME_OVER, isGameFinished: true });
    this.syncState();

    try {
      await Api.saveScore(state.playerName, state.score, state.history.length);
    } catch (err) {
      console.error(TEXT.engine.errors.saveScoreFailed, err);
    }

    await this.loadLeaderboard();
  }
}

export const engine = new GameEngine();