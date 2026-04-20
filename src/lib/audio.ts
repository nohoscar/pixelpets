// Lightweight sound system using WebAudio.
// No external assets — sounds are synthesized on the fly.
// Persists volume + mute to localStorage.

type SoundName =
  | "click" | "coin" | "happy" | "sad" | "eat" | "snore"
  | "shoot" | "reload" | "pop"
  | "pickaxe" | "halo" | "lightsaber" | "claws" | "bow" | "sniper"
  | "portal" | "keyblade" | "swordSlash" | "gravity" | "bfg"
  | "kar98" | "awp" | "buster" | "gunblade" | "hammer"
  | "chainsaw" | "plasma" | "needler" | "crossbow" | "katana"
  | "shuriken" | "magic" | "bomb" | "splash" | "whoosh";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const STORAGE_KEY = "desktop-pets-audio-v1";

interface AudioState {
  volume: number; // 0..1
  muted: boolean;
}

function readState(): AudioState {
  if (typeof window === "undefined") return { volume: 0.5, muted: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { volume: 0.5, muted: false, ...JSON.parse(raw) };
  } catch {}
  return { volume: 0.5, muted: false };
}

function writeState(s: AudioState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    const s = readState();
    masterGain.gain.value = s.muted ? 0 : s.volume;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function setMasterFromState() {
  const s = readState();
  if (masterGain) masterGain.gain.value = s.muted ? 0 : s.volume;
}

export function setVolume(v: number) {
  const s = readState();
  s.volume = Math.max(0, Math.min(1, v));
  writeState(s);
  setMasterFromState();
}

export function setMuted(m: boolean) {
  const s = readState();
  s.muted = m;
  writeState(s);
  setMasterFromState();
}

export function getAudioState(): AudioState {
  return readState();
}

// Helpers ------------------------------------------------------------

function tone(opts: {
  freq: number;
  duration: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  freqEnd?: number;
  gain?: number;
  delay?: number;
}) {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  const t0 = c.currentTime + (opts.delay || 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type || "sine";
  osc.frequency.setValueAtTime(opts.freq, t0);
  if (opts.freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.freqEnd), t0 + opts.duration);
  }
  const peak = opts.gain ?? 0.4;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + (opts.attack ?? 0.005));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);
  osc.connect(g).connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + opts.duration + 0.05);
}

function noise(opts: { duration: number; gain?: number; filter?: number; delay?: number }) {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  const t0 = c.currentTime + (opts.delay || 0);
  const len = Math.floor((c.sampleRate * opts.duration));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = opts.gain ?? 0.3;
  if (opts.filter) {
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = opts.filter;
    src.connect(bp).connect(g).connect(masterGain);
  } else {
    src.connect(g).connect(masterGain);
  }
  src.start(t0);
}

// Public sounds ------------------------------------------------------

export function playSound(name: SoundName) {
  const s = readState();
  if (s.muted || s.volume <= 0) return;
  switch (name) {
    case "click":
      // Cute UI blip
      tone({ freq: 1200, freqEnd: 1600, duration: 0.05, type: "square", gain: 0.15 });
      break;
    case "pop":
      // Bubble pop — Animal Crossing style
      tone({ freq: 800, freqEnd: 1800, duration: 0.08, type: "sine", gain: 0.3 });
      tone({ freq: 1400, duration: 0.04, type: "triangle", gain: 0.15, delay: 0.04 });
      break;
    case "coin":
      // Classic 8-bit coin (Mario-ish)
      tone({ freq: 988, duration: 0.06, type: "square", gain: 0.22 });
      tone({ freq: 1318, duration: 0.18, type: "square", gain: 0.22, delay: 0.06 });
      break;
    case "happy":
      // Cute chirp arpeggio — rising
      tone({ freq: 784, duration: 0.07, type: "square", gain: 0.18 });
      tone({ freq: 988, duration: 0.07, type: "square", gain: 0.18, delay: 0.07 });
      tone({ freq: 1318, duration: 0.12, type: "square", gain: 0.18, delay: 0.14 });
      tone({ freq: 1568, duration: 0.16, type: "triangle", gain: 0.18, delay: 0.26 });
      break;
    case "sad":
      // Cute "aww" — descending wobble
      tone({ freq: 660, freqEnd: 330, duration: 0.35, type: "triangle", gain: 0.22 });
      tone({ freq: 550, freqEnd: 280, duration: 0.35, type: "square", gain: 0.1, delay: 0.05 });
      break;
    case "eat":
      // Cute munch — soft chirpy bites instead of harsh noise
      tone({ freq: 700, freqEnd: 500, duration: 0.06, type: "triangle", gain: 0.25 });
      tone({ freq: 600, freqEnd: 400, duration: 0.06, type: "triangle", gain: 0.25, delay: 0.1 });
      tone({ freq: 800, freqEnd: 550, duration: 0.06, type: "triangle", gain: 0.25, delay: 0.2 });
      break;
    case "snore":
      // Cute sleepy whistle (zZz) instead of grumpy saw
      tone({ freq: 440, freqEnd: 660, duration: 0.35, type: "sine", gain: 0.2 });
      tone({ freq: 660, freqEnd: 330, duration: 0.35, type: "sine", gain: 0.18, delay: 0.4 });
      break;
    case "shoot":
      // 8-bit arcade pew-pew (descending square zap)
      tone({ freq: 1800, freqEnd: 200, duration: 0.12, type: "square", gain: 0.35 });
      tone({ freq: 900, freqEnd: 100, duration: 0.1, type: "square", gain: 0.2, delay: 0.02 });
      break;
    case "reload":
      // 8-bit click-clack — two short square blips
      tone({ freq: 440, duration: 0.04, type: "square", gain: 0.3 });
      tone({ freq: 330, duration: 0.04, type: "square", gain: 0.3, delay: 0.08 });
      tone({ freq: 660, duration: 0.05, type: "square", gain: 0.3, delay: 0.18 });
      break;
    case "pickaxe":
      // Pico picando piedra: thunk + chip metálico
      tone({ freq: 180, freqEnd: 90, duration: 0.08, type: "square", gain: 0.35 });
      noise({ duration: 0.08, filter: 3500, gain: 0.5, delay: 0.02 });
      tone({ freq: 800, freqEnd: 600, duration: 0.05, type: "triangle", gain: 0.18, delay: 0.06 });
      break;
    case "halo":
      // Tajo eléctrico azul — zumbido + corte
      tone({ freq: 1200, freqEnd: 400, duration: 0.18, type: "sawtooth", gain: 0.25 });
      tone({ freq: 2400, freqEnd: 1200, duration: 0.12, type: "square", gain: 0.18, delay: 0.02 });
      noise({ duration: 0.1, filter: 4000, gain: 0.2, delay: 0.04 });
      break;
    case "lightsaber":
      // Vrum-vrum: hum bajo + swish
      tone({ freq: 90, freqEnd: 110, duration: 0.25, type: "sawtooth", gain: 0.25 });
      tone({ freq: 1400, freqEnd: 600, duration: 0.18, type: "sawtooth", gain: 0.22, delay: 0.04 });
      tone({ freq: 220, freqEnd: 180, duration: 0.3, type: "triangle", gain: 0.15, delay: 0.02 });
      break;
    case "claws":
      // Tres tajos rápidos
      noise({ duration: 0.05, filter: 3000, gain: 0.5 });
      tone({ freq: 1800, freqEnd: 600, duration: 0.06, type: "triangle", gain: 0.2 });
      noise({ duration: 0.05, filter: 3500, gain: 0.5, delay: 0.06 });
      tone({ freq: 2000, freqEnd: 700, duration: 0.06, type: "triangle", gain: 0.2, delay: 0.06 });
      noise({ duration: 0.05, filter: 4000, gain: 0.5, delay: 0.12 });
      tone({ freq: 2200, freqEnd: 800, duration: 0.06, type: "triangle", gain: 0.2, delay: 0.12 });
      break;
    case "bow":
      // Cuerda + flecha silbando
      tone({ freq: 200, freqEnd: 80, duration: 0.08, type: "triangle", gain: 0.3 });
      tone({ freq: 1600, freqEnd: 400, duration: 0.25, type: "sine", gain: 0.18, delay: 0.06 });
      break;
    case "sniper":
      // Disparo seco grave + eco
      noise({ duration: 0.1, filter: 1200, gain: 0.7 });
      tone({ freq: 120, freqEnd: 40, duration: 0.25, type: "sawtooth", gain: 0.5 });
      tone({ freq: 80, freqEnd: 30, duration: 0.4, type: "sine", gain: 0.25, delay: 0.15 });
      break;
    case "portal":
      tone({ freq: 1400, freqEnd: 600, duration: 0.12, type: "sine", gain: 0.25 });
      tone({ freq: 200, freqEnd: 80, duration: 0.18, type: "sine", gain: 0.3, delay: 0.08 });
      tone({ freq: 900, duration: 0.06, type: "triangle", gain: 0.15, delay: 0.15 });
      break;
    case "keyblade":
      tone({ freq: 880, duration: 0.08, type: "triangle", gain: 0.22 });
      tone({ freq: 1320, duration: 0.08, type: "triangle", gain: 0.22, delay: 0.05 });
      tone({ freq: 1760, duration: 0.18, type: "sine", gain: 0.2, delay: 0.1 });
      noise({ duration: 0.04, filter: 6000, gain: 0.15 });
      break;
    case "swordSlash":
      noise({ duration: 0.08, filter: 4500, gain: 0.4 });
      tone({ freq: 2200, freqEnd: 600, duration: 0.12, type: "triangle", gain: 0.25 });
      tone({ freq: 1100, freqEnd: 400, duration: 0.1, type: "sine", gain: 0.15, delay: 0.04 });
      break;
    case "gravity":
      tone({ freq: 100, freqEnd: 400, duration: 0.18, type: "sawtooth", gain: 0.25 });
      tone({ freq: 1800, freqEnd: 800, duration: 0.1, type: "square", gain: 0.18, delay: 0.06 });
      noise({ duration: 0.08, filter: 800, gain: 0.2, delay: 0.04 });
      break;
    case "bfg":
      tone({ freq: 60, freqEnd: 30, duration: 0.4, type: "sawtooth", gain: 0.5 });
      tone({ freq: 220, freqEnd: 110, duration: 0.3, type: "square", gain: 0.3, delay: 0.05 });
      noise({ duration: 0.3, filter: 600, gain: 0.5 });
      tone({ freq: 1500, freqEnd: 200, duration: 0.2, type: "sawtooth", gain: 0.2, delay: 0.1 });
      break;
    case "kar98":
      noise({ duration: 0.08, filter: 1500, gain: 0.6 });
      tone({ freq: 150, freqEnd: 60, duration: 0.2, type: "sawtooth", gain: 0.45 });
      tone({ freq: 440, duration: 0.04, type: "square", gain: 0.2, delay: 0.25 });
      tone({ freq: 330, duration: 0.04, type: "square", gain: 0.2, delay: 0.32 });
      break;
    case "awp":
      noise({ duration: 0.12, filter: 1000, gain: 0.7 });
      tone({ freq: 100, freqEnd: 30, duration: 0.3, type: "sawtooth", gain: 0.5 });
      tone({ freq: 60, duration: 0.45, type: "sine", gain: 0.25, delay: 0.2 });
      break;
    case "buster":
      tone({ freq: 1800, freqEnd: 600, duration: 0.1, type: "square", gain: 0.3 });
      tone({ freq: 1200, freqEnd: 400, duration: 0.12, type: "triangle", gain: 0.2, delay: 0.02 });
      break;
    case "gunblade":
      noise({ duration: 0.06, filter: 4000, gain: 0.4 });
      tone({ freq: 2000, freqEnd: 500, duration: 0.1, type: "triangle", gain: 0.22 });
      tone({ freq: 180, freqEnd: 70, duration: 0.15, type: "sawtooth", gain: 0.35, delay: 0.08 });
      break;
    case "hammer":
      tone({ freq: 80, freqEnd: 40, duration: 0.25, type: "sine", gain: 0.5 });
      noise({ duration: 0.1, filter: 400, gain: 0.4 });
      tone({ freq: 2400, freqEnd: 1800, duration: 0.06, type: "square", gain: 0.18, delay: 0.05 });
      break;
    case "chainsaw":
      tone({ freq: 180, freqEnd: 220, duration: 0.4, type: "sawtooth", gain: 0.35 });
      tone({ freq: 90, freqEnd: 110, duration: 0.4, type: "square", gain: 0.3, delay: 0.02 });
      noise({ duration: 0.4, filter: 1200, gain: 0.25 });
      break;
    case "plasma":
      tone({ freq: 600, freqEnd: 1400, duration: 0.1, type: "sine", gain: 0.25 });
      tone({ freq: 1400, freqEnd: 600, duration: 0.1, type: "sine", gain: 0.25, delay: 0.05 });
      noise({ duration: 0.06, filter: 3000, gain: 0.15, delay: 0.05 });
      break;
    case "needler":
      tone({ freq: 1800, duration: 0.04, type: "square", gain: 0.18 });
      tone({ freq: 2200, duration: 0.04, type: "square", gain: 0.18, delay: 0.05 });
      tone({ freq: 2600, duration: 0.04, type: "square", gain: 0.18, delay: 0.1 });
      tone({ freq: 3000, duration: 0.05, type: "triangle", gain: 0.18, delay: 0.15 });
      break;
    case "crossbow":
      tone({ freq: 90, duration: 0.04, type: "square", gain: 0.4 });
      noise({ duration: 0.05, filter: 2000, gain: 0.3 });
      tone({ freq: 1400, freqEnd: 500, duration: 0.3, type: "sine", gain: 0.2, delay: 0.05 });
      break;
    case "katana":
      noise({ duration: 0.06, filter: 5000, gain: 0.35 });
      tone({ freq: 2800, freqEnd: 800, duration: 0.18, type: "triangle", gain: 0.22 });
      tone({ freq: 1400, duration: 0.25, type: "sine", gain: 0.1, delay: 0.06 });
      break;
    case "shuriken":
      noise({ duration: 0.18, filter: 6000, gain: 0.3 });
      tone({ freq: 3000, freqEnd: 800, duration: 0.15, type: "sine", gain: 0.15 });
      tone({ freq: 200, duration: 0.05, type: "square", gain: 0.2, delay: 0.18 });
      break;
    case "magic":
      tone({ freq: 1200, duration: 0.05, type: "sine", gain: 0.18 });
      tone({ freq: 1800, duration: 0.05, type: "sine", gain: 0.18, delay: 0.05 });
      tone({ freq: 2400, duration: 0.05, type: "sine", gain: 0.18, delay: 0.1 });
      tone({ freq: 3200, duration: 0.1, type: "triangle", gain: 0.2, delay: 0.15 });
      tone({ freq: 2400, duration: 0.08, type: "triangle", gain: 0.15, delay: 0.25 });
      break;
    case "bomb":
      noise({ duration: 0.15, filter: 5000, gain: 0.2 });
      tone({ freq: 60, freqEnd: 25, duration: 0.5, type: "sawtooth", gain: 0.55, delay: 0.2 });
      noise({ duration: 0.4, filter: 300, gain: 0.5, delay: 0.2 });
      tone({ freq: 200, freqEnd: 60, duration: 0.3, type: "square", gain: 0.3, delay: 0.2 });
      break;
    case "splash":
      noise({ duration: 0.18, filter: 1800, gain: 0.4 });
      tone({ freq: 800, freqEnd: 200, duration: 0.15, type: "sine", gain: 0.2 });
      tone({ freq: 400, freqEnd: 150, duration: 0.18, type: "sine", gain: 0.15, delay: 0.05 });
      break;
    case "whoosh":
      noise({ duration: 0.35, filter: 1500, gain: 0.25 });
      tone({ freq: 600, freqEnd: 200, duration: 0.3, type: "sine", gain: 0.2 });
      tone({ freq: 800, freqEnd: 250, duration: 0.3, type: "triangle", gain: 0.15, delay: 0.05 });
      break;
  }
}

// Pet Voice Sounds — Animal Crossing style synthesized voices per pet type
export function playVoice(kind: string) {
  const s = readState();
  if (s.muted || s.volume <= 0) return;

  const voiceGain = 0.1; // Very low volume so it's subtle

  switch (kind) {
    case "cat":
      // Short high sine chirps — "mew mew"
      tone({ freq: 800, freqEnd: 1200, duration: 0.05, type: "sine", gain: voiceGain });
      tone({ freq: 900, freqEnd: 1100, duration: 0.05, type: "sine", gain: voiceGain, delay: 0.08 });
      tone({ freq: 1000, freqEnd: 1200, duration: 0.05, type: "sine", gain: voiceGain, delay: 0.16 });
      break;
    case "dog":
    case "doge":
      // Medium square wave barks — "woof"
      tone({ freq: 300, freqEnd: 500, duration: 0.08, type: "square", gain: voiceGain });
      tone({ freq: 350, freqEnd: 450, duration: 0.08, type: "square", gain: voiceGain, delay: 0.12 });
      break;
    case "slime":
    case "shoggoth":
      // Bubbly sine sweep — "blub"
      tone({ freq: 200, freqEnd: 400, duration: 0.08, type: "sine", gain: voiceGain });
      tone({ freq: 400, freqEnd: 200, duration: 0.08, type: "sine", gain: voiceGain, delay: 0.08 });
      break;
    case "robot":
    case "dalek":
    case "bb8":
      // Beepy square — "beep boop"
      tone({ freq: 1000, duration: 0.03, type: "square", gain: voiceGain });
      tone({ freq: 1500, duration: 0.03, type: "square", gain: voiceGain, delay: 0.05 });
      tone({ freq: 2000, duration: 0.03, type: "square", gain: voiceGain, delay: 0.1 });
      tone({ freq: 1200, duration: 0.03, type: "square", gain: voiceGain, delay: 0.15 });
      break;
    case "dragon":
      // Low growl — "grr"
      tone({ freq: 80, freqEnd: 120, duration: 0.2, type: "sawtooth", gain: voiceGain });
      noise({ duration: 0.15, filter: 200, gain: voiceGain * 0.5 });
      break;
    case "ghost":
    case "yurei":
      // Whisper — filtered noise, very quiet — "wooo"
      noise({ duration: 0.3, filter: 800, gain: voiceGain * 0.4 });
      break;
    case "pikachu":
      // Electric zap — sine sweep — "pika"
      tone({ freq: 1000, freqEnd: 3000, duration: 0.1, type: "sine", gain: voiceGain });
      break;
    case "parrot":
    case "chocobo":
    case "owl":
      // Tweet — high sine chirps — "tweet"
      tone({ freq: 2000, duration: 0.04, type: "sine", gain: voiceGain });
      tone({ freq: 2500, duration: 0.04, type: "sine", gain: voiceGain, delay: 0.06 });
      tone({ freq: 3000, duration: 0.04, type: "sine", gain: voiceGain, delay: 0.12 });
      break;
    case "cthulhu":
    case "blackgoat":
    case "necronomicon":
      // Eldritch — very low sawtooth + detuned — "grumble"
      tone({ freq: 30, freqEnd: 50, duration: 0.3, type: "sawtooth", gain: voiceGain });
      tone({ freq: 33, freqEnd: 47, duration: 0.3, type: "sawtooth", gain: voiceGain * 0.7, delay: 0.02 });
      break;
    default:
      // Generic chirp — "chirp chirp"
      tone({ freq: 600, freqEnd: 900, duration: 0.06, type: "sine", gain: voiceGain });
      tone({ freq: 700, freqEnd: 850, duration: 0.06, type: "sine", gain: voiceGain, delay: 0.1 });
      break;
  }
}
