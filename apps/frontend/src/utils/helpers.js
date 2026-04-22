export const PLAYER_NAME_MAX_LEN = 16;
export const PLAYER_NAME_REGEX = /^[A-Za-z0-9._-]+$/;

export function normalizePlayerName(name = '') {
  return name.trim();
}

export function validatePlayerName(name = '') {
  if (!name) {
    return 'Player name is required.';
  }

  if (name.length > PLAYER_NAME_MAX_LEN) {
    return `Player name must be at most ${PLAYER_NAME_MAX_LEN} characters.`;
  }

  if (!PLAYER_NAME_REGEX.test(name)) {
    return 'Use only letters, numbers, dot (.), underscore (_), or hyphen (-).';
  }

  return null;
}

export function formatScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '0';
  return numeric.toLocaleString();
}
