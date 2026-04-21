import { useState } from "react";
import { FOODS, isFavoriteFood, type FoodItem } from "@/lib/foodSystem";
import type { GameState } from "@/hooks/useGameState";

interface Props {
  gameState: GameState;
  activePetKind: string;
  onFeedWithFood: (food: FoodItem) => void;
}

export function FoodInventory({ gameState, activePetKind, onFeedWithFood }: Props) {
  const [showAll, setShowAll] = useState(false);

  const inventory = gameState.foodInventory || {};
  const ownedFoods = FOODS.filter((f) => (inventory[f.id] || 0) > 0);

  if (ownedFoods.length === 0) {
    return (
      <div className="glass rounded-xl p-3 border border-border/40">
        <h4 className="font-display text-[9px] text-muted-foreground mb-2">🍽️ FOOD INVENTORY</h4>
        <p className="text-[10px] text-muted-foreground italic">No food yet! Play mini-games to earn food.</p>
      </div>
    );
  }

  const displayed = showAll ? ownedFoods : ownedFoods.slice(0, 6);

  return (
    <div className="glass rounded-xl p-3 border border-border/40">
      <h4 className="font-display text-[9px] text-muted-foreground mb-2">🍽️ FOOD INVENTORY</h4>
      <div className="grid grid-cols-3 gap-1.5">
        {displayed.map((food) => {
          const qty = inventory[food.id] || 0;
          const isFav = isFavoriteFood(activePetKind, food.id);
          return (
            <button
              key={food.id}
              onClick={() => onFeedWithFood(food)}
              className={`relative glass rounded-lg p-2 text-center hover:border-neon/60 transition-all cursor-pointer ${isFav ? "border-yellow-400/60 bg-yellow-400/5" : "border-border/30"}`}
              title={`${food.name} — Hunger +${food.hungerRestore}, Happy +${food.happinessBoost}${isFav ? " (FAVORITE ×2!)" : ""}`}
            >
              <span className="text-lg block">{food.icon}</span>
              <span className="font-display text-[7px] text-muted-foreground block truncate">{food.name}</span>
              <span className="absolute top-0.5 right-1 font-display text-[8px] text-neon">×{qty}</span>
              {isFav && <span className="absolute top-0.5 left-0.5 text-[8px]">⭐</span>}
            </button>
          );
        })}
      </div>
      {ownedFoods.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-[9px] text-neon hover:underline w-full text-center"
        >
          {showAll ? "Show less" : `+${ownedFoods.length - 6} more...`}
        </button>
      )}
    </div>
  );
}
