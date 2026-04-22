import { TEXT, UI_CONFIG } from './constants.js';

export const PLAYER_NAME_MAX_LEN = UI_CONFIG.PLAYER_NAME_MAX_LEN;
export const PLAYER_NAME_MIN_LEN = UI_CONFIG.PLAYER_NAME_MIN_LEN;
export const PLAYER_NAME_REGEX = /^[A-Za-z0-9._-]+$/;

export function normalizePlayerName(name = '') {
  return name.trim();
}

export function validatePlayerName(name = '') {
  if (!name) {
    return TEXT.validation.playerNameRequired;
  }

  if (name.length < PLAYER_NAME_MIN_LEN) {
    return TEXT.validation.playerNameMin(PLAYER_NAME_MIN_LEN);
  }

  if (name.length > PLAYER_NAME_MAX_LEN) {
    return TEXT.validation.playerNameMax(PLAYER_NAME_MAX_LEN);
  }

  if (!PLAYER_NAME_REGEX.test(name)) {
    return TEXT.validation.playerNameCharset;
  }

  return null;
}

export function formatScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '0';
  return numeric.toLocaleString();
}