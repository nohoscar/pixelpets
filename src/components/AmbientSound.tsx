import { useEffect, useRef } from "react";
import { getAudioState } from "@/lib/audio";

type AmbientId = "rain" | "lofi" | "nature" | "silent";

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

  // Cleanup on unmount
  useEffect(() => () => cleanup(), []);

  return null;
}
