import type { PetStats } from "./pets/Pet";
import type { SystemAwareness } from "@/hooks/useSystemAwareness";
import type { GameState } from "@/hooks/useGameState";
import { useI18n } from "@/lib/i18n";
import { ShareButton } from "./ShareButton";

interface Props {
  stats: PetStats | null;
  petName: string;
  awareness?: SystemAwareness;
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  gameState?: GameState;
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

export function StatsPanel({ stats, petName, awareness, onFeed, onPlay, onSleep, gameState }: Props) {
  if (!stats) return null;
  const { t } = useI18n();
  const battPct = awareness?.batteryLevel != null ? Math.round(awareness.batteryLevel * 100) : null;

  const TOD_LABEL: Record<string, { icon: string; text: string }> = {
    morning: { icon: "🌅", text: t("stats.morning") },
    day:     { icon: "☀️", text: t("stats.day") },
    evening: { icon: "🌆", text: t("stats.evening") },
    night:   { icon: "🌙", text: t("stats.night") },
  };

  const tod = awareness ? TOD_LABEL[awareness.timeOfDay] : null;

  // XP progress calculation
  const currentLevel = gameState?.level ?? 1;
  const currentXp = gameState?.xp ?? 0;
  // Threshold for current level: (level-1)^2 * 100
  const currentLevelThreshold = (currentLevel - 1) * (currentLevel - 1) * 100;
  const nextLevelThreshold = currentLevel * currentLevel * 100;
  const xpInLevel = currentXp - currentLevelThreshold;
  const xpNeeded = nextLevelThreshold - currentLevelThreshold;
  const xpProgress = xpNeeded > 0 ? Math.min(100, (xpInLevel / xpNeeded) * 100) : 100;

  return (
    <section className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-[10px] text-neon-pink">{petName.toUpperCase()} · {t("stats.title")}</h2>
        <ShareButton petName={petName} stats={stats} gameState={gameState} />
      </div>
      <div className="space-y-3 mb-4">
        <Bar label={t("stats.hunger")} value={stats.hunger} color="hsl(20 90% 60%)" />
        <Bar label={t("stats.happiness")} value={stats.happiness} color="hsl(330 80% 65%)" />
        <Bar label={t("stats.energy")} value={stats.energy} color="hsl(150 80% 55%)" />
      </div>

      {/* XP / Level display */}
      {gameState && (
        <div className="mb-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-display text-neon">{t("stats.level")} {currentLevel}</span>
            <span className="text-[9px] font-display text-muted-foreground">{currentXp} XP</span>
          </div>
          <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${xpProgress}%`,
                background: "hsl(270 80% 65%)",
                boxShadow: "0 0 10px hsl(270 80% 65%)",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[8px] text-muted-foreground">
              {xpInLevel}/{xpNeeded} → {t("stats.level")} {currentLevel + 1}
            </p>
            {gameState.streakDays > 0 && (
              <span
                className="text-[9px] font-display"
                style={{
                  color: gameState.streakDays > 3 ? "hsl(20 90% 55%)" : "var(--muted-foreground)",
                  animation: gameState.streakDays > 3 ? "pulse-glow 2s ease-in-out infinite" : undefined,
                }}
              >
                🔥 Day {gameState.streakDays}
              </span>
            )}
          </div>
        </div>
      )}

      {awareness && (
        <div className="mb-4 pt-3 border-t border-border/50">
          <p className="font-display text-[9px] text-neon mb-2">{t("stats.system")}</p>
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
          className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px]"
        >
          <span className="text-base">🍖</span>
          <span>{t("stats.feed")}</span>
        </button>
        <button
          onClick={onPlay}
          className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px]"
        >
          <span className="text-base">🎾</span>
          <span>{t("stats.play")}</span>
        </button>
        <button
          onClick={onSleep}
          className="px-2 py-2 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-0.5 min-h-[44px] min-w-[44px]"
        >
          <span className="text-base">💤</span>
          <span>{t("stats.sleep")}</span>
        </button>
      </div>
    </section>
  );
}
