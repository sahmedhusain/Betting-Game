export const SFX_PROFILES = {
  CLICK: {
    frequency: 1200,
    duration: 0.05,
    volume: 0.1,
    type: 'sine'
  },
  BET: {
    frequency: 440,
    duration: 0.1,
    volume: 0.15,
    type: 'sine',
    slideTo: 880
  },
  WIN: {
    notes: [
      { frequency: 523.25, duration: 0.3, offset: 0 },
      { frequency: 659.25, duration: 0.3, offset: 0.05 },
      { frequency: 783.99, duration: 0.4, offset: 0.1 }
    ],
    volume: 0.2,
    type: 'triangle'
  },
  LOSS: {
    frequency: 220,
    duration: 0.4,
    volume: 0.2,
    type: 'sawtooth',
    slideTo: 110
  },
  GAME_OVER: {
    notes: [
      { frequency: 440, duration: 0.2, offset: 0 },
      { frequency: 330, duration: 0.2, offset: 0.2 },
      { frequency: 220, duration: 0.6, offset: 0.4, slideTo: 55 }
    ],
    volume: 0.15,
    type: 'square'
  }
};

export const AMBIENT_CONFIG = {
  FREQUENCIES: [110, 164.81],
  VOLUME: 0.02,
  FILTER_FREQ: 300,
  FADE_IN_DURATION: 3,
  FADE_OUT_DURATION: 1.5
};
