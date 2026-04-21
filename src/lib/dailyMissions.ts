// PixelPets · Daily Missions System
// Generates 3 daily missions that reset each day

export interface Mission {
  id: string;
  title: string;
  icon: string;
  description: string;
  target: number;
  type: "feed" | "play" | "game" | "xp" | "happiness" | "streak" | "food";
  reward: { xp: number; food?: { id: string; quantity: number } };
}

// Pool of possible missions
const MISSION_POOL: Omit<Mission, "id">[] = [
  { title: "Hungry Pet", icon: "🍖", description: "Feed your pet 3 times", target: 3, type: "feed", reward: { xp: 20, food: { id: "cookie", quantity: 2 } } },
  { title: "Feast!", icon: "🍽️", description: "Feed your pet 8 times", target: 8, type: "feed", reward: { xp: 40, food: { id: "pizza", quantity: 1 } } },
  { title: "Playtime", icon: "🎾", description: "Play with your pet 3 times", target: 3, type: "play", reward: { xp: 20, food: { id: "apple", quantity: 3 } } },
  { title: "Best Friend", icon: "💕", description: "Play with your pet 6 times", target: 6, type: "play", reward: { xp: 35, food: { id: "icecream", quantity: 1 } } },
  { title: "Gamer", icon: "🎮", description: "Complete 2 mini-games", target: 2, type: "game", reward: { xp: 30, food: { id: "sushi", quantity: 1 } } },
  { title: "Pro Gamer", icon: "🏆", description: "Complete 5 mini-games", target: 5, type: "game", reward: { xp: 60, food: { id: "cake", quantity: 1 } } },
  { title: "XP Hunter", icon: "⚡", description: "Earn 50 XP today", target: 50, type: "xp", reward: { xp: 25, food: { id: "ramen", quantity: 1 } } },
  { title: "XP Machine", icon: "🔥", description: "Earn 150 XP today", target: 150, type: "xp", reward: { xp: 50, food: { id: "star", quantity: 1 } } },
  { title: "Dedicated", icon: "📅", description: "Maintain a 3-day streak", target: 3, type: "streak", reward: { xp: 40, food: { id: "rainbow", quantity: 1 } } },
  { title: "Loyal", icon: "🔥", description: "Maintain a 7-day streak", target: 7, type: "streak", reward: { xp: 80, food: { id: "goldfish", quantity: 1 } } },
  { title: "Chef", icon: "👨‍🍳", description: "Use 3 different foods", target: 3, type: "food", reward: { xp: 30, food: { id: "burger", quantity: 1 } } },
];

// Seeded random based on date — same missions for everyone on same day
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function getDailyMissions(dateStr: string): Mission[] {
  // Create seed from date
  const parts = dateStr.split("-");
  const seed = parseInt(parts[0]) * 10000 + parseInt(parts[1]) * 100 + parseInt(parts[2]);
  const rng = seededRandom(seed);

  // Pick 3 unique missions
  const shuffled = [...MISSION_POOL].sort(() => rng() - 0.5);
  return shuffled.slice(0, 3).map((m, i) => ({
    ...m,
    id: `${dateStr}-${i}`,
  }));
}

export interface MissionProgress {
  date: string;
  missions: { id: string; progress: number; completed: boolean; claimed: boolean }[];
}

export function getEmptyProgress(dateStr: string): MissionProgress {
  const missions = getDailyMissions(dateStr);
  return {
    date: dateStr,
    missions: missions.map((m) => ({ id: m.id, progress: 0, completed: false, claimed: false })),
  };
}
