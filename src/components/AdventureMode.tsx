import { useState, useEffect } from "react";
import { WORLDS, getAvailableWorlds, type AdventureWorld } from "@/lib/adventureSystem";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
  onStartBossFight: (gameId: string) => void;
}

export function AdventureMode({ gameState, onStartBossFight }: Props) {
  const [selectedWorld, setSelectedWorld] = useState<AdventureWorld | null>(null);
  const [exploring, setExploring] = useState(false);
  const [exploreProgress, setExploreProgress] = useState(0);

  const availableWorlds = getAvailableWorlds(gameState.level);
  const currentAdventure = gameState.currentAdventure || null;
  // Stable key for effect dependency
  const adventureKey = currentAdventure ? `${currentAdventure.worldId}-${currentAdventure.stageId}-${currentAdventure.startedAt}` : "";

  // Handle exploration timer
  useEffect(() => {
    if (!currentAdventure) { setExploring(false); setExploreProgress(0); return; }
    setExploring(true);

    const world = WORLDS.find((w) => w.id === currentAdventure.worldId);
    const stage = world?.stages.find((s) => s.id === currentAdventure.stageId);
    if (!world || !stage) { setExploring(false); return; }

    const duration = stage.durationMs;
    const startedAt = currentAdventure.startedAt;

    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setExploreProgress(pct);

      if (elapsed >= duration) {
        // Complete!
        gameState.completeAdventureStage(world.id, stage.id);
        gameState.addXp(stage.xpReward);
        if (stage.foodReward) gameState.addFood(stage.foodReward, 1);
        gameState.updateMissionProgress("xp", stage.xpReward);
        setExploring(false);
        setExploreProgress(0);
      }
    };

    const id = setInterval(tick, 500);
    tick();
    return () => clearInterval(id);
  }, [adventureKey]);

  if (exploring && currentAdventure) {
    const world = WORLDS.find((w) => w.id === currentAdventure.worldId);
    const stage = world?.stages.find((s) => s.id === currentAdventure.stageId);
    return (
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">🗺️ EXPLORING...</h4>
        <div className="text-center py-3">
          <span className="text-2xl animate-bob inline-block">{world?.icon}</span>
          <p className="font-display text-[10px] text-foreground mt-2">{stage?.name}</p>
          <p className="text-[8px] text-muted-foreground italic mt-1">{stage?.description}</p>
          <div className="mt-3 h-2 rounded-full bg-background/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-neon transition-all duration-500"
              style={{ width: `${exploreProgress}%` }}
            />
          </div>
          <p className="text-[8px] text-muted-foreground mt-1">{Math.round(exploreProgress)}%</p>
        </div>
      </div>
    );
  }

  if (selectedWorld) {
    const progress = gameState.adventureProgress?.[selectedWorld.id];
    const completedStages = progress?.stagesCompleted || [];
    const bossDefeated = progress?.bossDefeated || false;
    const allStagesComplete = selectedWorld.stages.every((s) => completedStages.includes(s.id));

    return (
      <div className="glass rounded-xl p-3 border border-border/40">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display text-[9px] text-muted-foreground">🗺️ {selectedWorld.name.toUpperCase()}</h4>
          <button onClick={() => setSelectedWorld(null)} className="text-[9px] text-muted-foreground hover:text-foreground">← Back</button>
        </div>
        <p className="text-[8px] text-muted-foreground italic mb-2">{selectedWorld.description}</p>

        <div className="flex flex-col gap-1.5">
          {selectedWorld.stages.map((stage) => {
            const done = completedStages.includes(stage.id);
            return (
              <button
                key={stage.id}
                disabled={done}
                onClick={() => gameState.startAdventure(selectedWorld.id, stage.id)}
                className={`rounded-lg p-2 border text-left transition-all ${done ? "border-green-500/30 bg-green-500/5 opacity-60" : "border-border/30 hover:border-neon/50 cursor-pointer"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{done ? "✅" : "⚔️"}</span>
                  <div>
                    <p className="font-display text-[9px]">{stage.name}</p>
                    <p className="text-[7px] text-muted-foreground">+{stage.xpReward}XP {stage.foodReward ? `+ 🍽️` : ""}</p>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Boss fight */}
          {allStagesComplete && !bossDefeated && (
            <button
              onClick={() => onStartBossFight(selectedWorld.bossGame)}
              className="rounded-lg p-2 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all animate-pulse"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">👹</span>
                <div>
                  <p className="font-display text-[9px] text-red-400">BOSS FIGHT!</p>
                  <p className="text-[7px] text-muted-foreground">Defeat the boss to complete this world</p>
                </div>
              </div>
            </button>
          )}
          {bossDefeated && (
            <div className="rounded-lg p-2 border border-yellow-500/40 bg-yellow-500/5 text-center">
              <span className="text-lg">🏆</span>
              <p className="font-display text-[8px] text-yellow-400">WORLD COMPLETE!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-3 border border-border/40">
      <h4 className="font-display text-[9px] text-muted-foreground mb-2">🗺️ ADVENTURE MODE</h4>
      <div className="grid grid-cols-2 gap-1.5">
        {WORLDS.map((world) => {
          const available = world.requiredLevel <= gameState.level;
          const progress = gameState.adventureProgress?.[world.id];
          const bossDefeated = progress?.bossDefeated || false;
          const stagesCount = progress?.stagesCompleted?.length || 0;

          return (
            <button
              key={world.id}
              disabled={!available}
              onClick={() => setSelectedWorld(world)}
              className={`rounded-lg p-2 border text-center transition-all ${!available ? "opacity-30 border-border/20" : bossDefeated ? "border-yellow-500/40 bg-yellow-500/5" : "border-border/30 hover:border-neon/50 cursor-pointer"}`}
            >
              <span className="text-xl block">{available ? world.icon : "🔒"}</span>
              <p className="font-display text-[8px] mt-1">{world.name}</p>
              <p className="text-[7px] text-muted-foreground">
                {!available ? `Lv.${world.requiredLevel}` : bossDefeated ? "✅ Complete" : `${stagesCount}/${world.stages.length}`}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
