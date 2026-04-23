import { playTone, getAudioContext } from '../utils.js';

export function playGameOver() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const volume = 0.15;
  playTone(ctx, { frequency: 440, duration: 0.2, volume, type: 'square' });
  playTone(ctx, { frequency: 330, duration: 0.2, volume, type: 'square', startOffset: 0.2 });
  playTone(ctx, { frequency: 220, duration: 0.6, volume, type: 'square', startOffset: 0.4, slideTo: 55 });
}
