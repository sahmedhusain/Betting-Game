import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { TILE_TYPES, calculateHandValue, updateDynamicValue } from './TileConfig.js';
import { GAME_CONFIG, PHASES } from '../utils/constants.js';
import { Api } from '../services/Api.js';

class GameEngine {
    constructor() {
        this.deck = new Deck();
    }

    async loadLeaderboard() {
        try {
            const scores = await Api.getLeaderboard();
            store.setState({ leaderboard: scores });
        } catch (err) {
            console.error("Failed to load leaderboard:", err);
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

        Api.logGameSession({ player_name: playerName, action: 'START_GAME' });
    }

    betHigher() { this.processBet('HIGHER'); }
    betLower() { this.processBet('LOWER'); }

    processBet(betType) {
        const state = store.getState();
        const currentVal = state.currentHandValue;
        const nextHand = this.deck.draw(GAME_CONFIG.HAND_SIZE);

        if (nextHand.length < GAME_CONFIG.HAND_SIZE) {
            this.endGame();
            return;
        }

        const nextVal = calculateHandValue(nextHand);
        let isWin = false;
        if (betType === 'HIGHER' && nextVal > currentVal) isWin = true;
        if (betType === 'LOWER' && nextVal < currentVal) isWin = true;
        if (nextVal === currentVal) isWin = true;

        let boundaryHit = false;
        nextHand.forEach(tile => {
            if (tile.type !== TILE_TYPES.NUMBER) {
                const newVal = updateDynamicValue(tile.name, isWin ? 1 : -1);
                if (newVal <= GAME_CONFIG.DYNAMIC_MIN || newVal >= GAME_CONFIG.DYNAMIC_MAX) {
                    boundaryHit = true;
                }
            }
        });

        const scoreDelta = isWin ? Math.abs(nextVal - currentVal) + GAME_CONFIG.WIN_SCORE_BASE : GAME_CONFIG.LOSS_PENALTY;
        const newScore = Math.max(0, state.score + scoreDelta);

        store.setState({
            score: newScore,
            currentHand: nextHand,
            currentHandValue: nextVal,
            history: [...state.history, { hand: state.currentHand, value: currentVal, result: isWin ? 'WIN' : 'LOSS' }],
            ...this.deck.getStats()
        });

        this.deck.discard(state.currentHand);
        if (boundaryHit) this.endGame();
    }

    async endGame() {
        const state = store.getState();
        store.setState({ gamePhase: PHASES.GAME_OVER });

        // Save score and then refresh the leaderboard
        await Api.saveScore(state.playerName, state.score);
        await this.loadLeaderboard();
    }
}

export const engine = new GameEngine();
