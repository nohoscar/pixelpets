import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/desktop")({
  component: DesktopPage,
  head: () => ({
    meta: [
      { title: "Desktop Pets · Descarga la app" },
      { name: "description", content: "Descarga la app de escritorio para Windows con tu mascotita y cursores de juegos." },
    ],
  }),
});

function DesktopPage() {
  const [downloading, setDownloading] = useState<"app" | "cursors" | null>(null);

  const download = async (path: string, filename: string, key: "app" | "cursors") => {
    try {
      setDownloading(key);
      const res = await fetch(path);
      if (!res.ok) throw new Error(`No disponible (${res.status})`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert(`Descarga fallida: ${(e as Error).message}\n\nProbablemente aún no está empaquetada. Pídele a Lovable que ejecute el build.`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <main className="relative min-h-screen w-full p-6 md:p-12">
      <Link to="/" className="font-display text-[10px] text-neon-pink hover:underline">
        ← VOLVER
      </Link>

      <div className="max-w-3xl mx-auto mt-8">
        <p className="font-display text-[10px] text-neon-pink animate-flicker mb-3">
          ▸ DESKTOP_BUILD · WINDOWS
        </p>
        <h1 className="font-display text-3xl md:text-5xl leading-tight mb-4">
          <span className="text-neon">Tu mascota</span>
          <br />
          <span className="text-foreground">en tu</span>{" "}
          <span className="text-neon-pink">escritorio.</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mb-10">
          Mientras trabajas en lo que sea, tu mascotita camina sobre tu escritorio.
          Ventana transparente, siempre encima, no estorba al hacer click.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* App download */}
          <div className="glass rounded-xl p-6">
            <p className="font-display text-[10px] text-neon mb-2">01 · APP</p>
            <h2 className="font-display text-base mb-2">DesktopPets.exe</h2>
            <p className="text-xs text-muted-foreground mb-5">
              App portable para Windows. No requiere instalación. Doble click y listo.
              Ícono en la bandeja del sistema para cambiar mascota o cerrar.
            </p>
            <button
              onClick={() => download("/DesktopPets-win.zip", "DesktopPets-win.zip", "app")}
              disabled={downloading === "app"}
              className="w-full px-4 py-3 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all disabled:opacity-50"
            >
              {downloading === "app" ? "DESCARGANDO..." : "▸ DESCARGAR APP (.zip)"}
            </button>
          </div>

          {/* Cursors download */}
          <div className="glass rounded-xl p-6">
            <p className="font-display text-[10px] text-neon mb-2">02 · CURSORES</p>
            <h2 className="font-display text-base mb-2">Cursores .cur</h2>
            <p className="text-xs text-muted-foreground mb-5">
              Pack con CS:GO, Valorant, Bow y Sniper en formato Windows nativo (.cur).
              Sin glitches — los aplica el sistema.
            </p>
            <button
              onClick={() => download("/cursors-pack.zip", "cursors-pack.zip", "cursors")}
              disabled={downloading === "cursors"}
              className="w-full px-4 py-3 rounded-md border border-accent/60 bg-accent/10 text-accent-foreground font-display text-[10px] hover:bg-accent/20 hover:shadow-[var(--shadow-neon-pink)] transition-all disabled:opacity-50"
            >
              {downloading === "cursors" ? "DESCARGANDO..." : "▸ DESCARGAR PACK (.zip)"}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <section className="mt-10 glass rounded-xl p-6">
          <h3 className="font-display text-xs text-neon mb-4">CÓMO USAR LA APP</h3>
          <ol className="space-y-3 text-xs text-muted-foreground">
            <li><span className="font-display text-neon-pink mr-2">01</span> Descarga el .zip y descomprímelo en cualquier carpeta.</li>
            <li><span className="font-display text-neon-pink mr-2">02</span> Doble click en <code className="text-foreground">DesktopPets.exe</code>.</li>
            <li><span className="font-display text-neon-pink mr-2">03</span> Verás tu mascota flotando en pantalla. Aparece un ícono en la bandeja del sistema (junto al reloj).</li>
            <li><span className="font-display text-neon-pink mr-2">04</span> Click derecho en ese ícono para cambiar mascota, activar follow, o salir.</li>
          </ol>
        </section>

        <section className="mt-4 glass rounded-xl p-6">
          <h3 className="font-display text-xs text-neon mb-4">CÓMO INSTALAR LOS CURSORES (WINDOWS)</h3>
          <ol className="space-y-3 text-xs text-muted-foreground">
            <li><span className="font-display text-neon-pink mr-2">01</span> Descomprime <code className="text-foreground">cursors-pack.zip</code>.</li>
            <li><span className="font-display text-neon-pink mr-2">02</span> Abre <code className="text-foreground">Configuración → Bluetooth y dispositivos → Mouse → Configuración adicional del mouse</code>.</li>
            <li><span className="font-display text-neon-pink mr-2">03</span> Ve a la pestaña <code className="text-foreground">Punteros</code>.</li>
            <li><span className="font-display text-neon-pink mr-2">04</span> Selecciona "Selección normal" → <code className="text-foreground">Examinar</code> → elige el .cur que quieras (csgo.cur, valorant.cur, bow.cur, sniper.cur).</li>
            <li><span className="font-display text-neon-pink mr-2">05</span> Aplicar. Tu cursor cambia en todo Windows. Para volver al normal: clic en "Predeterminado".</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
