import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { DOWNLOADS, downloadsConfigured } from "@/lib/downloads";

export const Route = createFileRoute("/download/$token")({
  component: DownloadPage,
  head: () => ({
    meta: [
      { title: "¡Compra confirmada! · Descarga PixelPets" },
      { name: "description", content: "Descarga tu copia de PixelPets para Windows, Mac o Linux." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function DownloadPage() {
  const { token } = Route.useParams();
  const [email, setEmail] = useState<string>("");
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Decode purchase token from API
    try {
      // Token is base64url encoded JSON: { email, licenseKey, ts }
      const padded = token.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = atob(padded);
      const data = JSON.parse(decoded);
      if (data.email) setEmail(data.email);
      if (data.licenseKey) setLicenseKey(data.licenseKey);
    } catch {
      // Fallback: try old format (email:timestamp)
      try {
        const decoded = atob(token.replace(/-/g, "="));
        const [mail] = decoded.split(":");
        setEmail(mail || "tu@email.com");
      } catch {
        setEmail("tu@email.com");
      }
      // Generate fallback license key if not in token
      if (!licenseKey) {
        const segments = Array.from({ length: 4 }, () =>
          Math.random().toString(36).slice(2, 6).toUpperCase()
        );
        setLicenseKey(`PIXL-${segments.join("-")}`);
      }
    }
  }, [token]);

  const copyLicense = async () => {
    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (url: string, filename: string) => {
    if (!downloadsConfigured) {
      alert(
        `▸ DESCARGAS NO CONFIGURADAS\n\nArchivo: ${filename}\nLicencia: ${licenseKey}\n\nPara activar:\n1. Conecta el proyecto a GitHub\n2. Espera al build (Actions)\n3. Crea un Release v1.0.0\n4. Edita src/lib/downloads.ts con tu usuario de GitHub`
      );
      return;
    }
    window.location.href = url;
  };

  return (
    <main className="relative min-h-screen w-full">
      <SiteHeader showBuyCta={false} />
      <div className="max-w-3xl mx-auto px-4 md:px-8 pb-12">
        {/* Success header */}
        <div className="text-center mb-10 mt-6">
          <div className="inline-block mb-4 text-6xl animate-bob">🎉</div>
          <p className="font-display text-[10px] text-neon-pink animate-flicker mb-2">
            ▸ TRANSACTION_OK · 200
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-3">
            <span className="text-neon">¡Compra</span>{" "}
            <span className="text-neon-pink">confirmada!</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Hemos enviado un email de confirmación a <span className="text-foreground">{email}</span>
          </p>
        </div>

        {/* License key */}
        <div className="glass rounded-xl p-6 mb-6 border border-neon/40">
          <p className="font-display text-[10px] text-neon mb-3">▸ TU_LICENCIA</p>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <code className="flex-1 px-4 py-3 rounded bg-input border border-border font-display text-sm text-neon-pink tracking-wider text-center">
              {licenseKey || "PIXL-XXXX-XXXX-XXXX-XXXX"}
            </code>
            <button
              onClick={copyLicense}
              className="px-4 py-3 rounded bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_20px_var(--primary)] transition-all whitespace-nowrap"
            >
              {copied ? "✓ COPIADO" : "▸ COPIAR"}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3">
            Guarda este código. Lo necesitarás la primera vez que abras la app para activar tu copia.
          </p>
        </div>

        {/* Downloads */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-[10px] text-neon">▸ DESCARGAS_DISPONIBLES</p>
            {!downloadsConfigured && (
              <span className="font-display text-[9px] text-neon-pink animate-flicker">
                ▸ MODO DEMO
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DOWNLOADS.map((d) => (
              <button
                key={d.filename}
                onClick={() => handleDownload(d.url, d.filename)}
                className="text-left p-4 rounded-lg border border-border bg-card/40 hover:bg-card/70 hover:border-neon/60 hover:shadow-[0_0_20px_color-mix(in_oklab,var(--neon)_25%,transparent)] transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-2xl mb-1">{d.icon}</p>
                    <p className="font-display text-[10px] text-neon">{d.os}</p>
                  </div>
                  <span className="text-neon-pink group-hover:translate-y-1 transition-transform">↓</span>
                </div>
                <p className="text-[11px] text-foreground font-mono">{d.filename}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{d.size} · {d.arch}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="glass rounded-xl p-6 mb-6">
          <p className="font-display text-[10px] text-neon mb-4">▸ PRÓXIMOS_PASOS</p>
          <ol className="space-y-3 text-xs text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-display text-neon-pink">01</span>
              <span>Descarga el archivo correspondiente a tu sistema operativo.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-neon-pink">02</span>
              <span>Ábrelo y sigue las instrucciones de instalación (en Mac, arrastra a Aplicaciones; en Windows, doble click).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-neon-pink">03</span>
              <span>Al primer arranque, pega tu código de licencia para activar todas las mascotas.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-display text-neon-pink">04</span>
              <span>¡Disfruta de tu compañero pixel!</span>
            </li>
          </ol>
        </div>

        {/* Support */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>¿Algún problema? Escríbenos a <span className="text-neon">hello@pixelpets.app</span></p>
          <Link to="/" className="inline-block mt-4 font-display text-[10px] text-neon-pink hover:underline">
            ← VOLVER_AL_INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
