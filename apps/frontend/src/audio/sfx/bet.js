import { playTone, getAudioContext } from '../utils.js';

export function playBet() {
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(ctx, {
    frequency: 440,
    duration: 0.1,
    volume: 0.15,
    type: 'sine',
    slideTo: 880
  });
}
