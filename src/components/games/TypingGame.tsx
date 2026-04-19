import { useState, useCallback, useEffect, useRef } from "react";
import { playSound } from "@/lib/audio";

interface TypingGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const PHRASES = [
  "pixel pets are the best",
  "gotta catch them all",
  "hello world",
  "the quick brown fox",
  "code compile run",
  "level up your pet",
  "feed play sleep repeat",
  "desktop companion vibes",
  "eight bit adventure",
  "retro gaming forever",
  "neon lights and pixels",
  "cyberpunk aesthetic",
  "keep calm and code on",
  "press start to play",
  "game over try again",
];

export function TypingGame({ onComplete, onCancel }: TypingGameProps) {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);
  const scoreRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  scoreRef.current = score;

  const pickPhrase = useCallback(() => {
    setCurrentPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    setTyped("");
  }, []);

  useEffect(() => {
    pickPhrase();
    inputRef.current?.focus();
  }, [pickPhrase]);

  // Timer
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finished]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const val = e.target.value;
    setTyped(val);

    // Check each character
    if (val.length > 0 && val[val.length - 1] === currentPhrase[val.length - 1]) {
      playSound("click");
    }

    // Check if phrase complete
    if (val === currentPhrase) {
      setScore((s) => s + 1);
      pickPhrase();
    }
  }, [finished, currentPhrase, pickPhrase]);

  if (finished) {
    const xp = Math.min(50, scoreRef.current * 8);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// TIME_UP</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {scoreRef.current} phrases ⌨️
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
          <span className="font-display text-[10px] text-neon">SCORE: {score}</span>
          <span className="font-display text-[10px] text-neon-pink">{timeLeft}s</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">
          ✕ QUIT
        </button>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="glass rounded-xl p-6 max-w-md w-full text-center">
          <p className="font-display text-lg text-foreground tracking-wide">
            {currentPhrase.split("").map((char, i) => (
              <span
                key={i}
                className={
                  i < typed.length
                    ? typed[i] === char ? "text-neon" : "text-destructive"
                    : "text-muted-foreground"
                }
              >
                {char}
              </span>
            ))}
          </p>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={handleInput}
          className="w-full max-w-md px-4 py-3 rounded-lg border border-border bg-secondary/60 text-foreground font-mono text-sm focus:border-primary focus:outline-none"
          placeholder="Type here..."
          autoFocus
        />
      </div>
    </div>
  );
}
