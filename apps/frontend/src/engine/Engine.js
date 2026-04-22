import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { TILE_TYPES, calculateHandValue, updateDynamicValue } from './TileConfig.js';
import { GAME_CONFIG, PHASES } from '../utils/constants.js';
import { Api } from '../services/Api.js';

class GameEngine {
    constructor() {
        this.deck = new Deck();
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

        // Backend Log
        Api.logGameSession({ player_name: playerName, action: 'START_GAME' });
    }

    betHigher() { this.processBet('HIGHER'); }
    betLower() { this.processBet('LOWER'); }

    processBet(betType) {
        const state = store.getState();
        const currentVal = state.currentHandValue;
        
        // Draw Next Hand
        const nextHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);
        
        // Deck Exhaustion Check
        if (nextHand.length < GAME_CONFIG.HAND_SIZE) {
            this.endGame();
            return;
        }

        const nextVal = calculateHandValue(nextHand);
        
        // Determine Win/Loss
        let isWin = false;
        if (betType === 'HIGHER' && nextVal > currentVal) isWin = true;
        if (betType === 'LOWER' && nextVal < currentVal) isWin = true;
        if (nextVal === currentVal) isWin = true; // Tie favor

        // Dynamic Scaling 
        let boundaryHit = false;
        nextHand.forEach(tile => {
            if (tile.type !== TILE_TYPES.NUMBER) {
                const newVal = updateDynamicValue(tile.name, isWin ? 1 : -1);
                if (newVal <= GAME_CONFIG.DYNAMIC_MIN || newVal >= GAME_CONFIG.DYNAMIC_MAX) {
                    boundaryHit = true;
                }
            }
        });

        // Scoring
        const scoreDelta = isWin ? Math.abs(nextVal - currentVal) + GAME_CONFIG.WIN_SCORE_BASE : GAME_CONFIG.LOSS_PENALTY;
        const newScore = Math.max(0, state.score + scoreDelta);

        // State Update
        store.setState({
            score: newScore,
            currentHand: nextHand,
            currentHandValue: nextVal,
            history: [...state.history, { hand: state.currentHand, value: currentVal, result: isWin ? 'WIN' : 'LOSS' }],
            ...this.deck.getStats()
        });

        this.deck.discard(state.currentHand);

        // Check Game Over
        if (boundaryHit) {
            this.endGame();
        }
    }

    async endGame() {
        const state = store.getState();
        store.setState({ gamePhase: PHASES.GAME_OVER });
        
        // Save to database
        await Api.saveScore(state.playerName, state.score);
    }
}

export const engine = new GameEngine();
