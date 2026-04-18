// Standalone entry point for the Electron panel window.
// Controls only — no pet rendered here. The pet lives in the overlay window.

import "../src/styles.css";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ControlPanel } from "../src/components/ControlPanel";
import { PETS, type PetKind } from "../src/components/pets/petSprites";
import { CURSORS, CURSOR_SOUND, type CursorKind } from "../src/components/cursors/cursors";
import { VolumeControl } from "../src/components/VolumeControl";
import { useSystemAwareness } from "../src/hooks/useSystemAwareness";
import { playSound } from "../src/lib/audio";
import type { PetStats } from "../src/components/pets/Pet";

declare global {
  interface Window {
    pixelpets?: {
      setPet: (kind: string) => void;
      setFollow: (value: boolean) => void;
      petAction: (action: string) => void;
      onStatsUpdate: (cb: (stats: PetStats) => void) => void;
    };
  }
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[9px] font-display text-muted-foreground">{label}</span>
        <span className="text-[9px] font-display" style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
    </div>
  );
}

function DesktopPanel() {
  const [currentKind, setCurrentKind] = useState<PetKind>("cat");
  const [cursor, setCursor] = useState<CursorKind>("csgo");
  const [followCursor, setFollowCursor] = useState(false);
  const [stats, setStats] = useState<PetStats>({ hunger: 80, happiness: 80, energy: 80 });
  const awareness = useSystemAwareness();

  // Listen for stats updates from the pet overlay
  useEffect(() => {
    window.pixelpets?.onStatsUpdate?.((s) => setStats(s));
  }, []);

  // Cursor styling
  useEffect(() => {
    document.body.style.cursor = CURSORS[cursor].value;
    return () => { document.body.style.cursor = ""; };
  }, [cursor]);

  // Cursor click sounds
  useEffect(() => {
    const sound = CURSOR_SOUND[cursor];
    if (!sound) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("button, a, input, label")) return;
      playSound(sound as Parameters<typeof playSound>[0]);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [cursor]);

  const setPet = (kind: PetKind) => {
    setCurrentKind(kind);
    window.pixelpets?.setPet(kind);
  };

  const currentPetName = PETS[currentKind].name;

  const TOD_LABEL: Record<string, { icon: string; text: string }> = {
    morning: { icon: "🌅", text: "MAÑANA" },
    day:     { icon: "☀️", text: "DÍA" },
    evening: { icon: "🌆", text: "TARDE" },
    night:   { icon: "🌙", text: "NOCHE" },
  };
  const battPct = awareness.batteryLevel != null ? Math.round(awareness.batteryLevel * 100) : null;
  const tod = TOD_LABEL[awareness.timeOfDay];

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="relative z-10 min-h-screen p-4 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <ControlPanel
            cursor={cursor}
            onCursor={setCursor}
            followCursor={followCursor}
            onToggleFollow={(v) => {
              setFollowCursor(v);
              window.pixelpets?.setFollow(v);
            }}
            petCount={1}
            onAddPet={setPet}
            onClearPets={() => {}}
          />

          {/* Stats panel — reads from overlay via IPC */}
          <section className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-[10px] text-neon-pink">
                {currentPetName.toUpperCase()} · STATS
              </h2>
            </div>
            <div className="space-y-3 mb-4">
              <StatBar label="HAMBRE" value={stats.hunger} color="hsl(20 90% 60%)" />
              <StatBar label="FELICIDAD" value={stats.happiness} color="hsl(330 80% 65%)" />
              <StatBar label="ENERGÍA" value={stats.energy} color="hsl(150 80% 55%)" />
            </div>

            {awareness && (
              <div className="mb-4 pt-3 border-t border-border/50">
                <p className="font-display text-[9px] text-neon mb-2">SISTEMA</p>
                <div className="grid grid-cols-3 gap-2 text-[9px] font-display">
                  <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-secondary/30">
                    <span className="text-base">
                      {!awareness.hasBattery ? "🖥️"
                        : awareness.batteryTier === "critical" ? "🪫"
                        : awareness.batteryCharging ? "⚡" : "🔋"}
                    </span>
                    <span className={!awareness.hasBattery ? "text-neon" : awareness.batteryTier === "critical" ? "text-destructive" : "text-muted-foreground"}>
                      {!awareness.hasBattery ? "PC" : battPct != null ? `${battPct}%` : "—"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-secondary/30">
                    <span className="text-base">{awareness.isIdle ? "💤" : "🖱️"}</span>
                    <span className="text-muted-foreground">
                      {awareness.isIdle ? "AFK" : `${awareness.idleSeconds}s`}
                    </span>
                  </div>
                  {tod && (
                    <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-secondary/30">
                      <span className="text-base">{tod.icon}</span>
                      <span className="text-muted-foreground">{tod.text}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => window.pixelpets?.petAction("feed")}
                className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5">
                <span className="text-base">🍖</span><span>FEED</span>
              </button>
              <button onClick={() => window.pixelpets?.petAction("play")}
                className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5">
                <span className="text-base">🎾</span><span>PLAY</span>
              </button>
              <button onClick={() => window.pixelpets?.petAction("sleep")}
                className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5">
                <span className="text-base">💤</span><span>SLEEP</span>
              </button>
            </div>
          </section>

          <VolumeControl />
        </div>

        {/* Hero */}
        <section className="hidden md:flex flex-col gap-6 max-w-2xl mx-auto justify-center min-h-[80vh] pointer-events-none">
          <p className="font-display text-[10px] text-neon-pink animate-flicker">▸ DESKTOP_APP · v2.0</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">
            <span className="text-neon">Pixel pets</span><br />
            <span className="text-foreground">para tu</span>{" "}
            <span className="text-neon-pink">desktop.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            42 mascotas con stats Tamagotchi. Aliméntalas y elige entre 29 cursores con sonidos únicos.
            La mascota vive en tu escritorio — este panel es solo el control remoto.
          </p>
        </section>
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<DesktopPanel />);
