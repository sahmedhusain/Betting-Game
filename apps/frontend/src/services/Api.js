import { API_CONFIG, API_ENDPOINTS, API_QUERY, TEXT } from '../utils/constants.js';

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
    return { player_name: TEXT.leaderboard.unknownPlayer, score: 0 };
  }

  return {
    player_name: asString(entry.player_name ?? entry.username, TEXT.leaderboard.unknownPlayer),
    score: asNumber(entry.score, 0),
    highest_score: asNumber(entry.highest_score ?? entry.score, 0)
  };
}

function extractLeaderboardArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload) && Array.isArray(payload.scores)) return payload.scores;
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data;
  return [];
}

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(TEXT.api.errors.invalidJsonResponse);
  }
}

async function requestJson(url, init) {
  const response = await fetch(url, init);
  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const message = isRecord(payload)
      ? asString(payload.error || payload.message, TEXT.api.errors.requestFailedWithStatus(response.status))
      : TEXT.api.errors.requestFailedWithStatus(response.status);
    throw new Error(message);
  }

  return payload;
}

export const Api = {
  async getLeaderboard() {
    const params = new URLSearchParams({
      [API_QUERY.LIMIT]: String(API_CONFIG.LEADERBOARD_LIMIT)
    });

    const payload = await requestJson(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.SCORES}?${params.toString()}`
    );

    return extractLeaderboardArray(payload)
      .map(normalizeScoreEntry)
      .slice(0, API_CONFIG.LEADERBOARD_LIMIT);
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

    // Return a stable object
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
  }
};