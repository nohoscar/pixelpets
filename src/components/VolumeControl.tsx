import { useEffect, useState } from "react";
import { getAudioState, setMuted, setVolume, playSound } from "@/lib/audio";

export function VolumeControl() {
  const [volume, setVol] = useState(0.5);
  const [muted, setM] = useState(false);

  useEffect(() => {
    const s = getAudioState();
    setVol(s.volume);
    setM(s.muted);
  }, []);

  const onVol = (v: number) => {
    setVol(v);
    setVolume(v);
    if (muted && v > 0) { setM(false); setMuted(false); }
  };
  const onMute = () => {
    const next = !muted;
    setM(next);
    setMuted(next);
    if (!next) playSound("pop");
  };

  return (
    <section className="glass rounded-xl p-4">
      <h2 className="font-display text-[10px] text-neon-pink mb-3">AUDIO</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={onMute}
          className="w-10 h-10 rounded-md border border-border bg-secondary/40 hover:border-accent hover:bg-accent/20 transition-all flex items-center justify-center text-base"
          title={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted || volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : volume < 0.75 ? "🔉" : "🔊"}
        </button>
        <input
          type="range"
          min={0} max={1} step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => onVol(parseFloat(e.target.value))}
          className="flex-1 accent-[var(--accent)]"
        />
        <span className="text-[10px] font-display text-muted-foreground w-8 text-right">
          {Math.round((muted ? 0 : volume) * 100)}
        </span>
      </div>
    </section>
  );
}
