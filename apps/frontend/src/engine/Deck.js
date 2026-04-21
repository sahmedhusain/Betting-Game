import { generateBaseDeck } from './TileConfig.js';

export class Deck {
    constructor() {
        this.drawPile = [];
        this.discardPile = [];
        this.reshuffleCount = 0;
        this.initializeNewDeck();
    }


    initializeNewDeck() {
        // grab a fresh deck and shuffle it right away
        const freshDeck = generateBaseDeck();
        this.drawPile = this.shuffle(freshDeck);
    }

    shuffle(array) {
        // standard fisher-yates shuffle
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

        // if we reshuffled 3 times, stop the game
        if (this.reshuffleCount >= 3) {
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

        // pull tiles one by one, reshuffling if the pile empties
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
}
