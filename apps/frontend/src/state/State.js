import { createStore } from '../picojs/framework/core.js';
const initialState = {
    playerName: '',
    currentHand: [],
    currentHandValue: 0,
    history: [],
    score: 0,
    gamePhase: 'LANDING',
    drawPileCount: 0,
    discardPileCount: 0,
    reshuffleCount: 0,
    errorMessage: ''
};
export const store = createStore(initialState);