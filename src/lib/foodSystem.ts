// PixelPets · Food System
// Each food has different stat effects and some pets have favorites

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  hungerRestore: number;
  happinessBoost: number;
  category: "basic" | "premium" | "rare";
}

export const FOODS: FoodItem[] = [
  // Basic (earned easily)
  { id: "kibble", name: "Kibble", icon: "🥣", hungerRestore: 15, happinessBoost: 2, category: "basic" },
  { id: "apple", name: "Apple", icon: "🍎", hungerRestore: 10, happinessBoost: 5, category: "basic" },
  { id: "bread", name: "Bread", icon: "🍞", hungerRestore: 12, happinessBoost: 3, category: "basic" },
  { id: "cookie", name: "Cookie", icon: "🍪", hungerRestore: 8, happinessBoost: 10, category: "basic" },
  { id: "carrot", name: "Carrot", icon: "🥕", hungerRestore: 10, happinessBoost: 4, category: "basic" },
  // Premium (earned from games)
  { id: "pizza", name: "Pizza", icon: "🍕", hungerRestore: 25, happinessBoost: 12, category: "premium" },
  { id: "sushi", name: "Sushi", icon: "🍣", hungerRestore: 20, happinessBoost: 15, category: "premium" },
  { id: "burger", name: "Burger", icon: "🍔", hungerRestore: 30, happinessBoost: 8, category: "premium" },
  { id: "icecream", name: "Ice Cream", icon: "🍦", hungerRestore: 10, happinessBoost: 20, category: "premium" },
  { id: "ramen", name: "Ramen", icon: "🍜", hungerRestore: 28, happinessBoost: 10, category: "premium" },
  { id: "steak", name: "Steak", icon: "🥩", hungerRestore: 35, happinessBoost: 8, category: "premium" },
  // Rare (missions/achievements)
  { id: "cake", name: "Birthday Cake", icon: "🎂", hungerRestore: 20, happinessBoost: 30, category: "rare" },
  { id: "goldfish", name: "Golden Fish", icon: "🐟", hungerRestore: 40, happinessBoost: 20, category: "rare" },
  { id: "rainbow", name: "Rainbow Candy", icon: "🌈", hungerRestore: 15, happinessBoost: 40, category: "rare" },
  { id: "star", name: "Star Fruit", icon: "⭐", hungerRestore: 50, happinessBoost: 50, category: "rare" },
];

// Pet favorites — feeding a favorite gives 2x bonus
export const PET_FAVORITES: Record<string, string[]> = {
  cat: ["goldfish", "sushi"],
  dog: ["steak", "burger", "kibble"],
  bunny: ["carrot", "apple"],
  fox: ["sushi", "cookie"],
  panda: ["ramen", "apple"],
  axolotl: ["goldfish", "sushi"],
  capybara: ["apple", "carrot", "bread"],
  penguin: ["goldfish", "icecream"],
  monkey: ["cookie", "cake", "apple"],
  unicorn: ["rainbow", "star", "cake"],
  slime: ["icecream", "rainbow"],
  dragon: ["steak", "pizza"],
  ghost: ["cake", "cookie"],
  robot: ["pizza", "ramen"],
  pikachu: ["apple", "cookie"],
  kirby: ["cake", "burger", "pizza", "steak", "icecream"], // kirby eats everything
  creeper: ["bread", "carrot"],
  yoshi: ["apple", "cookie", "star"],
  cthulhu: ["goldfish", "sushi", "steak"],
};

export function isFavoriteFood(petKind: string, foodId: string): boolean {
  return PET_FAVORITES[petKind]?.includes(foodId) ?? false;
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOODS.find((f) => f.id === id);
}

// Rewards from mini-games: returns food items to add to inventory
export function getGameReward(score: number): { foodId: string; quantity: number }[] {
  const rewards: { foodId: string; quantity: number }[] = [];
  // Always get 1-2 basic food
  const basicFoods = FOODS.filter((f) => f.category === "basic");
  const randomBasic = basicFoods[Math.floor(Math.random() * basicFoods.length)];
  rewards.push({ foodId: randomBasic.id, quantity: 1 + (score > 20 ? 1 : 0) });

  // Score > 15: chance of premium food
  if (score > 15 && Math.random() < 0.5) {
    const premiumFoods = FOODS.filter((f) => f.category === "premium");
    const randomPremium = premiumFoods[Math.floor(Math.random() * premiumFoods.length)];
    rewards.push({ foodId: randomPremium.id, quantity: 1 });
  }

  // Score > 30: small chance of rare food
  if (score > 30 && Math.random() < 0.2) {
    const rareFoods = FOODS.filter((f) => f.category === "rare");
    const randomRare = rareFoods[Math.floor(Math.random() * rareFoods.length)];
    rewards.push({ foodId: randomRare.id, quantity: 1 });
  }

  return rewards;
}
