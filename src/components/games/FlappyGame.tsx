import { useEffect, useRef, useState, useCallback } from "react";
import { playSound } from "@/lib/audio";

interface FlappyGameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

const GRAVITY = 0.5;
const JUMP_VEL = -7;
const PIPE_WIDTH = 40;
const GAP_SIZE = 100;
const PIPE_SPEED = 3;
const CANVAS_W = 320;
const CANVAS_H = 480;

export function FlappyGame({ onComplete, onCancel }: FlappyGameProps) {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdRef = useRef({ y: CANVAS_H / 2, vel: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const gameOverRef = useRef(false);

  const jump = useCallback(() => {
    if (gameOverRef.current) return;
    if (!started) setStarted(true);
    birdRef.current.vel = JUMP_VEL;
    playSound("click");
  }, [started]);

  // Input handlers
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => { if (e.code === "Space" || e.key === " ") { e.preventDefault(); jump(); } };
    const clickHandler = () => jump();
    window.addEventListener("keydown", keyHandler);
    const canvas = canvasRef.current;
    canvas?.addEventListener("click", clickHandler);
    return () => { window.removeEventListener("keydown", keyHandler); canvas?.removeEventListener("click", clickHandler); };
  }, [jump]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frameCount = 0;

    const loop = () => {
      if (gameOverRef.current) return;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const bird = birdRef.current;

      if (started) {
        // Physics
        bird.vel += GRAVITY;
        bird.y += bird.vel;

        // Spawn pipes
        frameCount++;
        if (frameCount % 90 === 0) {
          const gapY = 80 + Math.random() * (CANVAS_H - 160 - GAP_SIZE);
          pipesRef.current.push({ x: CANVAS_W, gapY, passed: false });
        }

        // Move pipes
        pipesRef.current = pipesRef.current.filter((p) => p.x > -PIPE_WIDTH);
        for (const pipe of pipesRef.current) {
          pipe.x -= PIPE_SPEED;
          // Score
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 40) {
            pipe.passed = true;
            scoreRef.current++;
            setScore(scoreRef.current);
            playSound("coin");
          }
          // Collision
          const birdX = 40, birdR = 12;
          if (birdX + birdR > pipe.x && birdX - birdR < pipe.x + PIPE_WIDTH) {
            if (bird.y - birdR < pipe.gapY || bird.y + birdR > pipe.gapY + GAP_SIZE) {
              gameOverRef.current = true;
              setGameOver(true);
              return;
            }
          }
        }

        // Floor/ceiling
        if (bird.y > CANVAS_H - 12 || bird.y < 12) {
          gameOverRef.current = true;
          setGameOver(true);
          return;
        }
      }

      // Draw pipes
      ctx.shadowColor = "var(--neon-cyan)";
      ctx.shadowBlur = 8;
      for (const pipe of pipesRef.current) {
        ctx.fillStyle = "#0f766e";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.fillRect(pipe.x, pipe.gapY + GAP_SIZE, PIPE_WIDTH, CANVAS_H - pipe.gapY - GAP_SIZE);
      }
      ctx.shadowBlur = 0;

      // Draw bird
      ctx.font = "24px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🐾", 40, bird.y);

      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameOver, started]);

  if (gameOver) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// GAME_OVER</p>
          <h2 className="font-display text-2xl text-neon mb-4">{scoreRef.current} 🐦</h2>
          <p className="text-sm text-muted-foreground mb-6">Passed {scoreRef.current} pipes!</p>
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
        <div className="glass rounded-lg px-4 py-2">
          <span className="font-display text-[10px] text-neon">SCORE: {score}</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">✕ QUIT</button>
      </div>
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
        className="relative z-10 rounded-lg border border-border bg-black/30" />
      {!started && <p className="relative z-10 font-display text-[9px] text-muted-foreground mt-3">Click or Space to flap</p>}
    </div>
  );
}
