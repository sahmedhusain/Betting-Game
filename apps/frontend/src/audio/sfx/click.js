import { playTone, getAudioContext } from '../utils.js';

export function playClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  playTone(ctx, {
    frequency: 1200,
    duration: 0.05,
    volume: 0.1,
    type: 'sine'
  });
}
