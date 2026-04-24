import { generateBaseDeck } from './TileConfig.js';
import { GAME_CONFIG } from '../utils/constants.js';

export class Deck {
    constructor() {
        this.drawPile = [];
        this.discardPile = [];
        this.reshuffleCount = 0;
        this.initializeNewDeck();
    }


    initializeNewDeck() {
        const freshDeck = generateBaseDeck();
        this.drawPile = this.shuffle(freshDeck);
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }


    discard(hand) {
        this.discardPile.push(...hand);
    }

    reshuffle() {
        this.reshuffleCount++;

        if (this.reshuffleCount >= GAME_CONFIG.MAX_RESHUFFLES) {
            return false;
        }

        const freshDeck = generateBaseDeck();
        const combined = [...freshDeck, ...this.discardPile];

        this.drawPile = this.shuffle(combined);
        this.discardPile = [];

        return true;
    }

    draw(count) {
        const drawnTiles = [];

        for (let i = 0; i < count; i++) {
            if (this.drawPile.length === 0) {
                const canReshuffle = this.reshuffle();
                if (!canReshuffle) break;
            }

            drawnTiles.push(this.drawPile.pop());
        }

        return drawnTiles;
    }

    getStats() {
        return {
            drawPileCount: this.drawPile.length,
            discardPileCount: this.discardPile.length,
            reshuffleCount: this.reshuffleCount
        };
    }

    exportState() {
        return {
            drawPile: this.drawPile,
            discardPile: this.discardPile,
            reshuffleCount: this.reshuffleCount
        };
    }

    importState(state) {
        if (!state) return;
        this.drawPile = state.drawPile || [];
        this.discardPile = state.discardPile || [];
        this.reshuffleCount = state.reshuffleCount || 0;
    }
}
