import { useEffect, useState, useRef } from "react";
import { generateInteraction, getInteractionInterval, type PetInteraction } from "@/lib/petInteractions";
import { PETS } from "@/components/pets/petSprites";

interface Props {
  activePets: string[]; // array of pet kinds currently active
  onInteractionXp?: (xp: number) => void;
}

export function PetInteractionDisplay({ activePets, onInteractionXp }: Props) {
  const [interaction, setInteraction] = useState<{ pet1: string; pet2: string; data: PetInteraction } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activePets.length < 2) {
      setInteraction(null);
      return;
    }

    const triggerInteraction = () => {
      // Pick 2 random pets
      const shuffled = [...activePets].sort(() => Math.random() - 0.5);
      const pet1 = shuffled[0];
      const pet2 = shuffled[1];
      const data = generateInteraction(pet1, pet2);
      setInteraction({ pet1, pet2, data });
      if (data.xpBonus > 0 && onInteractionXp) {
        onInteractionXp(data.xpBonus);
      }
      // Clear after 5 seconds
      setTimeout(() => setInteraction(null), 5000);

      // Schedule next
      const interval = getInteractionInterval(pet1, pet2);
      timerRef.current = setTimeout(triggerInteraction, interval);
    };

    // First interaction after 10 seconds
    timerRef.current = setTimeout(triggerInteraction, 10000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activePets.join(",")]);

  if (!interaction) return null;

  const pet1Name = PETS[interaction.pet1 as keyof typeof PETS]?.name || interaction.pet1;
  const pet2Name = PETS[interaction.pet2 as keyof typeof PETS]?.name || interaction.pet2;

  return (
    <div className="glass rounded-xl p-2 border border-neon/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2">
        <span className="text-base">{interaction.data.icon}</span>
        <p className="text-[9px] text-foreground">
          <span className="text-neon font-display">{pet1Name}</span>
          {" & "}
          <span className="text-neon font-display">{pet2Name}</span>
          {" "}
          <span className="text-muted-foreground">{interaction.data.message}</span>
        </p>
        {interaction.data.xpBonus > 0 && (
          <span className="text-[8px] text-neon ml-auto">+{interaction.data.xpBonus}XP</span>
        )}
      </div>
    </div>
  );
}
