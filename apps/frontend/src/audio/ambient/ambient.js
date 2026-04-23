import { getAudioContext } from '../utils.js';
import { AMBIENT_CONFIG } from '../../utils/constants.js';

let droneGain = null;
let droneFilter = null;
let oscillators = [];

export function playAmbient() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (droneGain) stopAmbient();

  const config = AMBIENT_CONFIG;

  droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(config.FILTER_FREQ, ctx.currentTime);
  droneFilter.Q.setValueAtTime(1, ctx.currentTime);

  droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0, ctx.currentTime);
  droneGain.gain.linearRampToValueAtTime(config.VOLUME, ctx.currentTime + config.FADE_IN_DURATION);

  droneFilter.connect(droneGain);
  droneGain.connect(ctx.destination);

  config.FREQUENCIES.forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(droneFilter);
    osc.start();
    oscillators.push(osc);
  });
}

export function stopAmbient() {
  const ctx = getAudioContext();
  const config = AMBIENT_CONFIG;
  if (droneGain && ctx) {
    droneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + config.FADE_OUT_DURATION);
    setTimeout(() => {
      oscillators.forEach(osc => osc.stop());
      oscillators = [];
      droneGain = null;
      droneFilter = null;
    }, (config.FADE_OUT_DURATION + 0.1) * 1000);
  }
}

