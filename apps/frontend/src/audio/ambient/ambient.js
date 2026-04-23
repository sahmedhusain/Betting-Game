import { getAudioContext } from '../utils.js';

let droneGain = null;
let oscillators = [];

export function playAmbient() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (droneGain) stopAmbient();

  droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0, ctx.currentTime);
  droneGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
  droneGain.connect(ctx.destination);

  const frequencies = [110, 164.81, 220]; 
  frequencies.forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.connect(droneGain);
    osc.start();
    oscillators.push(osc);
  });
}

export function stopAmbient() {
  const ctx = getAudioContext();
  if (droneGain && ctx) {
    droneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => {
      oscillators.forEach(osc => osc.stop());
      oscillators = [];
      droneGain = null;
    }, 1100);
  }
}
