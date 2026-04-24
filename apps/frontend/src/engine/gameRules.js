import { BET_TYPES, HAND_RESULTS, GAME_CONFIG, TEXT } from '../utils/constants.js';

export function isWinningBet({ betType, currentVal, nextVal }) {
  if (nextVal === currentVal) return true;
  if (betType === BET_TYPES.HIGHER && nextVal > currentVal) return true;
  if (betType === BET_TYPES.LOWER && nextVal < currentVal) return true;
  return false;
}

export function calculateScoreDelta({ isWin, currentVal, nextVal, winScoreBase, lossPenalty }) {
  if (!isWin) return lossPenalty;
  return Math.abs(nextVal - currentVal) + winScoreBase;
}

export function clampScore(score) {
  return Math.max(0, score);
}

export function createHistoryEntry({ hand, value, isWin }) {
  return {
    hand,
    value,
    result: isWin ? HAND_RESULTS.WIN : HAND_RESULTS.LOSS
  };
}

export function applyDynamicAdjustments({
  hand,
  isWin,
  tileTypes,
  updateDynamicValue,
  dynamicMin,
  dynamicMax
}) {
  let boundaryHit = false;

  hand.forEach((tile) => {
    if (tile.type !== tileTypes.NUMBER) {
      const newVal = updateDynamicValue(tile.name, isWin ? 1 : -1);
      if (newVal <= dynamicMin || newVal >= dynamicMax) {
        boundaryHit = true;
      }
    }
  });

  return boundaryHit;
}

export function calculatePlayerRank(score) {
  if (score >= GAME_CONFIG.RANK_THRESHOLDS.LEGEND) return TEXT.leaderboard.legendary;
  if (score >= GAME_CONFIG.RANK_THRESHOLDS.EXPERT) return TEXT.leaderboard.challenger;
  return TEXT.game.playerLabel;
}