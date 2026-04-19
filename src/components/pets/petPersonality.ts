import type { PetKind } from "./petSprites";

export interface PetPersonality {
  hungerDecay: number;    // multiplier on hunger decay (default 1.0)
  happinessDecay: number; // multiplier on happiness decay
  energyDecay: number;    // multiplier on energy decay
  sleepRecovery: number;  // multiplier on energy recovery during sleep
  feedBonus: number;      // extra hunger restored on feed
  playBonus: number;      // extra happiness on play
  clickSound: string;     // sound name from audio.ts
}

const DEFAULT_PERSONALITY: PetPersonality = {
  hungerDecay: 1.0,
  happinessDecay: 1.0,
  energyDecay: 1.0,
  sleepRecovery: 1.0,
  feedBonus: 0,
  playBonus: 0,
  clickSound: "pop",
};

const PERSONALITIES: Partial<Record<PetKind, Partial<PetPersonality>>> = {
  cat: { energyDecay: 1.3, sleepRecovery: 1.5, clickSound: "eat" },
  dog: { happinessDecay: 1.4, playBonus: 10, clickSound: "happy" },
  slime: { hungerDecay: 0.7, energyDecay: 0.7, clickSound: "pop" },
  dragon: { hungerDecay: 1.5, feedBonus: 10, clickSound: "shoot" },
  robot: { hungerDecay: 0.8, happinessDecay: 0.8, energyDecay: 0.8, clickSound: "click" },
  capybara: { hungerDecay: 0.6, happinessDecay: 0.6, energyDecay: 0.6, playBonus: 0, clickSound: "pop" },
  pikachu: { energyDecay: 0.5, happinessDecay: 1.2, clickSound: "magic" },
  cthulhu: { clickSound: "snore" }, // chaotic multipliers applied at runtime
  doge: { happinessDecay: 0.5, playBonus: 15, clickSound: "pop" },
  sonic: { energyDecay: 2.0, sleepRecovery: 2.0, clickSound: "pop" },
  ghost: { clickSound: "sad" },
  yurei: { clickSound: "sad" },
  dalek: { clickSound: "click" },
  bb8: { clickSound: "click" },
  shoggoth: { clickSound: "pop" },
  blackgoat: { clickSound: "snore" },
  necronomicon: { clickSound: "snore" },
  // New batch 3
  hamster: { energyDecay: 1.5, playBonus: 5, clickSound: "pop" },
  parrot: { happinessDecay: 0.6, clickSound: "happy" },
  jellyfish: { hungerDecay: 0.7, happinessDecay: 0.7, energyDecay: 0.7, clickSound: "pop" },
  bat: { energyDecay: 0.5, clickSound: "sad" },
  crab: { hungerDecay: 0.8, clickSound: "click" },
  frog: { playBonus: 10, clickSound: "splash" },
  snail: { hungerDecay: 0.5, happinessDecay: 0.5, energyDecay: 0.5, clickSound: "pop" },
  firefly: { happinessDecay: 0.5, clickSound: "magic" },
  octopus: { feedBonus: 10, clickSound: "splash" },
  phoenix: { sleepRecovery: 2.0, clickSound: "shoot" },
};

/** Get the personality for a pet kind. Returns full defaults merged with overrides. */
export function getPersonality(kind: PetKind): PetPersonality {
  const overrides = PERSONALITIES[kind];
  if (!overrides) return { ...DEFAULT_PERSONALITY };
  return { ...DEFAULT_PERSONALITY, ...overrides };
}

/**
 * For cthulhu: generate chaotic multipliers (random 0.5-1.5 each tick).
 * Call this each decay tick to get fresh random values.
 */
export function getChaosMultipliers(): Pick<PetPersonality, "hungerDecay" | "happinessDecay" | "energyDecay" | "sleepRecovery"> {
  const rand = () => 0.5 + Math.random();
  return {
    hungerDecay: rand(),
    happinessDecay: rand(),
    energyDecay: rand(),
    sleepRecovery: rand(),
  };
}
