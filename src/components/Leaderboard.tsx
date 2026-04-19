import type { GameState } from "@/hooks/useGameState";
import { PETS, type PetKind } from "./pets/petSprites";
import { calculateLevel } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
}

export function Leaderboard({ gameState }: Props) {
  const entries = Object.entries(gameState.petXpHistory)
    .filter(([kind]) => kind in PETS)
    .map(([kind, xp]) => ({
      kind: kind as PetKind,
      name: gameState.petNames[kind] || PETS[kind as PetKind].name,
      xp,
      level: calculateLevel(xp),
    }))
    .sort((a, b) => b.xp - a.xp);

  if (entries.length === 0) return null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <details className="glass rounded-xl">
      <summary className="p-4 font-display text-[10px] text-neon-pink cursor-pointer select-none hover:text-neon transition-colors flex items-center gap-2">
        <span>🏆</span> LEADERBOARD <span className="text-[8px] text-muted-foreground">({entries.length})</span>
      </summary>
      <div className="px-4 pb-4 space-y-1.5">
        {entries.map((entry, i) => (
          <div
            key={entry.kind}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${
              i < 3 ? "bg-primary/10 border border-primary/20" : "bg-secondary/30"
            }`}
          >
            <span className="font-display text-[10px] w-6 text-center">
              {i < 3 ? medals[i] : `#${i + 1}`}
            </span>
            <div className="w-6 h-6 flex-shrink-0">
              {PETS[entry.kind].render("right", 0)}
            </div>
            <span className="font-display text-[8px] text-foreground flex-1 truncate">
              {entry.name}
            </span>
            <span className="font-display text-[8px] text-neon">L{entry.level}</span>
            <span className="font-display text-[7px] text-muted-foreground">{entry.xp}xp</span>
          </div>
        ))}
      </div>
    </details>
  );
}
