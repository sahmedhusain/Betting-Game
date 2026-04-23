import { playTone, getAudioContext } from '../utils.js';
import { SFX_PROFILES } from '../../utils/constants.js';

export function playGameOver() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const profile = SFX_PROFILES.GAME_OVER;
  profile.notes.forEach(note => {
    playTone(ctx, { 
      frequency: note.frequency, 
      duration: note.duration, 
      volume: profile.volume, 
      type: profile.type, 
      startOffset: note.offset,
      slideTo: note.slideTo
    });
  });
}

