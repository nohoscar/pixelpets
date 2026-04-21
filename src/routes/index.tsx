import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { Pet, type PetStats } from "@/components/pets/Pet";
import { PETS, type PetKind } from "@/components/pets/petSprites";
import { StatsPanel } from "@/components/StatsPanel";
import { VolumeControl } from "@/components/VolumeControl";
import { useSystemAwareness } from "@/hooks/useSystemAwareness";
import { useGameState } from "@/hooks/useGameState";
import { CatchGame } from "@/components/games/CatchGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { SimonGame } from "@/components/games/SimonGame";
import { TypingGame } from "@/components/games/TypingGame";
import { ReactionGame } from "@/components/games/ReactionGame";
import { PetQuizGame } from "@/components/games/PetQuizGame";
import { DodgeGame } from "@/components/games/DodgeGame";
import { WhackGame } from "@/components/games/WhackGame";
import { SnakeGame } from "@/components/games/SnakeGame";
import { FlappyGame } from "@/components/games/FlappyGame";
import { PuzzleGame } from "@/components/games/PuzzleGame";
import { ColorMatchGame } from "@/components/games/ColorMatchGame";
import { RhythmGame } from "@/components/games/RhythmGame";
import { AchievementToast } from "@/components/AchievementToast";
import { WidgetPanel } from "@/components/WidgetPanel";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { Onboarding, useOnboarding } from "@/components/Onboarding";
import { applyTheme, type ThemeId } from "@/lib/themes";
import { AmbientSound } from "@/components/AmbientSound";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Leaderboard } from "@/components/Leaderboard";
import { SeasonalBackground } from "@/components/SeasonalBackground";
import { PetDiary } from "@/components/PetDiary";
import { randomThought } from "@/components/pets/petThoughts";

export const Route = createFileRoute("/")({
  component: Index,
});

interface PetInstance {
  id: string;
  kind: PetKind;
  initialX?: number;
  initialY?: number;
}

function Index() {
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
      <IndexContent gameState={gameState} />
    </I18nProvider>
  );
}

function IndexContent({ gameState }: { gameState: ReturnType<typeof useGameState> }) {
  const [pets, setPets] = useState<PetInstance[]>([{ id: "p1", kind: "cat" }]);
  const [followCursor, setFollowCursor] = useState(false);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [activeGame, setActiveGame] = useState<"catch" | "memory" | "simon" | "typing" | "reaction" | "quiz" | "dodge" | "whack" | "snake" | "flappy" | "puzzle" | "colorMatch" | "rhythm" | null>(null);
  const [achievementToast, setAchievementToast] = useState<{ name: string; icon: string } | null>(null);
  const [activePetId, setActivePetId] = useState<string>("p1");
  const awareness = useSystemAwareness();
  const { t } = useI18n();

  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const actionRef = useRef<{ feed: () => void; play: () => void; sleep: () => void } | null>(null);
  const petPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const interactionCooldownRef = useRef<Map<string, number>>(new Map());
  const petSpeakRefs = useRef<Map<string, { current: ((msg: string) => void) | null }>>(new Map());

  // Mini-game handlers
  const handleCatchComplete = (score: number) => {
    const xp = Math.min(50, Math.max(10, score * 3));
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("catch");
    setActiveGame(null);
  };

  const handleMemoryComplete = (attempts: number) => {
    const xp = attempts < 10 ? 50 : attempts <= 15 ? 30 : 15;
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("memory");
    setActiveGame(null);
  };

  const handleSimonComplete = (rounds: number) => {
    const xp = Math.min(50, rounds * 5);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("simon");
    setActiveGame(null);
  };

  const handleTypingComplete = (score: number) => {
    const xp = Math.min(50, score * 8);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("typing");
    setActiveGame(null);
  };

  const handleReactionComplete = (avgMs: number) => {
    const xp = avgMs < 300 ? 50 : avgMs < 500 ? 30 : 15;
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("reaction");
    setActiveGame(null);
  };

  const handleQuizComplete = (correct: number) => {
    const xp = Math.min(50, correct * 5);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("quiz");
    setActiveGame(null);
  };

  const handleDodgeComplete = (score: number) => {
    const xp = Math.min(50, score * 2);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("dodge");
    setActiveGame(null);
  };

  const handleWhackComplete = (score: number) => {
    const xp = Math.min(50, score * 3);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("whack");
    setActiveGame(null);
  };

  const handleSnakeComplete = (length: number) => {
    const xp = Math.min(50, length * 3);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("snake");
    setActiveGame(null);
  };

  const handleFlappyComplete = (score: number) => {
    const xp = Math.min(50, score * 5);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("flappy");
    setActiveGame(null);
  };

  const handlePuzzleComplete = (moves: number) => {
    const xp = moves < 20 ? 50 : moves < 30 ? 30 : 15;
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("puzzle");
    setActiveGame(null);
  };

  const handleColorMatchComplete = (score: number) => {
    const xp = Math.min(50, Math.round(score * 2.5));
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
    gameState.incrementGamesPlayed("colorMatch");
    setActiveGame(null);
  };

  const handleRhythmComplete = (score: number) => {
    const xp = Math.min(50, score * 2);
    gameState.addXp(xp);
    if (activePetKind) gameState.addPetXp(activePetKind, xp);
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

  // Pomodoro callbacks — trigger pet speech bubbles
  const handlePomodoroWorkEnd = () => {
    // Trigger speech bubble on all pets
    petSpeakRefs.current.forEach((ref) => {
      ref.current?.("Break time! 🍅");
    });
  };
  const handlePomodoroBreakEnd = () => {
    petSpeakRefs.current.forEach((ref) => {
      ref.current?.("Back to work! 💪");
    });
  };

  // Wire achievement callback to toast
  useEffect(() => {
    gameState.achievementCallbackRef.current = showAchievementToast;
    return () => { gameState.achievementCallbackRef.current = null; };
  });


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Pet interaction detection (task 9.2)
  useEffect(() => {
    if (pets.length < 2) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const positions = petPositionsRef.current;
      const cooldowns = interactionCooldownRef.current;
      const phrases = ["hi!", "♥", "play?", "hey!", "✨", "*boop*"];

      for (let i = 0; i < pets.length; i++) {
        for (let j = i + 1; j < pets.length; j++) {
          const posA = positions.get(pets[i].id);
          const posB = positions.get(pets[j].id);
          if (!posA || !posB) continue;

          const dist = Math.hypot(posA.x - posB.x, posA.y - posB.y);
          if (dist >= 80) continue;

          const pairKey = [pets[i].id, pets[j].id].sort().join("-");
          const lastInteraction = cooldowns.get(pairKey) ?? 0;
          if (now - lastInteraction < 10000) continue;

          cooldowns.set(pairKey, now);
          const phrase = phrases[Math.floor(Math.random() * phrases.length)];
          const speakA = petSpeakRefs.current.get(pets[i].id)?.current;
          const speakB = petSpeakRefs.current.get(pets[j].id)?.current;
          speakA?.(phrase);
          speakB?.(phrase);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pets]);

  // Non-overlapping spawn logic (task 9.3)
  const calculateSpawnPosition = (petSize: number): { x: number; y: number } => {
    const existing = Array.from(petPositionsRef.current.values());
    const maxAttempts = 50;
    for (let i = 0; i < maxAttempts; i++) {
      const x = Math.random() * (window.innerWidth - petSize - 40) + 20;
      const y = Math.random() * (window.innerHeight - petSize - 200) + 120;
      const tooClose = existing.some((pos) => {
        const dist = Math.hypot(pos.x - x, pos.y - y);
        return dist < petSize;
      });
      if (!tooClose) return { x, y };
    }
    // Fallback: random position
    return {
      x: Math.random() * (window.innerWidth - petSize - 40) + 20,
      y: Math.random() * (window.innerHeight - petSize - 200) + 120,
    };
  };

  const addPet = (kind: PetKind) => {
    setPets((prev) => {
      if (prev.length >= 5) return prev;
      const newId = `p${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const petSize = PETS[kind].size;
      const spawnPos = calculateSpawnPosition(petSize);
      // Store spawn position for the new pet
      petPositionsRef.current.set(newId, spawnPos);
      const newPet: PetInstance = { id: newId, kind, initialX: spawnPos.x, initialY: spawnPos.y };
      setActivePetId(newId);
      return [...prev, newPet];
    });
  };
  const removePet = (id: string) => {
    setPets((p) => p.filter((x) => x.id !== id));
    petPositionsRef.current.delete(id);
    setActivePetId((prev) => prev === id ? (pets[0]?.id ?? "") : prev);
  };
  const clearPets = () => { setPets([]); setStats(null); petPositionsRef.current.clear(); setActivePetId(""); };

  const activePet = pets.find((p) => p.id === activePetId) ?? pets[0];
  const activePetKind = activePet?.kind;
  const currentPetName = activePet
    ? (gameState.petNames[activePet.kind] || PETS[activePet.kind].name)
    : "—";

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <SeasonalBackground />
      {/* Mobile compact header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 glass border-b border-border/60">
        <span className="font-display text-[10px] text-neon">{t("mobile.header")}</span>
        <Link
          to="/buy"
          className="px-3 py-1.5 rounded bg-primary text-primary-foreground font-display text-[9px]"
        >
          ▸ {t("buy.free")}
        </Link>
      </div>

      {/* Pets layer */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <ClientOnly fallback={null}>
          {pets.map((p) => {
            // Get or create speakRef for this pet
            if (!petSpeakRefs.current.has(p.id)) {
              petSpeakRefs.current.set(p.id, { current: null });
            }
            const speakRef = petSpeakRefs.current.get(p.id)!;
            return (
              <Pet
                key={p.id}
                id={p.id}
                kind={p.kind}
                initialX={p.initialX}
                initialY={p.initialY}
                cursorRef={cursorRef}
                followCursor={followCursor}
                onRemove={removePet}
                onStatsChange={p.id === (activePet?.id) ? setStats : undefined}
                actionRef={p.id === (activePet?.id) ? actionRef : undefined}
                awareness={awareness}
                gameState={gameState}
                paused={activeGame !== null}
                onPositionChange={(pos) => petPositionsRef.current.set(p.id, pos)}
                onPetClick={() => setActivePetId(p.id)}
                speakRef={speakRef}
                customName={gameState.petNames[p.kind] || undefined}
              />
            );
          })}
        </ClientOnly>
      </div>

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
            onToggleFollow={setFollowCursor}
            petCount={pets.length}
            onAddPet={addPet}
            onClearPets={clearPets}
            gameState={gameState}
            onStartGame={setActiveGame}
            onAchievementUnlock={showAchievementToast}
            onPomodoroWorkEnd={handlePomodoroWorkEnd}
            onPomodoroBreakEnd={handlePomodoroBreakEnd}
            activePetKind={activePetKind}
            petName={activePetKind ? (gameState.petNames[activePetKind] ?? "") : ""}
            onPetNameChange={(name) => { if (activePetKind) gameState.setPetName(activePetKind, name); }}
          />
          {pets.length > 0 && (
            <StatsPanel
              stats={stats}
              petName={currentPetName}
              awareness={awareness}
              onFeed={() => actionRef.current?.feed()}
              onPlay={() => actionRef.current?.play()}
              onSleep={() => actionRef.current?.sleep()}
              gameState={gameState}
              activePetKind={activePetKind}
            />
          )}
          {gameState && Object.keys(gameState.petXpHistory).length > 0 && (
            <Leaderboard gameState={gameState} />
          )}
          <PetDiary gameState={gameState} />
          <WidgetPanel />
          <VolumeControl />
        </div>

        {/* Pet Spotlight */}
        <section className="hidden md:flex flex-col gap-6 max-w-2xl mx-auto justify-center min-h-[80vh] pointer-events-none">
          <PetSpotlight activePetKind={activePetKind ?? "cat"} gameState={gameState} />

          {/* Animated stats counter */}
          <div className="mt-8 pointer-events-auto">
            <AnimatedCounter />
          </div>
        </section>
      </div>
    </main>
  );
}

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
      {/* Glow background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)"
      }} />

      <div className="relative flex flex-col items-center gap-4">
        {/* Large pet render */}
        <div className="w-32 h-32 animate-bob">
          {def.render("right", step)}
        </div>

        {/* Pet name & trait */}
        <div className="text-center">
          <h3 className="font-display text-xl text-neon">{petName}</h3>
          <p className="font-display text-[10px] text-neon-pink mt-1">{trait}</p>
        </div>

        {/* Thought bubble */}
        <div className="glass rounded-lg px-4 py-2 border border-primary/30 min-h-[36px] flex items-center">
          <p className="text-xs text-muted-foreground italic text-center">💭 "{thought}"</p>
        </div>

        {/* Stats row */}
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
