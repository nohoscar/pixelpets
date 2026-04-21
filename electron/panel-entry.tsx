// Standalone entry point for the Electron panel window.
// Single-column scrollable layout — proven stable design.

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
import { getGameReward, isFavoriteFood } from "../src/lib/foodSystem";
import type { FoodItem } from "../src/lib/foodSystem";
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

  useEffect(() => {
    window.pixelpets?.onStatsUpdate?.((s) => setStats(s));
  }, []);

  // Consolidated game handler
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

  const showAchievementToast = (name: string, icon: string) => {
    setAchievementToast({ name, icon });
    setTimeout(() => setAchievementToast(null), 3000);
  };

  useEffect(() => {
    gameState.achievementCallbackRef.current = showAchievementToast;
    return () => { gameState.achievementCallbackRef.current = null; };
  });

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
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Game overlays */}
      {activeGame === "catch" && <CatchGame onComplete={(s) => handleGameComplete("catch", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "memory" && <MemoryGame onComplete={(s) => handleGameComplete("memory", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "simon" && <SimonGame onComplete={(s) => handleGameComplete("simon", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "typing" && <TypingGame onComplete={(s) => handleGameComplete("typing", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "reaction" && <ReactionGame onComplete={(s) => handleGameComplete("reaction", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "quiz" && <PetQuizGame onComplete={(s) => handleGameComplete("quiz", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "dodge" && <DodgeGame onComplete={(s) => handleGameComplete("dodge", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "whack" && <WhackGame onComplete={(s) => handleGameComplete("whack", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "snake" && <SnakeGame onComplete={(s) => handleGameComplete("snake", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "flappy" && <FlappyGame onComplete={(s) => handleGameComplete("flappy", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "puzzle" && <PuzzleGame onComplete={(s) => handleGameComplete("puzzle", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "colorMatch" && <ColorMatchGame onComplete={(s) => handleGameComplete("colorMatch", s)} onCancel={() => setActiveGame(null)} />}
      {activeGame === "rhythm" && <RhythmGame onComplete={(s) => handleGameComplete("rhythm", s)} onCancel={() => setActiveGame(null)} />}

      {achievementToast && <AchievementToast name={achievementToast.name} icon={achievementToast.icon} />}

      {/* Single column layout */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 flex justify-center">
        <div className="w-full max-w-md flex flex-col gap-4">
          <ControlPanel
            followCursor={followCursor}
            onToggleFollow={(v) => { setFollowCursor(v); window.pixelpets?.setFollow(v); }}
            petCount={1}
            onAddPet={setPet}
            onClearPets={() => {}}
            gameState={gameState}
            onStartGame={setActiveGame}
            onAchievementUnlock={showAchievementToast}
            onPomodoroWorkEnd={() => window.pixelpets?.petAction("pomodoroWorkEnd")}
            onPomodoroBreakEnd={() => window.pixelpets?.petAction("pomodoroBreakEnd")}
            activePetKind={currentKind}
            petName={gameState.petNames[currentKind] ?? ""}
            onPetNameChange={(name) => gameState.setPetName(currentKind, name)}
            onFeedWithFood={handleFeedWithFood}
            activePets={[currentKind]}
          />

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

          {Object.keys(gameState.petXpHistory).length > 0 && (
            <Leaderboard gameState={gameState} />
          )}

          <WidgetPanel />
          <VolumeControl />
        </div>
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<ElectronApp />);
