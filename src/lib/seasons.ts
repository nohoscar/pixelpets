// Seasonal Events System — auto-detects current season based on date

export interface SeasonalEvent {
  id: string;
  name: string;
  icon: string;
  petBonus: "hunger" | "happiness" | "energy";
  specialAccessory: string;
}

const SEASONAL_EVENTS: SeasonalEvent[] = [
  { id: "halloween", name: "HALLOWEEN EVENT", icon: "🎃", petBonus: "energy", specialAccessory: "witch-hat" },
  { id: "christmas", name: "CHRISTMAS EVENT", icon: "🎄", petBonus: "happiness", specialAccessory: "santa-hat" },
  { id: "valentine", name: "VALENTINE EVENT", icon: "💕", petBonus: "happiness", specialAccessory: "heart-crown" },
  { id: "summer", name: "SUMMER EVENT", icon: "☀️", petBonus: "hunger", specialAccessory: "sunglasses" },
];

function isInRange(month: number, day: number, startMonth: number, startDay: number, endMonth: number, endDay: number): boolean {
  const current = month * 100 + day;
  const start = startMonth * 100 + startDay;
  const end = endMonth * 100 + endDay;

  if (start <= end) {
    return current >= start && current <= end;
  }
  // Wraps around year (e.g. Dec 10 - Jan 5)
  return current >= start || current <= end;
}

export function getCurrentSeason(date: Date = new Date()): SeasonalEvent | null {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Halloween: Oct 15 - Nov 5
  if (isInRange(month, day, 10, 15, 11, 5)) return SEASONAL_EVENTS[0];
  // Christmas: Dec 10 - Jan 5
  if (isInRange(month, day, 12, 10, 1, 5)) return SEASONAL_EVENTS[1];
  // Valentine: Feb 7 - Feb 21
  if (isInRange(month, day, 2, 7, 2, 21)) return SEASONAL_EVENTS[2];
  // Summer: Jun 15 - Aug 31
  if (isInRange(month, day, 6, 15, 8, 31)) return SEASONAL_EVENTS[3];

  return null;
}
