import { useState, useCallback } from "react";
import type { PetStats } from "./pets/Pet";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  petName: string;
  stats: PetStats | null;
  gameState?: GameState;
}

export function ShareButton({ petName, stats, gameState }: Props) {
  const [toast, setToast] = useState(false);

  const handleShare = useCallback(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 400, 240);
    grad.addColorStop(0, "#1a1030");
    grad.addColorStop(1, "#0d0818");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 240);

    // Border glow
    ctx.strokeStyle = "#39ff14";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#39ff14";
    ctx.shadowBlur = 10;
    ctx.strokeRect(8, 8, 384, 224);
    ctx.shadowBlur = 0;

    // Pet name
    ctx.fillStyle = "#39ff14";
    ctx.font = "bold 20px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText(petName.toUpperCase(), 200, 50);

    // Stats
    if (stats) {
      ctx.font = "12px 'Space Grotesk', sans-serif";
      ctx.textAlign = "left";
      const y = 90;
      const barWidth = 120;

      // Hunger
      ctx.fillStyle = "#aaa";
      ctx.fillText("Hunger", 40, y);
      ctx.fillStyle = "#333";
      ctx.fillRect(130, y - 10, barWidth, 12);
      ctx.fillStyle = "hsl(20, 90%, 60%)";
      ctx.fillRect(130, y - 10, barWidth * (stats.hunger / 100), 12);

      // Happiness
      ctx.fillStyle = "#aaa";
      ctx.fillText("Happiness", 40, y + 25);
      ctx.fillStyle = "#333";
      ctx.fillRect(130, y + 15, barWidth, 12);
      ctx.fillStyle = "hsl(330, 80%, 65%)";
      ctx.fillRect(130, y + 15, barWidth * (stats.happiness / 100), 12);

      // Energy
      ctx.fillStyle = "#aaa";
      ctx.fillText("Energy", 40, y + 50);
      ctx.fillStyle = "#333";
      ctx.fillRect(130, y + 40, barWidth, 12);
      ctx.fillStyle = "hsl(150, 80%, 55%)";
      ctx.fillRect(130, y + 40, barWidth * (stats.energy / 100), 12);
    }

    // Level & Streak
    if (gameState) {
      ctx.font = "bold 14px 'Press Start 2P', monospace";
      ctx.textAlign = "right";
      ctx.fillStyle = "#c386ff";
      ctx.fillText(`LVL ${gameState.level}`, 370, 90);

      if (gameState.streakDays > 0) {
        ctx.fillStyle = "#ff6b35";
        ctx.fillText(`🔥 Day ${gameState.streakDays}`, 370, 115);
      }
    }

    // Branding
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    ctx.fillText("PIXELPETS · pixelpets.app", 200, 220);

    // Export
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("No blob");

      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pixelpets-${petName.toLowerCase().replace(/\s+/g, "-")}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
      }
    } catch {
      // Final fallback
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixelpets-${petName.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
    }
  }, [petName, stats, gameState]);

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="px-3 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex items-center gap-1.5"
      >
        <span>📸</span>
        <span>SHARE</span>
      </button>
      {toast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md glass text-[9px] font-display text-neon whitespace-nowrap animate-in fade-in zoom-in z-50">
          Copied to clipboard! 📋
        </div>
      )}
    </div>
  );
}
