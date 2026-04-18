import { useState, useEffect, useRef, useCallback } from "react";
import { playSound } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";

type PomodoroPhase = "idle" | "work" | "break";

interface PomodoroTimerProps {
  workMinutes: number;
  breakMinutes: number;
  onWorkEnd?: () => void;
  onBreakEnd?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PomodoroTimer({ workMinutes, breakMinutes, onWorkEnd, onBreakEnd }: PomodoroTimerProps) {
  const [phase, setPhase] = useState<PomodoroPhase>("idle");
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startWork = useCallback(() => {
    clearTimer();
    setPhase("work");
    setRemaining(workMinutes * 60);
  }, [workMinutes, clearTimer]);

  const startBreak = useCallback(() => {
    clearTimer();
    setPhase("break");
    setRemaining(breakMinutes * 60);
  }, [breakMinutes, clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setPhase("idle");
    setRemaining(0);
  }, [clearTimer]);

  // Tick interval
  useEffect(() => {
    if (phase === "idle") return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // Phase complete
          if (phase === "work") {
            playSound("happy");
            onWorkEnd?.();
            // Transition to break
            setTimeout(() => {
              setPhase("break");
              setRemaining(breakMinutes * 60);
            }, 0);
          } else if (phase === "break") {
            playSound("click");
            onBreakEnd?.();
            // Return to idle
            setTimeout(() => {
              setPhase("idle");
              setRemaining(0);
            }, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [phase, breakMinutes, onWorkEnd, onBreakEnd, clearTimer]);

  const phaseColor = phase === "work" ? "text-neon-pink" : phase === "break" ? "text-neon" : "text-muted-foreground";
  const { t } = useI18n();
  const phaseLabelI18n = phase === "work" ? t("pomodoro.work") : phase === "break" ? t("pomodoro.break") : t("pomodoro.idle");

  return (
    <div className="glass rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-display text-[9px] ${phaseColor}`}>{phaseLabelI18n}</span>
        {phase !== "idle" && (
          <span className="font-display text-sm text-neon-pink tabular-nums">
            {formatTime(remaining)}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {phase === "idle" ? (
          <button
            onClick={startWork}
            className="flex-1 px-2 py-1.5 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[8px] min-h-[44px]"
          >
            {t("pomodoro.start")}
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex-1 px-2 py-1.5 rounded-md border border-destructive/50 bg-destructive/10 hover:bg-destructive/20 transition-all font-display text-[8px] text-destructive min-h-[44px]"
          >
            {t("pomodoro.stop")}
          </button>
        )}
      </div>
    </div>
  );
}

export { formatTime };
