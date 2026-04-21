// Standalone entry point for the Electron panel window.
// Tabbed interface for compact navigation.

import "../src/styles.css";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { PETS, PET_LIST, type PetKind } from "../src/components/pets/petSprites";
import { StatsPanel } from "../src/components/StatsPanel";
import { VolumeControl } from "../src/components/VolumeControl";
import { useSystemAwareness } from "../src/hooks/useSystemAwareness";
import { useGameState } from "../src/hooks/useGameState";
import { CatchGame } from "../src/components/games/CatchGame";
import { MemoryGame } from "../src/components/games/MemoryGame";
import { SimonGame } from "../src/components/games/SimonGame";
import { TypingGame } from "../src/components/games/TypingGame";
import { ReactionGame } from "../src/components/games/ReactionGame";
import { PetQuizGame } from "../src/components/games/PetQuizGame";
import { DodgeGame } from "../src/components/games/DodgeGame";
import { WhackGame } from "../src/components/games/WhackGame";
import { SnakeGame } from "../src/components/games/SnakeGame";
import { FlappyGame } from "../src/components/games/FlappyGame";
import { PuzzleGame } from "../src/components/games/PuzzleGame";
import { ColorMatchGame } from "../src/components/games/ColorMatchGame";
import { RhythmGame } from "../src/components/games/RhythmGame";
import { AchievementToast } from "../src/components/AchievementToast";
import { I18nProvider } from "../src/lib/i18n";
import { Onboarding, useOnboarding } from "../src/components/Onboarding";
import { applyTheme, type ThemeId } from "../src/lib/themes";
import { AmbientSound } from "../src/components/AmbientSound";
import { FoodInventory } from "../src/components/FoodInventory";
import { DailyMissions } from "../src/components/DailyMissions";
import { AdventureMode } from "../src/components/AdventureMode";
import { WeatherWidget } from "../src/components/WeatherWidget";
import { PetTrading } from "../src/components/PetTrading";
import { getGameReward, isFavoriteFood } from "../src/lib/foodSystem";
import type { FoodItem } from "../src/lib/foodSystem";
import { PomodoroTimer } from "../src/components/PomodoroTimer";
import { getUnlockedAccessories } from "../src/components/pets/accessories";
import { ACHIEVEMENTS } from "../src/hooks/useGameState";
import { THEMES } from "../src/lib/themes";
import { randomThought } from "../src/components/pets/petThoughts";
import type { PetStats } from "../src/components/pets/Pet";

declare global {
  interface Window {
    pixelpets?: {
      setPet: (kind: string) => void;
      setFollow: (value: boolean) => void;
      petAction: (action: string) => void;
      setCursor: (name: string) => void;
      onStatsUpdate: (cb: (stats: PetStats) => void) => void;
    };
  }
}

type TabId = "pet" | "games" | "adventure" | "social" | "settings";

function ElectronApp() {
  const gameState = useGameState();
  const { showOnboarding, dismissOnboarding } = useOnboarding();

  useEffect(() => {
    if (gameState.theme && gameState.theme !== "cyberpunk") {
      applyTheme(gameState.theme as ThemeId);
    }
  }, []);

  return (
    <I18nProvider initialLocale={gameState.locale}>
      {showOnboarding && <Onboarding onDismiss={dismissOnboarding} />}
      <AmbientSound soundId={gameState.ambientSound} />
      <ElectronPanel gameState={gameState} />
    </I18nProvider>
  );
}

function ElectronPanel({ gameState }: { gameState: ReturnType<typeof useGameState> }) {
  const [currentKind, setCurrentKind] = useState<PetKind>("cat");
  const [followCursor, setFollowCursor] = useState(false);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [achievementToast, setAchievementToast] = useState<{ name: string; icon: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("pet");
  const awareness = useSystemAwareness();

  useEffect(() => {
    window.pixelpets?.onStatsUpdate?.((s) => setStats(s));
  }, []);

  // --- Game handlers (consolidated) ---
  const handleGameComplete = (game: string, score: number) => {
    const xpMap: Record<string, (s: number) => number> = {
      catch: (s) => Math.min(50, Math.max(10, s * 3)),
      memory: (s) => s < 10 ? 50 : s <= 15 ? 30 : 15,
      simon: (s) => Math.min(50, s * 5),
      typing: (s) => Math.min(50, s * 8),
      reaction: (s) => s < 300 ? 50 : s < 500 ? 30 : 15,
      quiz: (s) => Math.min(50, s * 5),
      dodge: (s) => Math.min(50, s * 2),
      whack: (s) => Math.min(50, s * 3),
      snake: (s) => Math.min(50, s * 2),
      flappy: (s) => Math.min(50, s * 3),
      puzzle: (s) => Math.min(50, s * 4),
      colorMatch: (s) => Math.min(50, s * 3),
      rhythm: (s) => Math.min(50, s * 3),
    };
    const xp = (xpMap[game] || (() => 20))(score);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed(game as any);
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleGameCancel = () => setActiveGame(null);

  const showAchievementToast = (name: string, icon: string) => {
    setAchievementToast({ name, icon });
    setTimeout(() => setAchievementToast(null), 3000);
  };

  useEffect(() => {
    gameState.achievementCallbackRef.current = showAchievementToast;
    return () => { gameState.achievementCallbackRef.current = null; };
  });

  // IPC wrappers
  const setPet = (kind: PetKind) => {
    setCurrentKind(kind);
    window.pixelpets?.setPet(kind);
  };

  const handleFeed = () => {
    window.pixelpets?.petAction("feed");
    gameState.incrementFeedCount();
    gameState.addXp(5);
    gameState.addPetXp(currentKind, 5);
    gameState.updateMissionProgress("feed", 1);
  };

  const handlePlay = () => {
    window.pixelpets?.petAction("play");
    gameState.incrementPlayCount();
    gameState.addXp(5);
    gameState.addPetXp(currentKind, 5);
    gameState.updateMissionProgress("play", 1);
  };

  const handleSleep = () => { window.pixelpets?.petAction("sleep"); };

  const handleFeedWithFood = (food: FoodItem) => {
    if (!gameState.useFood(food.id)) return;
    window.pixelpets?.petAction("feed");
    gameState.incrementFeedCount();
    const isFav = isFavoriteFood(currentKind, food.id);
    const xp = food.happinessBoost * (isFav ? 2 : 1);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.updateMissionProgress("feed", 1);
    gameState.updateMissionProgress("food", 1);
  };

  const currentPetName = gameState.petNames[currentKind] || PETS[currentKind].name;

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Game overlays */}
      {activeGame === "catch" && <CatchGame onComplete={(s) => handleGameComplete("catch", s)} onCancel={handleGameCancel} />}
      {activeGame === "memory" && <MemoryGame onComplete={(s) => handleGameComplete("memory", s)} onCancel={handleGameCancel} />}
      {activeGame === "simon" && <SimonGame onComplete={(s) => handleGameComplete("simon", s)} onCancel={handleGameCancel} />}
      {activeGame === "typing" && <TypingGame onComplete={(s) => handleGameComplete("typing", s)} onCancel={handleGameCancel} />}
      {activeGame === "reaction" && <ReactionGame onComplete={(s) => handleGameComplete("reaction", s)} onCancel={handleGameCancel} />}
      {activeGame === "quiz" && <PetQuizGame onComplete={(s) => handleGameComplete("quiz", s)} onCancel={handleGameCancel} />}
      {activeGame === "dodge" && <DodgeGame onComplete={(s) => handleGameComplete("dodge", s)} onCancel={handleGameCancel} />}
      {activeGame === "whack" && <WhackGame onComplete={(s) => handleGameComplete("whack", s)} onCancel={handleGameCancel} />}
      {activeGame === "snake" && <SnakeGame onComplete={(s) => handleGameComplete("snake", s)} onCancel={handleGameCancel} />}
      {activeGame === "flappy" && <FlappyGame onComplete={(s) => handleGameComplete("flappy", s)} onCancel={handleGameCancel} />}
      {activeGame === "puzzle" && <PuzzleGame onComplete={(s) => handleGameComplete("puzzle", s)} onCancel={handleGameCancel} />}
      {activeGame === "colorMatch" && <ColorMatchGame onComplete={(s) => handleGameComplete("colorMatch", s)} onCancel={handleGameCancel} />}
      {activeGame === "rhythm" && <RhythmGame onComplete={(s) => handleGameComplete("rhythm", s)} onCancel={handleGameCancel} />}

      {achievementToast && <AchievementToast name={achievementToast.name} icon={achievementToast.icon} />}

      {/* ═══ TOP BAR ═══ */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/40 glass">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-sm text-neon">🐾 PIXEL<span className="text-neon-pink">PETS</span></h1>
          <span className="text-[8px] font-display text-muted-foreground">Lv.{gameState.level}</span>
          <span className="text-[8px] font-display text-neon">{gameState.xp}XP</span>
        </div>
        <div className="flex items-center gap-2">
          <WeatherWidget />
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "pet" && (
          <TabPet
            currentKind={currentKind}
            setPet={setPet}
            gameState={gameState}
            stats={stats}
            currentPetName={currentPetName}
            awareness={awareness}
            onFeed={handleFeed}
            onPlay={handlePlay}
            onSleep={handleSleep}
            onFeedWithFood={handleFeedWithFood}
            followCursor={followCursor}
            setFollowCursor={(v) => { setFollowCursor(v); window.pixelpets?.setFollow(v); }}
          />
        )}
        {activeTab === "games" && (
          <TabGames onStartGame={setActiveGame} gameState={gameState} />
        )}
        {activeTab === "adventure" && (
          <TabAdventure gameState={gameState} onStartBossFight={setActiveGame} />
        )}
        {activeTab === "social" && (
          <TabSocial gameState={gameState} activePetKind={currentKind} />
        )}
        {activeTab === "settings" && (
          <TabSettings gameState={gameState} />
        )}
      </div>

      {/* ═══ BOTTOM TAB BAR ═══ */}
      <nav className="flex border-t border-border/40 glass">
        {([
          { id: "pet" as TabId, icon: "🐾", label: "Pet" },
          { id: "games" as TabId, icon: "🎮", label: "Games" },
          { id: "adventure" as TabId, icon: "🗺️", label: "Worlds" },
          { id: "social" as TabId, icon: "🔄", label: "Social" },
          { id: "settings" as TabId, icon: "⚙️", label: "Settings" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-all ${
              activeTab === tab.id
                ? "text-neon border-t-2 border-neon bg-neon/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span className="font-display text-[7px]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

// ═══════════ TAB: PET ═══════════
function TabPet({ currentKind, setPet, gameState, stats, currentPetName, awareness, onFeed, onPlay, onSleep, onFeedWithFood, followCursor, setFollowCursor }: {
  currentKind: PetKind;
  setPet: (k: PetKind) => void;
  gameState: ReturnType<typeof useGameState>;
  stats: PetStats | null;
  currentPetName: string;
  awareness: any;
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onFeedWithFood: (food: FoodItem) => void;
  followCursor: boolean;
  setFollowCursor: (v: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [thought, setThought] = useState(() => randomThought(currentKind));

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setThought(randomThought(currentKind));
    const id = setInterval(() => setThought(randomThought(currentKind)), 8000);
    return () => clearInterval(id);
  }, [currentKind]);

  const def = PETS[currentKind];
  const petLevel = Math.floor((gameState.petXpHistory[currentKind] ?? 0) / 100) + 1;

  return (
    <div className="flex flex-col gap-3">
      {/* Pet spotlight — compact horizontal */}
      <div className="glass rounded-xl p-3 border border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)"
        }} />
        <div className="relative flex items-center gap-3">
          <div className="w-14 h-14 animate-bob flex-shrink-0">
            {def.render("right", step)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-sm text-neon truncate">{currentPetName}</h2>
            <p className="text-[8px] text-muted-foreground italic truncate">💭 {thought}</p>
            <div className="flex gap-2 mt-1">
              <span className="font-display text-[8px] text-neon">L{petLevel}</span>
              <span className="font-display text-[8px] text-muted-foreground">{gameState.petXpHistory[currentKind] ?? 0}XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions — compact */}
      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={onFeed} className="py-2 rounded-lg border border-border/40 hover:border-neon/50 font-display text-[9px] transition-all glass">🍖 Feed</button>
        <button onClick={onPlay} className="py-2 rounded-lg border border-border/40 hover:border-neon/50 font-display text-[9px] transition-all glass">🎾 Play</button>
        <button onClick={onSleep} className="py-2 rounded-lg border border-border/40 hover:border-neon/50 font-display text-[9px] transition-all glass">😴 Sleep</button>
      </div>

      {/* Stats — compact inline */}
      <StatsPanel
        stats={stats}
        petName={currentPetName}
        awareness={awareness}
        onFeed={onFeed}
        onPlay={onPlay}
        onSleep={onSleep}
        gameState={gameState}
        activePetKind={currentKind}
      />

      {/* Food + Missions side by side on wide screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FoodInventory gameState={gameState} activePetKind={currentKind} onFeedWithFood={onFeedWithFood} />
        <DailyMissions gameState={gameState} />
      </div>

      {/* Pet selector — compact */}
      <div className="glass rounded-xl p-2 border border-border/40">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-display text-[8px] text-muted-foreground">SWITCH PET</h4>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={followCursor} onChange={(e) => setFollowCursor(e.target.checked)} className="w-3 h-3 accent-[var(--neon)]" />
            <span className="text-[7px] text-muted-foreground">Follow</span>
          </label>
        </div>
        <div className="grid grid-cols-12 gap-0.5 max-h-20 overflow-y-auto">
          {PET_LIST.map((k) => {
            const d = PETS[k];
            return (
              <button
                key={k}
                onClick={() => setPet(k)}
                className={`aspect-square rounded border transition-all flex items-center justify-center ${
                  currentKind === k
                    ? "border-neon bg-neon/10"
                    : "border-transparent hover:border-neon/40"
                }`}
                title={d.name}
              >
                <div className="w-4 h-4">{d.render("right", 0)}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════ TAB: GAMES ═══════════
function TabGames({ onStartGame, gameState }: { onStartGame: (g: string) => void; gameState: ReturnType<typeof useGameState> }) {
  const games = [
    { id: "catch", icon: "🎯", label: "Catch" },
    { id: "memory", icon: "🧠", label: "Memory" },
    { id: "simon", icon: "🎵", label: "Simon" },
    { id: "typing", icon: "⌨️", label: "Typing" },
    { id: "reaction", icon: "⚡", label: "React" },
    { id: "quiz", icon: "❓", label: "Quiz" },
    { id: "dodge", icon: "🏃", label: "Dodge" },
    { id: "whack", icon: "🔨", label: "Whack" },
    { id: "snake", icon: "🐍", label: "Snake" },
    { id: "flappy", icon: "🐦", label: "Flappy" },
    { id: "puzzle", icon: "🧩", label: "Puzzle" },
    { id: "colorMatch", icon: "🎨", label: "Color" },
    { id: "rhythm", icon: "🎶", label: "Rhythm" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-[9px] text-muted-foreground text-center">Win games to earn food & XP</p>
      <div className="grid grid-cols-4 gap-1.5">
        {games.map((g) => {
          const played = (gameState.gamesPlayed as any)[g.id] || 0;
          return (
            <button
              key={g.id}
              onClick={() => onStartGame(g.id)}
              className="glass rounded-lg p-2 border border-border/40 hover:border-neon/50 transition-all text-center group"
            >
              <span className="text-lg block group-hover:animate-bob">{g.icon}</span>
              <p className="font-display text-[8px] mt-0.5">{g.label}</p>
              {played > 0 && <p className="text-[7px] text-neon">×{played}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════ TAB: ADVENTURE ═══════════
function TabAdventure({ gameState, onStartBossFight }: { gameState: ReturnType<typeof useGameState>; onStartBossFight: (g: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="font-display text-sm text-neon">🗺️ ADVENTURE MODE</h2>
        <p className="text-[9px] text-muted-foreground mt-1">Explore worlds, defeat bosses, earn rare food</p>
      </div>
      <AdventureMode gameState={gameState} onStartBossFight={onStartBossFight} />
    </div>
  );
}

// ═══════════ TAB: SOCIAL ═══════════
function TabSocial({ gameState, activePetKind }: { gameState: ReturnType<typeof useGameState>; activePetKind: PetKind }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="font-display text-sm text-neon">🔄 SOCIAL</h2>
        <p className="text-[9px] text-muted-foreground mt-1">Trade pets with friends</p>
      </div>
      <PetTrading gameState={gameState} activePetKind={activePetKind} />

      {/* Achievements */}
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">🏆 ACHIEVEMENTS ({gameState.achievements.length}/{ACHIEVEMENTS.length})</h4>
        <div className="grid grid-cols-5 gap-1.5">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = gameState.achievements.includes(ach.id);
            return (
              <div key={ach.id}
                className={`aspect-square rounded-md border flex items-center justify-center text-lg transition-all ${unlocked ? "border-primary/60 bg-primary/10 shadow-[0_0_6px_var(--primary)]" : "border-border bg-secondary/20 opacity-30 grayscale"}`}
                title={unlocked ? ach.name.en : "???"}
              >
                <span>{ach.icon}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      {Object.keys(gameState.petXpHistory).length > 0 && (
        <div className="glass rounded-xl p-3 border border-border/40">
          <h4 className="font-display text-[9px] text-muted-foreground mb-2">📊 PET LEADERBOARD</h4>
          <div className="flex flex-col gap-1">
            {Object.entries(gameState.petXpHistory)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([kind, xp], i) => (
                <div key={kind} className="flex items-center gap-2 py-1">
                  <span className="font-display text-[9px] text-muted-foreground w-4">{i + 1}.</span>
                  <div className="w-5 h-5">{PETS[kind as PetKind]?.render("right", 0)}</div>
                  <span className="font-display text-[9px] flex-1">{gameState.petNames[kind] || PETS[kind as PetKind]?.name || kind}</span>
                  <span className="font-display text-[8px] text-neon">{xp}XP</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════ TAB: SETTINGS ═══════════
function TabSettings({ gameState }: { gameState: ReturnType<typeof useGameState> }) {
  const sounds = [
    { id: "rain", icon: "🌧️" }, { id: "lofi", icon: "🎵" }, { id: "nature", icon: "🌿" },
    { id: "cafe", icon: "☕" }, { id: "storm", icon: "⛈️" }, { id: "space", icon: "🚀" },
    { id: "fireplace", icon: "🔥" }, { id: "ocean", icon: "🌊" }, { id: "city", icon: "🌃" },
    { id: "whispers", icon: "👁️" }, { id: "heartbeat", icon: "💀" }, { id: "dungeon", icon: "⛓️" },
    { id: "void", icon: "🕳️" }, { id: "silent", icon: "🔇" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="font-display text-sm text-neon">⚙️ SETTINGS</h2>
      </div>

      {/* Theme */}
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">🎨 THEME</h4>
        <div className="flex gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => { gameState.setTheme(theme.id); applyTheme(theme.id as ThemeId); }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                gameState.theme === theme.id
                  ? "border-foreground scale-110 shadow-[0_0_10px_var(--neon)]"
                  : "border-border hover:border-foreground/60"
              }`}
              style={{ background: theme.color }}
              title={theme.label}
            />
          ))}
        </div>
      </div>

      {/* Ambient sound */}
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">🎵 AMBIENT SOUND</h4>
        <div className="grid grid-cols-7 gap-1.5">
          {sounds.map((s) => (
            <button
              key={s.id}
              onClick={() => gameState.setAmbientSound(s.id)}
              className={`aspect-square rounded-lg border flex items-center justify-center text-base transition-all ${
                gameState.ambientSound === s.id
                  ? "border-neon bg-neon/10"
                  : "border-border/30 hover:border-neon/40"
              }`}
              title={s.id}
            >
              {s.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Pomodoro */}
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">🍅 POMODORO</h4>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <label className="text-[8px] font-display text-muted-foreground">WORK
            <select value={gameState.pomodoroConfig.workMinutes} onChange={(e) => gameState.setPomodoroConfig({ ...gameState.pomodoroConfig, workMinutes: Number(e.target.value) })}
              className="block w-full mt-0.5 px-1 py-1 rounded border border-border bg-secondary/40 text-foreground text-[9px] font-display">
              <option value={15}>15 min</option><option value={25}>25 min</option><option value={45}>45 min</option>
            </select>
          </label>
          <label className="text-[8px] font-display text-muted-foreground">BREAK
            <select value={gameState.pomodoroConfig.breakMinutes} onChange={(e) => gameState.setPomodoroConfig({ ...gameState.pomodoroConfig, breakMinutes: Number(e.target.value) })}
              className="block w-full mt-0.5 px-1 py-1 rounded border border-border bg-secondary/40 text-foreground text-[9px] font-display">
              <option value={5}>5 min</option><option value={10}>10 min</option><option value={15}>15 min</option>
            </select>
          </label>
        </div>
        <PomodoroTimer
          workMinutes={gameState.pomodoroConfig.workMinutes}
          breakMinutes={gameState.pomodoroConfig.breakMinutes}
          onWorkEnd={() => window.pixelpets?.petAction("pomodoroWorkEnd")}
          onBreakEnd={() => window.pixelpets?.petAction("pomodoroBreakEnd")}
        />
      </div>

      {/* Accessories */}
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">👗 ACCESSORIES</h4>
        <div className="grid grid-cols-3 gap-2">
          {getUnlockedAccessories(gameState.level).map((acc) => {
            const isEquipped = gameState.accessories[acc.slot] === acc.id;
            return (
              <button key={acc.id}
                onClick={() => gameState.equipAccessory(acc.slot, isEquipped ? null : acc.id)}
                className={`px-2 py-2 rounded-lg border transition-all font-display text-[8px] flex flex-col items-center gap-0.5 ${isEquipped ? "border-primary bg-primary/10 shadow-[0_0_8px_var(--primary)]" : "border-border/30 hover:border-neon/40"}`}
              >
                <span className="text-sm">{acc.id === "basic-hat" ? "🎩" : acc.id === "glasses" ? "👓" : acc.id === "bow" ? "🎀" : acc.id === "scarf" ? "🧣" : acc.id === "cape" ? "🦸" : "🌙"}</span>
                <span className="truncate w-full text-center">{acc.name.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Volume */}
      <VolumeControl />

      {/* Info */}
      <div className="glass rounded-xl p-3 border border-border/40 text-center">
        <p className="font-display text-[8px] text-muted-foreground">PixelPets v2.3.0</p>
        <p className="text-[8px] text-muted-foreground mt-1">Streak: {gameState.streakDays} days 🔥</p>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<ElectronApp />);
