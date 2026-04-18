import { useState, useCallback, useRef, type MutableRefObject } from "react";

// --- Types ---

export type AccessorySlot = "head" | "eyes" | "neck" | "back" | "special";
export type AccessoryId = string;

export interface PersistedGameState {
  xp: number;
  level: number;
  accessories: Record<AccessorySlot, AccessoryId | null>;
  achievements: string[];
  feedCount: number;
  playCount: number;
  clickCount: number;
  gamesPlayed: { catch: number; memory: number };
  pomodoroConfig: { workMinutes: number; breakMinutes: number };
  locale: "en" | "pt";
  nightModeManualOverride: boolean;
  petNames: Record<string, string>; // petKind → custom name
  lastActiveDate: string; // ISO date string "2026-04-18"
  streakDays: number;     // consecutive days active
  theme: string;          // ThemeId
  ambientSound: string;   // "rain" | "lofi" | "nature" | "silent"
}

export interface GameActions {
  addXp: (amount: number) => { newLevel: number; previousLevel: number };
  equipAccessory: (slot: AccessorySlot, id: AccessoryId | null) => void;
  unlockAchievement: (id: string) => void;
  incrementFeedCount: () => void;
  incrementPlayCount: () => void;
  incrementClickCount: () => void;
  incrementGamesPlayed: (game: "catch" | "memory") => void;
  setLocale: (locale: "en" | "pt") => void;
  setNightModeManualOverride: (v: boolean) => void;
  setPomodoroConfig: (config: { workMinutes: number; breakMinutes: number }) => void;
  setPetName: (kind: string, name: string) => void;
  getPetName: (kind: string) => string;
  setTheme: (theme: string) => void;
  setAmbientSound: (sound: string) => void;
}

export type GameState = PersistedGameState & GameActions & {
  achievementCallbackRef: MutableRefObject<((name: string, icon: string) => void) | null>;
};

// --- Achievement Definitions ---

export interface AchievementDef {
  id: string;
  name: Record<"en" | "pt", string>;
  icon: string;
  condition: (state: PersistedGameState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "fed-10", name: { en: "Feeder", pt: "Alimentador" }, icon: "🍖", condition: (s) => s.feedCount >= 10 },
  { id: "fed-100", name: { en: "Chef", pt: "Chef" }, icon: "👨‍🍳", condition: (s) => s.feedCount >= 100 },
  { id: "played-50", name: { en: "Playful", pt: "Brincalhão" }, icon: "🎾", condition: (s) => s.playCount >= 50 },
  { id: "level-5", name: { en: "Rising Star", pt: "Estrela" }, icon: "⭐", condition: (s) => s.level >= 5 },
  { id: "level-10", name: { en: "Veteran", pt: "Veterano" }, icon: "🏆", condition: (s) => s.level >= 10 },
  { id: "survived-critical", name: { en: "Survivor", pt: "Sobrevivente" }, icon: "🪫", condition: () => false }, // triggered externally
  { id: "all-minigames", name: { en: "Gamer", pt: "Gamer" }, icon: "🎮", condition: (s) => s.gamesPlayed.catch > 0 && s.gamesPlayed.memory > 0 },
  { id: "first-accessory", name: { en: "Fashionista", pt: "Fashionista" }, icon: "🎩", condition: (s) => Object.values(s.accessories).some((v) => v !== null) },
  { id: "night-owl", name: { en: "Night Owl", pt: "Coruja" }, icon: "🦉", condition: () => new Date().getHours() === 3 },
  { id: "clicked-500", name: { en: "Clicker", pt: "Clicador" }, icon: "🖱️", condition: (s) => s.clickCount >= 500 },
];

// --- Pure helpers ---

const STORAGE_KEY = "pixelpets-game-v1";

const DEFAULT_STATE: PersistedGameState = {
  xp: 0,
  level: 1,
  accessories: { head: null, eyes: null, neck: null, back: null, special: null },
  achievements: [],
  feedCount: 0,
  playCount: 0,
  clickCount: 0,
  gamesPlayed: { catch: 0, memory: 0 },
  pomodoroConfig: { workMinutes: 25, breakMinutes: 5 },
  locale: "en",
  nightModeManualOverride: false,
  petNames: {},
  lastActiveDate: "",
  streakDays: 0,
  theme: "cyberpunk",
  ambientSound: "silent",
};

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function readFromStorage(): PersistedGameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function updateStreak(state: PersistedGameState): PersistedGameState {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  if (state.lastActiveDate === today) return state;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (state.lastActiveDate === yesterday) {
    return { ...state, lastActiveDate: today, streakDays: state.streakDays + 1 };
  }
  // Older or never set → reset streak
  return { ...state, lastActiveDate: today, streakDays: 1 };
}

function writeToStorage(state: PersistedGameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// --- Hook ---

export function useGameState(): GameState {
  const [state, setState] = useState<PersistedGameState>(() => {
    const loaded = readFromStorage();
    const withStreak = updateStreak(loaded);
    if (withStreak !== loaded) writeToStorage(withStreak);
    return withStreak;
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const persist = useCallback((next: PersistedGameState) => {
    setState(next);
    writeToStorage(next);
  }, []);

  const addXp = useCallback((amount: number) => {
    const prev = stateRef.current;
    const previousLevel = prev.level;
    const newXp = prev.xp + amount;
    const newLevel = calculateLevel(newXp);
    persist({ ...prev, xp: newXp, level: newLevel });
    return { newLevel, previousLevel };
  }, [persist]);

  const equipAccessory = useCallback((slot: AccessorySlot, id: AccessoryId | null) => {
    const prev = stateRef.current;
    persist({ ...prev, accessories: { ...prev.accessories, [slot]: id } });
  }, [persist]);

  const unlockAchievement = useCallback((id: string) => {
    const prev = stateRef.current;
    if (prev.achievements.includes(id)) return;
    persist({ ...prev, achievements: [...prev.achievements, id] });
  }, [persist]);

  const incrementFeedCount = useCallback(() => {
    const prev = stateRef.current;
    persist({ ...prev, feedCount: prev.feedCount + 1 });
  }, [persist]);

  const incrementPlayCount = useCallback(() => {
    const prev = stateRef.current;
    persist({ ...prev, playCount: prev.playCount + 1 });
  }, [persist]);

  const incrementClickCount = useCallback(() => {
    const prev = stateRef.current;
    persist({ ...prev, clickCount: prev.clickCount + 1 });
  }, [persist]);

  const setLocale = useCallback((locale: "en" | "pt") => {
    const prev = stateRef.current;
    persist({ ...prev, locale });
  }, [persist]);

  const setNightModeManualOverride = useCallback((v: boolean) => {
    const prev = stateRef.current;
    persist({ ...prev, nightModeManualOverride: v });
  }, [persist]);

  const incrementGamesPlayed = useCallback((game: "catch" | "memory") => {
    const prev = stateRef.current;
    const gamesPlayed = { ...prev.gamesPlayed, [game]: (prev.gamesPlayed?.[game] ?? 0) + 1 };
    persist({ ...prev, gamesPlayed });
  }, [persist]);

  const setPomodoroConfig = useCallback((config: { workMinutes: number; breakMinutes: number }) => {
    const prev = stateRef.current;
    persist({ ...prev, pomodoroConfig: config });
  }, [persist]);

  const setPetName = useCallback((kind: string, name: string) => {
    const prev = stateRef.current;
    persist({ ...prev, petNames: { ...prev.petNames, [kind]: name } });
  }, [persist]);

  const getPetName = useCallback((kind: string) => {
    return stateRef.current.petNames[kind] || "";
  }, []);

  const setTheme = useCallback((theme: string) => {
    const prev = stateRef.current;
    persist({ ...prev, theme });
  }, [persist]);

  const setAmbientSound = useCallback((sound: string) => {
    const prev = stateRef.current;
    persist({ ...prev, ambientSound: sound });
  }, [persist]);

  // Achievement checking — runs on every persist
  const achievementCallbackRef = useRef<((name: string, icon: string) => void) | null>(null);

  const checkAchievements = useCallback((state: PersistedGameState) => {
    for (const ach of ACHIEVEMENTS) {
      if (state.achievements.includes(ach.id)) continue;
      if (ach.condition(state)) {
        const next = { ...state, achievements: [...state.achievements, ach.id] };
        persist(next);
        if (achievementCallbackRef.current) {
          achievementCallbackRef.current(ach.name.en, ach.icon);
        }
        break; // one at a time
      }
    }
  }, [persist]);

  // Check achievements after state changes
  const prevStateRef = useRef(state);
  if (prevStateRef.current !== state) {
    prevStateRef.current = state;
    // Defer to avoid calling persist during render
    setTimeout(() => checkAchievements(stateRef.current), 0);
  }

  return {
    ...state,
    addXp,
    equipAccessory,
    unlockAchievement,
    incrementFeedCount,
    incrementPlayCount,
    incrementClickCount,
    incrementGamesPlayed,
    setLocale,
    setNightModeManualOverride,
    setPomodoroConfig,
    setPetName,
    getPetName,
    setTheme,
    setAmbientSound,
    achievementCallbackRef,
  };
}
