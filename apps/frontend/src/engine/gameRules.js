import { BET_TYPES, HAND_RESULTS, GAME_CONFIG, TEXT } from '../utils/constants.js';

export function determineResult({ betType, currentVal, nextVal }) {
  if (nextVal === currentVal) return HAND_RESULTS.PUSH;
  const isWin = (betType === BET_TYPES.HIGHER && nextVal > currentVal) ||
                (betType === BET_TYPES.LOWER && nextVal < currentVal);
  return isWin ? HAND_RESULTS.WIN : HAND_RESULTS.LOSS;
}

export function calculateScoreDelta({ result, currentVal, nextVal, winScoreBase, lossPenalty }) {
  if (result === HAND_RESULTS.PUSH) return 0;
  if (result === HAND_RESULTS.LOSS) return lossPenalty;
  return Math.abs(nextVal - currentVal) + winScoreBase;
}

export function clampScore(score) {
  return Math.max(0, score);
}

export function createHistoryEntry({ hand, value, result }) {
  return {
    hand,
    value,
    result
  };
}

export function applyDynamicAdjustments({
  hand,
  result,
  tileTypes,
  updateDynamicValue,
  dynamicMin,
  dynamicMax
}) {
  if (result === HAND_RESULTS.PUSH) return false;
  let boundaryHit = false;

  hand.forEach((tile) => {
    if (tile.type !== tileTypes.NUMBER) {
      const newVal = updateDynamicValue(tile.name, result === HAND_RESULTS.WIN ? 1 : -1);
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