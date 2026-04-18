import { Link } from "@tanstack/react-router";

interface SiteHeaderProps {
  showBuyCta?: boolean;
}

export function SiteHeader({ showBuyCta = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:animate-bob">🐾</span>
          <span className="font-display text-[11px] text-neon group-hover:text-neon-pink transition-colors">
            PIXELPETS
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-3">
          <Link
            to="/"
            className="px-2.5 py-1.5 font-display text-[9px] text-muted-foreground hover:text-neon transition-colors"
            activeOptions={{ exact: true }}
            activeProps={{ className: "px-2.5 py-1.5 font-display text-[9px] text-neon" }}
          >
            ▸ DEMO
          </Link>
          <Link
            to="/buy"
            className="px-2.5 py-1.5 font-display text-[9px] text-muted-foreground hover:text-neon transition-colors"
            activeProps={{ className: "px-2.5 py-1.5 font-display text-[9px] text-neon" }}
          >
            ▸ COMPRAR
          </Link>
          {showBuyCta && (
            <Link
              to="/buy"
              className="ml-1 md:ml-2 px-3 py-1.5 rounded bg-primary text-primary-foreground font-display text-[9px] hover:shadow-[0_0_18px_var(--primary)] transition-all"
            >
              ▸ GRATIS
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
