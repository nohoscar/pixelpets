import { useState, useCallback, useRef } from "react";
import type { GameState } from "@/hooks/useGameState";
import type { PetKind } from "./pets/petSprites";
import { PETS } from "./pets/petSprites";

interface Props {
  gameState: GameState;
  activePetKind?: PetKind;
  petName: string;
}

// Theme color maps for canvas (can't use CSS vars in canvas)
const THEME_COLORS: Record<string, { bg1: string; bg2: string; bg3: string; neon: string; neonPink: string }> = {
  cyberpunk: { bg1: "#2a1050", bg2: "#0f0828", bg3: "#060414", neon: "#39ff14", neonPink: "#ff3399" },
  pastel: { bg1: "#f5e6f0", bg2: "#ede0f0", bg3: "#e8dce8", neon: "#d94fa0", neonPink: "#9b59b6" },
  retro: { bg1: "#2a2200", bg2: "#1a1400", bg3: "#0d0a00", neon: "#ffb000", neonPink: "#44cc44" },
  midnight: { bg1: "#1a0a3a", bg2: "#0d0520", bg3: "#060210", neon: "#7c3aed", neonPink: "#c026d3" },
};

export function WallpaperGenerator({ gameState, activePetKind, petName }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateWallpaper = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = THEME_COLORS[gameState.theme] || THEME_COLORS.cyberpunk;

    // Background gradient
    const grad = ctx.createRadialGradient(960, 300, 0, 960, 540, 960);
    grad.addColorStop(0, colors.bg1);
    grad.addColorStop(0.6, colors.bg2);
    grad.addColorStop(1, colors.bg3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1080);

    // Grid overlay (scanline effect)
    ctx.strokeStyle = colors.neon + "15";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1920; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1080);
      ctx.stroke();
    }
    for (let y = 0; y < 1080; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1920, y);
      ctx.stroke();
    }

    // Pet sprite (rendered as SVG → canvas)
    if (activePetKind && PETS[activePetKind]) {
      // Draw a large glow circle behind pet
      const cx = 960, cy = 500;
      const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      glowGrad.addColorStop(0, colors.neon + "30");
      glowGrad.addColorStop(1, colors.neon + "00");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();

      // Pet placeholder circle (since we can't easily render React SVG to canvas)
      ctx.fillStyle = colors.neon + "20";
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = colors.neon;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pet emoji/text representation
      ctx.font = "80px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const petEmojis: Record<string, string> = {
        cat: "🐱", dog: "🐶", slime: "🟢", dragon: "🐉", ghost: "👻",
        robot: "🤖", axolotl: "🦎", capybara: "🐹", penguin: "🐧", fox: "🦊",
        panda: "🐼", unicorn: "🦄", bunny: "🐰", monkey: "🐵", pikachu: "⚡",
        kirby: "🩷", creeper: "💚", yoshi: "🦖", cthulhu: "🐙",
      };
      ctx.fillText(petEmojis[activePetKind] || "🐾", cx, cy);
    }

    // Pet name in neon font
    ctx.font = "bold 48px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = colors.neon;
    ctx.shadowColor = colors.neon;
    ctx.shadowBlur = 20;
    ctx.fillText(petName.toUpperCase(), 960, 720);
    ctx.shadowBlur = 0;

    // Level badge
    ctx.font = "bold 24px 'Press Start 2P', monospace";
    ctx.fillStyle = colors.neonPink;
    ctx.shadowColor = colors.neonPink;
    ctx.shadowBlur = 10;
    ctx.fillText(`LEVEL ${gameState.level}`, 960, 780);
    ctx.shadowBlur = 0;

    // Branding in corner
    ctx.font = "14px 'Press Start 2P', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = colors.neon + "80";
    ctx.fillText("PIXELPETS", 1880, 1050);

    // Store for preview and download
    const dataUrl = canvas.toDataURL("image/png");
    setPreview(dataUrl);
    canvasRef.current = canvas;
  }, [gameState, activePetKind, petName]);

  const downloadWallpaper = useCallback(() => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `pixelpets-wallpaper-${petName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  }, [petName]);

  return (
    <div className="mt-3">
      <button
        onClick={generateWallpaper}
        className="w-full px-3 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex items-center justify-center gap-2"
      >
        <span>🖼️</span>
        <span>WALLPAPER</span>
      </button>
      {preview && (
        <div className="mt-2 space-y-2">
          <img
            src={preview}
            alt="Wallpaper preview"
            className="w-full rounded-md border border-border"
          />
          <button
            onClick={downloadWallpaper}
            className="w-full px-3 py-1.5 rounded-md border border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all font-display text-[9px] text-neon"
          >
            ⬇️ DOWNLOAD 1920×1080
          </button>
          <button
            onClick={() => setPreview(null)}
            className="w-full px-3 py-1 rounded-md text-[8px] font-display text-muted-foreground hover:text-foreground transition-colors"
          >
            CLOSE PREVIEW
          </button>
        </div>
      )}
    </div>
  );
}
