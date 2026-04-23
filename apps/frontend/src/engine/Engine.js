import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { TILE_TYPES, calculateHandValue, updateDynamicValue } from './TileConfig.js';
import { GAME_CONFIG, PHASES, BET_TYPES, GAME_ACTIONS, TEXT, SOUND_PATHS } from '../utils/constants.js';
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
    
    soundService.playAmbient(SOUND_PATHS.AMBIENT.GAMEPLAY);
    soundService.playClick();

    store.setState({
      playerName,
      gamePhase: PHASES.PLAYING,
      currentHand: initialHand,
      currentHandValue: calculateHandValue(initialHand),
      score: GAME_CONFIG.INITIAL_SCORE,
      history: [],
      ...this.deck.getStats()
    });

    Api.logGameSession({ player_name: playerName, action: GAME_ACTIONS.START_GAME })
      .catch((err) => console.warn(TEXT.engine.errors.logSessionFailed, err));
  }

  betHigher() {
    soundService.playBet();
    this.processBet(BET_TYPES.HIGHER);
  }

  betLower() {
    soundService.playBet();
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