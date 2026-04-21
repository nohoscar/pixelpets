// Standalone entry point for the Electron panel window.
// Full-featured control panel — mirrors the web demo but adapted for Electron IPC.
// The pet itself is NOT rendered here (it lives in the overlay window).

import "../src/styles.css";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ControlPanel } from "../src/components/ControlPanel";
import { PETS, type PetKind } from "../src/components/pets/petSprites";
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
import { WidgetPanel } from "../src/components/WidgetPanel";
import { I18nProvider } from "../src/lib/i18n";
import { Onboarding, useOnboarding } from "../src/components/Onboarding";
import { applyTheme, type ThemeId } from "../src/lib/themes";
import { AmbientSound } from "../src/components/AmbientSound";
import { Leaderboard } from "../src/components/Leaderboard";
import { FoodInventory } from "../src/components/FoodInventory";
import { DailyMissions } from "../src/components/DailyMissions";
import { AdventureMode } from "../src/components/AdventureMode";
import { WeatherWidget } from "../src/components/WeatherWidget";
import { PetTrading } from "../src/components/PetTrading";
import { PetInteractionDisplay } from "../src/components/PetInteractionDisplay";
import { getGameReward, isFavoriteFood } from "../src/lib/foodSystem";
import type { FoodItem } from "../src/lib/foodSystem";
import { AnimatedCounter } from "../src/components/AnimatedCounter";
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

function ElectronApp() {
  const gameState = useGameState();
  const { showOnboarding, dismissOnboarding } = useOnboarding();

  // Apply persisted theme on mount
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
  const [activeGame, setActiveGame] = useState<"catch" | "memory" | "simon" | "typing" | "reaction" | "quiz" | "dodge" | "whack" | "snake" | "flappy" | "puzzle" | "colorMatch" | "rhythm" | null>(null);
  const [achievementToast, setAchievementToast] = useState<{ name: string; icon: string } | null>(null);
  const awareness = useSystemAwareness();

  // Listen for stats updates from the pet overlay via IPC
  useEffect(() => {
    window.pixelpets?.onStatsUpdate?.((s) => setStats(s));
  }, []);

  // Mini-game handlers
  const handleCatchComplete = (score: number) => {
    const xp = Math.min(50, Math.max(10, score * 3));
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("catch");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleMemoryComplete = (attempts: number) => {
    const xp = attempts < 10 ? 50 : attempts <= 15 ? 30 : 15;
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("memory");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(30 - attempts).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleSimonComplete = (rounds: number) => {
    const xp = Math.min(50, rounds * 5);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("simon");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(rounds * 2).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleTypingComplete = (score: number) => {
    const xp = Math.min(50, score * 8);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("typing");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score * 3).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleReactionComplete = (avgMs: number) => {
    const xp = avgMs < 300 ? 50 : avgMs < 500 ? 30 : 15;
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("reaction");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(avgMs < 300 ? 30 : 15).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleQuizComplete = (correct: number) => {
    const xp = Math.min(50, correct * 5);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("quiz");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(correct * 3).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleDodgeComplete = (score: number) => {
    const xp = Math.min(50, score * 2);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("dodge");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleWhackComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("whack");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleSnakeComplete = (score: number) => {
    const xp = Math.min(50, score * 2);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("snake");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleFlappyComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("flappy");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handlePuzzleComplete = (score: number) => {
    const xp = Math.min(50, score * 4);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("puzzle");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score * 2).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleColorMatchComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("colorMatch");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleRhythmComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("rhythm");
    gameState.updateMissionProgress("game", 1);
    gameState.updateMissionProgress("xp", xp);
    getGameReward(score).forEach((r) => gameState.addFood(r.foodId, r.quantity));
    setActiveGame(null);
  };

  const handleGameCancel = () => {
    setActiveGame(null);
  };

  // Achievement toast handler
  const showAchievementToast = (name: string, icon: string) => {
    setAchievementToast({ name, icon });
    setTimeout(() => setAchievementToast(null), 3000);
  };

  // Wire achievement callback to toast
  useEffect(() => {
    gameState.achievementCallbackRef.current = showAchievementToast;
    return () => { gameState.achievementCallbackRef.current = null; };
  });

  // Pomodoro callbacks — send speech to pet overlay via IPC
  const handlePomodoroWorkEnd = () => {
    window.pixelpets?.petAction("pomodoroWorkEnd");
  };
  const handlePomodoroBreakEnd = () => {
    window.pixelpets?.petAction("pomodoroBreakEnd");
  };

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

  const handleFeedWithFood = (food: FoodItem) => {
    if (!gameState.useFood(food.id)) return;
    window.pixelpets?.petAction("feed");
    gameState.incrementFeedCount();
    const isFav = isFavoriteFood(currentKind, food.id);
    const multiplier = isFav ? 2 : 1;
    const xp = (food.happinessBoost * multiplier);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.updateMissionProgress("feed", 1);
    gameState.updateMissionProgress("food", 1);
  };

  const handleSleep = () => {
    window.pixelpets?.petAction("sleep");
  };

  const currentPetName = gameState.petNames[currentKind] || PETS[currentKind].name;

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Mini-game overlays */}
      {activeGame === "catch" && (
        <CatchGame onComplete={handleCatchComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "memory" && (
        <MemoryGame onComplete={handleMemoryComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "simon" && (
        <SimonGame onComplete={handleSimonComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "typing" && (
        <TypingGame onComplete={handleTypingComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "reaction" && (
        <ReactionGame onComplete={handleReactionComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "quiz" && (
        <PetQuizGame onComplete={handleQuizComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "dodge" && (
        <DodgeGame onComplete={handleDodgeComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "whack" && (
        <WhackGame onComplete={handleWhackComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "snake" && (
        <SnakeGame onComplete={handleSnakeComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "flappy" && (
        <FlappyGame onComplete={handleFlappyComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "puzzle" && (
        <PuzzleGame onComplete={handlePuzzleComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "colorMatch" && (
        <ColorMatchGame onComplete={handleColorMatchComplete} onCancel={handleGameCancel} />
      )}
      {activeGame === "rhythm" && (
        <RhythmGame onComplete={handleRhythmComplete} onCancel={handleGameCancel} />
      )}

      {/* Achievement toast */}
      {achievementToast && (
        <AchievementToast name={achievementToast.name} icon={achievementToast.icon} />
      )}

      {/* UI layer */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <ControlPanel
            followCursor={followCursor}
            onToggleFollow={(v) => {
              setFollowCursor(v);
              window.pixelpets?.setFollow(v);
            }}
            petCount={1}
            onAddPet={setPet}
            onClearPets={() => {}}
            gameState={gameState}
            onStartGame={setActiveGame}
            onAchievementUnlock={showAchievementToast}
            onPomodoroWorkEnd={handlePomodoroWorkEnd}
            onPomodoroBreakEnd={handlePomodoroBreakEnd}
            activePetKind={currentKind}
            petName={gameState.petNames[currentKind] ?? ""}
            onPetNameChange={(name) => gameState.setPetName(currentKind, name)}
            onFeedWithFood={handleFeedWithFood}
            activePets={[currentKind]}
          />

          {/* Stats panel — reads from overlay via IPC */}
          <StatsPanel
            stats={stats}
            petName={currentPetName}
            awareness={awareness}
            onFeed={handleFeed}
            onPlay={handlePlay}
            onSleep={handleSleep}
            gameState={gameState}
            activePetKind={currentKind}
          />

          {/* Leaderboard */}
          {Object.keys(gameState.petXpHistory).length > 0 && (
            <Leaderboard gameState={gameState} />
          )}

          <WidgetPanel />
          <VolumeControl />
        </div>

        {/* Pet Spotlight */}
        <section className="hidden md:flex flex-col gap-6 max-w-2xl mx-auto justify-center min-h-[80vh] pointer-events-none">
          <PetSpotlight activePetKind={currentKind} gameState={gameState} />

          {/* Animated stats counter */}
          <div className="mt-8 pointer-events-auto">
            <AnimatedCounter />
          </div>
        </section>
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<ElectronApp />);

const PERSONALITY_TRAITS: Record<string, string> = {
  cat: "Sleepy & Judgy",
  dog: "Loyal & Playful",
  slime: "Chill & Bouncy",
  dragon: "Fierce & Hungry",
  ghost: "Shy & Mysterious",
  robot: "Logical & Efficient",
  axolotl: "Cute & Regenerative",
  capybara: "Ultra Chill",
  penguin: "Dapper & Cool",
  fox: "Clever & Quick",
  panda: "Lazy & Cuddly",
  unicorn: "Magical & Unique",
  bunny: "Fluffy & Hoppy",
  monkey: "Mischievous",
  cthulhu: "Chaotic & Cosmic",
  pikachu: "Electric & Energetic",
  kirby: "Hungry & Powerful",
  creeper: "Explosive",
  yoshi: "Friendly & Helpful",
  sonic: "Fast & Impatient",
  doge: "Much Wow",
};

function PetSpotlight({ activePetKind, gameState }: { activePetKind: PetKind; gameState: ReturnType<typeof useGameState> }) {
  const [step, setStep] = useState(0);
  const [thought, setThought] = useState(() => randomThought(activePetKind));

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setThought(randomThought(activePetKind));
    const id = setInterval(() => setThought(randomThought(activePetKind)), 8000);
    return () => clearInterval(id);
  }, [activePetKind]);

  const def = PETS[activePetKind];
  const petName = gameState.petNames[activePetKind] || def.name;
  const trait = PERSONALITY_TRAITS[activePetKind] || "Unique & Special";
  const petLevel = gameState.petXpHistory[activePetKind]
    ? Math.floor((gameState.petXpHistory[activePetKind] ?? 0) / 100) + 1
    : 1;

  return (
    <div className="glass rounded-2xl p-8 border border-border/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)"
      }} />

      <div className="relative flex flex-col items-center gap-4">
        <div className="w-32 h-32 animate-bob">
          {def.render("right", step)}
        </div>

        <div className="text-center">
          <h3 className="font-display text-xl text-neon">{petName}</h3>
          <p className="font-display text-[10px] text-neon-pink mt-1">{trait}</p>
        </div>

        <div className="glass rounded-lg px-4 py-2 border border-primary/30 min-h-[36px] flex items-center">
          <p className="text-xs text-muted-foreground italic text-center">💭 "{thought}"</p>
        </div>

        <div className="flex gap-4 mt-2">
          <div className="text-center">
            <p className="font-display text-lg text-neon tabular-nums">L{petLevel}</p>
            <p className="font-display text-[7px] text-muted-foreground">LEVEL</p>
          </div>
          <div className="text-center">
            <p className="font-display text-lg text-neon tabular-nums">{gameState.level}</p>
            <p className="font-display text-[7px] text-muted-foreground">TRAINER</p>
          </div>
          <div className="text-center">
            <p className="font-display text-lg text-neon tabular-nums">{gameState.achievements.length}</p>
            <p className="font-display text-[7px] text-muted-foreground">BADGES</p>
          </div>
        </div>
      </div>
    </div>
  );
}
