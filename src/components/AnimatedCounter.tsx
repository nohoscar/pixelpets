import { useEffect, useRef, useState } from "react";

interface CounterItem {
  value: number;
  label: string;
  icon: string;
}

function Counter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref} className="font-display text-2xl md:text-4xl text-neon tabular-nums">{display}</span>;
}

const STATS: CounterItem[] = [
  { value: 62, label: "MASCOTAS", icon: "🐾" },
  { value: 5, label: "MUNDOS", icon: "🗺️" },
  { value: 13, label: "JUEGOS", icon: "🕹️" },
  { value: 15, label: "COMIDAS", icon: "🍽️" },
];

export function AnimatedCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {STATS.map((s) => (
        <div key={s.label} className="glass rounded-xl p-4 text-center group hover:border-neon/60 transition-all">
          <span className="text-2xl mb-2 block group-hover:animate-bob">{s.icon}</span>
          <Counter value={s.value} />
          <p className="font-display text-[8px] text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
