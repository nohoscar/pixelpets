import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PetShowcase } from "@/components/PetShowcase";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { useGameState } from "@/hooks/useGameState";

export const Route = createFileRoute("/buy")({
  component: BuyPage,
  head: () => ({
    meta: [
      { title: "Comprar PixelPets · App de escritorio $4.99" },
      { name: "description", content: "Pago único $4.99 USD. 42 mascotas pixel art en tu escritorio. Windows, Mac y Linux. Updates gratis de por vida." },
      { property: "og:title", content: "PixelPets Desktop · $4.99 USD" },
      { property: "og:description", content: "Tu mascota pixel art viviendo en tu escritorio. Pago único, sin suscripciones." },
    ],
  }),
});

const FEATURES = [
  { icon: "🐾", title: "42 mascotas", desc: "Pikachu, BB-8, Cthulhu, Xenomorph, Slime, Cabra negra... todas incluidas." },
  { icon: "🗡️", title: "29 cursores", desc: "Lightsaber, BFG 9000, Keyblade, Mjolnir, Pickaxe... con sonidos únicos." },
  { icon: "🔋", title: "Reactivo a tu PC", desc: "Tu mascota detecta batería baja, modo sobremesa y reacciona en tiempo real." },
  { icon: "💬", title: "Pensamientos vivos", desc: "Cientos de frases temáticas. Pikachu dice 'pika', Dalek grita 'EXTERMINATE'." },
  { icon: "👻", title: "Ventana invisible", desc: "Sin barra ni marco. Solo tu mascotita flotando, sin estorbar al hacer click." },
  { icon: "♾️", title: "Updates de por vida", desc: "Pago único $4.99. Nuevas mascotas y cursores gratis para siempre." },
];

const COMPARISON = [
  { feature: "Mascotas disponibles", free: "5 básicas", pro: "Las 42 ★" },
  { feature: "Cursores con sonido", free: "5 básicos", pro: "Los 29 ★" },
  { feature: "Funciona en escritorio", free: "—", pro: "✓ Win/Mac/Linux" },
  { feature: "Sin marca de agua", free: "—", pro: "✓" },
  { feature: "Reacción a batería", free: "Solo demo", pro: "✓ Tiempo real" },
  { feature: "Updates futuros", free: "—", pro: "✓ De por vida" },
];

function BuyPage() {
  const gameState = useGameState();
  return (
    <I18nProvider initialLocale={gameState.locale}>
      <BuyPageContent />
    </I18nProvider>
  );
}

function BuyPageContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    // Free beta — skip payment, go straight to download
    const purchaseData = JSON.stringify({
      email,
      licenseKey: "BETA-FREE-TEST-MODE",
      ts: Date.now(),
    });
    const token = btoa(purchaseData)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    navigate({ to: "/download/$token", params: { token } });
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <SiteHeader />

      {/* Mobile banner (Task 14.3) */}
      {isMobile && (
        <div className="mx-4 mt-4 p-4 rounded-lg glass border border-neon-pink/40 text-center">
          <p className="font-display text-[10px] text-neon-pink mb-2">{t("buy.mobile.banner")}</p>
          <Link
            to="/"
            className="inline-block px-5 py-3 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all min-h-[44px]"
          >
            {t("buy.mobile.demo")}
          </Link>
        </div>
      )}

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-6">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-start">
          <div className="min-w-0">
            <p className="font-display text-[10px] text-neon-pink animate-flicker mb-3">
              ▸ DESKTOP_EDITION · v2.0 · LIFETIME
            </p>
            <h1 className="font-display text-2xl md:text-4xl lg:text-5xl leading-tight mb-5">
              <span className="text-neon">Tu mascota</span>
              <br />
              <span className="text-foreground">vive en tu</span>{" "}
              <span className="text-neon-pink whitespace-nowrap">escritorio.</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6 leading-relaxed">
              Mientras trabajas, programas o ves Netflix, tu mascotita pixel camina, duerme,
              come y reacciona a tu batería. Sin ventanas. Sin notificaciones. Solo compañía.
            </p>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <span style={{ color: "oklch(0.85 0.18 90)" }}>★★★★★</span>
                <span>4.9 / 5</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-neon">▸</span> 12,847 descargas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-neon-pink">▸</span> 42 mascotas · 29 cursores
              </span>
            </div>

            <PetShowcase />
          </div>

          {/* PRICING CARD */}
          <div className="md:sticky md:top-20">
            <div className="relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-display bg-neon-pink text-background z-10 whitespace-nowrap">
                ▸ MÁS VENDIDO
              </span>
              <div className="glass rounded-xl p-6 border-2 border-neon animate-pulse-glow">
                <div className="flex items-center justify-between mb-5 mt-1">
                  <p className="font-display text-[10px] text-neon">PIXELPETS · DESKTOP</p>
                  <span className="px-2 py-0.5 rounded text-[9px] font-display bg-neon-pink/20 text-neon-pink border border-neon-pink/40">
                    LIFETIME
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-5xl text-neon">GRATIS</span>
                  <span className="text-sm text-muted-foreground line-through">$4.99</span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-6">
                  Beta abierta · Prueba todo gratis
                </p>

                <ul className="space-y-2 text-xs text-muted-foreground mb-6">
                  <li className="flex gap-2"><span className="text-neon">✓</span> 42 mascotas + 29 cursores</li>
                  <li className="flex gap-2"><span className="text-neon">✓</span> Win · Mac · Linux</li>
                  <li className="flex gap-2"><span className="text-neon">✓</span> Updates gratis de por vida</li>
                  <li className="flex gap-2"><span className="text-neon">✓</span> Soporte por email</li>
                  <li className="flex gap-2"><span className="text-neon">✓</span> Sin DRM, sin teléfono a casa</li>
                </ul>

                <form onSubmit={handleCheckout} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="font-display text-[9px] text-muted-foreground block mb-1.5">
                      ▸ EMAIL_PARA_LICENCIA
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full px-3 py-2.5 rounded-md bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-neon focus:shadow-[0_0_12px_color-mix(in_oklab,var(--neon)_40%,transparent)] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full px-4 py-3.5 rounded-md bg-primary text-primary-foreground font-display text-[11px] hover:shadow-[0_0_28px_var(--primary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "▸ PROCESANDO..." : "▸ DESCARGAR GRATIS"}
                  </button>

                  {error && (
                    <p className="text-[10px] text-center text-destructive">
                      ⚠ {error}
                    </p>
                  )}
                  <p className="text-[10px] text-center text-muted-foreground">
                    🔒 Pago seguro · Reembolso 14 días
                  </p>
                </form>

                <div className="mt-5 pt-4 border-t border-border">
                  <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground/80">
                    <span>VISA</span>·<span>Mastercard</span>·<span>Apple Pay</span>·<span>Google Pay</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[10px] text-center text-muted-foreground/70">
              <span className="text-neon-pink/70">demo:</span> activa Lovable Payments + Plan Pro para cobrar de verdad
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <p className="font-display text-[10px] text-neon-pink mb-2">▸ FEATURES</p>
        <h2 className="font-display text-xl md:text-2xl text-foreground mb-6">
          Lo que hace especial a <span className="text-neon">PixelPets</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-lg p-5 hover:border-neon/60 transition-colors">
              <p className="text-2xl mb-2">{f.icon}</p>
              <p className="font-display text-[11px] text-neon mb-1.5">{f.title}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <p className="font-display text-[10px] text-neon-pink mb-2">▸ COMPARATIVA</p>
        <h2 className="font-display text-xl md:text-2xl text-foreground mb-6">
          Demo web vs <span className="text-neon-pink">PixelPets Desktop</span>
        </h2>
        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] font-display text-[10px] border-b border-border">
            <div className="px-4 py-3 text-muted-foreground">FEATURE</div>
            <div className="px-4 py-3 text-muted-foreground text-center border-l border-border">FREE WEB</div>
            <div className="px-4 py-3 text-neon-pink text-center border-l border-border bg-neon-pink/5">PRO $4.99</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-[1.5fr_1fr_1fr] text-xs ${i % 2 === 0 ? "bg-card/20" : ""}`}>
              <div className="px-4 py-3 text-foreground">{row.feature}</div>
              <div className="px-4 py-3 text-muted-foreground text-center border-l border-border">{row.free}</div>
              <div className="px-4 py-3 text-neon text-center border-l border-border bg-neon-pink/5 font-display text-[10px]">{row.pro}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10">
        <p className="font-display text-[10px] text-neon-pink mb-2">▸ FAQ</p>
        <h2 className="font-display text-xl md:text-2xl text-foreground mb-6">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {[
            { q: "¿Realmente es pago único?", a: "Sí. Pagas $4.99 una vez y la app es tuya para siempre, con todas las actualizaciones futuras incluidas." },
            { q: "¿Funciona sin internet?", a: "Sí. Una vez instalada, la app funciona 100% offline. No envía datos a ningún servidor." },
            { q: "¿Puedo usarla en varios ordenadores?", a: "Sí. Tu licencia te permite instalar la app en hasta 3 dispositivos personales." },
            { q: "¿Cómo recibo la app?", a: "Tras el pago, te llega un email inmediato con el link de descarga para tu sistema operativo + tu código de licencia." },
            { q: "¿Y si no me gusta?", a: "Reembolso del 100% durante los primeros 14 días. Solo escríbenos a hello@pixelpets.app sin preguntas." },
          ].map((item) => (
            <details key={item.q} className="glass rounded-lg p-4 group hover:border-neon/40 transition-colors">
              <summary className="cursor-pointer font-display text-[11px] text-foreground flex justify-between items-center list-none">
                {item.q}
                <span className="text-neon-pink group-open:rotate-45 transition-transform text-lg">+</span>
              </summary>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-12 text-center">
        <h2 className="font-display text-2xl md:text-3xl mb-4">
          <span className="text-neon">¿Listo</span> para tener compañía?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Una mascotita pixel cuesta menos que un café ☕
        </p>
        <Link
          to="/buy"
          hash="top"
          className="inline-block px-8 py-4 rounded-md bg-primary text-primary-foreground font-display text-xs hover:shadow-[0_0_32px_var(--primary)] transition-all animate-pulse-glow"
        >
          ▸ COMPRAR AHORA · $4.99
        </Link>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-background/90 border-t border-border p-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-[9px] text-muted-foreground">{t("buy.mobile.sticky.label")}</p>
          <p className="font-display text-base text-neon-pink">$4.99 USD</p>
        </div>
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] min-h-[44px] flex items-center"
        >
          {t("buy.mobile.sticky.button")}
        </a>
      </div>
    </main>
  );
}
