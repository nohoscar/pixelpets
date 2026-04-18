import { createFileRoute, ClientOnly, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { Pet, type PetStats } from "@/components/pets/Pet";
import { PETS, type PetKind } from "@/components/pets/petSprites";
import { CURSORS, CURSOR_SOUND, type CursorKind } from "@/components/cursors/cursors";
import { StatsPanel } from "@/components/StatsPanel";
import { VolumeControl } from "@/components/VolumeControl";
import { useSystemAwareness } from "@/hooks/useSystemAwareness";
import { playSound } from "@/lib/audio";

export const Route = createFileRoute("/")({
  component: Index,
});

interface PetInstance {
  id: string;
  kind: PetKind;
}

function Index() {
  const [pets, setPets] = useState<PetInstance[]>([{ id: "p1", kind: "cat" }]);
  const [cursor, setCursor] = useState<CursorKind>("csgo");
  const [followCursor, setFollowCursor] = useState(false);
  const [stats, setStats] = useState<PetStats | null>(null);
  const awareness = useSystemAwareness();

  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const actionRef = useRef<{ feed: () => void; play: () => void; sleep: () => void } | null>(null);


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

  const setPet = (kind: PetKind) => {
    setPets([{ id: `p${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, kind }]);
    setStats(null);
  };
  const removePet = (id: string) => setPets((p) => p.filter((x) => x.id !== id));
  const clearPets = () => { setPets([]); setStats(null); };

  const currentPetName = pets[0] ? PETS[pets[0].kind].name : "—";

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Pets layer */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <ClientOnly fallback={null}>
          {pets.map((p) => (
            <Pet
              key={p.id}
              id={p.id}
              kind={p.kind}
              cursorRef={cursorRef}
              followCursor={followCursor}
              onRemove={removePet}
              onStatsChange={setStats}
              actionRef={actionRef}
              awareness={awareness}
            />
          ))}
        </ClientOnly>
      </div>

      {/* UI layer */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <ControlPanel
            cursor={cursor}
            onCursor={setCursor}
            followCursor={followCursor}
            onToggleFollow={setFollowCursor}
            petCount={pets.length}
            onAddPet={setPet}
            onClearPets={clearPets}
          />
          {pets.length > 0 && (
            <StatsPanel
              stats={stats}
              petName={currentPetName}
              awareness={awareness}
              onFeed={() => actionRef.current?.feed()}
              onPlay={() => actionRef.current?.play()}
              onSleep={() => actionRef.current?.sleep()}
            />
          )}
          <VolumeControl />
        </div>

        {/* Hero / explainer */}
        <section className="hidden md:flex flex-col gap-6 max-w-2xl mx-auto justify-center min-h-[80vh] pointer-events-none">
          <p className="font-display text-[10px] text-neon-pink animate-flicker">
            ▸ SYSTEM_BOOT · v2.0
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight">
            <span className="text-neon">Pixel pets</span>
            <br />
            <span className="text-foreground">para tu</span>{" "}
            <span className="text-neon-pink">desktop.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            42 mascotas — desde gatitos hasta xenomorfos, Pikachu, BB-8 y horrores cósmicos — con stats Tamagotchi.
            Aliméntalas, arrástralas y elige entre 29 cursores: pico de Minecraft, BFG, Keyblade, lightsaber y más.
          </p>

          <div className="flex flex-wrap gap-3 mt-2 pointer-events-auto">
            <Link
              to="/buy"
              className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all"
            >
              ▸ COMPRAR APP · $4.99
            </Link>
            <a
              href="#how"
              className="px-4 py-2 rounded-md border border-primary/50 bg-primary/10 text-primary font-display text-[10px] hover:bg-primary/20 transition-all"
            >
              ▸ CÓMO_FUNCIONA
            </a>
          </div>

          <div id="how" className="mt-12 grid grid-cols-3 gap-4 pointer-events-auto">
            {[
              { n: "01", t: "Elige mascota", d: "14 estilos para escoger." },
              { n: "02", t: "Cuídala", d: "Feed · Play · Sleep." },
              { n: "03", t: "Arrástrala", d: "Click y mueve." },
            ].map((s) => (
              <div key={s.n} className="glass rounded-lg p-4">
                <p className="font-display text-[10px] text-neon">{s.n}</p>
                <p className="font-display text-xs mt-2">{s.t}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.d}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-display text-muted-foreground mt-8">
            // La app de escritorio funciona sin que se vea la ventana — solo tu mascotita flotando.
          </p>
        </section>
      </div>
    </main>
  );
}
