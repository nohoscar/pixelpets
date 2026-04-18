import { useState, useEffect } from "react";
import { PETS, PET_LIST, type PetKind } from "./pets/petSprites";
import { randomThought } from "./pets/petThoughts";

type Category = "cute" | "gaming" | "horror" | "scifi" | "all";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "cute", label: "🐾 Cute" },
  { id: "gaming", label: "🎮 Gaming" },
  { id: "horror", label: "👻 Horror" },
  { id: "scifi", label: "🤖 Sci-fi" },
  { id: "all", label: "📚 All" },
];

const PET_CATEGORIES: Record<Category, PetKind[]> = {
  cute: ["cat", "dog", "bunny", "fox", "panda", "axolotl", "capybara", "penguin", "monkey", "unicorn", "slime", "mushroom", "doge", "nyanCat", "bear", "turtle", "owl", "totoro"],
  gaming: ["pikachu", "kirby", "yoshi", "creeper", "metroid", "companionCube", "chocobo", "booMario", "bulborb", "headcrab", "isaac", "mario", "sonic", "amongUs", "jigglypuff"],
  horror: ["ghost", "cthulhu", "shoggoth", "blackgoat", "necronomicon", "yurei", "facehugger", "xenomorph", "chestburster", "weepingAngel", "gremlin", "yautja"],
  scifi: ["robot", "alien", "dalek", "tribble", "bb8", "dragon", "slimemage"],
  all: PET_LIST,
};

const PERSONALITY_TRAITS: Partial<Record<PetKind, string>> = {
  cat: "Sleepy & independent",
  dog: "Loyal & playful",
  slime: "Chill & low-maintenance",
  dragon: "Hungry & fierce",
  robot: "Efficient & steady",
  capybara: "Zen master",
  pikachu: "Electric & energetic",
  cthulhu: "Chaotic & unknowable",
  doge: "Much happy, very wow",
  sonic: "Gotta go fast",
  ghost: "Shy & spooky",
  kirby: "Always hungry",
  creeper: "Explosive personality",
  xenomorph: "Aggressive & alien",
  bb8: "Loyal droid",
  dalek: "EXTERMINATE!",
  totoro: "Gentle forest spirit",
  amongUs: "Kinda sus",
};

function getTraitForPet(kind: PetKind): string {
  return PERSONALITY_TRAITS[kind] || "Unique companion";
}

export function PetGallery() {
  const [activeTab, setActiveTab] = useState<Category>("cute");
  const [step, setStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState<PetKind | null>(null);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 200);
    return () => clearInterval(id);
  }, []);

  const pets = PET_CATEGORIES[activeTab];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveTab(cat.id); setSelectedPet(null); }}
            className={`px-3 py-1.5 rounded-md font-display text-[9px] transition-all ${
              activeTab === cat.id
                ? "bg-primary/20 text-neon border border-primary/40 shadow-[0_0_10px_color-mix(in_oklab,var(--neon)_30%,transparent)]"
                : "text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Selected pet preview */}
      {selectedPet && (
        <div className="mb-4 p-4 rounded-xl glass border border-neon/30 flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 animate-bob">
            {PETS[selectedPet].render("right", step)}
          </div>
          <div className="min-w-0">
            <p className="font-display text-xs text-neon">{PETS[selectedPet].name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{getTraitForPet(selectedPet)}</p>
            <p className="text-[10px] text-neon-pink mt-1 italic truncate">
              "{randomThought(selectedPet)}"
            </p>
          </div>
          <button
            onClick={() => setSelectedPet(null)}
            className="ml-auto text-muted-foreground hover:text-foreground text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {pets.map((kind) => {
          const def = PETS[kind];
          const isSelected = selectedPet === kind;
          return (
            <button
              key={kind}
              onClick={() => setSelectedPet(isSelected ? null : kind)}
              className={`group relative aspect-square rounded-lg border transition-all p-1 flex flex-col items-center justify-center ${
                isSelected
                  ? "border-neon bg-neon/10 shadow-[0_0_14px_color-mix(in_oklab,var(--neon)_40%,transparent)]"
                  : "border-border bg-secondary/40 hover:border-neon/60 hover:bg-neon/5"
              }`}
              title={def.name}
            >
              <div className="w-10 h-10">
                {def.render("right", step)}
              </div>
              <span className="absolute bottom-0.5 left-0 right-0 text-[6px] font-display text-center text-muted-foreground group-hover:text-neon truncate px-0.5">
                {def.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
