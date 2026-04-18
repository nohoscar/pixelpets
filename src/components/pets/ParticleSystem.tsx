import { useEffect, useState, useRef } from "react";

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

function generateParticles(config: ParticleConfig): Particle[] {
  const particles: Particle[] = [];
  const colors = COLORS[config.type];
  for (let i = 0; i < config.count; i++) {
    const angle = (Math.PI * 2 * i) / config.count + (Math.random() - 0.5) * 0.5;
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

function StarSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size * 2} height={size * 2} viewBox="0 0 10 10">
      <polygon
        points="5,0 6.2,3.5 10,3.8 7.2,6.2 8,10 5,7.8 2,10 2.8,6.2 0,3.8 3.8,3.5"
        fill={color}
      />
    </svg>
  );
}

function FoodSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size * 2} height={size * 2} viewBox="0 0 10 10">
      <circle cx="5" cy="5" r="4" fill={color} />
    </svg>
  );
}

function ConfettiSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size * 2} height={size * 2} viewBox="0 0 10 10">
      <rect x="2" y="2" width="6" height="6" rx="1" fill={color} transform={`rotate(${Math.random() * 360} 5 5)`} />
    </svg>
  );
}

export function ParticleSystem({ particles: configs }: { particles: ParticleConfig[] }) {
  const [activeParticles, setActiveParticles] = useState<Particle[]>([]);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (configs.length > prevLengthRef.current) {
      // New config added
      const newConfig = configs[configs.length - 1];
      const newParticles = generateParticles(newConfig);
      setActiveParticles((prev) => [...prev, ...newParticles]);

      // Remove after duration
      setTimeout(() => {
        setActiveParticles((prev) =>
          prev.filter((p) => !newParticles.some((np) => np.id === p.id))
        );
      }, newConfig.duration);
    }
    prevLengthRef.current = configs.length;
  }, [configs]);

  if (activeParticles.length === 0) return null;

  return (
    <>
      {activeParticles.map((p) => {
        const ParticleSvg = p.type === "stars" ? StarSvg : p.type === "food" ? FoodSvg : ConfettiSvg;
        return (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              animation: `particle-fly ${p.duration}ms ease-out forwards`,
              ["--dx" as string]: `${p.dx}px`,
              ["--dy" as string]: `${p.dy}px`,
            }}
          >
            <ParticleSvg color={p.color} size={p.size} />
          </div>
        );
      })}
    </>
  );
}
