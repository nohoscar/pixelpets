import { useEffect, useRef, useMemo } from "react";

export interface ParticleConfig {
  type: "stars" | "food" | "confetti";
  count: number;
  duration: number;
  origin: { x: number; y: number };
}

interface Particle {
  id: string;
  type: ParticleConfig["type"];
  x: number;
  y: number;
  dx: number;
  dy: number;
  duration: number;
  color: string;
  size: number;
}

const COLORS = {
  stars: ["#ffd700", "#ffec8b", "#fff8dc", "#fffacd"],
  food: ["#ff6b6b", "#ffa07a", "#ff7f50", "#ff4500"],
  confetti: ["#ff69b4", "#00ff88", "#00bfff", "#ffd700", "#ff4500", "#9b59b6", "#1abc9c"],
};

const MAX_ACTIVE_PARTICLES = 20;

function generateParticles(config: ParticleConfig): Particle[] {
  const particles: Particle[] = [];
  const colors = COLORS[config.type];
  const count = Math.min(config.count, MAX_ACTIVE_PARTICLES);
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 20 + Math.random() * 30;
    particles.push({
      id: `${config.type}-${Date.now()}-${i}`,
      type: config.type,
      x: config.origin.x,
      y: config.origin.y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed - (config.type === "food" ? 30 : 0),
      duration: config.duration,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: config.type === "confetti" ? 3 + Math.random() * 3 : 2 + Math.random() * 2,
    });
  }
  return particles;
}

// CSS-only particle styles injected once
const STYLE_ID = "particle-system-styles";
function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .particle-item {
      position: absolute;
      pointer-events: none;
      will-change: transform, opacity;
      animation-fill-mode: forwards;
    }
    @keyframes particle-burst {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      100% { transform: translate(var(--pdx), var(--pdy)) scale(0.3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function ParticleSvg({ type, color, size }: { type: string; color: string; size: number }) {
  if (type === "stars") {
    return (
      <svg width={size * 2} height={size * 2} viewBox="0 0 10 10">
        <polygon
          points="5,0 6.2,3.5 10,3.8 7.2,6.2 8,10 5,7.8 2,10 2.8,6.2 0,3.8 3.8,3.5"
          fill={color}
        />
      </svg>
    );
  }
  if (type === "food") {
    return (
      <svg width={size * 2} height={size * 2} viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" fill={color} />
      </svg>
    );
  }
  return (
    <svg width={size * 2} height={size * 2} viewBox="0 0 10 10">
      <rect x="2" y="2" width="6" height="6" rx="1" fill={color} transform={`rotate(${Math.random() * 360} 5 5)`} />
    </svg>
  );
}

export function ParticleSystem({ particles: configs }: { particles: ParticleConfig[] }) {
  const prevLengthRef = useRef(0);
  const activeRef = useRef<Particle[]>([]);

  // Ensure CSS is injected
  useEffect(() => { ensureStyles(); }, []);

  // Generate particles only when new configs are added
  const currentParticles = useMemo(() => {
    if (configs.length > prevLengthRef.current) {
      const newConfig = configs[configs.length - 1];
      const newParticles = generateParticles(newConfig);
      // Enforce max particle limit
      const combined = [...activeRef.current, ...newParticles];
      activeRef.current = combined.slice(-MAX_ACTIVE_PARTICLES);
    }
    prevLengthRef.current = configs.length;
    return activeRef.current;
  }, [configs]);

  // Clean up expired particles via timeout (no DOM removal, CSS handles opacity: 0)
  useEffect(() => {
    if (configs.length === 0) return;
    const lastConfig = configs[configs.length - 1];
    const timer = setTimeout(() => {
      activeRef.current = [];
    }, lastConfig.duration + 50);
    return () => clearTimeout(timer);
  }, [configs.length]);

  if (currentParticles.length === 0) return null;

  return (
    <>
      {currentParticles.map((p) => (
        <div
          key={p.id}
          className="particle-item"
          style={{
            left: p.x,
            top: p.y,
            ["--pdx" as string]: `${p.dx}px`,
            ["--pdy" as string]: `${p.dy}px`,
            animation: `particle-burst ${p.duration}ms ease-out forwards`,
          }}
        >
          <ParticleSvg type={p.type} color={p.color} size={p.size} />
        </div>
      ))}
    </>
  );
}
