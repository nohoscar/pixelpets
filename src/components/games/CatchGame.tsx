import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface CatchGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

interface FallingObject {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
}

const EMOJIS = ["🍎", "⭐", "💎", "🍕", "🎁", "🌟", "🍩", "🔮", "🍬", "🪙"];
const GAME_DURATION = 30_000; // 30 seconds
const SPAWN_INTERVAL = 1200; // ms

export function CatchGame({ onComplete, onCancel }: CatchGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [finished, setFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const objectsRef = useRef<FallingObject[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(Date.now());
  const nextIdRef = useRef(0);
  const scoreRef = useRef(0);

  objectsRef.current = objects;
  scoreRef.current = score;

  // Spawn objects every 1200ms
  useEffect(() => {
    if (finished) return;
    const spawn = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      const obj: FallingObject = {
        id: nextIdRef.current++,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * (w - 40) + 20,
        y: -40,
        speed: 1.5 + Math.random() * 1.5,
      };
      setObjects((prev) => [...prev, obj]);
    };
    spawn(); // spawn first immediately
    const id = setInterval(spawn, SPAWN_INTERVAL);
    return () => clearInterval(id);
  }, [finished]);

  // Animation loop
  useEffect(() => {
    if (finished) return;
    const tick = () => {
      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const h = container.clientHeight;
      setObjects((prev) =>
        prev
          .map((obj) => ({ ...obj, y: obj.y + obj.speed }))
          .filter((obj) => obj.y < h + 50)
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finished]);

  // Timer countdown
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, Math.ceil((GAME_DURATION - elapsed) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setFinished(true);
      }
    }, 200);
    return () => clearInterval(id);
  }, [finished]);

  // Handle catch click
  const handleCatch = useCallback((objId: number) => {
    setObjects((prev) => prev.filter((o) => o.id !== objId));
    setScore((s) => s + 1);
    playSound("coin");
  }, []);

  // Handle finish
  useEffect(() => {
    if (finished) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [finished]);

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {scoreRef.current} 🎯
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Caught {scoreRef.current} items!
          </p>
          <button
            onClick={() => onComplete(scoreRef.current)}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all"
          >
            ▸ COLLECT XP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
          <span className="font-display text-[10px] text-neon">
            SCORE: {score}
          </span>
          <span className="font-display text-[10px] text-neon-pink">
            {timeLeft}s
          </span>
        </div>
        <button
          onClick={onCancel}
          className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all"
        >
          ✕ QUIT
        </button>
      </div>
      {/* Game area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
      >
        {objects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => handleCatch(obj.id)}
            className="absolute w-10 h-10 flex items-center justify-center text-2xl cursor-pointer hover:scale-125 transition-transform active:scale-90"
            style={{
              left: obj.x,
              top: obj.y,
              filter: "drop-shadow(0 0 8px var(--neon-cyan))",
            }}
          >
            {obj.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
