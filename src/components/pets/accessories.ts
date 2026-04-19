import type { ReactNode } from "react";
import type { AccessorySlot, AccessoryId } from "@/hooks/useGameState";

export interface AccessoryDef {
  id: AccessoryId;
  name: Record<"en" | "pt", string>;
  slot: AccessorySlot;
  unlockLevel: number;
  render: (facing: "left" | "right") => ReactNode;
}

// SVG elements positioned relative to 32×32 viewBox
// Each render function returns a React element (JSX in the .tsx consumer)

export const ACCESSORY_LIST: AccessoryDef[] = [
  {
    id: "basic-hat",
    name: { en: "Basic Hat", pt: "Chapéu Básico" },
    slot: "head",
    unlockLevel: 2,
    render: (_facing) => null, // implemented in AccessoryRenderer via SVG
  },
  {
    id: "glasses",
    name: { en: "Glasses", pt: "Óculos" },
    slot: "eyes",
    unlockLevel: 3,
    render: (_facing) => null,
  },
  {
    id: "bow",
    name: { en: "Bow", pt: "Laço" },
    slot: "neck",
    unlockLevel: 5,
    render: (_facing) => null,
  },
  {
    id: "scarf",
    name: { en: "Scarf", pt: "Cachecol" },
    slot: "neck",
    unlockLevel: 7,
    render: (_facing) => null,
  },
  {
    id: "cape",
    name: { en: "Cape", pt: "Capa" },
    slot: "back",
    unlockLevel: 10,
    render: (_facing) => null,
  },
  {
    id: "pajamas",
    name: { en: "Pajamas", pt: "Pijama" },
    slot: "special",
    unlockLevel: 0,
    render: (_facing) => null,
  },
  // Seasonal accessories
  {
    id: "witch-hat",
    name: { en: "Witch Hat", pt: "Chapéu de Bruxa" },
    slot: "head",
    unlockLevel: 0,
    render: (_facing) => null,
  },
  {
    id: "santa-hat",
    name: { en: "Santa Hat", pt: "Gorro de Natal" },
    slot: "head",
    unlockLevel: 0,
    render: (_facing) => null,
  },
  {
    id: "heart-crown",
    name: { en: "Heart Crown", pt: "Coroa de Corações" },
    slot: "head",
    unlockLevel: 0,
    render: (_facing) => null,
  },
  {
    id: "sunglasses",
    name: { en: "Sunglasses", pt: "Óculos de Sol" },
    slot: "eyes",
    unlockLevel: 0,
    render: (_facing) => null,
  },
];

export const ACCESSORIES: Record<AccessoryId, AccessoryDef> = Object.fromEntries(
  ACCESSORY_LIST.map((a) => [a.id, a])
);

export function getUnlockedAccessories(level: number): AccessoryDef[] {
  return ACCESSORY_LIST.filter((a) => a.unlockLevel <= level);
}

export function getLockedAccessories(level: number): AccessoryDef[] {
  return ACCESSORY_LIST.filter((a) => a.unlockLevel > level);
}
