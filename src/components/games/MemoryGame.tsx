import { useState, useCallback, useEffect, useRef } from "react";
import { playSound } from "@/lib/audio";

interface MemoryGameProps {
  onComplete: (attempts: number) => void;
  onCancel: () => void;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const PET_EMOJIS = ["🐱", "🐶", "🐰", "🦊", "🐼", "🐸"];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const pairs = [...PET_EMOJIS, ...PET_EMOJIS];
  const shuffled = shuffleArray(pairs);
  return shuffled.map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

export function MemoryGame({ onComplete, onCancel }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>(() => createCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const attemptsRef = useRef(0);
  attemptsRef.current = attempts;

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setFinished(true);
    }
  }, [cards]);

  const handleCardClick = useCallback((id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map((c) =>
      c.id === id ? { ...c, flipped: true } : c
    );
    setCards(newCards);

    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setAttempts((a) => a + 1);
      setLocked(true);

      const [first, second] = newSelected;
      const card1 = newCards.find((c) => c.id === first)!;
      const card2 = newCards.find((c) => c.id === second)!;

      if (card1.emoji === card2.emoji) {
        // Match!
        playSound("happy");
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          )
        );
        setSelected([]);
        setLocked(false);
      } else {
        // No match — flip back after 800ms
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 800);
      }
    }
  }, [cards, selected, locked]);

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// COMPLETE</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {attemptsRef.current} attempts 🧠
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            All pairs matched!
          </p>
          <button
            onClick={() => onComplete(attemptsRef.current)}
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
            ATTEMPTS: {attempts}
          </span>
          <span className="font-display text-[10px] text-muted-foreground">
            {cards.filter((c) => c.matched).length / 2}/{PET_EMOJIS.length} pairs
          </span>
        </div>
        <button
          onClick={onCancel}
          className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all"
        >
          ✕ QUIT
        </button>
      </div>
      {/* Card grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-4 gap-3 max-w-md w-full">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl border-2 text-3xl flex items-center justify-center transition-all duration-300 ${
                card.flipped || card.matched
                  ? "border-primary bg-primary/10 shadow-[0_0_12px_var(--primary)] rotate-0"
                  : "border-border bg-secondary/60 hover:border-accent/60 hover:bg-accent/10"
              }`}
              style={{
                transform: card.flipped || card.matched ? "rotateY(0deg)" : "rotateY(180deg)",
                transformStyle: "preserve-3d",
                transition: "transform 0.3s ease, border-color 0.3s, background 0.3s, box-shadow 0.3s",
              }}
              disabled={card.matched}
            >
              {card.flipped || card.matched ? (
                <span>{card.emoji}</span>
              ) : (
                <span className="text-muted-foreground">?</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
