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

// Noise buffer for roars/whooshes
function noiseBuffer(c: AudioContext, dur: number) {
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function scaryRoar(duration = 2.5) {
  const c = ac(); if (!c) return;
  const now = c.currentTime;
  // Low rumble
  const o1 = c.createOscillator();
  o1.type = "sawtooth";
  o1.frequency.setValueAtTime(55, now);
  o1.frequency.exponentialRampToValueAtTime(35, now + duration);
  const g1 = c.createGain();
  g1.gain.setValueAtTime(0.0001, now);
  g1.gain.exponentialRampToValueAtTime(0.25, now + 0.15);
  g1.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o1.connect(g1).connect(c.destination);
  o1.start(now); o1.stop(now + duration);

  // Growl modulator
  const o2 = c.createOscillator();
  o2.type = "square";
  o2.frequency.setValueAtTime(110, now);
  o2.frequency.exponentialRampToValueAtTime(70, now + duration);
  const g2 = c.createGain();
  g2.gain.setValueAtTime(0.0001, now);
  g2.gain.exponentialRampToValueAtTime(0.08, now + 0.2);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  const lfo = c.createOscillator();
  lfo.frequency.value = 12;
  const lfoGain = c.createGain(); lfoGain.gain.value = 30;
  lfo.connect(lfoGain).connect(o2.frequency);
  o2.connect(g2).connect(c.destination);
  lfo.start(now); lfo.stop(now + duration);
  o2.start(now); o2.stop(now + duration);

  // Noise hiss
  const noise = c.createBufferSource();
  noise.buffer = noiseBuffer(c, duration);
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.setValueAtTime(800, now);
  filt.frequency.exponentialRampToValueAtTime(200, now + duration);
  const gn = c.createGain();
  gn.gain.setValueAtTime(0.0001, now);
  gn.gain.exponentialRampToValueAtTime(0.15, now + 0.1);
  gn.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  noise.connect(filt).connect(gn).connect(c.destination);
  noise.start(now); noise.stop(now + duration);
}

function alienDrone(duration = 3) {
  const c = ac(); if (!c) return;
  const now = c.currentTime;
  // Eerie detuned pair
  const freqs = [180, 183];
  freqs.forEach((f) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f, now);
    o.frequency.linearRampToValueAtTime(f * 0.5, now + duration);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.connect(g).connect(c.destination);
    o.start(now); o.stop(now + duration);
  });
  // High shimmer
  const o2 = c.createOscillator();
  o2.type = "triangle";
  o2.frequency.setValueAtTime(1320, now);
  const lfo = c.createOscillator(); lfo.frequency.value = 7;
  const lfoG = c.createGain(); lfoG.gain.value = 80;
  lfo.connect(lfoG).connect(o2.frequency);
  const g2 = c.createGain();
  g2.gain.setValueAtTime(0.0001, now);
  g2.gain.exponentialRampToValueAtTime(0.05, now + 0.4);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  o2.connect(g2).connect(c.destination);
  lfo.start(now); lfo.stop(now + duration);
  o2.start(now); o2.stop(now + duration);
}

function kawaiiJingle() {
  const c = ac(); if (!c) return;
  // Cute pentatonic arpeggio (J-pop kawaii vibe)
  const notes = [880, 1109, 1319, 1760, 1319, 1109, 1480, 1760];
  notes.forEach((f, i) => {
    setTimeout(() => {
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      const g = c.createGain();
      const t = c.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g).connect(c.destination);
      o.start(t); o.stop(t + 0.25);
    }, i * 140);
  });
}

export const sfx = {
  click: () => tone(880, 0.05, "square"),
  blip: () => tone(660, 0.07, "triangle"),
  power: () => { tone(220, 0.08); setTimeout(() => tone(440, 0.08), 60); },
  death: () => { tone(330, 0.12, "sawtooth"); setTimeout(() => tone(160, 0.18, "sawtooth"), 100); },
  coin: () => { tone(988, 0.05); setTimeout(() => tone(1318, 0.08), 50); },
  scaryRoar,
  alienDrone,
  kawaiiJingle,
};
