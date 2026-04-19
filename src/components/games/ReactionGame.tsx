import { useState, useCallback, useRef, useEffect } from "react";
import { playSound } from "@/lib/audio";

interface ReactionGameProps {
  onComplete: (avgMs: number) => void;
  onCancel: () => void;
}

type Phase = "waiting" | "ready" | "go" | "tooEarly" | "result";

export function ReactionGame({ onComplete, onCancel }: ReactionGameProps) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [lastTime, setLastTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const goTimeRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timesRef = useRef<number[]>([]);
  timesRef.current = times;

  const startRound = useCallback(() => {
    setPhase("ready");
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      goTimeRef.current = Date.now();
      setPhase("go");
    }, delay);
  }, []);

  useEffect(() => {
    startRound();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [startRound]);

  const handleClick = useCallback(() => {
    if (phase === "ready") {
      // Too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("tooEarly");
      setTimeout(() => {
        startRound();
      }, 1500);
    } else if (phase === "go") {
      const reaction = Date.now() - goTimeRef.current;
      playSound("shoot");
      setLastTime(reaction);
      const newTimes = [...times, reaction];
      setTimes(newTimes);
      setPhase("result");

      const nextRound = round + 1;
      setRound(nextRound);

      if (nextRound >= 5) {
        setTimeout(() => setFinished(true), 1500);
      } else {
        setTimeout(() => startRound(), 1500);
      }
    }
  }, [phase, times, round, startRound]);

  if (finished) {
    const avg = Math.round(timesRef.current.reduce((a, b) => a + b, 0) / timesRef.current.length);
    const xp = avg < 300 ? 50 : avg < 500 ? 30 : 15;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// COMPLETE</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {avg}ms avg ⚡
          </h2>
          <p className="text-sm text-muted-foreground mb-6">+{xp} XP</p>
          <button
            onClick={() => onComplete(avg)}
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
          <span className="font-display text-[10px] text-neon">ROUND: {round + 1}/5</span>
          {lastTime > 0 && <span className="font-display text-[10px] text-muted-foreground">Last: {lastTime}ms</span>}
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">
          ✕ QUIT
        </button>
      </div>
      <div
        className="relative z-10 flex-1 flex items-center justify-center cursor-pointer select-none"
        onClick={handleClick}
      >
        {phase === "waiting" && (
          <p className="font-display text-2xl text-muted-foreground">Get ready...</p>
        )}
        {phase === "ready" && (
          <p className="font-display text-3xl text-yellow-400 animate-pulse">WAIT...</p>
        )}
        {phase === "go" && (
          <p className="font-display text-4xl text-neon animate-pulse">CLICK!</p>
        )}
        {phase === "tooEarly" && (
          <p className="font-display text-2xl text-destructive">Too early! ❌</p>
        )}
        {phase === "result" && (
          <p className="font-display text-2xl text-neon">{lastTime}ms ⚡</p>
        )}
      </div>
    </div>
  );
}
