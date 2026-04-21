import { getDailyMissions, type MissionProgress } from "@/lib/dailyMissions";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
}

export function DailyMissions({ gameState }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const missions = getDailyMissions(today);
  const progress = gameState.missionProgress?.date === today
    ? gameState.missionProgress.missions
    : missions.map(() => ({ id: "", progress: 0, completed: false, claimed: false }));

  return (
    <div className="glass rounded-xl p-3 border border-border/40">
      <h4 className="font-display text-[9px] text-muted-foreground mb-2">📋 DAILY MISSIONS</h4>
      <div className="flex flex-col gap-2">
        {missions.map((mission, i) => {
          const p = progress[i] || { progress: 0, completed: false, claimed: false };
          const pct = Math.min(100, (p.progress / mission.target) * 100);

          return (
            <div key={mission.id} className={`rounded-lg p-2 border transition-all ${p.claimed ? "border-green-500/40 bg-green-500/5" : p.completed ? "border-yellow-400/60 bg-yellow-400/5" : "border-border/30 bg-background/30"}`}>
              <div className="flex items-center gap-2">
                <span className="text-base">{mission.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[9px] text-foreground truncate">{mission.title}</p>
                  <p className="text-[8px] text-muted-foreground">{mission.description}</p>
                </div>
                {p.completed && !p.claimed && (
                  <button
                    onClick={() => gameState.claimMissionReward(mission.id)}
                    className="px-2 py-0.5 rounded text-[8px] font-display bg-neon/20 text-neon border border-neon/40 hover:bg-neon/30 transition-all animate-pulse"
                  >
                    CLAIM
                  </button>
                )}
                {p.claimed && <span className="text-[10px]">✅</span>}
              </div>
              {/* Progress bar */}
              <div className="mt-1.5 h-1.5 rounded-full bg-background/50 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: p.completed ? "var(--neon, #7af5b0)" : "var(--primary, #a855f7)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[7px] text-muted-foreground">{p.progress}/{mission.target}</span>
                <span className="text-[7px] text-muted-foreground">+{mission.reward.xp}XP {mission.reward.food ? `+ ${mission.reward.food.quantity}× food` : ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
