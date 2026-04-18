import { useEffect, useState } from "react";
import { PETS, type PetKind } from "@/components/pets/petSprites";

const FEATURED: PetKind[] = [
  "pikachu", "cthulhu", "bb8", "creeper", "xenomorph",
  "kirby", "yoshi", "dalek", "shoggoth", "facehugger",
  "slime", "dragon", "ghost", "axolotl", "mushroom",
];

export function PetShowcase() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 220);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm py-6">
      {/* Scanline gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, color-mix(in oklab, var(--neon) 8%, transparent) 3px, color-mix(in oklab, var(--neon) 8%, transparent) 4px)",
        }}
      />

      <div className="flex animate-marquee whitespace-nowrap">
        {[...FEATURED, ...FEATURED].map((kind, i) => {
          const def = PETS[kind];
          const facing: "left" | "right" = i % 2 === 0 ? "right" : "left";
          return (
            <div
              key={`${kind}-${i}`}
              className="flex flex-col items-center justify-end mx-3 shrink-0"
              style={{ width: 64 }}
            >
              <div className="w-14 h-14 animate-bob" style={{ animationDelay: `${(i % 5) * 0.2}s` }}>
                {def.render(facing, step)}
              </div>
              <p className="font-display text-[8px] text-muted-foreground mt-1.5 truncate max-w-full">
                {def.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
