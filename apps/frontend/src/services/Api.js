import { API_CONFIG, API_ENDPOINTS, API_QUERY, TEXT } from '../utils/constants.js';
import { store } from '../state/State.js';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asString(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeScoreEntry(entry) {
  if (!isRecord(entry)) {
    return { player_name: TEXT.leaderboard.unknownPlayer, score: 0, highest_score: 0 };
  }

  const name = entry.player_name || entry.username || entry.name || TEXT.leaderboard.unknownPlayer;
  const score = entry.highest_score ?? entry.score ?? 0;

  return {
    player_name: asString(name, TEXT.leaderboard.unknownPlayer),
    score: asNumber(score, 0),
    highest_score: asNumber(score, 0)
  };
}

function extractLeaderboardArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  
  const wrappers = ['scores', 'data', 'leaderboard', 'entries'];
  for (const key of wrappers) {
    if (isRecord(payload) && Array.isArray(payload[key])) {
      return payload[key];
    }
  }
  
  return [];
}

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('JSON Parse Error:', err, 'Raw text:', text);
    throw new Error(TEXT.api.errors.invalidJsonResponse);
  }
}

async function requestJson(url, init = {}) {
  try {
    const response = await fetch(url, {
      ...init,
      credentials: 'include'
    });
    
    const payload = await parseJsonSafe(response);

    if (response.status === 401) {
      if (store) {
        store.setState({ sessionValid: false, playerName: '' });
      }
    }

    if (!response.ok) {
      const message = isRecord(payload)
        ? asString(payload.error || payload.message, TEXT.api.errors.requestFailedWithStatus(response.status))
        : TEXT.api.errors.requestFailedWithStatus(response.status);
      throw new Error(message);
    }

    return payload;
  } catch (err) {
    throw err;
  }
}

export const Api = {
  async startSession(username) {
    return await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SESSION_START}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
  },

  async validateSession() {
    return await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SESSION_VALIDATE}`, {
      method: 'GET'
    });
  },

  async logoutSession() {
    return await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SESSION_LOGOUT}`, {
      method: 'POST'
    });
  },

  async saveGameState(state) {
    return await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SESSION_STATE}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  },

  async getLeaderboard() {
    try {
      const params = new URLSearchParams({
        [API_QUERY.LIMIT]: String(API_CONFIG.LEADERBOARD_LIMIT)
      });

      const payload = await requestJson(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCORES}?${params.toString()}`
      );

      const normalized = extractLeaderboardArray(payload)
        .map(normalizeScoreEntry)
        .slice(0, API_CONFIG.LEADERBOARD_LIMIT);
        
      return normalized;
    } catch (err) {
      console.error('Api.getLeaderboard failed:', err);
      throw err;
    }
  },

  async saveScore(playerName, score, handsPlayed = 0) {
    const payload = await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCORES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        player_name: playerName, 
        score,
        hands_played: handsPlayed 
      })
    });

    return normalizeScoreEntry(
      isRecord(payload) ? payload : { player_name: playerName, score }
    );
  },

  async logGameSession(data) {
    await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GAMES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },
  
  async getGameHistory() {
    return await requestJson(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.GAMES}`, {
      method: 'GET'
    });
  }
};