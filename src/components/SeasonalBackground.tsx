import { getSeasonalBackground } from "@/lib/seasons";

export function SeasonalBackground() {
  const bg = getSeasonalBackground();
  if (!bg) return null;

  return (
    <div
      className="seasonal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: bg.gradient,
        overflow: "hidden",
      }}
    >
      {bg.particles.map((particle, i) => (
        <span
          key={i}
          className={`seasonal-particle seasonal-particle--${bg.animationName}`}
          style={{
            position: "absolute",
            left: `${8 + i * 9}%`,
            top: `-5%`,
            fontSize: `${14 + (i % 3) * 6}px`,
            animationDelay: `${i * 0.7}s`,
            opacity: 0.7,
          }}
        >
          {particle}
        </span>
      ))}
    </div>
  );
}
