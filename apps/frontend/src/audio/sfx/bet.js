import { playTone, getAudioContext } from '../utils.js';
import { SFX_PROFILES } from '../../utils/constants.js';

export function playBet() {
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(ctx, SFX_PROFILES.BET);
}

