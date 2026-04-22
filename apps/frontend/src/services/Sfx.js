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

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.02);
    }

    playBetClick() {
        this.playTone({ frequency: 900, duration: 0.05, volume: 0.03, type: 'square' });
    }

    playWinChime() {
        this.playTone({ frequency: 660, duration: 0.09, volume: 0.04, type: 'triangle' });
        this.playTone({ frequency: 880, duration: 0.12, volume: 0.045, type: 'triangle', startOffset: 0.08 });
    }

    playLoseThud() {
        this.playTone({ frequency: 180, duration: 0.16, volume: 0.05, type: 'sawtooth', slideTo: 90 });
    }
}

export const sfx = new SfxService();