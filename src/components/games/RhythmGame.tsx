import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface RhythmGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

interface Note {
  id: number;
  lane: number; // 0-3 (←↑↓→)
  y: number;
  hit: boolean;
}

const LANES = ["←", "↑", "↓", "→"];
const LANE_KEYS = ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"];
const GAME_DURATION = 30_000;
const NOTE_SPEED = 3;
const HIT_ZONE_Y = 85; // percentage from top
const HIT_TOLERANCE = 8; // percentage tolerance

export function RhythmGame({ onComplete, onCancel }: RhythmGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [notes, setNotes] = useState<Note[]>([]);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const notesRef = useRef<Note[]>([]);
  const nextIdRef = useRef(0);
  const rafRef = useRef(0);
  scoreRef.current = score;
  notesRef.current = notes;

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

  // Spawn notes procedurally
  useEffect(() => {
    if (finished) return;
    const spawn = () => {
      const lane = Math.floor(Math.random() * 4);
      const note: Note = { id: nextIdRef.current++, lane, y: -5, hit: false };
      setNotes((prev) => [...prev, note]);
    };
    const id = setInterval(spawn, 600 + Math.random() * 400);
    return () => clearInterval(id);
  }, [finished]);

  // Animation loop
  useEffect(() => {
    if (finished) return;
    const tick = () => {
      setNotes((prev) => {
        const updated = prev
          .map((n) => ({ ...n, y: n.y + NOTE_SPEED }))
          .filter((n) => {
            if (n.y > 100 && !n.hit) {
              // Missed
              scoreRef.current = Math.max(0, scoreRef.current - 1);
              setScore(scoreRef.current);
              return false;
            }
            return n.y <= 105;
          });
        return updated;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finished]);

  // Key handler
  const handleKey = useCallback((e: KeyboardEvent) => {
    const laneIdx = LANE_KEYS.indexOf(e.key);
    if (laneIdx === -1) return;
    e.preventDefault();
    setFlash(laneIdx);
    setTimeout(() => setFlash(null), 100);

    // Check for hit
    setNotes((prev) => {
      const hitIdx = prev.findIndex(
        (n) => n.lane === laneIdx && !n.hit && Math.abs(n.y - HIT_ZONE_Y) < HIT_TOLERANCE
      );
      if (hitIdx !== -1) {
        scoreRef.current++;
        setScore(scoreRef.current);
        playSound("click");
        const updated = [...prev];
        updated[hitIdx] = { ...updated[hitIdx], hit: true };
        return updated.filter((_, i) => i !== hitIdx);
      } else {
        playSound("sad");
        scoreRef.current = Math.max(0, scoreRef.current - 1);
        setScore(scoreRef.current);
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">{scoreRef.current} 🎶</h2>
          <p className="text-sm text-muted-foreground mb-6">Hit {scoreRef.current} notes!</p>
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
      {/* Game area */}
      <div className="relative z-10 w-full max-w-[280px] h-[400px] rounded-lg border border-border bg-black/40 overflow-hidden">
        {/* Lanes */}
        {LANES.map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 border-r border-border/30"
            style={{ left: `${(i / 4) * 100}%`, width: "25%" }} />
        ))}
        {/* Hit zone line */}
        <div className="absolute left-0 right-0 h-[2px] bg-neon-pink/80"
          style={{ top: `${HIT_ZONE_Y}%`, boxShadow: "0 0 8px var(--neon-pink)" }} />
        {/* Notes */}
        {notes.map((note) => (
          <div key={note.id}
            className="absolute w-[25%] flex items-center justify-center"
            style={{ left: `${(note.lane / 4) * 100}%`, top: `${note.y}%`, height: "24px" }}>
            <div className="w-10 h-6 rounded bg-primary/80 border border-primary flex items-center justify-center font-display text-[10px] text-primary-foreground"
              style={{ boxShadow: "0 0 8px var(--primary)" }}>
              {LANES[note.lane]}
            </div>
          </div>
        ))}
        {/* Lane labels at bottom */}
        <div className="absolute bottom-2 left-0 right-0 flex">
          {LANES.map((label, i) => (
            <div key={i} className={`flex-1 text-center font-display text-sm transition-all ${flash === i ? "text-neon scale-125" : "text-muted-foreground"}`}>
              {label}
            </div>
          ))}
        </div>
      </div>
      <p className="relative z-10 font-display text-[9px] text-muted-foreground mt-3">Arrow keys to hit notes</p>
    </div>
  );
}
