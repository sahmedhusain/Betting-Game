import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { TILE_TYPES, calculateHandValue, updateDynamicValue } from './TileConfig.js';
import { GAME_CONFIG, PHASES, BET_TYPES, GAME_ACTIONS } from '../utils/constants.js';
import { Api } from '../services/Api.js';
import { sfx } from '../services/Sfx.js';
import {
  applyDynamicAdjustments,
  calculateScoreDelta,
  clampScore,
  createHistoryEntry,
  isWinningBet
} from './gameRules.js';

class GameEngine {
  constructor() {
    this.deck = new Deck();
  }

  async loadLeaderboard() {
    try {
      const scores = await Api.getLeaderboard();
      store.setState({ leaderboard: scores });
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  }

  startGame(playerName) {
    this.deck = new Deck();
    const initialHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);
    store.setState({
      playerName,
      gamePhase: PHASES.PLAYING,
      currentHand: initialHand,
      currentHandValue: calculateHandValue(initialHand),
      score: GAME_CONFIG.INITIAL_SCORE,
      history: [],
      ...this.deck.getStats()
    });

    Api.logGameSession({ player_name: playerName, action: GAME_ACTIONS.START_GAME });

  }

  betHigher() {
    sfx.playBetClick();
    this.processBet(BET_TYPES.HIGHER);
  }

  betLower() {
    sfx.playBetClick();
    this.processBet(BET_TYPES.LOWER);
  }

  processBet(betType) {
    const state = store.getState();
    const currentVal = state.currentHandValue;
    const nextHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);

    if (nextHand.length < GAME_CONFIG.HAND_SIZE) {
      this.endGame();
      return;
    }

    const nextVal = calculateHandValue(nextHand);
    const isWin = isWinningBet({ betType, currentVal, nextVal });

    if (isWin) {
      sfx.playWinChime();
    } else {
      sfx.playLoseThud();
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
      score: newScore,
      currentHand: nextHand,
      currentHandValue: nextVal,
      history: [...state.history, createHistoryEntry({ hand: state.currentHand, value: currentVal, isWin })],
      ...this.deck.getStats()
    });

    this.deck.discard(state.currentHand);
    if (boundaryHit) this.endGame();
  }

  async endGame() {
    const state = store.getState();
    store.setState({ gamePhase: PHASES.GAME_OVER });

    try {
      await Api.saveScore(state.playerName, state.score);
    } catch (err) {
      console.error('Failed to save score:', err);
    }

    await this.loadLeaderboard();

  }
}

export const engine = new GameEngine();