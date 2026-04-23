import { playTone, getAudioContext } from '../utils.js';

export function playLoss() {
  const ctx = getAudioContext();
  if (!ctx) return;

  playTone(ctx, {
    frequency: 220,
    duration: 0.4,
    volume: 0.2,
    type: 'sawtooth',
    slideTo: 110
  });
}
