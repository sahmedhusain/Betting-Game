export const TILE_TYPES = {
    NUMBER: 'NUMBER',
    WIND: 'WIND',
    DRAGON: 'DRAGON'
};

export const SUITS = {
    DOTS: 'DOTS',
    BAMBOO: 'BAMBOO',
    CHARACTERS: 'CHARACTERS',
    NONE: 'NONE' // no suit for this
};

export const INITIAL_BASE_VALUE = 5; // Dragons and Winds start value

export const dynamicTileValues = { // Up down scales for Winds and Dragons "dynamic"
    'EAST': INITIAL_BASE_VALUE,
    'SOUTH': INITIAL_BASE_VALUE,
    'WEST': INITIAL_BASE_VALUE,
    'NORTH': INITIAL_BASE_VALUE,
    'RED': INITIAL_BASE_VALUE,
    'GREEN': INITIAL_BASE_VALUE,
    'WHITE': INITIAL_BASE_VALUE
};

// numbred and non-numbred tiles values return
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

// Genarate a standard deck of 144 tiles (4 copies of each tile type)
export function generateBaseDeck() {
    const deck = [];
    let idCounter = 1;
    const addTile = (type, suit, name, faceValue) => {
        for (let i = 0; i < 4; i++) {
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

    const winds = ['EAST', 'SOUTH', 'WEST', 'NORTH'];
    for (const wind of winds) {
        addTile(TILE_TYPES.WIND, SUITS.NONE, wind, INITIAL_BASE_VALUE);
    }

    const dragons = ['RED', 'GREEN', 'WHITE'];
    for (const dragon of dragons) {
        addTile(TILE_TYPES.DRAGON, SUITS.NONE, dragon, INITIAL_BASE_VALUE);
    }
    return deck;
}

export function calculateHandValue(hand) {
    return hand.reduce((total, tile) => total + getTileValue(tile), 0);
}
