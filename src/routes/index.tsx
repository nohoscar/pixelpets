import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { Pet, type PetStats } from "@/components/pets/Pet";
import { PETS, type PetKind } from "@/components/pets/petSprites";
import { CURSORS, CURSOR_SOUND, type CursorKind } from "@/components/cursors/cursors";
import { StatsPanel } from "@/components/StatsPanel";
import { VolumeControl } from "@/components/VolumeControl";
import { useSystemAwareness } from "@/hooks/useSystemAwareness";
import { useGameState } from "@/hooks/useGameState";
import { playSound } from "@/lib/audio";
import { CatchGame } from "@/components/games/CatchGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { AchievementToast } from "@/components/AchievementToast";
import { WidgetPanel } from "@/components/WidgetPanel";
import { I18nProvider, useI18n } from "@/lib/i18n";

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
  return (
    <I18nProvider initialLocale={gameState.locale}>
      <IndexContent gameState={gameState} />
    </I18nProvider>
  );
}

function IndexContent({ gameState }: { gameState: ReturnType<typeof useGameState> }) {
  const [pets, setPets] = useState<PetInstance[]>([{ id: "p1", kind: "cat" }]);
  const [cursor, setCursor] = useState<CursorKind>("csgo");
  const [followCursor, setFollowCursor] = useState(false);
  const [stats, setStats] = useState<PetStats | null>(null);
  const [activeGame, setActiveGame] = useState<"catch" | "memory" | null>(null);
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
    gameState.incrementGamesPlayed("catch");
    setActiveGame(null);
  };

  const handleMemoryComplete = (attempts: number) => {
    const xp = attempts < 10 ? 50 : attempts <= 15 ? 30 : 15;
    gameState.addXp(xp);
    gameState.incrementGamesPlayed("memory");
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

  useEffect(() => {
    const value = CURSORS[cursor].value;
    document.body.style.cursor = value;
    return () => { document.body.style.cursor = ""; };
  }, [cursor]);

  // Sound when clicking with weapon/tool cursor
  useEffect(() => {
    const sound = CURSOR_SOUND[cursor];
    if (!sound) return;
    const handler = (e: MouseEvent) => {
      // skip if click landed on an interactive control
      const t = e.target as HTMLElement;
      if (t.closest("button, a, input, label")) return;
      playSound(sound as Parameters<typeof playSound>[0]);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [cursor]);

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
  const currentPetName = activePet ? PETS[activePet.kind].name : "—";

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
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

      {/* Achievement toast */}
      {achievementToast && (
        <AchievementToast name={achievementToast.name} icon={achievementToast.icon} />
      )}

      {/* UI layer */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <ControlPanel
            cursor={cursor}
            onCursor={setCursor}
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
            />
          )}
          <WidgetPanel />
          <VolumeControl />
        </div>

        {/* Hero / explainer */}
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

          <div className="flex flex-wrap gap-3 mt-2 pointer-events-auto">
            <Link
              to="/buy"
              className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all"
            >
              {t("hero.download")}
            </Link>
            <a
              href="#how"
              className="px-4 py-2 rounded-md border border-primary/50 bg-primary/10 text-primary font-display text-[10px] hover:bg-primary/20 transition-all"
            >
              {t("hero.howItWorks")}
            </a>
          </div>

          <div id="how" className="mt-12 grid grid-cols-3 gap-4 pointer-events-auto">
            {[
              { n: "01", t: t("hero.step1.title"), d: t("hero.step1.desc") },
              { n: "02", t: t("hero.step2.title"), d: t("hero.step2.desc") },
              { n: "03", t: t("hero.step3.title"), d: t("hero.step3.desc") },
            ].map((s) => (
              <div key={s.n} className="glass rounded-lg p-4">
                <p className="font-display text-[10px] text-neon">{s.n}</p>
                <p className="font-display text-xs mt-2">{s.t}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.d}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-display text-muted-foreground mt-8">
            {t("hero.footer")}
          </p>
        </section>
      </div>
    </main>
  );
}
