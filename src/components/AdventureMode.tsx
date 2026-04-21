import { useState, useRef, useCallback } from "react";
import { WORLDS, type AdventureWorld } from "@/lib/adventureSystem";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
  onStartBossFight: (gameId: string) => void;
}

export function AdventureMode({ gameState, onStartBossFight }: Props) {
  const [selectedWorld, setSelectedWorld] = useState<AdventureWorld | null>(null);
  const [exploring, setExploring] = useState(false);
  const [exploreInfo, setExploreInfo] = useState<{ worldId: string; stageId: string; worldIcon: string; stageName: string; stageDesc: string; xp: number; food: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const startExplore = useCallback((worldId: string, stageId: string) => {
    const world = WORLDS.find((w) => w.id === worldId);
    const stage = world?.stages.find((s) => s.id === stageId);
    if (!world || !stage) return;

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    setExploreInfo({
      worldId, stageId,
      worldIcon: world.icon,
      stageName: stage.name,
      stageDesc: stage.description,
      xp: stage.xpReward,
      food: stage.foodReward || "",
    });
    setExploring(true);
    setProgress(0);

    const startedAt = Date.now();
    const duration = stage.durationMs;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;

        const gs = gameStateRef.current;
        gs.addXp(stage.xpReward);
        if (stage.foodReward) gs.addFood(stage.foodReward, 1);
        gs.updateMissionProgress("xp", stage.xpReward);
        gs.completeAdventureStage(worldId, stageId);

        setExploring(false);
        setExploreInfo(null);
        setProgress(0);
      }
    }, 250);
  }, []);

  // Exploring view
  if (exploring && exploreInfo) {
    return (
      <div className="glass rounded-xl p-4 border border-neon/30">
        <h4 className="font-display text-[9px] text-neon mb-3">🗺️ EXPLORING...</h4>
        <div className="text-center py-3">
          <span className="text-3xl animate-bob inline-block">{exploreInfo.worldIcon}</span>
          <p className="font-display text-xs text-foreground mt-2">{exploreInfo.stageName}</p>
          <p className="text-[9px] text-muted-foreground italic mt-1">{exploreInfo.stageDesc}</p>
          <div className="mt-4 h-3 rounded-full bg-background/50 overflow-hidden border border-neon/20">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: "var(--neon, #7af5b0)" }}
            />
          </div>
          <p className="text-sm text-neon mt-2 font-display">{Math.round(progress)}%</p>
          <p className="text-[8px] text-muted-foreground mt-1">+{exploreInfo.xp}XP {exploreInfo.food ? "· +🍽️" : ""}</p>
        </div>
      </div>
    );
  }

  // World detail view
  if (selectedWorld) {
    const wp = gameState.adventureProgress?.[selectedWorld.id];
    const completedStages = wp?.stagesCompleted || [];
    const bossDefeated = wp?.bossDefeated || false;
    const allDone = selectedWorld.stages.every((s) => completedStages.includes(s.id));

    return (
      <div className="glass rounded-xl p-3 border border-border/40">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display text-[10px] text-neon">{selectedWorld.icon} {selectedWorld.name}</h4>
          <button onClick={() => setSelectedWorld(null)} className="text-[9px] text-muted-foreground hover:text-foreground">← Back</button>
        </div>
        <p className="text-[8px] text-muted-foreground italic mb-3">{selectedWorld.description}</p>

        <div className="flex flex-col gap-2">
          {selectedWorld.stages.map((stage) => {
            const done = completedStages.includes(stage.id);
            return (
              <button
                key={stage.id}
                disabled={done}
                onClick={() => startExplore(selectedWorld.id, stage.id)}
                className={`rounded-lg p-3 border text-left transition-all ${done ? "border-green-500/30 bg-green-500/5 opacity-60" : "border-border/30 hover:border-neon/50 hover:bg-neon/5 cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{done ? "✅" : "⚔️"}</span>
                  <div>
                    <p className="font-display text-[10px]">{stage.name}</p>
                    <p className="text-[8px] text-muted-foreground">{stage.description}</p>
                    <p className="text-[7px] text-neon mt-0.5">+{stage.xpReward}XP {stage.foodReward ? "· +🍽️" : ""}</p>
                  </div>
                </div>
              </button>
            );
          })}

          {allDone && !bossDefeated && (
            <button
              onClick={() => onStartBossFight(selectedWorld.bossGame)}
              className="rounded-lg p-3 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">👹</span>
                <div>
                  <p className="font-display text-[10px] text-red-400">BOSS FIGHT!</p>
                  <p className="text-[8px] text-muted-foreground">Defeat the boss to complete this world</p>
                </div>
              </div>
            </button>
          )}
          {bossDefeated && (
            <div className="rounded-lg p-3 border border-yellow-500/40 bg-yellow-500/5 text-center">
              <span className="text-2xl">🏆</span>
              <p className="font-display text-[9px] text-yellow-400 mt-1">WORLD COMPLETE!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // World selection grid
  return (
    <div className="grid grid-cols-2 gap-3">
      {WORLDS.map((world) => {
        const available = world.requiredLevel <= gameState.level;
        const wp = gameState.adventureProgress?.[world.id];
        const bossDefeated = wp?.bossDefeated || false;
        const stagesCount = wp?.stagesCompleted?.length || 0;

        return (
          <button
            key={world.id}
            disabled={!available}
            onClick={() => setSelectedWorld(world)}
            className={`glass rounded-xl p-4 border text-center transition-all ${!available ? "opacity-30 border-border/20" : bossDefeated ? "border-yellow-500/40 bg-yellow-500/5" : "border-border/30 hover:border-neon/50 cursor-pointer"}`}
          >
            <span className="text-2xl block">{available ? world.icon : "🔒"}</span>
            <p className="font-display text-[9px] mt-1">{world.name}</p>
            <p className="text-[7px] text-muted-foreground mt-0.5">
              {!available ? `Lv.${world.requiredLevel}` : bossDefeated ? "✅ Complete" : `${stagesCount}/${world.stages.length}`}
            </p>
          </button>
        );
      })}
    </div>
  );
}
