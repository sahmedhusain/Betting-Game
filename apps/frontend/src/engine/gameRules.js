export function isWinningBet({ betType, currentVal, nextVal }) {
  if (nextVal === currentVal) return true;
  if (betType === 'HIGHER' && nextVal > currentVal) return true;
  if (betType === 'LOWER' && nextVal < currentVal) return true;
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
    result: isWin ? 'WIN' : 'LOSS'
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