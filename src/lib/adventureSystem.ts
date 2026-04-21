// PixelPets · Adventure / Story Mode
// Pets explore worlds, fight mini-bosses, and unlock new areas

export interface AdventureWorld {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredLevel: number;
  stages: AdventureStage[];
  bossGame: string; // mini-game id used as boss fight
  reward: { xp: number; food: string; accessory?: string };
}

export interface AdventureStage {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  foodReward?: string;
  durationMs: number; // how long the "exploration" takes
}

export const WORLDS: AdventureWorld[] = [
  {
    id: "meadow",
    name: "Pixel Meadow",
    icon: "🌿",
    description: "A peaceful meadow full of flowers and butterflies.",
    requiredLevel: 1,
    stages: [
      { id: "meadow-1", name: "Flower Field", description: "Your pet explores colorful flowers", xpReward: 10, foodReward: "apple", durationMs: 15000 },
      { id: "meadow-2", name: "Butterfly Chase", description: "Chasing butterflies through the grass", xpReward: 15, foodReward: "cookie", durationMs: 20000 },
      { id: "meadow-3", name: "Hidden Pond", description: "A secret pond with golden fish!", xpReward: 20, foodReward: "goldfish", durationMs: 25000 },
    ],
    bossGame: "catch",
    reward: { xp: 50, food: "cake" },
  },
  {
    id: "cave",
    name: "Crystal Cave",
    icon: "💎",
    description: "Dark tunnels filled with glowing crystals.",
    requiredLevel: 3,
    stages: [
      { id: "cave-1", name: "Entrance", description: "The cave mouth glows with an eerie light", xpReward: 15, foodReward: "bread", durationMs: 20000 },
      { id: "cave-2", name: "Crystal Chamber", description: "Walls covered in shimmering crystals", xpReward: 20, foodReward: "ramen", durationMs: 25000 },
      { id: "cave-3", name: "Underground Lake", description: "A vast underground lake reflects the crystals", xpReward: 25, foodReward: "sushi", durationMs: 30000 },
    ],
    bossGame: "memory",
    reward: { xp: 80, food: "rainbow" },
  },
  {
    id: "volcano",
    name: "Fire Mountain",
    icon: "🌋",
    description: "A dangerous volcano with rivers of lava.",
    requiredLevel: 5,
    stages: [
      { id: "volcano-1", name: "Lava Fields", description: "Hot ground, careful where you step!", xpReward: 20, foodReward: "steak", durationMs: 25000 },
      { id: "volcano-2", name: "Obsidian Bridge", description: "A narrow bridge over a lava river", xpReward: 25, foodReward: "pizza", durationMs: 30000 },
      { id: "volcano-3", name: "Dragon's Lair", description: "Something ancient sleeps here...", xpReward: 35, foodReward: "burger", durationMs: 35000 },
    ],
    bossGame: "dodge",
    reward: { xp: 120, food: "star" },
  },
  {
    id: "cloud",
    name: "Sky Kingdom",
    icon: "☁️",
    description: "Floating islands above the clouds.",
    requiredLevel: 7,
    stages: [
      { id: "cloud-1", name: "Cloud Steps", description: "Bouncing from cloud to cloud", xpReward: 25, foodReward: "icecream", durationMs: 25000 },
      { id: "cloud-2", name: "Rainbow Bridge", description: "A bridge made of pure rainbow", xpReward: 30, foodReward: "rainbow", durationMs: 30000 },
      { id: "cloud-3", name: "Star Temple", description: "An ancient temple among the stars", xpReward: 40, foodReward: "star", durationMs: 35000 },
    ],
    bossGame: "flappy",
    reward: { xp: 150, food: "star" },
  },
  {
    id: "abyss",
    name: "The Abyss",
    icon: "🕳️",
    description: "The deepest, darkest place. Only the brave enter.",
    requiredLevel: 10,
    stages: [
      { id: "abyss-1", name: "Void Entrance", description: "Reality bends around you...", xpReward: 35, foodReward: "goldfish", durationMs: 30000 },
      { id: "abyss-2", name: "Shadow Realm", description: "Shadows move on their own here", xpReward: 40, foodReward: "cake", durationMs: 35000 },
      { id: "abyss-3", name: "Core of Darkness", description: "The heart of the abyss pulses", xpReward: 50, foodReward: "star", durationMs: 40000 },
    ],
    bossGame: "rhythm",
    reward: { xp: 200, food: "star" },
  },
];

export function getAvailableWorlds(level: number): AdventureWorld[] {
  return WORLDS.filter((w) => w.requiredLevel <= level);
}

export function getWorldById(id: string): AdventureWorld | undefined {
  return WORLDS.find((w) => w.id === id);
}
