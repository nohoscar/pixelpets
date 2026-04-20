import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface SnakeGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

type Dir = "up" | "down" | "left" | "right";
type Pos = { x: number; y: number };

const GRID = 15;
const TICK = 150;
const FOOD_EMOJIS = ["🍎", "⭐", "💎", "🍕", "🔮"];

export function SnakeGame({ onComplete, onCancel }: SnakeGameProps) {
  const [snake, setSnake] = useState<Pos[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Pos>({ x: 3, y: 3 });
  const [foodEmoji, setFoodEmoji] = useState("🍎");
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef<Dir>("right");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  snakeRef.current = snake;
  foodRef.current = food;

  const spawnFood = useCallback((snk: Pos[]) => {
    let pos: Pos;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snk.some((s) => s.x === pos.x && s.y === pos.y));
    setFood(pos);
    setFoodEmoji(FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]);
  }, []);

  // Key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((key === "arrowup" || key === "w") && dirRef.current !== "down") dirRef.current = "up";
      else if ((key === "arrowdown" || key === "s") && dirRef.current !== "up") dirRef.current = "down";
      else if ((key === "arrowleft" || key === "a") && dirRef.current !== "right") dirRef.current = "left";
      else if ((key === "arrowright" || key === "d") && dirRef.current !== "left") dirRef.current = "right";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      const snk = [...snakeRef.current];
      const head = { ...snk[0] };
      if (dirRef.current === "up") head.y--;
      else if (dirRef.current === "down") head.y++;
      else if (dirRef.current === "left") head.x--;
      else if (dirRef.current === "right") head.x++;

      // Wall collision
      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
        setGameOver(true); return;
      }
      // Self collision
      if (snk.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true); return;
      }

      snk.unshift(head);
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        playSound("coin");
        spawnFood(snk);
      } else {
        snk.pop();
      }
      setSnake(snk);
    }, TICK);
    return () => clearInterval(id);
  }, [gameOver, spawnFood]);

  if (gameOver) {
    const length = snakeRef.current.length;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">{length} 🐍</h2>
          <p className="text-sm text-muted-foreground mb-6">Snake length: {length}</p>
          <button onClick={() => onComplete(length)}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all">
            ▸ COLLECT XP
          </button>
        </div>
      </div>
    );
  }

  const cellSize = `${100 / GRID}%`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex items-center justify-between w-full max-w-sm px-4 mb-4">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
          <span className="font-display text-[10px] text-neon">LENGTH: {snake.length}</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">✕ QUIT</button>
      </div>
      <div className="relative z-10 w-[min(80vw,320px)] aspect-square border border-border rounded-lg bg-black/40 overflow-hidden">
        {/* Food */}
        <div className="absolute text-lg flex items-center justify-center"
          style={{ left: `${(food.x / GRID) * 100}%`, top: `${(food.y / GRID) * 100}%`, width: cellSize, height: cellSize }}>
          {foodEmoji}
        </div>
        {/* Snake */}
        {snake.map((seg, i) => (
          <div key={i} className="absolute rounded-sm"
            style={{
              left: `${(seg.x / GRID) * 100}%`, top: `${(seg.y / GRID) * 100}%`,
              width: cellSize, height: cellSize,
              background: i === 0 ? "var(--neon-cyan, #0ff)" : "var(--primary)",
              opacity: i === 0 ? 1 : 0.7,
              boxShadow: i === 0 ? "0 0 8px var(--neon-cyan)" : "none",
            }} />
        ))}
      </div>
      <p className="relative z-10 font-display text-[9px] text-muted-foreground mt-3">WASD / Arrow keys to move</p>
    </div>
  );
}
