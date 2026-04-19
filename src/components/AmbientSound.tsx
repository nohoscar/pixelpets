import { useEffect, useRef } from "react";
import { getAudioState } from "@/lib/audio";

export type AmbientId = "rain" | "lofi" | "nature" | "cafe" | "storm" | "space" | "fireplace" | "ocean" | "city" | "silent";

interface Props {
  soundId: string;
}

export function AmbientSound({ soundId }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const activeRef = useRef<string>("silent");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync volume with master
  useEffect(() => {
    const sync = () => {
      if (!gainRef.current) return;
      const { volume, muted } = getAudioState();
      gainRef.current.gain.value = muted ? 0 : volume * 0.3; // ambient is quieter
    };
    sync();
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  }, [soundId]);

  useEffect(() => {
    const id = soundId as AmbientId;
    if (id === activeRef.current) return;
    activeRef.current = id;

    // Cleanup previous
    cleanup();

    if (id === "silent") return;

    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    const ctx = new AC();
    ctxRef.current = ctx;
    const masterGain = ctx.createGain();
    const { volume, muted } = getAudioState();
    masterGain.gain.value = muted ? 0 : volume * 0.3;
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    if (id === "rain") createRain(ctx, masterGain);
    else if (id === "lofi") createLofi(ctx, masterGain);
    else if (id === "nature") createNature(ctx, masterGain);
    else if (id === "cafe") createCafe(ctx, masterGain);
    else if (id === "storm") createStorm(ctx, masterGain);
    else if (id === "space") createSpace(ctx, masterGain);
    else if (id === "fireplace") createFireplace(ctx, masterGain);
    else if (id === "ocean") createOcean(ctx, masterGain);
    else if (id === "city") createCity(ctx, masterGain);

    return () => cleanup();
  }, [soundId]);

  function cleanup() {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    nodesRef.current.forEach((n) => { try { (n as AudioBufferSourceNode).stop?.(); } catch {} });
    nodesRef.current = [];
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    gainRef.current = null;
  }

  function createRain(ctx: AudioContext, dest: AudioNode) {
    // Filtered white noise with slow volume modulation
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.15;

    const volGain = ctx.createGain();
    volGain.gain.value = 0.6;

    lfo.connect(lfoGain).connect(volGain.gain);
    src.connect(filter).connect(volGain).connect(dest);
    lfo.start();
    src.start();

    nodesRef.current.push(src, lfo);
  }

  function createLofi(ctx: AudioContext, dest: AudioNode) {
    // Soft sine wave chord progression C-Am-F-G with gentle filter
    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];
    let chordIdx = 0;
    const oscs: OscillatorNode[] = [];

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.connect(dest);

    const chordGain = ctx.createGain();
    chordGain.gain.value = 0.25;
    chordGain.connect(filter);

    // Create 3 oscillators for the chord
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = chords[0][i];
      osc.connect(chordGain);
      osc.start();
      oscs.push(osc);
    }
    nodesRef.current.push(...oscs);

    // Change chord every 3 seconds
    intervalRef.current = setInterval(() => {
      chordIdx = (chordIdx + 1) % chords.length;
      const t = ctx.currentTime;
      oscs.forEach((osc, i) => {
        osc.frequency.linearRampToValueAtTime(chords[chordIdx][i], t + 0.5);
      });
    }, 3000);
  }

  function createNature(ctx: AudioContext, dest: AudioNode) {
    // Wind: filtered noise
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buffer;
    windSrc.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 400;
    windFilter.Q.value = 0.5;

    const windGain = ctx.createGain();
    windGain.gain.value = 0.4;

    windSrc.connect(windFilter).connect(windGain).connect(dest);
    windSrc.start();
    nodesRef.current.push(windSrc);

    // Occasional bird-like tones
    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.4) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      const baseFreq = 1200 + Math.random() * 1200;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, ctx.currentTime + 0.2);

      const birdGain = ctx.createGain();
      birdGain.gain.setValueAtTime(0, ctx.currentTime);
      birdGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      birdGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(birdGain).connect(dest);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }, 2000);
  }

  function createCafe(ctx: AudioContext, dest: AudioNode) {
    // Brownian noise (very low-pass filtered white noise)
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + (0.02 * white)) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200;

    const volGain = ctx.createGain();
    volGain.gain.value = 0.7;

    src.connect(filter).connect(volGain).connect(dest);
    src.start();
    nodesRef.current.push(src);

    // Occasional clink sounds
    const scheduleClink = () => {
      const delay = (3 + Math.random() * 5) * 1000;
      const timeout = setTimeout(() => {
        if (!ctxRef.current) return;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 2000 + Math.random() * 2000;
        const clinkGain = ctx.createGain();
        clinkGain.gain.setValueAtTime(0.06, ctx.currentTime);
        clinkGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(clinkGain).connect(dest);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
        scheduleClink();
      }, delay);
      nodesRef.current.push({ stop: () => clearTimeout(timeout) } as unknown as AudioNode);
    };
    scheduleClink();
  }

  function createStorm(ctx: AudioContext, dest: AudioNode) {
    // Loud rain
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.2;

    const volGain = ctx.createGain();
    volGain.gain.value = 0.85;

    lfo.connect(lfoGain).connect(volGain.gain);
    src.connect(filter).connect(volGain).connect(dest);
    lfo.start();
    src.start();
    nodesRef.current.push(src, lfo);

    // Thunder
    const scheduleThunder = () => {
      const delay = (8 + Math.random() * 7) * 1000;
      const timeout = setTimeout(() => {
        if (!ctxRef.current) return;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 40 + Math.random() * 40;
        const thunderGain = ctx.createGain();
        thunderGain.gain.setValueAtTime(0, ctx.currentTime);
        thunderGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
        thunderGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.connect(thunderGain).connect(dest);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
        scheduleThunder();
      }, delay);
      nodesRef.current.push({ stop: () => clearTimeout(timeout) } as unknown as AudioNode);
    };
    scheduleThunder();
  }

  function createSpace(ctx: AudioContext, dest: AudioNode) {
    // Deep drone
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 40 + Math.random() * 20;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.15;
    drone.connect(droneGain).connect(dest);
    drone.start();
    nodesRef.current.push(drone);

    // Sci-fi bleeps
    const scheduleBleep = () => {
      const delay = (4 + Math.random() * 6) * 1000;
      const timeout = setTimeout(() => {
        if (!ctxRef.current) return;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
        const bleepGain = ctx.createGain();
        bleepGain.gain.setValueAtTime(0.07, ctx.currentTime);
        bleepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(bleepGain).connect(dest);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
        scheduleBleep();
      }, delay);
      nodesRef.current.push({ stop: () => clearTimeout(timeout) } as unknown as AudioNode);
    };
    scheduleBleep();
  }

  function createFireplace(ctx: AudioContext, dest: AudioNode) {
    // Crackle noise (bandpass filtered)
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.95 ? 3 : 0.5);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 0.8;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = 0.35;

    src.connect(filter).connect(crackleGain).connect(dest);
    src.start();
    nodesRef.current.push(src);

    // Low warm hum
    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 80;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.04;
    hum.connect(humGain).connect(dest);
    hum.start();
    nodesRef.current.push(hum);
  }

  function createOcean(ctx: AudioContext, dest: AudioNode) {
    // Rhythmic waves: white noise with slow LFO
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;

    const volGain = ctx.createGain();
    volGain.gain.value = 0.5;

    lfo.connect(lfoGain).connect(volGain.gain);
    src.connect(filter).connect(volGain).connect(dest);
    lfo.start();
    src.start();
    nodesRef.current.push(src, lfo);
  }

  function createCity(ctx: AudioContext, dest: AudioNode) {
    // Low rumble
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 200;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.5;

    src.connect(filter).connect(rumbleGain).connect(dest);
    src.start();
    nodesRef.current.push(src);

    // Occasional distant sirens
    const scheduleSiren = () => {
      const delay = (10 + Math.random() * 10) * 1000;
      const timeout = setTimeout(() => {
        if (!ctxRef.current) return;
        const osc = ctx.createOscillator();
        osc.type = "sine";
        const t = ctx.currentTime;
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.8);
        osc.frequency.linearRampToValueAtTime(400, t + 1.6);
        const sirenGain = ctx.createGain();
        sirenGain.gain.setValueAtTime(0, t);
        sirenGain.gain.linearRampToValueAtTime(0.04, t + 0.2);
        sirenGain.gain.setValueAtTime(0.04, t + 1.2);
        sirenGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        osc.connect(sirenGain).connect(dest);
        osc.start(t);
        osc.stop(t + 1.8);
        scheduleSiren();
      }, delay);
      nodesRef.current.push({ stop: () => clearTimeout(timeout) } as unknown as AudioNode);
    };
    scheduleSiren();
  }

  // Cleanup on unmount
  useEffect(() => () => cleanup(), []);

  return null;
}
