import { playTone, getAudioContext } from '../utils.js';

export function playWin() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const volume = 0.2;
  playTone(ctx, { frequency: 523.25, duration: 0.3, volume, type: 'triangle' });
  playTone(ctx, { frequency: 659.25, duration: 0.3, volume, type: 'triangle', startOffset: 0.05 });
  playTone(ctx, { frequency: 783.99, duration: 0.4, volume, type: 'triangle', startOffset: 0.1 });
}
