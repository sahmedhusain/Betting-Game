let audioCtx = null;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTone(ctx, { frequency, duration, volume, type = 'sine', startOffset = 0, slideTo = null, envelope = true }) {
  const startTime = ctx.currentTime + startOffset;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, startTime + duration);
  }

  if (envelope) {
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  } else {
    gain.gain.setValueAtTime(volume, startTime);
  }

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.1);

  return { oscillator, gain };
}
