// Tiny synth-based retro game SFX using WebAudio. Zero assets.
let ctx: AudioContext | null = null;
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

function tone(freq: number, dur = 0.08, type: OscillatorType = "square", gain = 0.06) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.value = gain;
  o.connect(g).connect(c.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.stop(c.currentTime + dur);
}

export const sfx = {
  click: () => tone(880, 0.05, "square"),
  blip: () => tone(660, 0.07, "triangle"),
  power: () => { tone(220, 0.08); setTimeout(() => tone(440, 0.08), 60); },
  death: () => { tone(330, 0.12, "sawtooth"); setTimeout(() => tone(160, 0.18, "sawtooth"), 100); },
  coin: () => { tone(988, 0.05); setTimeout(() => tone(1318, 0.08), 50); },
};
