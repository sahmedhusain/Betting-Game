export const SFX_ENVELOPE = {
  FLOOR_GAIN: 0.0001,
  ATTACK_SECONDS: 0.01,
  STOP_TAIL_SECONDS: 0.02
};

export const SFX_PROFILES = {
  BET_CLICK: [
    { frequency: 900, duration: 0.05, volume: 0.03, type: 'square' }
  ],
  WIN_CHIME: [
    { frequency: 660, duration: 0.09, volume: 0.04, type: 'triangle' },
    { frequency: 880, duration: 0.12, volume: 0.045, type: 'triangle', startOffset: 0.08 }
  ],
  LOSE_THUD: [
    { frequency: 180, duration: 0.16, volume: 0.05, type: 'sawtooth', slideTo: 90 }
  ]
};