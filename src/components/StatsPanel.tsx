import type { PetStats } from "./pets/Pet";
import type { SystemAwareness } from "@/hooks/useSystemAwareness";

interface Props {
  stats: PetStats | null;
  petName: string;
  awareness?: SystemAwareness;
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[9px] font-display text-muted-foreground">{label}</span>
        <span className="text-[9px] font-display" style={{ color }}>{Math.round(value)}</span>
      </div>
      <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 rounded-full"
          style={{
            width: `${value}%`,
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

const TOD_LABEL: Record<string, { icon: string; text: string }> = {
  morning: { icon: "🌅", text: "MAÑANA" },
  day:     { icon: "☀️", text: "DÍA" },
  evening: { icon: "🌆", text: "TARDE" },
  night:   { icon: "🌙", text: "NOCHE" },
};

export function StatsPanel({ stats, petName, awareness, onFeed, onPlay, onSleep }: Props) {
  if (!stats) return null;
  const battPct = awareness?.batteryLevel != null ? Math.round(awareness.batteryLevel * 100) : null;
  const tod = awareness ? TOD_LABEL[awareness.timeOfDay] : null;

  return (
    <section className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-[10px] text-neon-pink">{petName.toUpperCase()} · STATS</h2>
      </div>
      <div className="space-y-3 mb-4">
        <Bar label="HAMBRE" value={stats.hunger} color="hsl(20 90% 60%)" />
        <Bar label="FELICIDAD" value={stats.happiness} color="hsl(330 80% 65%)" />
        <Bar label="ENERGÍA" value={stats.energy} color="hsl(150 80% 55%)" />
      </div>

      {awareness && (
        <div className="mb-4 pt-3 border-t border-border/50">
          <p className="font-display text-[9px] text-neon mb-2">SISTEMA</p>
          <div className="grid grid-cols-3 gap-2 text-[9px] font-display">
            <div
              className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-secondary/30"
              title={awareness.hasBattery
                ? (awareness.batteryCharging ? "cargando" : `batería: ${awareness.batteryTier}`)
                : "PC sobremesa (sin batería)"}
            >
              <span className="text-base">
                {!awareness.hasBattery ? "🖥️"
                  : awareness.batteryTier === "critical" ? "🪫"
                  : awareness.batteryCharging ? "⚡"
                  : awareness.batteryTier === "low" ? "🔋"
                  : "🔋"}
              </span>
              <span className={
                !awareness.hasBattery ? "text-neon"
                  : awareness.batteryTier === "critical" ? "text-destructive"
                  : "text-muted-foreground"
              }>
                {!awareness.hasBattery ? "PC" : battPct != null ? `${battPct}%` : "—"}
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-secondary/30" title="inactividad">
              <span className="text-base">{awareness.isIdle ? "💤" : "🖱️"}</span>
              <span className="text-muted-foreground">
                {awareness.isIdle ? "AFK" : `${awareness.idleSeconds}s`}
              </span>
            </div>
            {tod && (
              <div className="flex flex-col items-center gap-0.5 p-1.5 rounded-md bg-secondary/30" title={`hora: ${awareness.hour}:00`}>
                <span className="text-base">{tod.icon}</span>
                <span className="text-muted-foreground">{tod.text}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onFeed}
          className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5"
        >
          <span className="text-base">🍖</span>
          <span>FEED</span>
        </button>
        <button
          onClick={onPlay}
          className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5"
        >
          <span className="text-base">🎾</span>
          <span>PLAY</span>
        </button>
        <button
          onClick={onSleep}
          className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5"
        >
          <span className="text-base">💤</span>
          <span>SLEEP</span>
        </button>
      </div>
    </section>
  );
}
