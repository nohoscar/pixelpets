import { PET_LIST, PETS, type PetKind } from "./pets/petSprites";
import { CURSORS, CURSOR_PREVIEWS, type CursorKind } from "./cursors/cursors";

interface Props {
  cursor: CursorKind;
  onCursor: (c: CursorKind) => void;
  followCursor: boolean;
  onToggleFollow: (v: boolean) => void;
  petCount: number;
  onAddPet: (k: PetKind) => void;
  onClearPets: () => void;
}

export function ControlPanel({
  cursor,
  onCursor,
  followCursor,
  onToggleFollow,
  petCount,
  onAddPet,
  onClearPets,
}: Props) {
  return (
    <aside className="glass rounded-xl p-5 w-full max-w-sm pointer-events-auto">
      <header className="mb-4">
        <p className="font-display text-[10px] text-neon-pink mb-1">// CONTROL_PANEL.exe</p>
        <h1 className="font-display text-base text-neon leading-tight">
          DESKTOP<br />PETS
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Mascotitas que viven en tu pantalla + cursores de armas de juegos.
        </p>
      </header>

      <section className="mb-5">
        <h2 className="font-display text-[10px] text-neon-pink mb-2">CURSOR / ARMA</h2>
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
          <h2 className="font-display text-[10px] text-neon-pink">TU MASCOTA</h2>
          {petCount > 0 && (
            <button
              onClick={onClearPets}
              className="text-[10px] font-display text-destructive hover:underline"
            >
              QUITAR
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
            <p className="text-xs font-display text-neon-pink">FOLLOW MODE</p>
            <p className="text-[10px] text-muted-foreground">Las mascotas persiguen el cursor</p>
          </div>
        </label>
      </section>

      <footer className="mt-5 pt-4 border-t border-border">
        <p className="text-[9px] font-display text-muted-foreground leading-relaxed">
          Arrastra la mascota · Click → jugar · Click derecho → quitar
        </p>
      </footer>
    </aside>
  );
}
