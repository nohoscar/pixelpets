import { useEffect, useRef } from "react";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
}

export function PetDiary({ gameState }: Props) {
  const generatedRef = useRef(false);

  // Auto-generate diary entry once per day on load
  useEffect(() => {
    if (generatedRef.current) return;
    generatedRef.current = true;

    const today = new Date().toISOString().slice(0, 10);
    const entries = gameState.diaryEntries || [];
    const alreadyHasToday = entries.some((e) => e.date === today);
    if (alreadyHasToday) return;

    // Only generate if there's been at least one day of activity
    if (!gameState.lastActiveDate) return;

    let text = `Day ${gameState.streakDays}: Fed ${gameState.feedCount} times today, played ${gameState.playCount} times. Level ${gameState.level}.`;

    // Flavor based on stats (we don't have live stats here, use game state hints)
    if (gameState.level > 1) {
      // Check evolved pets
      if (gameState.evolvedPets.length > 0) {
        text += " I evolved today! ✨";
      }
    }

    // Check games played for flavor
    const totalGames = Object.values(gameState.gamesPlayed).reduce((a, b) => a + b, 0);
    if (totalGames > 0) {
      const playedGames = Object.entries(gameState.gamesPlayed).filter(([, v]) => v > 0);
      if (playedGames.length > 0) {
        const lastGame = playedGames[playedGames.length - 1][0];
        text += ` Played ${lastGame} and had fun!`;
      }
    }

    // Streak-based flavor
    if (gameState.streakDays > 3) {
      text += " Feeling great! 😊";
    } else if (gameState.streakDays <= 1) {
      text += " So hungry... 🍖";
    }

    gameState.addDiaryEntry(text);
  }, []);

  const entries = gameState.diaryEntries || [];
  if (entries.length === 0) return null;

  return (
    <details className="glass rounded-xl">
      <summary className="p-4 font-display text-[10px] text-neon-pink cursor-pointer select-none hover:text-neon transition-colors flex items-center gap-2">
        <span>📔</span> PET DIARY <span className="text-[8px] text-muted-foreground">({entries.length})</span>
      </summary>
      <div className="px-4 pb-4 max-h-48 overflow-y-auto space-y-2">
        {[...entries].reverse().map((entry, i) => (
          <div
            key={`${entry.date}-${i}`}
            className="glass rounded-md px-3 py-2"
          >
            <p className="font-display text-[8px] text-neon mb-0.5">{entry.date}</p>
            <p className="text-[9px] text-foreground/80">{entry.text}</p>
          </div>
        ))}
      </div>
    </details>
  );
}
