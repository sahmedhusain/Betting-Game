export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  LEADERBOARD_LIMIT: 5
};
export const API_ENDPOINTS = {
  SCORES: '/scores',
  GAMES: '/games',
  SESSION_START: '/session/start',
  SESSION_VALIDATE: '/session/validate',
  SESSION_LOGOUT: '/session/logout',
  SESSION_STATE: '/session/state'
};

export const API_QUERY = {
  LIMIT: 'limit'
};