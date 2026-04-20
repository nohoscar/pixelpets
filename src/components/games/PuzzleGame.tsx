import { useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface PuzzleGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

function shuffle(): number[] {
  // Generate a solvable puzzle
  let tiles: number[];
  do {
    tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || isWon(tiles));
  return tiles;
}

function isSolvable(tiles: number[]): boolean {
  let inversions = 0;
  const flat = tiles.filter((t) => t !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

function isWon(tiles: number[]): boolean {
  return tiles.every((t, i) => t === (i + 1) % 9);
}

export function PuzzleGame({ onComplete, onCancel }: PuzzleGameProps) {
  const [tiles, setTiles] = useState<number[]>(shuffle);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const handleClick = useCallback((idx: number) => {
    if (won) return;
    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(idx / 3), col = idx % 3;
    const eRow = Math.floor(emptyIdx / 3), eCol = emptyIdx % 3;
    const isAdjacent = (Math.abs(row - eRow) + Math.abs(col - eCol)) === 1;
    if (!isAdjacent) return;

    const newTiles = [...tiles];
    [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
    setTiles(newTiles);
    setMoves((m) => m + 1);
    playSound("click");

    if (isWon(newTiles)) {
      setWon(true);
      playSound("happy");
    }
  }, [tiles, won]);

  if (won) {
    const xp = moves < 20 ? 50 : moves < 30 ? 30 : 15;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// PUZZLE_SOLVED</p>
          <h2 className="font-display text-2xl text-neon mb-4">{moves} moves 🧩</h2>
          <p className="text-sm text-muted-foreground mb-6">Solved in {moves} moves!</p>
          <button onClick={() => onComplete(moves)}
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
      <div className="relative z-10 flex items-center justify-between w-full max-w-xs px-4 mb-4">
        <div className="glass rounded-lg px-4 py-2">
          <span className="font-display text-[10px] text-neon">MOVES: {moves}</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">✕ QUIT</button>
      </div>
      <div className="relative z-10 grid grid-cols-3 gap-2 w-full max-w-[240px]">
        {tiles.map((tile, idx) => (
          <button key={idx} onClick={() => handleClick(idx)}
            className={`aspect-square rounded-lg border font-display text-lg flex items-center justify-center transition-all ${
              tile === 0
                ? "border-transparent bg-transparent"
                : "border-primary/60 bg-primary/10 hover:bg-primary/20 hover:shadow-[0_0_12px_var(--primary)] text-neon active:scale-95"
            }`}>
            {tile !== 0 && tile}
          </button>
        ))}
      </div>
    </div>
  );
}
