// Pet Evolution System — cosmetic evolutions at Level 5

import type { PetKind } from "./petSprites";

export interface EvolutionDef {
  kind: PetKind;
  requiredLevel: number;
  evolvedName: string;
  evolvedStyle: string; // CSS class additions
}

export const EVOLUTIONS: EvolutionDef[] = [
  { kind: "cat", requiredLevel: 5, evolvedName: "Neko Sage", evolvedStyle: "evolved-cat" },
  { kind: "dog", requiredLevel: 5, evolvedName: "Alpha Wolf", evolvedStyle: "evolved-dog" },
  { kind: "slime", requiredLevel: 5, evolvedName: "Slime King", evolvedStyle: "evolved-slime" },
  { kind: "dragon", requiredLevel: 5, evolvedName: "Elder Dragon", evolvedStyle: "evolved-dragon" },
  { kind: "pikachu", requiredLevel: 5, evolvedName: "Raichu", evolvedStyle: "evolved-pikachu" },
];

export function getEvolution(kind: PetKind, level: number): EvolutionDef | null {
  const evo = EVOLUTIONS.find((e) => e.kind === kind);
  if (!evo || level < evo.requiredLevel) return null;
  return evo;
}
