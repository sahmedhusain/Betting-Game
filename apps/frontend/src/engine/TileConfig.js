import { TILE_TYPES, SUITS, TILE_VALUES, WINDS, DRAGONS, FLOWERS, SEASONS } from '../utils/constants.js';

export const dynamicTileValues = {
    'EAST': TILE_VALUES.INITIAL_BASE,
    'SOUTH': TILE_VALUES.INITIAL_BASE,
    'WEST': TILE_VALUES.INITIAL_BASE,
    'NORTH': TILE_VALUES.INITIAL_BASE,
    'RED': TILE_VALUES.INITIAL_BASE,
    'GREEN': TILE_VALUES.INITIAL_BASE,
    'WHITE': TILE_VALUES.INITIAL_BASE
    /*
    / Flowers
    'PLUM': TILE_VALUES.SPECIAL_BASE,
    'ORCHID': TILE_VALUES.SPECIAL_BASE,
    'BAMBOO_FLOWER': TILE_VALUES.SPECIAL_BASE,
    'CHRYSANTHEMUM': TILE_VALUES.SPECIAL_BASE,
    // Seasons
    'SPRING': TILE_VALUES.SPECIAL_BASE,
    'SUMMER': TILE_VALUES.SPECIAL_BASE,
    'AUTUMN': TILE_VALUES.SPECIAL_BASE,
    'WINTER': TILE_VALUES.SPECIAL_BASE
    */
};

export function getTileValue(tile) {
    if (tile.type === TILE_TYPES.NUMBER) {
        return tile.faceValue;
    }
    return dynamicTileValues[tile.name];
}

export function updateDynamicValue(tileName, delta) {
    if (dynamicTileValues[tileName] !== undefined) {
        dynamicTileValues[tileName] += delta;
        return dynamicTileValues[tileName];
    }
    return 0;
}

export function generateBaseDeck() {
    const deck = [];
    let idCounter = 1;
    const addTile = (type, suit, name, faceValue, copies = 4) => {
        for (let i = 0; i < copies; i++) {
            deck.push({
                id: idCounter++,
                type,
                suit,
                name,
                faceValue
            });
        }
    };

    const numberSuits = [SUITS.DOTS, SUITS.BAMBOO, SUITS.CHARACTERS];
    for (const suit of numberSuits) {
        for (let val = 1; val <= 9; val++) {
            addTile(TILE_TYPES.NUMBER, suit, `${val}_${suit}`, val);
        }
    }

    for (const wind of WINDS) {
        addTile(TILE_TYPES.WIND, SUITS.NONE, wind, TILE_VALUES.INITIAL_BASE);
    }

    for (const dragon of DRAGONS) {
        addTile(TILE_TYPES.DRAGON, SUITS.NONE, dragon, TILE_VALUES.INITIAL_BASE);
    }
    /*
        for (const flower of FLOWERS) {
            addTile(TILE_TYPES.FLOWER, SUITS.NONE, flower, TILE_VALUES.SPECIAL_BASE, 1);
        }
    
        for (const season of SEASONS) {
            addTile(TILE_TYPES.SEASON, SUITS.NONE, season, TILE_VALUES.SPECIAL_BASE, 1);
        }
    */
    return deck;
}

export function calculateHandValue(hand) {
    return hand.reduce((total, tile) => total + getTileValue(tile), 0);
}
