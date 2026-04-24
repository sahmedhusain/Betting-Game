export const I18N = {
  en: {
    landing: {
      branding: (import.meta.env.VITE_APP_NAME && import.meta.env.VITE_APP_NAME !== '') ? import.meta.env.VITE_APP_NAME : 'BETTING GAME',
      goBack: 'Go Back',
      registration: 'Identify yourself',
      title: 'MAHJONG\nBETTING',
      subtitle: 'Premium betting experience powered by state-of-the-art tile mechanics.',
      logoSubtitle: 'STRATEGIC TILE ENGINE',
      logoSubtitleShort: 'TILE ENGINE',
      playNow: 'Play Now',
      rulesTitle: 'How to Play?',
      rulesTitleShort: 'HOW TO PLAY',
      identifyPlayer: 'Player Name',
      namePlaceholder: 'YOUR NAME',
      allowedNameChars: 'Only alphanumeric, dot (.), underscore (_), or hyphen (-) characters are allowed.',
      nameRules: (minLen, maxLen) => `Character limit: ${minLen}–${maxLen}`,
      startButton: 'Start Game',
      hallOfFame: 'Leaderboard',
      serverUnavailable: 'Server unavailable. Please try again later.',
      serverOffline: 'Server Offline',
      logoAlt: 'Logo'
    },
    loading: {
      authenticating: 'Authenticating'
    },
    game: {
      drawLane: 'Draw Lane',
      deckEmpty: 'Deck Empty',
      cards: 'Cards',
      drawPile: 'Draw Pile',
      discarded: 'Discarded',
      reshuffles: 'Reshuffles',
      bankroll: 'Bankroll',
      currentValue: 'Current Value',
      playerLabel: 'PLAYER',
      anonymousPlayer: 'Anonymous',
      resolvingHand: 'Resolving hand...',
      betLower: 'Bet Lower',
      betHigher: 'Bet Higher',
      waitingForFirstBet: 'Waiting for first bet...',
      handHistory: 'Hand History',
      leaveGame: 'LEAVE GAME',
      leaveGameShort: 'LEAVE',
      leaveGameTitle: 'Leave Game',
      sessionHand: (number) => `GAME HAND #${number}`,
      handValue: 'Hand Value',
      bettingArena: 'BETTING ARENA',
      arena: 'ARENA',
      totalWins: 'Total Wins',
      totalLosses: 'Total Losses',
      drawLaneWithCount: (count) => `Draw Lane · ${count}`,
      reshuffling: 'RESHUFFLING...',
      reloading: 'RELOADING...',
      resolvingDeck: 'Reshuffling Deck',
      cardBackAlt: 'Card Back',
      tileValue: 'Value',
      feedbackWin: 'Bim!',
      feedbackLoss: 'Oh Snap!',
      betHigherAction: 'Bet Higher',
      betLowerAction: 'Bet Lower',
      confirmAction: 'Confirm',
      keyboardH: 'KEYBOARD: H',
      keyboardL: 'KEYBOARD: L',
      keyboardEnter: 'KEYBOARD: ENTER',
      notAvailable: '--'
    },
    leaderboard: {
      unknownPlayer: 'Unknown',
      legend: 'Legend',
      rank: (rank) => `RANK 0${rank}`,
      emptyState: 'No legends recorded yet. Will you be the first?',
      ordinals: ['th', 'st', 'nd', 'rd'],
      legendary: 'LEGENDARY',
      challenger: 'CHALLENGER',
      earnings: 'Earnings'
    },
    end: {
      sessionTerminated: 'BET GAME\nTERMINATED',
      gameOver: 'CAUGHT\nUP!',
      finalBankroll: 'New earnings',
      returnToLobby: 'Return to Terminal',
      playAgain: 'Play Again',
      activityHistory: 'Activity History',
      anonymous: 'Anonymous',
      records: 'Records',
      lifetimeEarnings: 'Total Earnings',
      personalBest: 'Personal Best',
      newTag: 'New record',
      balance: 'Balance',
      noHistory: 'No history recorded',
      comments: {
        newBest: 'Personal best!',
        nearFifth: 'So close to 5th place! Try again!',
        nearFirst: 'So close to 1st place! Try again!',
        solid: 'Solid performance!',
        keepUp: 'Keep it up!',
        bankrupt: 'Regroup and try again.'
      }
    },
    validation: {
      playerNameRequired: 'Player name is required.',
      playerNameMin: (minLen) => `Player name must be at least ${minLen} characters.`,
      playerNameMax: (maxLen) => `Player name must be at most ${maxLen} characters.`,
      playerNameCharset: 'Use only letters, numbers, dot (.), underscore (_), or hyphen (-).'
    },
    api: {
      errors: {
        invalidJsonResponse: 'Invalid JSON response from server.',
        requestFailedWithStatus: (status) => `Request failed with status ${status}`
      }
    },
    engine: {
      errors: {
        loadLeaderboardFailed: 'Failed to load leaderboard:',
        saveScoreFailed: 'Failed to save score:',
        logSessionFailed: 'Failed to log game session:'
      }
    },
    error: {
      unauthorized: {
        code: '401',
        title: 'UNAUTHORIZED',
        message: 'The page you are trying to access requires a valid session. Please identify yourself to continue.',
        buttonText: 'BACK TO HOME'
      },
      notFound: {
        code: '404',
        title: 'PAGE NOT FOUND',
        message: 'The requested page is invalid or has been discarded from the active session.',
        buttonText: 'BACK TO HOME'
      },
      internalServerError: {
        code: '500',
        title: 'INTERNAL SERVER ERROR',
        message: 'An internal server error occurred. Please try again or contact support.',
        buttonText: 'BACK TO HOME'
      },
      general: {
        code: 'ERROR',
        title: 'Unexpected Error',
        message: 'An unexpected state occurred. Please try again or contact support.',
        buttonText: 'BACK TO HOME'
      },
      integrityCompromised: (code) => `SYSTEM_INTEGRITY_COMPROMISED // ERROR_CODE: ${code}`,
      iconAlt: 'Error Icon'
    },
    tiles: {
      WIND_EAST: 'East Wind',
      WIND_SOUTH: 'South Wind',
      WIND_WEST: 'West Wind',
      WIND_NORTH: 'North Wind',
      DRAGON_RED: 'Red Dragon',
      DRAGON_GREEN: 'Green Dragon',
      DRAGON_WHITE: 'White Dragon',
      FLOWER_PLUM: 'Plum Flower',
      FLOWER_ORCHID: 'Orchid Flower',
      FLOWER_BAMBOO_FLOWER: 'Bamboo Flower',
      FLOWER_CHRYSANTHEMUM: 'Chrysanthemum',
      SEASON_SPRING: 'Spring Season',
      SEASON_SUMMER: 'Summer Season',
      SEASON_AUTUMN: 'Autumn Season',
      SEASON_WINTER: 'Winter Season'
    },
    menu: {
      systemNavigation: 'SYSTEM NAVIGATION',
      currentStanding: 'Current Standing',
      controls: 'Controls',
      howToPlay: 'HOW TO PLAY'
    },
    rules: {
      guideTitle: 'Strategic Guide',
      protocolLabel: 'Protocol & Operations',
      pointsLabel: 'Points',
      honorTiles: 'Honor Tiles',
      suitSeries: 'Suit Series',
      systemReady: 'System ready for strategic engagement',
      gotIt: 'Got It',
      winds: 'Winds',
      dragons: 'Dragons',
      flowers: 'Flowers / Seasons',
      bamboo: 'Bamboo',
      characters: 'Characters',
      dots: 'Dots',
      sections: {
        core: 'SYSTEM_CORE // 01',
        registry: 'TILE_REGISTRY // 02',
        inputs: 'INPUT_MATRIX // 03'
      },
      mechanics: [
        { t: 'Analysis', d: 'The sum of all 5 tiles in your hand determines your Current Score.' },
        { t: 'Prediction', d: 'Forecast if the next hand value will exceed or fall below your current total.' },
        { t: 'Resolution', d: 'Correct forecasts award bankroll. Failed attempts trigger penalties.' }
      ]
    }
  }
};

export const DEFAULT_LOCALE = 'en';
export const TEXT = I18N[DEFAULT_LOCALE];