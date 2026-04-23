export const TILE_TYPES = {
    NUMBER: 'NUMBER',
    WIND: 'WIND',
    DRAGON: 'DRAGON',
    FLOWER: 'FLOWER',
    SEASON: 'SEASON'
};

export const SUITS = {
    DOTS: 'DOTS',
    BAMBOO: 'BAMBOO',
    CHARACTERS: 'CHARACTERS',
    NONE: 'NONE'
};

export const INITIAL_BASE_VALUE = 5;
export const SPECIAL_BASE_VALUE = 10; // Flowers and Seasons value

export const dynamicTileValues = { // Up down scales for Winds and Dragons "dynamic"
    'EAST': INITIAL_BASE_VALUE,
    'SOUTH': INITIAL_BASE_VALUE,
    'WEST': INITIAL_BASE_VALUE,
    'NORTH': INITIAL_BASE_VALUE,
    'RED': INITIAL_BASE_VALUE,
    'GREEN': INITIAL_BASE_VALUE,
    'WHITE': INITIAL_BASE_VALUE,
    // Flowers
    'PLUM': SPECIAL_BASE_VALUE,
    'ORCHID': SPECIAL_BASE_VALUE,
    'BAMBOO_FLOWER': SPECIAL_BASE_VALUE,
    'CHRYSANTHEMUM': SPECIAL_BASE_VALUE,
    // Seasons
    'SPRING': SPECIAL_BASE_VALUE,
    'SUMMER': SPECIAL_BASE_VALUE,
    'AUTUMN': SPECIAL_BASE_VALUE,
    'WINTER': SPECIAL_BASE_VALUE
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

// Genarate a standard deck of 144 tiles
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

    const winds = ['EAST', 'SOUTH', 'WEST', 'NORTH'];
    for (const wind of winds) {
        addTile(TILE_TYPES.WIND, SUITS.NONE, wind, INITIAL_BASE_VALUE);
    }

    const dragons = ['RED', 'GREEN', 'WHITE'];
    for (const dragon of dragons) {
        addTile(TILE_TYPES.DRAGON, SUITS.NONE, dragon, INITIAL_BASE_VALUE);
    }

    const flowers = ['PLUM', 'ORCHID', 'BAMBOO_FLOWER', 'CHRYSANTHEMUM'];
    for (const flower of flowers) {
        addTile(TILE_TYPES.FLOWER, SUITS.NONE, flower, SPECIAL_BASE_VALUE, 1);
    }

    const seasons = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
    for (const season of seasons) {
        addTile(TILE_TYPES.SEASON, SUITS.NONE, season, SPECIAL_BASE_VALUE, 1);
    }

    return deck;
}

export function calculateHandValue(hand) {
    return hand.reduce((total, tile) => total + getTileValue(tile), 0);
}
