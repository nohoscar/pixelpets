import { useState, useCallback, useEffect, useRef } from "react";
import { playSound } from "@/lib/audio";

interface SimonGameProps {
  onComplete: (rounds: number) => void;
  onCancel: () => void;
}

const COLORS = ["red", "blue", "green", "yellow"] as const;
const COLOR_STYLES: Record<string, { base: string; lit: string }> = {
  red:    { base: "bg-red-700 border-red-900", lit: "bg-red-400 border-red-600 shadow-[0_0_20px_#f87171]" },
  blue:   { base: "bg-blue-700 border-blue-900", lit: "bg-blue-400 border-blue-600 shadow-[0_0_20px_#60a5fa]" },
  green:  { base: "bg-green-700 border-green-900", lit: "bg-green-400 border-green-600 shadow-[0_0_20px_#4ade80]" },
  yellow: { base: "bg-yellow-600 border-yellow-800", lit: "bg-yellow-300 border-yellow-500 shadow-[0_0_20px_#facc15]" },
};

export function SimonGame({ onComplete, onCancel }: SimonGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [litButton, setLitButton] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(0);
  const roundRef = useRef(0);
  roundRef.current = round;

  const startNewRound = useCallback((prevSequence: number[]) => {
    const next = [...prevSequence, Math.floor(Math.random() * 4)];
    setSequence(next);
    setPlayerIndex(0);
    setRound(next.length);
    setIsShowingSequence(true);

    // Show sequence
    let i = 0;
    const show = () => {
      if (i >= next.length) {
        setLitButton(null);
        setIsShowingSequence(false);
        return;
      }
      setLitButton(next[i]);
      setTimeout(() => {
        setLitButton(null);
        i++;
        setTimeout(show, 200);
      }, 500);
    };
    setTimeout(show, 600);
  }, []);

  // Start first round
  useEffect(() => {
    startNewRound([]);
  }, [startNewRound]);

  const handlePress = useCallback((idx: number) => {
    if (isShowingSequence || gameOver) return;

    setLitButton(idx);
    setTimeout(() => setLitButton(null), 150);

    if (sequence[playerIndex] === idx) {
      playSound("coin");
      const nextIdx = playerIndex + 1;
      if (nextIdx >= sequence.length) {
        // Round complete
        setTimeout(() => startNewRound(sequence), 800);
      } else {
        setPlayerIndex(nextIdx);
      }
    } else {
      playSound("sad");
      setGameOver(true);
    }
  }, [isShowingSequence, gameOver, sequence, playerIndex, startNewRound]);

  if (gameOver) {
    const xp = Math.min(50, roundRef.current * 5);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {roundRef.current} rounds 🎵
          </h2>
          <p className="text-sm text-muted-foreground mb-6">+{xp} XP</p>
          <button
            onClick={() => onComplete(roundRef.current)}
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
          <span className="font-display text-[10px] text-neon">ROUND: {round}</span>
          <span className="font-display text-[10px] text-muted-foreground">
            {isShowingSequence ? "WATCH..." : "YOUR TURN"}
          </span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">
          ✕ QUIT
        </button>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
          {COLORS.map((color, idx) => (
            <button
              key={color}
              onClick={() => handlePress(idx)}
              disabled={isShowingSequence}
              className={`aspect-square rounded-xl border-4 transition-all duration-150 ${
                litButton === idx ? COLOR_STYLES[color].lit : COLOR_STYLES[color].base
              } ${isShowingSequence ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80 active:scale-95"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
