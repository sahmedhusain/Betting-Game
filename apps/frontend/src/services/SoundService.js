import { GAME_CONFIG } from '../utils/constants.js';

class SoundService {
  constructor() {
    this.isMuted = GAME_CONFIG.SOUND_DISABLED;
  }

  setMute(muted) {
    this.isMuted = muted;
    if (muted) this.stopAmbient();
    else this.playAmbient();
  }

  async playClick() { 
    if (this.isMuted) return;
    const { playClick } = await import('../audio/sfx/click.js');
    playClick();
  }

  async playBet() { 
    if (this.isMuted) return;
    const { playBet } = await import('../audio/sfx/bet.js');
    playBet();
  }

  async playWin() { 
    if (this.isMuted) return;
    const { playWin } = await import('../audio/sfx/win.js');
    playWin();
  }

  async playLoss() { 
    if (this.isMuted) return;
    const { playLoss } = await import('../audio/sfx/loss.js');
    playLoss();
  }

  async playGameOver() { 
    if (this.isMuted) return;
    const { playGameOver } = await import('../audio/sfx/gameOver.js');
    playGameOver();
  }

  async playAmbient() { 
    if (this.isMuted) return;
    const { playAmbient } = await import('../audio/ambient/ambient.js');
    playAmbient();
  }

  async stopAmbient() { 
    const { stopAmbient } = await import('../audio/ambient/ambient.js');
    stopAmbient();
  }
}

export const soundService = new SoundService();
