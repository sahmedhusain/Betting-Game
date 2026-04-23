import { SOUND_PATHS } from '../utils/constants.js';

class SoundService {
  constructor() {
    this.sfxVolume = 0.5;
    this.ambientVolume = 0.3;
    this.ambientAudio = null;
    this.isMuted = false;
  }

  setMute(muted) {
    this.isMuted = muted;
    if (this.ambientAudio) {
      this.ambientAudio.muted = muted;
    }
  }

  /**
   * Plays a one-shot sound effect.
   * @param {string} path - Path to the sound file.
   */
  playSFX(path) {
    if (this.isMuted) return;
    
    const audio = new Audio(path);
    audio.volume = this.sfxVolume;
    audio.play().catch(err => console.warn('SFX playback failed:', err));
  }

  /**
   * Plays background music on a loop.
   * @param {string} path - Path to the ambient file.
   */
  playAmbient(path) {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
    }

    this.ambientAudio = new Audio(path);
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = this.ambientVolume;
    this.ambientAudio.muted = this.isMuted;
    
    this.ambientAudio.play().catch(err => {
      console.warn('Ambient playback failed. User interaction might be required.', err);
    });
  }

  stopAmbient() {
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio = null;
    }
  }

  // Quick helper methods
  playClick() { this.playSFX(SOUND_PATHS.SFX.CLICK); }
  playBet() { this.playSFX(SOUND_PATHS.SFX.BET); }
  playWin() { this.playSFX(SOUND_PATHS.SFX.WIN); }
  playLoss() { this.playSFX(SOUND_PATHS.SFX.LOSS); }
  playGameOver() { this.playSFX(SOUND_PATHS.SFX.GAME_OVER); }
}

export const soundService = new SoundService();
export { SOUND_PATHS };
