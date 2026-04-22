export const I18N = {
  en: {
    landing: {
      title: 'MAHJONG\nBETTING',
      subtitle: 'High-fidelity strategy powered by dynamic tile scaling.',
      identifyPlayer: 'Identify Player',
      namePlaceholder: 'ENTER YOUR NAME',
      allowedNameChars: 'Allowed: A-Z, 0-9, dot, underscore, hyphen.',
      nameRules: (minLen, maxLen) => `Min ${minLen} / Max ${maxLen}.`,
      startButton: 'Initialize Session',
      hallOfFame: 'Hall of Fame'
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
      betLower: 'Bet Lower',
      betHigher: 'Bet Higher',
      waitingForFirstBet: 'Waiting for first bet...',
      handHistory: 'Hand History',
      sessionHand: (number) => `SESSION HAND #${number}`,
      handValue: 'Hand Value'
    },
    leaderboard: {
      unknownPlayer: 'Unknown',
      rank: (rank) => `RANK 0${rank}`,
      emptyState: 'No legends recorded yet. Will you be the first?'
    },
    end: {
      sessionTerminated: 'Session Terminated',
      gameOver: 'GAME\nOVER',
      finalBankroll: 'Final Bankroll',
      hallOfFameNotice: 'Your performance has been recorded in the Hall of Fame.',
      returnToLobby: 'Return to Lobby'
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
    }
  }
};

export const DEFAULT_LOCALE = 'en';
export const TEXT = I18N[DEFAULT_LOCALE];