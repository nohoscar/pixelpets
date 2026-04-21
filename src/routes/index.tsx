import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pet, type PetStats } from "@/components/pets/Pet";
import { PETS, PET_LIST, type PetKind } from "@/components/pets/petSprites";
import { useSystemAwareness } from "@/hooks/useSystemAwareness";
import { useGameState } from "@/hooks/useGameState";
import { CatchGame } from "@/components/games/CatchGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { AchievementToast } from "@/components/AchievementToast";
import { I18nProvider } from "@/lib/i18n";
import { AmbientSound } from "@/components/AmbientSound";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SeasonalBackground } from "@/components/SeasonalBackground";
import { randomThought } from "@/components/pets/petThoughts";

export const Route = createFileRoute("/")({
  component: Index,
});

const FREE_PETS: PetKind[] = ["cat", "dog", "slime", "dragon", "ghost"];
const FREE_GAMES = ["catch", "memory"];

function Index() {
  const gameState = useGameState();
  return (
    <I18nProvider initialLocale={gameState.locale}>
      <AmbientSound soundId={gameState.ambientSound} />
      <LandingPage gameState={gameState} />
    </I18nProvider>
  );
}

function LandingPage({ gameState }: { gameState: ReturnType<typeof useGameState> }) {
  const [demoActive, setDemoActive] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <SeasonalBackground />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <HeroSection onTryDemo={() => setDemoActive(true)} />

      {/* ═══════════ ANIMATED COUNTER ═══════════ */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedCounter />
        </div>
      </section>

      {/* ═══════════ INTERACTIVE DEMO ═══════════ */}
      <section className="relative z-10 py-8 px-4" id="demo">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-display text-lg text-neon">🎮 DEMO INTERACTIVA</h2>
            <p className="text-xs text-muted-foreground mt-1">Prueba con 5 mascotas y 2 juegos gratis</p>
          </div>
          <DemoSection gameState={gameState} />
        </div>
      </section>

      {/* ═══════════ FEATURES SHOWCASE ═══════════ */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-lg text-neon">✨ TODO LO QUE INCLUYE</h2>
            <p className="text-xs text-muted-foreground mt-1">La app de escritorio desbloquea todo esto</p>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* ═══════════ PET GALLERY ═══════════ */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-display text-lg text-neon">🐾 62 MASCOTAS</h2>
            <p className="text-xs text-muted-foreground mt-1">Desde clásicas hasta Lovecraft y videojuegos</p>
          </div>
          <PetGalleryPreview />
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="glass rounded-2xl p-8 border border-neon/30">
            <span className="text-4xl block mb-4 animate-bob">🐾</span>
            <h2 className="font-display text-xl text-neon mb-2">DESCARGA GRATIS</h2>
            <p className="text-xs text-muted-foreground mb-6">Beta gratuita — Windows, macOS, Linux</p>
            <Link
              to="/buy"
              className="inline-block px-8 py-3 rounded-lg bg-neon/20 text-neon border border-neon/50 font-display text-sm hover:bg-neon/30 hover:shadow-[0_0_20px_var(--neon)] transition-all"
            >
              ⬇️ DESCARGAR AHORA
            </Link>
            <p className="text-[8px] text-muted-foreground mt-4">v2.3.0 · ~85 MB · No requiere cuenta</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-4 border-t border-border/30">
        <p className="text-center text-[9px] text-muted-foreground font-display">
          PIXELPETS © 2026 · Hecho con 💜 · <Link to="/buy" className="text-neon hover:underline">Descargar</Link>
        </p>
      </footer>
    </main>
  );
}

// ═══════════ HERO SECTION ═══════════
function HeroSection({ onTryDemo }: { onTryDemo: () => void }) {
  const [step, setStep] = useState(0);
  const [petIdx, setPetIdx] = useState(0);
  const showcasePets: PetKind[] = ["cat", "dragon", "pikachu", "axolotl", "ghost"];

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPetIdx((i) => (i + 1) % showcasePets.length), 3000);
    return () => clearInterval(id);
  }, []);

  const currentPet = showcasePets[petIdx];
  const def = PETS[currentPet];

  return (
    <section className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 60%)"
      }} />

      <div className="relative flex flex-col items-center gap-6 text-center">
        {/* Logo */}
        <h1 className="font-display text-3xl md:text-5xl">
          <span className="text-neon">PIXEL</span><span className="text-neon-pink">PETS</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md">
          Tu mascota virtual de escritorio. Aliméntala, juega con ella, explora mundos y comparte con amigos.
        </p>

        {/* Animated pet showcase */}
        <div className="w-24 h-24 md:w-32 md:h-32 animate-bob my-4">
          {def.render("right", step)}
        </div>
        <p className="font-display text-[10px] text-neon-pink animate-pulse">{def.name}</p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link
            to="/buy"
            className="px-6 py-3 rounded-lg bg-neon/20 text-neon border border-neon/50 font-display text-xs hover:bg-neon/30 hover:shadow-[0_0_20px_var(--neon)] transition-all"
          >
            ⬇️ DESCARGAR GRATIS
          </Link>
          <a
            href="#demo"
            className="px-6 py-3 rounded-lg bg-secondary/40 text-foreground border border-border font-display text-xs hover:border-primary/50 transition-all"
          >
            🎮 PROBAR DEMO
          </a>
        </div>

        <p className="text-[9px] text-muted-foreground mt-2">Windows · macOS · Linux · Beta gratuita</p>
      </div>
    </section>
  );
}

// ═══════════ DEMO SECTION ═══════════
function DemoSection({ gameState }: { gameState: ReturnType<typeof useGameState> }) {
  const [currentPet, setCurrentPet] = useState<PetKind>("cat");
  const [activeGame, setActiveGame] = useState<"catch" | "memory" | null>(null);
  const [achievementToast, setAchievementToast] = useState<{ name: string; icon: string } | null>(null);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const actionRef = useRef<{ feed: () => void; play: () => void; sleep: () => void } | null>(null);
  const awareness = useSystemAwareness();

  useEffect(() => {
    const handler = (e: MouseEvent) => { cursorRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const handleGameComplete = (score: number) => {
    gameState.addXp(Math.min(30, score * 2));
    setActiveGame(null);
  };

  return (
    <div className="glass rounded-2xl border border-border/60 overflow-hidden">
      {/* Demo pet area */}
      <div className="relative h-64 md:h-80 bg-background/30">
        <ClientOnly fallback={null}>
          <Pet
            id="demo"
            kind={currentPet}
            cursorRef={cursorRef}
            followCursor={false}
            onRemove={() => {}}
            awareness={awareness}
            actionRef={actionRef}
            gameState={gameState}
          />
        </ClientOnly>

        {/* Demo badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/40">
          <span className="font-display text-[8px] text-yellow-400">⚡ DEMO MODE</span>
        </div>
      </div>

      {/* Controls bar */}
      <div className="p-4 border-t border-border/40">
        {/* Pet selector */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-[8px] text-muted-foreground">MASCOTA:</span>
          <div className="flex gap-1.5">
            {FREE_PETS.map((k) => (
              <button
                key={k}
                onClick={() => setCurrentPet(k)}
                className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center ${
                  currentPet === k
                    ? "border-neon bg-neon/10 shadow-[0_0_8px_var(--neon)]"
                    : "border-border/40 hover:border-neon/50"
                }`}
                title={PETS[k].name}
              >
                <div className="w-7 h-7">{PETS[k].render("right", 0)}</div>
              </button>
            ))}
            {/* Locked indicator */}
            <div className="w-9 h-9 rounded-lg border border-border/20 flex items-center justify-center opacity-40" title="57 más en la app">
              <span className="text-[10px]">+57🔒</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => actionRef.current?.feed()} className="flex-1 py-2 rounded-lg border border-border/40 hover:border-neon/50 font-display text-[9px] transition-all">🍖 Feed</button>
          <button onClick={() => actionRef.current?.play()} className="flex-1 py-2 rounded-lg border border-border/40 hover:border-neon/50 font-display text-[9px] transition-all">🎾 Play</button>
          <button onClick={() => actionRef.current?.sleep()} className="flex-1 py-2 rounded-lg border border-border/40 hover:border-neon/50 font-display text-[9px] transition-all">😴 Sleep</button>
        </div>

        {/* Games */}
        <div className="flex gap-2">
          <button onClick={() => setActiveGame("catch")} className="flex-1 py-2 rounded-lg border border-primary/40 bg-primary/5 hover:bg-primary/10 font-display text-[9px] transition-all">🎯 Catch Game</button>
          <button onClick={() => setActiveGame("memory")} className="flex-1 py-2 rounded-lg border border-primary/40 bg-primary/5 hover:bg-primary/10 font-display text-[9px] transition-all">🧠 Memory Game</button>
          <div className="flex-1 py-2 rounded-lg border border-border/20 font-display text-[9px] text-center opacity-40">+11 🔒</div>
        </div>
      </div>

      {/* Game overlays */}
      {activeGame === "catch" && <CatchGame onComplete={handleGameComplete} onCancel={() => setActiveGame(null)} />}
      {activeGame === "memory" && <MemoryGame onComplete={(a) => { gameState.addXp(20); setActiveGame(null); }} onCancel={() => setActiveGame(null)} />}

      {achievementToast && <AchievementToast name={achievementToast.name} icon={achievementToast.icon} />}
    </div>
  );
}

// ═══════════ FEATURES GRID ═══════════
function FeaturesGrid() {
  const features = [
    { icon: "🍽️", title: "15 Comidas", desc: "Alimenta con pizza, sushi, steak... cada mascota tiene favoritos" },
    { icon: "📋", title: "Misiones Diarias", desc: "3 misiones nuevas cada día con recompensas" },
    { icon: "🗺️", title: "5 Mundos", desc: "Explora desde Pixel Meadow hasta The Abyss" },
    { icon: "🌤️", title: "Clima Real", desc: "Tu mascota reacciona al clima de tu ciudad" },
    { icon: "🔄", title: "Trading", desc: "Comparte mascotas con amigos via código" },
    { icon: "💬", title: "Interacciones", desc: "Las mascotas juegan y pelean entre ellas" },
    { icon: "🎮", title: "13 Mini-juegos", desc: "Catch, Memory, Snake, Flappy, Rhythm..." },
    { icon: "🎵", title: "14 Sonidos", desc: "Rain, Lofi, Café, Dungeon, Void..." },
    { icon: "⚡", title: "Sistema XP", desc: "Niveles, evoluciones y logros" },
    { icon: "🔋", title: "System Aware", desc: "Reacciona a tu batería y música" },
    { icon: "🍅", title: "Pomodoro", desc: "Timer integrado con reacciones de tu pet" },
    { icon: "📖", title: "Diario", desc: "Tu mascota escribe su propia historia" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {features.map((f) => (
        <div key={f.title} className="glass rounded-xl p-3 border border-border/40 hover:border-neon/30 transition-all group">
          <span className="text-xl block mb-2 group-hover:animate-bob">{f.icon}</span>
          <p className="font-display text-[9px] text-foreground">{f.title}</p>
          <p className="text-[8px] text-muted-foreground mt-0.5">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ═══════════ PET GALLERY PREVIEW ═══════════
function PetGalleryPreview() {
  const [hoveredPet, setHoveredPet] = useState<PetKind | null>(null);
  const categories = [
    { label: "Clásicas", pets: ["cat", "dog", "bunny", "fox", "panda", "axolotl", "capybara", "penguin", "monkey", "unicorn"] as PetKind[] },
    { label: "Fantasy", pets: ["dragon", "ghost", "robot", "alien", "slime", "slimemage", "mushroom"] as PetKind[] },
    { label: "Lovecraft", pets: ["cthulhu", "shoggoth", "blackgoat", "necronomicon", "yurei"] as PetKind[] },
    { label: "Videojuegos", pets: ["pikachu", "kirby", "creeper", "yoshi", "metroid", "companionCube", "chocobo"] as PetKind[] },
  ];

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <div key={cat.label}>
          <p className="font-display text-[9px] text-neon-pink mb-2">{cat.label.toUpperCase()}</p>
          <div className="flex gap-2 flex-wrap">
            {cat.pets.map((k) => {
              const def = PETS[k];
              if (!def) return null;
              const isFree = FREE_PETS.includes(k);
              return (
                <div
                  key={k}
                  onMouseEnter={() => setHoveredPet(k)}
                  onMouseLeave={() => setHoveredPet(null)}
                  className={`relative w-12 h-12 rounded-lg border flex items-center justify-center transition-all ${
                    isFree
                      ? "border-neon/40 bg-neon/5"
                      : "border-border/30 bg-secondary/20 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  }`}
                  title={`${def.name}${isFree ? " (Free)" : " 🔒"}`}
                >
                  <div className="w-9 h-9">{def.render("right", 0)}</div>
                  {!isFree && <span className="absolute top-0 right-0 text-[7px]">🔒</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-center text-[9px] text-muted-foreground mt-4">
        + más categorías: Sci-fi, Horror, Animales... <span className="text-neon">62 en total</span>
      </p>
    </div>
  );
}
