import { PET_LIST, PETS, type PetKind } from "./pets/petSprites";
import type { GameState } from "@/hooks/useGameState";
import { getUnlockedAccessories, getLockedAccessories } from "./pets/accessories";
import { ACHIEVEMENTS } from "@/hooks/useGameState";
import { PomodoroTimer } from "./PomodoroTimer";
import { useI18n } from "@/lib/i18n";
import { THEMES, applyTheme, type ThemeId } from "@/lib/themes";
import { getCurrentSeason } from "@/lib/seasons";
import { FoodInventory } from "./FoodInventory";
import { DailyMissions } from "./DailyMissions";
import { AdventureMode } from "./AdventureMode";
import { WeatherWidget } from "./WeatherWidget";
import { PetTrading } from "./PetTrading";
import { Accordion } from "./Accordion";
import type { FoodItem } from "@/lib/foodSystem";

const isWebDemo = typeof window !== "undefined" && !(window as any).pixelpets;
const FREE_PETS: PetKind[] = ["cat", "dog", "slime", "dragon", "ghost"];
const FREE_GAMES = ["catch", "memory"];

interface Props {
  followCursor: boolean;
  onToggleFollow: (v: boolean) => void;
  petCount: number;
  onAddPet: (k: PetKind) => void;
  onClearPets: () => void;
  gameState?: GameState;
  onStartGame?: (game: "catch" | "memory" | "simon" | "typing" | "reaction" | "quiz" | "dodge" | "whack" | "snake" | "flappy" | "puzzle" | "colorMatch" | "rhythm") => void;
  onAchievementUnlock?: (name: string, icon: string) => void;
  onPomodoroWorkEnd?: () => void;
  onPomodoroBreakEnd?: () => void;
  activePetKind?: PetKind;
  petName?: string;
  onPetNameChange?: (name: string) => void;
  onFeedWithFood?: (food: FoodItem) => void;
  activePets?: string[];
}

export function ControlPanel({
  followCursor, onToggleFollow,
  petCount, onAddPet, onClearPets, gameState,
  onStartGame, onAchievementUnlock,
  onPomodoroWorkEnd, onPomodoroBreakEnd,
  activePetKind, petName, onPetNameChange,
  onFeedWithFood, activePets,
}: Props) {
  const level = gameState?.level ?? 1;
  const unlocked = getUnlockedAccessories(level);
  const locked = getLockedAccessories(level);
  const { t, locale, setLocale } = useI18n();
  const currentSeason = getCurrentSeason();

  return (
    <aside className="glass rounded-xl p-4 w-full max-w-sm pointer-events-auto max-h-[85vh] overflow-y-auto">
      {/* Seasonal Banner */}
      {currentSeason && (
        <div className="mb-3 px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-center font-display text-[9px] text-neon">
          {currentSeason.icon} {currentSeason.name} {currentSeason.icon}
        </div>
      )}

      {/* Header — always visible */}
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-base text-neon leading-tight">🐾 PIXEL<span className="text-neon-pink">PETS</span></h1>
          <div className="flex gap-1">
            <button onClick={() => { setLocale("en"); gameState?.setLocale("en"); }}
              className={`px-1.5 py-0.5 rounded text-[7px] font-display ${locale === "en" ? "bg-primary/20 text-neon border border-primary/40" : "text-muted-foreground"}`}>EN</button>
            <button onClick={() => { setLocale("pt"); gameState?.setLocale("pt"); }}
              className={`px-1.5 py-0.5 rounded text-[7px] font-display ${locale === "pt" ? "bg-primary/20 text-neon border border-primary/40" : "text-muted-foreground"}`}>PT</button>
          </div>
        </div>
        {gameState && (
          <div className="flex items-center gap-3 mt-1">
            <span className="font-display text-[8px] text-neon">Lv.{gameState.level}</span>
            <span className="font-display text-[8px] text-muted-foreground">{gameState.xp}XP</span>
            <span className="font-display text-[8px] text-muted-foreground">🔥{gameState.streakDays}d</span>
          </div>
        )}
      </header>

      {/* Pet Name + Follow — always visible */}
      {activePetKind && petCount > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <input
            type="text"
            value={petName ?? ""}
            placeholder={PETS[activePetKind].name}
            onChange={(e) => onPetNameChange?.(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
            maxLength={20}
            className="flex-1 px-2 py-1 rounded border border-border bg-secondary/40 text-foreground text-[9px] font-display focus:border-primary/60 focus:outline-none"
          />
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={followCursor} onChange={(e) => onToggleFollow(e.target.checked)} className="w-3 h-3 accent-[var(--neon)]" />
            <span className="text-[7px] font-display text-muted-foreground">Follow</span>
          </label>
        </div>
      )}

      {/* Weather — always visible, compact */}
      {gameState && <WeatherWidget />}

      {/* ═══ ACCORDION SECTIONS ═══ */}
      <div className="flex flex-col gap-2 mt-3">

        {/* 🐾 Pets */}
        <Accordion title="MASCOTAS" icon="🐾" defaultOpen badge={`${petCount}/5`}>
          <div className="grid grid-cols-5 gap-1.5 max-h-52 overflow-y-auto pr-1 mt-2">
            {PET_LIST.map((k) => {
              const def = PETS[k];
              const isLocked = isWebDemo && !FREE_PETS.includes(k);
              return (
                <button key={k} onClick={() => !isLocked && onAddPet(k)} disabled={isLocked}
                  className={`group relative aspect-square rounded-lg border transition-all p-0.5 flex flex-col items-center justify-center ${
                    isLocked ? "border-border bg-secondary/20 opacity-30 grayscale cursor-not-allowed"
                    : "border-border bg-secondary/40 hover:border-neon hover:bg-neon/5"
                  }`} title={isLocked ? "🔒 Desktop" : def.name}>
                  <div className="w-8 h-8">{def.render("right", 0)}</div>
                  {isLocked && <span className="absolute top-0 right-0 text-[7px]">🔒</span>}
                  <span className="absolute bottom-0 left-0 right-0 text-[5px] font-display text-center text-muted-foreground truncate">{def.name}</span>
                </button>
              );
            })}
          </div>
          {petCount > 0 && (
            <button onClick={onClearPets} className="mt-2 text-[8px] font-display text-destructive hover:underline">{t("control.remove")}</button>
          )}
        </Accordion>

        {/* 🎮 Games */}
        {gameState && onStartGame && (
          <Accordion title="MINI-JUEGOS" icon="🎮" badge="13">
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {([
                { id: "catch", icon: "🎯", label: "CATCH" },
                { id: "memory", icon: "🧠", label: "MEMORY" },
                { id: "simon", icon: "🎵", label: "SIMON" },
                { id: "typing", icon: "⌨️", label: "TYPE" },
                { id: "reaction", icon: "⚡", label: "REACT" },
                { id: "quiz", icon: "❓", label: "QUIZ" },
                { id: "dodge", icon: "🏃", label: "DODGE" },
                { id: "whack", icon: "🔨", label: "WHACK" },
                { id: "snake", icon: "🐍", label: "SNAKE" },
                { id: "flappy", icon: "🐦", label: "FLAPPY" },
                { id: "puzzle", icon: "🧩", label: "PUZZLE" },
                { id: "colorMatch", icon: "🎨", label: "COLOR" },
                { id: "rhythm", icon: "🎶", label: "RHYTHM" },
              ] as const).map((game) => {
                const isLocked = isWebDemo && !FREE_GAMES.includes(game.id);
                return (
                  <button key={game.id} onClick={() => !isLocked && onStartGame(game.id)} disabled={isLocked}
                    className={`relative px-1 py-2 rounded-md border transition-all font-display text-[8px] flex flex-col items-center gap-0.5 ${
                      isLocked ? "border-border bg-secondary/20 opacity-30 grayscale cursor-not-allowed"
                      : "border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent"
                    }`}>
                    <span className="text-base">{game.icon}</span>
                    <span>{game.label}</span>
                    {isLocked && <span className="absolute top-0 right-0 text-[6px]">🔒</span>}
                  </button>
                );
              })}
            </div>
          </Accordion>
        )}

        {/* 🗺️ Worlds */}
        {gameState && onStartGame && (
          <Accordion title="MUNDOS" icon="🗺️" badge="5">
            <div className="mt-2">
              <AdventureMode gameState={gameState} onStartBossFight={(g) => onStartGame(g as any)} />
            </div>
          </Accordion>
        )}

        {/* 🍽️ Food */}
        {gameState && activePetKind && onFeedWithFood && (
          <Accordion title="COMIDA" icon="🍽️" badge={`${Object.values(gameState.foodInventory || {}).reduce((a, b) => a + b, 0)}`}>
            <div className="mt-2">
              <FoodInventory gameState={gameState} activePetKind={activePetKind} onFeedWithFood={onFeedWithFood} />
            </div>
          </Accordion>
        )}

        {/* 📋 Missions */}
        {gameState && (
          <Accordion title="MISIONES DIARIAS" icon="📋">
            <div className="mt-2">
              <DailyMissions gameState={gameState} />
            </div>
          </Accordion>
        )}

        {/* 🔄 Trading */}
        {gameState && activePetKind && (
          <Accordion title="TRADING" icon="🔄">
            <div className="mt-2">
              <PetTrading gameState={gameState} activePetKind={activePetKind} />
            </div>
          </Accordion>
        )}

        {/* ⚙️ Settings */}
        {gameState && (
          <Accordion title="AJUSTES" icon="⚙️">
            <div className="mt-2 flex flex-col gap-3">
              {/* Theme */}
              <div>
                <span className="text-[8px] font-display text-muted-foreground">THEME</span>
                <div className="flex gap-1.5 mt-1">
                  {THEMES.map((theme) => (
                    <button key={theme.id} onClick={() => { gameState.setTheme(theme.id); applyTheme(theme.id as ThemeId); }}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${gameState.theme === theme.id ? "border-foreground scale-110 shadow-[0_0_8px_var(--neon)]" : "border-border hover:border-foreground/60"}`}
                      style={{ background: theme.color }} title={theme.label} />
                  ))}
                </div>
              </div>

              {/* Ambient */}
              <div>
                <span className="text-[8px] font-display text-muted-foreground">AMBIENT</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {([
                    { id: "rain", icon: "🌧️", free: true }, { id: "lofi", icon: "🎵", free: true },
                    { id: "nature", icon: "🌿", free: false }, { id: "cafe", icon: "☕", free: false },
                    { id: "storm", icon: "⛈️", free: false }, { id: "space", icon: "🚀", free: false },
                    { id: "fireplace", icon: "🔥", free: false }, { id: "ocean", icon: "🌊", free: false },
                    { id: "city", icon: "🌃", free: false }, { id: "whispers", icon: "👁️", free: false },
                    { id: "heartbeat", icon: "💀", free: false }, { id: "dungeon", icon: "⛓️", free: false },
                    { id: "void", icon: "🕳️", free: false }, { id: "silent", icon: "🔇", free: true },
                  ] as const).map((s) => {
                    const locked = isWebDemo && !s.free;
                    return (
                      <button key={s.id} onClick={() => !locked && gameState.setAmbientSound(s.id)} disabled={locked}
                        className={`px-1 py-0.5 rounded text-sm transition-all ${locked ? "opacity-40 grayscale cursor-not-allowed" : gameState.ambientSound === s.id ? "bg-primary/20 border border-primary/40" : "hover:bg-secondary/40"}`}>
                        {s.icon}{locked && "🔒"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <span className="text-[8px] font-display text-muted-foreground">ACCESSORIES</span>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {unlocked.map((acc) => {
                    const isEquipped = gameState.accessories[acc.slot] === acc.id;
                    return (
                      <button key={acc.id} onClick={() => { if (isEquipped) gameState.equipAccessory(acc.slot, null); else gameState.equipAccessory(acc.slot, acc.id); }}
                        className={`px-1.5 py-1.5 rounded-md border transition-all font-display text-[7px] flex flex-col items-center gap-0.5 ${isEquipped ? "border-primary bg-primary/10" : "border-border bg-secondary/40 hover:border-accent/60"}`}>
                        <span className="text-sm">{acc.id === "basic-hat" ? "🎩" : acc.id === "glasses" ? "👓" : acc.id === "bow" ? "🎀" : acc.id === "scarf" ? "🧣" : acc.id === "cape" ? "🦸" : "🌙"}</span>
                        <span className="truncate w-full text-center">{acc.name.en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pomodoro */}
              <div>
                <span className="text-[8px] font-display text-muted-foreground">POMODORO</span>
                <div className="grid grid-cols-2 gap-2 mt-1 mb-2">
                  <select value={gameState.pomodoroConfig.workMinutes} onChange={(e) => gameState.setPomodoroConfig({ ...gameState.pomodoroConfig, workMinutes: Number(e.target.value) })}
                    className="px-1 py-1 rounded border border-border bg-secondary/40 text-foreground text-[8px] font-display">
                    <option value={15}>Work 15m</option><option value={25}>Work 25m</option><option value={45}>Work 45m</option>
                  </select>
                  <select value={gameState.pomodoroConfig.breakMinutes} onChange={(e) => gameState.setPomodoroConfig({ ...gameState.pomodoroConfig, breakMinutes: Number(e.target.value) })}
                    className="px-1 py-1 rounded border border-border bg-secondary/40 text-foreground text-[8px] font-display">
                    <option value={5}>Break 5m</option><option value={10}>Break 10m</option><option value={15}>Break 15m</option>
                  </select>
                </div>
                <PomodoroTimer workMinutes={gameState.pomodoroConfig.workMinutes} breakMinutes={gameState.pomodoroConfig.breakMinutes} onWorkEnd={onPomodoroWorkEnd} onBreakEnd={onPomodoroBreakEnd} />
              </div>

              {/* Achievements */}
              <div>
                <span className="text-[8px] font-display text-muted-foreground">ACHIEVEMENTS ({gameState.achievements.length}/{ACHIEVEMENTS.length})</span>
                <div className="grid grid-cols-5 gap-1 mt-1">
                  {ACHIEVEMENTS.map((ach) => {
                    const isUnlocked = gameState.achievements.includes(ach.id);
                    return (
                      <div key={ach.id} className={`aspect-square rounded-md border flex items-center justify-center text-base ${isUnlocked ? "border-primary/60 bg-primary/10" : "border-border bg-secondary/20 opacity-30 grayscale"}`} title={isUnlocked ? ach.name.en : "???"}>
                        <span>{ach.icon}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Accordion>
        )}
      </div>
    </aside>
  );
}
