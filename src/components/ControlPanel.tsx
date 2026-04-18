import { PET_LIST, PETS, type PetKind } from "./pets/petSprites";
import { CURSORS, CURSOR_PREVIEWS, type CursorKind } from "./cursors/cursors";
import type { GameState } from "@/hooks/useGameState";
import { ACCESSORY_LIST, getUnlockedAccessories, getLockedAccessories } from "./pets/accessories";
import { ACHIEVEMENTS } from "@/hooks/useGameState";
import { PomodoroTimer } from "./PomodoroTimer";
import { useI18n } from "@/lib/i18n";

interface Props {
  cursor: CursorKind;
  onCursor: (c: CursorKind) => void;
  followCursor: boolean;
  onToggleFollow: (v: boolean) => void;
  petCount: number;
  onAddPet: (k: PetKind) => void;
  onClearPets: () => void;
  gameState?: GameState;
  onStartGame?: (game: "catch" | "memory") => void;
  onAchievementUnlock?: (name: string, icon: string) => void;
  onPomodoroWorkEnd?: () => void;
  onPomodoroBreakEnd?: () => void;
}

export function ControlPanel({
  cursor,
  onCursor,
  followCursor,
  onToggleFollow,
  petCount,
  onAddPet,
  onClearPets,
  gameState,
  onStartGame,
  onAchievementUnlock,
  onPomodoroWorkEnd,
  onPomodoroBreakEnd,
}: Props) {
  const level = gameState?.level ?? 1;
  const unlocked = getUnlockedAccessories(level);
  const locked = getLockedAccessories(level);
  const { t, locale, setLocale } = useI18n();

  return (
    <aside className="glass rounded-xl p-5 w-full max-w-sm pointer-events-auto max-h-[80vh] overflow-y-auto md:max-h-[90vh]">
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-[10px] text-neon-pink mb-1">{t("control.comment")}</p>
          {/* Language selector */}
          <div className="flex gap-1">
            <button
              onClick={() => { setLocale("en"); gameState?.setLocale("en"); }}
              className={`px-2 py-1 rounded text-[8px] font-display transition-all ${locale === "en" ? "bg-primary/20 text-neon border border-primary/40" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
            <button
              onClick={() => { setLocale("pt"); gameState?.setLocale("pt"); }}
              className={`px-2 py-1 rounded text-[8px] font-display transition-all ${locale === "pt" ? "bg-primary/20 text-neon border border-primary/40" : "text-muted-foreground hover:text-foreground"}`}
            >
              PT
            </button>
          </div>
        </div>
        <h1 className="font-display text-base text-neon leading-tight">
          {t("control.title")}
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          {t("control.subtitle")}
        </p>
      </header>

      <section className="mb-5">
        <h2 className="font-display text-[10px] text-neon-pink mb-2">{t("control.cursor")}</h2>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(CURSORS) as CursorKind[]).map((k) => {
            const active = cursor === k;
            const preview = CURSOR_PREVIEWS[k];
            return (
              <button
                key={k}
                onClick={() => onCursor(k)}
                className={`relative aspect-square rounded-lg border transition-all flex items-center justify-center group ${
                  active
                    ? "border-primary bg-primary/10 shadow-[0_0_18px_var(--primary)]"
                    : "border-border bg-secondary/40 hover:border-primary/60"
                }`}
                title={CURSORS[k].sub}
              >
                {preview ? (
                  <div
                    className="w-8 h-8"
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
                ) : (
                  <span className="text-2xl">↖</span>
                )}
                <span className="absolute -bottom-5 left-0 right-0 text-[9px] font-display text-center text-muted-foreground group-hover:text-foreground">
                  {CURSORS[k].label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-5 mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-[10px] text-neon-pink">{t("control.pet")}</h2>
          {petCount > 0 && (
            <button
              onClick={onClearPets}
              className="text-[10px] font-display text-destructive hover:underline"
            >
              {t("control.remove")}
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
          {PET_LIST.map((k) => {
            const def = PETS[k];
            return (
              <button
                key={k}
                onClick={() => onAddPet(k)}
                className="group relative aspect-square rounded-lg border border-border bg-secondary/40 hover:border-accent hover:bg-accent/10 transition-all p-1.5 flex flex-col items-center justify-center"
                title={`Cambiar a ${def.name}`}
              >
                <div className="w-9 h-9">{def.render("right", 0)}</div>
                <span className="absolute bottom-0.5 left-0 right-0 text-[7px] font-display text-center text-muted-foreground group-hover:text-foreground">
                  {def.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border bg-secondary/30 hover:border-accent/60 transition-colors">
          <input
            type="checkbox"
            checked={followCursor}
            onChange={(e) => onToggleFollow(e.target.checked)}
            className="w-4 h-4 accent-[var(--accent)]"
          />
          <div className="flex-1">
            <p className="text-xs font-display text-neon-pink">{t("control.follow")}</p>
            <p className="text-[10px] text-muted-foreground">{t("control.follow.desc")}</p>
          </div>
        </label>
      </section>

      {/* Accessory selection (task 2.7) */}
      {gameState && (
        <section className="mt-5">
          <h2 className="font-display text-[10px] text-neon-pink mb-2">{t("control.accessories")}</h2>
          <div className="grid grid-cols-3 gap-2">
            {unlocked.map((acc) => {
              const isEquipped = gameState.accessories[acc.slot] === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    if (isEquipped) {
                      gameState.equipAccessory(acc.slot, null);
                    } else {
                      gameState.equipAccessory(acc.slot, acc.id);
                      if (acc.slot === "special") {
                        gameState.setNightModeManualOverride(true);
                      }
                    }
                  }}
                  className={`px-2 py-2 rounded-md border transition-all font-display text-[8px] flex flex-col items-center gap-0.5 ${
                    isEquipped
                      ? "border-primary bg-primary/10 shadow-[0_0_12px_var(--primary)]"
                      : "border-border bg-secondary/40 hover:border-accent/60"
                  }`}
                  title={acc.name.en}
                >
                  <span className="text-sm">
                    {acc.id === "basic-hat" ? "🎩" : acc.id === "glasses" ? "👓" : acc.id === "bow" ? "🎀" : acc.id === "scarf" ? "🧣" : acc.id === "cape" ? "🦸" : "🌙"}
                  </span>
                  <span className="truncate w-full text-center">{acc.name.en}</span>
                </button>
              );
            })}
            {locked.map((acc) => (
              <button
                key={acc.id}
                disabled
                className="px-2 py-2 rounded-md border border-border bg-secondary/20 opacity-40 font-display text-[8px] flex flex-col items-center gap-0.5 cursor-not-allowed"
                title={`Unlock at Level ${acc.unlockLevel}`}
              >
                <span className="text-sm grayscale">
                  {acc.id === "basic-hat" ? "🎩" : acc.id === "glasses" ? "👓" : acc.id === "bow" ? "🎀" : acc.id === "scarf" ? "🧣" : acc.id === "cape" ? "🦸" : "🌙"}
                </span>
                <span className="truncate w-full text-center">L{acc.unlockLevel}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Mini-games section (task 5.2, 6.2) */}
      {gameState && onStartGame && (
        <section className="mt-5">
          <h2 className="font-display text-[10px] text-neon-pink mb-2">{t("control.minigames")}</h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStartGame("catch")}
              className="px-2 py-3 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-1"
            >
              <span className="text-lg">🎯</span>
              <span>CATCH</span>
            </button>
            <button
              onClick={() => onStartGame("memory")}
              className="px-2 py-3 rounded-md border border-border bg-secondary/40 hover:bg-accent/20 hover:border-accent transition-all font-display text-[9px] flex flex-col items-center gap-1"
            >
              <span className="text-lg">🧠</span>
              <span>MEMORY</span>
            </button>
          </div>
        </section>
      )}

      {/* Pomodoro section (task 10.3) */}
      {gameState && (
        <section className="mt-5">
          <h2 className="font-display text-[10px] text-neon-pink mb-2">{t("control.pomodoro")}</h2>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <label className="text-[8px] font-display text-muted-foreground">
              WORK
              <select
                value={gameState.pomodoroConfig.workMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  gameState.setPomodoroConfig({ ...gameState.pomodoroConfig, workMinutes: val });
                }}
                className="block w-full mt-0.5 px-1 py-1 rounded border border-border bg-secondary/40 text-foreground text-[9px] font-display"
              >
                <option value={15}>15 min</option>
                <option value={25}>25 min</option>
                <option value={45}>45 min</option>
              </select>
            </label>
            <label className="text-[8px] font-display text-muted-foreground">
              BREAK
              <select
                value={gameState.pomodoroConfig.breakMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  gameState.setPomodoroConfig({ ...gameState.pomodoroConfig, breakMinutes: val });
                }}
                className="block w-full mt-0.5 px-1 py-1 rounded border border-border bg-secondary/40 text-foreground text-[9px] font-display"
              >
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
              </select>
            </label>
          </div>
          <PomodoroTimer
            workMinutes={gameState.pomodoroConfig.workMinutes}
            breakMinutes={gameState.pomodoroConfig.breakMinutes}
            onWorkEnd={onPomodoroWorkEnd}
            onBreakEnd={onPomodoroBreakEnd}
          />
        </section>
      )}

      {/* Achievements section (task 7.3) */}
      {gameState && (
        <section className="mt-5">
          <h2 className="font-display text-[10px] text-neon-pink mb-2">
            {t("control.achievements")} ({gameState.achievements.length}/{ACHIEVEMENTS.length})
          </h2>
          <div className="grid grid-cols-5 gap-1.5">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = gameState.achievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`aspect-square rounded-md border flex items-center justify-center text-lg transition-all ${
                    unlocked
                      ? "border-primary/60 bg-primary/10 shadow-[0_0_8px_var(--primary)]"
                      : "border-border bg-secondary/20 opacity-30 grayscale"
                  }`}
                  title={unlocked ? ach.name.en : "???"}
                >
                  <span className={unlocked ? "" : "opacity-40"}>{ach.icon}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <footer className="mt-5 pt-4 border-t border-border">
        <p className="text-[9px] font-display text-muted-foreground leading-relaxed">
          {t("control.footer")}
        </p>
      </footer>
    </aside>
  );
}
