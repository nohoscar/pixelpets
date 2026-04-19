import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface DodgeGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

interface FallingObj {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
}

const HAZARDS = ["💣", "🔥", "⚡", "☄️", "🪨", "💀", "🌩️", "🦠"];

export function DodgeGame({ onComplete, onCancel }: DodgeGameProps) {
  const [playerX, setPlayerX] = useState(50); // percentage
  const [objects, setObjects] = useState<FallingObj[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerXRef = useRef(50);
  const objectsRef = useRef<FallingObj[]>([]);
  const scoreRef = useRef(0);
  const rafRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const nextIdRef = useRef(0);

  playerXRef.current = playerX;
  objectsRef.current = objects;
  scoreRef.current = score;

  // Keyboard controls
  useEffect(() => {
    if (finished) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerX((x) => Math.max(5, x - 5));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerX((x) => Math.min(95, x + 5));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [finished]);

  // Touch controls
  useEffect(() => {
    if (finished) return;
    const container = containerRef.current;
    if (!container) return;
    const handler = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const pct = ((touch.clientX - rect.left) / rect.width) * 100;
      setPlayerX(Math.max(5, Math.min(95, pct)));
    };
    container.addEventListener("touchmove", handler, { passive: true });
    return () => container.removeEventListener("touchmove", handler);
  }, [finished]);

  // Spawn objects
  useEffect(() => {
    if (finished) return;
    const spawn = () => {
      const obj: FallingObj = {
        id: nextIdRef.current++,
        x: Math.random() * 90 + 5,
        y: -5,
        speed: 0.4 + Math.random() * 0.4,
        emoji: HAZARDS[Math.floor(Math.random() * HAZARDS.length)],
      };
      setObjects((prev) => [...prev, obj]);
    };
    const id = setInterval(spawn, 800);
    return () => clearInterval(id);
  }, [finished]);

  // Animation + collision
  useEffect(() => {
    if (finished) return;
    const tick = () => {
      setObjects((prev) => {
        const updated = prev.map((o) => ({ ...o, y: o.y + o.speed })).filter((o) => o.y < 105);

        // Collision check
        for (const obj of updated) {
          if (obj.y > 85 && obj.y < 100) {
            const dist = Math.abs(obj.x - playerXRef.current);
            if (dist < 8) {
              playSound("sad");
              setFinished(true);
              return [];
            }
          }
        }
        return updated;
      });

      // Update score
      setScore(Math.floor((Date.now() - startTimeRef.current) / 1000));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finished]);

  if (finished) {
    const xp = Math.min(50, scoreRef.current * 2);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// HIT!</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {scoreRef.current}s survived 🏃
          </h2>
          <p className="text-sm text-muted-foreground mb-6">+{xp} XP</p>
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
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
          <span className="font-display text-[10px] text-neon">TIME: {score}s</span>
          <span className="font-display text-[10px] text-muted-foreground">← → to dodge</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">
          ✕ QUIT
        </button>
      </div>
      <div ref={containerRef} className="relative z-10 flex-1 overflow-hidden">
        {/* Falling objects */}
        {objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute text-2xl"
            style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: "translate(-50%, -50%)" }}
          >
            {obj.emoji}
          </div>
        ))}
        {/* Player */}
        <div
          className="absolute bottom-[8%] text-3xl transition-all duration-75"
          style={{ left: `${playerX}%`, transform: "translateX(-50%)" }}
        >
          🐾
        </div>
      </div>
    </div>
  );
}
