import { playTone, getAudioContext } from '../utils.js';
import { SFX_PROFILES } from '../../utils/constants.js';

export function playWin() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const profile = SFX_PROFILES.WIN;
  profile.notes.forEach(note => {
    playTone(ctx, { 
      frequency: note.frequency, 
      duration: note.duration, 
      volume: profile.volume, 
      type: profile.type, 
      startOffset: note.offset 
    });
  });
}

