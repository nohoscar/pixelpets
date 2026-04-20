import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface WhackGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const PET_EMOJIS = ["🐱", "🐶", "🐸", "🐰", "🐻", "🦊", "🐼", "🐨", "🐷"];
const GAME_DURATION = 30_000;

export function WhackGame({ onComplete, onCancel }: WhackGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [holes, setHoles] = useState<(string | null)[]>(Array(9).fill(null));
  const [finished, setFinished] = useState(false);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  scoreRef.current = score;

  // Timer
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((GAME_DURATION - (Date.now() - startTimeRef.current)) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) setFinished(true);
    }, 200);
    return () => clearInterval(id);
  }, [finished]);

  // Spawn moles
  useEffect(() => {
    if (finished) return;
    const spawn = () => {
      const idx = Math.floor(Math.random() * 9);
      const emoji = PET_EMOJIS[Math.floor(Math.random() * PET_EMOJIS.length)];
      setHoles((prev) => { const n = [...prev]; n[idx] = emoji; return n; });
      const duration = 1000 + Math.random() * 1000;
      setTimeout(() => {
        setHoles((prev) => { const n = [...prev]; if (n[idx] === emoji) n[idx] = null; return n; });
      }, duration);
    };
    spawn();
    const id = setInterval(spawn, 800);
    return () => clearInterval(id);
  }, [finished]);

  const handleWhack = useCallback((idx: number) => {
    if (holes[idx]) {
      setHoles((prev) => { const n = [...prev]; n[idx] = null; return n; });
      setScore((s) => s + 1);
      playSound("pop");
    }
  }, [holes]);

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">{scoreRef.current} 🔨</h2>
          <p className="text-sm text-muted-foreground mb-6">Whacked {scoreRef.current} pets!</p>
          <button onClick={() => onComplete(scoreRef.current)}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all">
            ▸ COLLECT XP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex items-center justify-between w-full max-w-sm px-4 mb-4">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
          <span className="font-display text-[10px] text-neon">SCORE: {score}</span>
          <span className="font-display text-[10px] text-neon-pink">{timeLeft}s</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">✕ QUIT</button>
      </div>
      <div className="relative z-10 grid grid-cols-3 gap-3 w-full max-w-xs">
        {holes.map((emoji, idx) => (
          <button key={idx} onClick={() => handleWhack(idx)}
            className="aspect-square rounded-xl border border-border bg-secondary/60 flex items-center justify-center text-3xl transition-all hover:scale-105 active:scale-95"
            style={{ boxShadow: emoji ? "0 0 16px var(--neon-cyan)" : "none" }}>
            {emoji && <span className="animate-bounce">{emoji}</span>}
            {!emoji && <span className="text-muted-foreground/30 text-xl">⚫</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
