import { SFX_ENVELOPE, SFX_PROFILES } from './sfxPresets.js';

class SfxService {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  playTone({ frequency, duration, volume, type = 'sine', startOffset = 0, slideTo = null }) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const startTime = ctx.currentTime + startOffset;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    if (slideTo) {
      oscillator.frequency.linearRampToValueAtTime(slideTo, startTime + duration);
    }

    gain.gain.setValueAtTime(SFX_ENVELOPE.FLOOR_GAIN, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + SFX_ENVELOPE.ATTACK_SECONDS);
    gain.gain.exponentialRampToValueAtTime(SFX_ENVELOPE.FLOOR_GAIN, startTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + SFX_ENVELOPE.STOP_TAIL_SECONDS);
  }

  playPattern(pattern = []) {
    pattern.forEach((tone) => this.playTone(tone));
  }

  playBetClick() {
    this.playPattern(SFX_PROFILES.BET_CLICK);
  }

  playWinChime() {
    this.playPattern(SFX_PROFILES.WIN_CHIME);
  }

  playLoseThud() {
    this.playPattern(SFX_PROFILES.LOSE_THUD);
  }
}

export const sfx = new SfxService();