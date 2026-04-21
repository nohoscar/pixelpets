// PixelPets · Pet Interactions System
// When multiple pets are active, they interact with each other

export type InteractionType = "play" | "fight" | "chat" | "share" | "dance" | "nap" | "ignore";

export interface PetInteraction {
  type: InteractionType;
  icon: string;
  message: string;
  xpBonus: number;
  happinessEffect: number; // can be negative for fights
}

// Compatibility matrix — some pets get along, some don't
const COMPATIBILITY: Record<string, Record<string, number>> = {
  cat: { dog: -1, bunny: 0, fox: 1, ghost: 1, robot: 0 },
  dog: { cat: -1, bunny: 1, fox: 0, panda: 1, monkey: 1 },
  dragon: { ghost: 1, cthulhu: 1, robot: -1, bunny: -1, unicorn: 0 },
  ghost: { cat: 1, dragon: 1, cthulhu: 1, pikachu: -1 },
  pikachu: { yoshi: 1, kirby: 1, ghost: -1, creeper: -1 },
  kirby: { pikachu: 1, yoshi: 1, slime: 1 },
  slime: { kirby: 1, mushroom: 1, ghost: 1 },
  cthulhu: { ghost: 1, dragon: 1, unicorn: -1, bunny: -1 },
};

function getCompatibility(pet1: string, pet2: string): number {
  return COMPATIBILITY[pet1]?.[pet2] ?? COMPATIBILITY[pet2]?.[pet1] ?? 0;
}

// Generate a random interaction between two pets
export function generateInteraction(pet1Kind: string, pet2Kind: string): PetInteraction {
  const compat = getCompatibility(pet1Kind, pet2Kind);
  const roll = Math.random();

  if (compat > 0) {
    // Friends — positive interactions
    if (roll < 0.3) return { type: "play", icon: "🎾", message: "are playing together!", xpBonus: 5, happinessEffect: 10 };
    if (roll < 0.5) return { type: "dance", icon: "💃", message: "are dancing together!", xpBonus: 3, happinessEffect: 8 };
    if (roll < 0.7) return { type: "share", icon: "🍪", message: "are sharing food!", xpBonus: 4, happinessEffect: 12 };
    if (roll < 0.85) return { type: "chat", icon: "💬", message: "are chatting!", xpBonus: 2, happinessEffect: 5 };
    return { type: "nap", icon: "😴", message: "fell asleep together!", xpBonus: 3, happinessEffect: 6 };
  }

  if (compat < 0) {
    // Rivals — mostly negative
    if (roll < 0.4) return { type: "fight", icon: "⚡", message: "are fighting!", xpBonus: 2, happinessEffect: -5 };
    if (roll < 0.6) return { type: "ignore", icon: "😤", message: "are ignoring each other", xpBonus: 0, happinessEffect: -2 };
    if (roll < 0.8) return { type: "chat", icon: "🗯️", message: "are arguing!", xpBonus: 1, happinessEffect: -3 };
    // Small chance they make up
    return { type: "play", icon: "🤝", message: "made up and are playing!", xpBonus: 8, happinessEffect: 15 };
  }

  // Neutral — mixed
  if (roll < 0.25) return { type: "play", icon: "🎾", message: "are playing!", xpBonus: 3, happinessEffect: 5 };
  if (roll < 0.45) return { type: "chat", icon: "💬", message: "are chatting!", xpBonus: 2, happinessEffect: 3 };
  if (roll < 0.6) return { type: "ignore", icon: "😐", message: "are minding their own business", xpBonus: 0, happinessEffect: 0 };
  if (roll < 0.75) return { type: "nap", icon: "😴", message: "are napping nearby", xpBonus: 1, happinessEffect: 2 };
  if (roll < 0.9) return { type: "dance", icon: "🎵", message: "are vibing to music!", xpBonus: 3, happinessEffect: 6 };
  return { type: "share", icon: "🍕", message: "are sharing a snack!", xpBonus: 4, happinessEffect: 8 };
}

// Get interaction frequency (ms) — friends interact more often
export function getInteractionInterval(pet1Kind: string, pet2Kind: string): number {
  const compat = getCompatibility(pet1Kind, pet2Kind);
  if (compat > 0) return 20000; // 20s for friends
  if (compat < 0) return 40000; // 40s for rivals
  return 30000; // 30s for neutral
}
