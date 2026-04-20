import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface ColorMatchGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const NEON_COLORS = [
  { name: "Cyan", hex: "#00fff2" },
  { name: "Pink", hex: "#ff2d95" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Green", hex: "#22c55e" },
  { name: "Orange", hex: "#f97316" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Red", hex: "#ef4444" },
];

const TOTAL_ROUNDS = 20;
const ROUND_TIME = 3000;

export function ColorMatchGame({ onComplete, onCancel }: ColorMatchGameProps) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(NEON_COLORS[0]);
  const [options, setOptions] = useState<typeof NEON_COLORS>([]);
  const [timeLeft, setTimeLeft] = useState(3);
  const [finished, setFinished] = useState(false);
  const scoreRef = useRef(0);
  const roundStartRef = useRef(Date.now());
  scoreRef.current = score;

  const generateRound = useCallback(() => {
    const targetColor = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
    const others = NEON_COLORS.filter((c) => c.hex !== targetColor.hex);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const insertIdx = Math.floor(Math.random() * 4);
    shuffled.splice(insertIdx, 0, targetColor);
    setTarget(targetColor);
    setOptions(shuffled);
    roundStartRef.current = Date.now();
    setTimeLeft(3);
  }, []);

  useEffect(() => { generateRound(); }, [generateRound]);

  // Timer per round
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - roundStartRef.current;
      const remaining = Math.max(0, Math.ceil((ROUND_TIME - elapsed) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) nextRound();
    }, 200);
    return () => clearInterval(id);
  }, [round, finished]);

  const nextRound = useCallback(() => {
    if (round >= TOTAL_ROUNDS) {
      setFinished(true);
    } else {
      setRound((r) => r + 1);
      generateRound();
    }
  }, [round, generateRound]);

  const handlePick = useCallback((color: typeof NEON_COLORS[0]) => {
    if (finished) return;
    if (color.hex === target.hex) {
      setScore((s) => s + 1);
      playSound("coin");
    } else {
      playSound("sad");
    }
    nextRound();
  }, [target, finished, nextRound]);

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">{scoreRef.current}/{TOTAL_ROUNDS} 🎨</h2>
          <p className="text-sm text-muted-foreground mb-6">Matched {scoreRef.current} colors!</p>
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
      <div className="relative z-10 flex items-center justify-between w-full max-w-xs px-4 mb-4">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
          <span className="font-display text-[10px] text-neon">R{round}/{TOTAL_ROUNDS}</span>
          <span className="font-display text-[10px] text-neon-pink">{timeLeft}s</span>
          <span className="font-display text-[10px] text-muted-foreground">✓{score}</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">✕ QUIT</button>
      </div>
      {/* Target */}
      <div className="relative z-10 mb-6">
        <p className="font-display text-[9px] text-muted-foreground text-center mb-2">MATCH THIS COLOR</p>
        <div className="w-24 h-24 rounded-xl border-2 border-border mx-auto"
          style={{ backgroundColor: target.hex, boxShadow: `0 0 24px ${target.hex}` }} />
      </div>
      {/* Options */}
      <div className="relative z-10 grid grid-cols-2 gap-3 w-full max-w-[200px]">
        {options.map((color, idx) => (
          <button key={idx} onClick={() => handlePick(color)}
            className="aspect-square rounded-xl border border-border hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: color.hex, boxShadow: `0 0 8px ${color.hex}40` }} />
        ))}
      </div>
    </div>
  );
}
