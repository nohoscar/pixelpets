// Standalone entry point for the Electron panel window.
// Full-featured control panel — mirrors the web demo but adapted for Electron IPC.
// The pet itself is NOT rendered here (it lives in the overlay window).

import "../src/styles.css";
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ControlPanel } from "../src/components/ControlPanel";
import { PETS, type PetKind } from "../src/components/pets/petSprites";
import { CURSORS, CURSOR_SOUND, type CursorKind } from "../src/components/cursors/cursors";
import { StatsPanel } from "../src/components/StatsPanel";
import { VolumeControl } from "../src/components/VolumeControl";
import { useSystemAwareness } from "../src/hooks/useSystemAwareness";
import { useGameState } from "../src/hooks/useGameState";
import { playSound } from "../src/lib/audio";
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
import { I18nProvider, useI18n } from "../src/lib/i18n";
import { Onboarding, useOnboarding } from "../src/components/Onboarding";
import { applyTheme, type ThemeId } from "../src/lib/themes";
import { AmbientSound } from "../src/components/AmbientSound";
import { Leaderboard } from "../src/components/Leaderboard";
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
  const [cursor, setCursor] = useState<CursorKind>("csgo");
  const [followCursor, setFollowCursor] = useState(false);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [activeGame, setActiveGame] = useState<"catch" | "memory" | "simon" | "typing" | "reaction" | "quiz" | "dodge" | "whack" | "snake" | "flappy" | "puzzle" | "colorMatch" | "rhythm" | null>(null);
  const [achievementToast, setAchievementToast] = useState<{ name: string; icon: string } | null>(null);
  const awareness = useSystemAwareness();
  const { t } = useI18n();

  // Listen for stats updates from the pet overlay via IPC
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
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, label")) return;
      playSound(sound as Parameters<typeof playSound>[0]);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [cursor]);

  // Mini-game handlers
  const handleCatchComplete = (score: number) => {
    const xp = Math.min(50, Math.max(10, score * 3));
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("catch");
    setActiveGame(null);
  };

  const handleMemoryComplete = (attempts: number) => {
    const xp = attempts < 10 ? 50 : attempts <= 15 ? 30 : 15;
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("memory");
    setActiveGame(null);
  };

  const handleSimonComplete = (rounds: number) => {
    const xp = Math.min(50, rounds * 5);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("simon");
    setActiveGame(null);
  };

  const handleTypingComplete = (score: number) => {
    const xp = Math.min(50, score * 8);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("typing");
    setActiveGame(null);
  };

  const handleReactionComplete = (avgMs: number) => {
    const xp = avgMs < 300 ? 50 : avgMs < 500 ? 30 : 15;
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("reaction");
    setActiveGame(null);
  };

  const handleQuizComplete = (correct: number) => {
    const xp = Math.min(50, correct * 5);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("quiz");
    setActiveGame(null);
  };

  const handleDodgeComplete = (score: number) => {
    const xp = Math.min(50, score * 2);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("dodge");
    setActiveGame(null);
  };

  const handleWhackComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("whack");
    setActiveGame(null);
  };

  const handleSnakeComplete = (score: number) => {
    const xp = Math.min(50, score * 2);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("snake");
    setActiveGame(null);
  };

  const handleFlappyComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("flappy");
    setActiveGame(null);
  };

  const handlePuzzleComplete = (score: number) => {
    const xp = Math.min(50, score * 4);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("puzzle");
    setActiveGame(null);
  };

  const handleColorMatchComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("colorMatch");
    setActiveGame(null);
  };

  const handleRhythmComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    gameState.addPetXp(currentKind, xp);
    gameState.incrementGamesPlayed("rhythm");
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
  };

  const handlePlay = () => {
    window.pixelpets?.petAction("play");
    gameState.incrementPlayCount();
    gameState.addXp(5);
    gameState.addPetXp(currentKind, 5);
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
            cursor={cursor}
            onCursor={(c) => {
              setCursor(c);
              window.pixelpets?.setCursor(c);
            }}
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

        {/* Hero / info section */}
        <section className="hidden md:flex flex-col gap-6 max-w-2xl mx-auto justify-center min-h-[80vh] pointer-events-none">
          <p className="font-display text-[10px] text-neon-pink animate-flicker">
            {t("hero.tag")}
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">
            <span className="text-neon">{t("hero.title1")}</span>
            <br />
            <span className="text-foreground">{t("hero.title2")}</span>{" "}
            <span className="text-neon-pink">{t("hero.title3")}</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {t("hero.desc")}
          </p>
          <p className="text-[10px] font-display text-muted-foreground mt-8">
            {t("hero.footer")}
          </p>
        </section>
      </div>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<ElectronApp />);
