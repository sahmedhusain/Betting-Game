import { store } from '../state/State.js';
import { Deck } from './Deck.js';
import { getTileValue, updateDynamicValue, TILE_TYPES } from './TileConfig.js';

export class GameEngine {

    constructor() {
        this.deck = null;
    }

    startGame(playerName) {
        this.deck = new Deck();

        // Reset the PicoJS framework states
        store.setState({
            playerName: playerName,
            score: 0,
            currentHand: [],
            currentHandValue: 0,
            history: [],
            gamePhase: 'PLAYING',
            errorMessage: '',
            ...this.deck.getStats()
        });
        this.dealNewHand();
    }
    // Start with five tiles to the player
    dealNewHand() {
        const newHand = this.deck.draw(5);

        if (newHand.length < 5) {
            this.endGame();
            return;
        }

        const handValue = this.calculateHandValue(newHand); // Calculate the score of the on-hand tiles

        store.setState({
            currentHand: newHand,
            currentHandValue: handValue,
            ...this.deck.getStats()
        });
    }

    calculateHandValue(hand) {
        return hand.reduce((total, tile) => total + getTileValue(tile), 0);
    }

    submitHand() {
        const state = store.getState();
        const value = state.currentHandValue;

        // Add on-hand value to total score
        const newScore = state.score + value;

        state.currentHand.forEach(tile => {
            if (tile.type !== TILE_TYPES.NUMBER) {
                updateDynamicValue(tile.name, 1);
            }
        });
        // Save to history
        const newHistory = [...state.history, { hand: state.currentHand, value }];
        this.deck.discard(state.currentHand);
        // Update state
        store.setState({
            score: newScore,
            history: newHistory,
            ...this.deck.getStats()
        });
        this.dealNewHand(); // Next hand
    }

    async endGame() {
        const state = store.getState();
        store.setState({ gamePhase: 'GAME_OVER' });
        const payload = {
            username: state.playerName,
            score: state.score,
            hands_played: state.history.length
        };

        try {
            // Log the game session (POST /api/games)
            await fetch('http://localhost:8080/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            // Update the Leaderboard (POST /api/scores)
            await fetch('http://localhost:8080/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error("Failed to save to backend:", error);
            store.setState({ errorMessage: 'Failed to sync score with server.' });
        }
    }
}
export const engine = new GameEngine();
