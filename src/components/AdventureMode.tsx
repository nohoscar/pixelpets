import { useState, useRef, useCallback, useEffect } from "react";
import { WORLDS, type AdventureWorld } from "@/lib/adventureSystem";
import { PETS, type PetKind } from "./pets/petSprites";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
  onStartBossFight: (gameId: string) => void;
  activePetKind?: PetKind;
}

// Scenery elements per world
const WORLD_SCENERY: Record<string, { bg: string; ground: string; items: string[] }> = {
  meadow: { bg: "from-green-900/40 to-cyan-900/30", ground: "bg-green-800/60", items: ["🌸", "🌻", "🦋", "🌿", "🍄", "🐝", "🌺", "🐛"] },
  cave: { bg: "from-indigo-900/50 to-purple-900/40", ground: "bg-stone-800/60", items: ["💎", "🔮", "🦇", "🕯️", "💀", "🪨", "✨", "🕸️"] },
  volcano: { bg: "from-red-900/50 to-orange-900/40", ground: "bg-red-950/60", items: ["🔥", "🌋", "💨", "🪨", "⚡", "🐉", "☄️", "🔶"] },
  cloud: { bg: "from-blue-900/30 to-sky-800/30", ground: "bg-sky-700/40", items: ["☁️", "⭐", "🌈", "🦅", "✨", "🌙", "💫", "🎐"] },
  abyss: { bg: "from-gray-950/60 to-purple-950/50", ground: "bg-gray-900/70", items: ["👁️", "🕳️", "💀", "👻", "🌑", "⚫", "🔮", "🫥"] },
};

// Random events during exploration
const EXPLORE_EVENTS = [
  { msg: "Found a treasure chest! 💰", icon: "🎁" },
  { msg: "A wild creature appeared!", icon: "👾" },
  { msg: "Discovered a hidden path!", icon: "🗝️" },
  { msg: "Found some berries!", icon: "🫐" },
  { msg: "A friendly NPC waves!", icon: "👋" },
  { msg: "Dodged a trap!", icon: "⚠️" },
  { msg: "Found a shiny gem!", icon: "💎" },
  { msg: "Resting at a campfire...", icon: "🏕️" },
  { msg: "Solved a puzzle!", icon: "🧩" },
  { msg: "Pet gained confidence!", icon: "💪" },
];

export function AdventureMode({ gameState, onStartBossFight, activePetKind }: Props) {
  const [selectedWorld, setSelectedWorld] = useState<AdventureWorld | null>(null);
  const [exploring, setExploring] = useState(false);
  const [exploreInfo, setExploreInfo] = useState<{ worldId: string; stageId: string; worldIcon: string; stageName: string; stageDesc: string; xp: number; food: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [petX, setPetX] = useState(10);
  const [step, setStep] = useState(0);
  const [events, setEvents] = useState<{ msg: string; icon: string; id: number }[]>([]);
  const [sceneryItems, setSceneryItems] = useState<{ icon: string; x: number; y: number; id: number }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eventIdRef = useRef(0);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Animate pet walking + scenery during exploration
  useEffect(() => {
    if (!exploring || !exploreInfo) return;
    const walkId = setInterval(() => {
      setStep((s) => s + 1);
      setPetX((x) => Math.min(85, x + 0.3));
    }, 200);
    return () => clearInterval(walkId);
  }, [exploring, exploreInfo]);

  // Generate random events during exploration
  useEffect(() => {
    if (!exploring) { setEvents([]); return; }
    const eventId = setInterval(() => {
      const evt = EXPLORE_EVENTS[Math.floor(Math.random() * EXPLORE_EVENTS.length)];
      const id = ++eventIdRef.current;
      setEvents((prev) => [...prev.slice(-2), { ...evt, id }]);
    }, 3000);
    return () => clearInterval(eventId);
  }, [exploring]);

  // Generate scenery items
  useEffect(() => {
    if (!exploring || !exploreInfo) { setSceneryItems([]); return; }
    const scenery = WORLD_SCENERY[exploreInfo.worldId] || WORLD_SCENERY.meadow;
    const items = Array.from({ length: 8 }, (_, i) => ({
      icon: scenery.items[Math.floor(Math.random() * scenery.items.length)],
      x: 5 + Math.random() * 85,
      y: 55 + Math.random() * 20,
      id: i,
    }));
    setSceneryItems(items);
  }, [exploring, exploreInfo?.stageId]);

  const startExplore = useCallback((worldId: string, stageId: string) => {
    const world = WORLDS.find((w) => w.id === worldId);
    const stage = world?.stages.find((s) => s.id === stageId);
    if (!world || !stage) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setExploreInfo({
      worldId, stageId, worldIcon: world.icon, stageName: stage.name,
      stageDesc: stage.description, xp: stage.xpReward, food: stage.foodReward || "",
    });
    setExploring(true);
    setProgress(0);
    setPetX(10);
    setEvents([]);

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

  const petKind = activePetKind || "cat";
  const petDef = PETS[petKind];

  // ═══ EXPLORING VIEW — Visual scene ═══
  if (exploring && exploreInfo) {
    const scenery = WORLD_SCENERY[exploreInfo.worldId] || WORLD_SCENERY.meadow;

    return (
      <div className="glass rounded-xl border border-neon/30 overflow-hidden">
        {/* Scene */}
        <div className={`relative h-40 bg-gradient-to-b ${scenery.bg} overflow-hidden`}>
          {/* Sky elements */}
          <div className="absolute top-2 right-4 text-lg opacity-60">{exploreInfo.worldIcon}</div>
          <div className="absolute top-3 left-6 text-[10px] opacity-40">✦</div>
          <div className="absolute top-5 left-20 text-[8px] opacity-30">✧</div>

          {/* Scenery items on ground */}
          {sceneryItems.map((item) => (
            <div key={item.id} className="absolute text-sm opacity-70" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
              {item.icon}
            </div>
          ))}

          {/* Ground */}
          <div className={`absolute bottom-0 left-0 right-0 h-8 ${scenery.ground}`} />

          {/* Pet walking */}
          <div className="absolute bottom-6 transition-all duration-200" style={{ left: `${petX}%` }}>
            <div className="w-10 h-10">
              {petDef.render("right", step)}
            </div>
          </div>

          {/* Stage name overlay */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/40 backdrop-blur-sm">
            <p className="font-display text-[8px] text-neon">{exploreInfo.stageName}</p>
          </div>
        </div>

        {/* Event log */}
        <div className="px-3 py-2 border-t border-border/30 min-h-[48px]">
          {events.slice(-2).map((evt) => (
            <div key={evt.id} className="flex items-center gap-1.5 py-0.5 animate-in fade-in slide-in-from-left duration-300">
              <span className="text-sm">{evt.icon}</span>
              <span className="text-[8px] text-muted-foreground">{evt.msg}</span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-[8px] text-muted-foreground italic">Exploring {exploreInfo.stageDesc.toLowerCase()}...</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-3 pb-3">
          <div className="h-2 rounded-full bg-background/50 overflow-hidden border border-border/20">
            <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, background: "var(--neon, #7af5b0)" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-neon font-display">{Math.round(progress)}%</span>
            <span className="text-[7px] text-muted-foreground">+{exploreInfo.xp}XP {exploreInfo.food ? "· +🍽️" : ""}</span>
          </div>
        </div>
      </div>
    );
  }

  // ═══ WORLD DETAIL VIEW ═══
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
              <button key={stage.id} disabled={done} onClick={() => startExplore(selectedWorld.id, stage.id)}
                className={`rounded-lg p-3 border text-left transition-all ${done ? "border-green-500/30 bg-green-500/5 opacity-60" : "border-border/30 hover:border-neon/50 hover:bg-neon/5 cursor-pointer"}`}>
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
            <button onClick={() => onStartBossFight(selectedWorld.bossGame)}
              className="rounded-lg p-3 border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all">
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

  // ═══ WORLD SELECTION GRID ═══
  return (
    <div className="grid grid-cols-2 gap-3">
      {WORLDS.map((world) => {
        const available = world.requiredLevel <= gameState.level;
        const wp = gameState.adventureProgress?.[world.id];
        const bossDefeated = wp?.bossDefeated || false;
        const stagesCount = wp?.stagesCompleted?.length || 0;
        return (
          <button key={world.id} disabled={!available} onClick={() => setSelectedWorld(world)}
            className={`glass rounded-xl p-4 border text-center transition-all ${!available ? "opacity-30 border-border/20" : bossDefeated ? "border-yellow-500/40 bg-yellow-500/5" : "border-border/30 hover:border-neon/50 cursor-pointer"}`}>
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
