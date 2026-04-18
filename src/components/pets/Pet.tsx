import { useEffect, useRef, useState } from "react";
import { PETS, type PetKind } from "./petSprites";
import { randomThought, moodThought } from "./petThoughts";
import { playSound } from "@/lib/audio";
import type { SystemAwareness } from "@/hooks/useSystemAwareness";

export type PetStats = {
  hunger: number;    // 0 (hambriento) → 100 (lleno)
  happiness: number; // 0 (triste) → 100 (feliz)
  energy: number;    // 0 (cansado) → 100 (lleno de energía)
};

type PetState = "walk" | "idle" | "jump" | "drag" | "sleep" | "faint";

interface PetProps {
  id: string;
  kind: PetKind;
  initialX?: number;
  initialY?: number;
  cursorRef: React.MutableRefObject<{ x: number; y: number } | null>;
  followCursor: boolean;
  onRemove: (id: string) => void;
  /** Optional: lift state up so the parent can show stat bars */
  onStatsChange?: (stats: PetStats) => void;
  /** Imperative actions: parent gets a function to call */
  actionRef?: React.MutableRefObject<{
    feed: () => void;
    play: () => void;
    sleep: () => void;
  } | null>;
  /** System signals: battery, idle, time of day */
  awareness?: SystemAwareness;
}

export function Pet({
  id, kind, initialX, initialY, cursorRef, followCursor, onRemove,
  onStatsChange, actionRef, awareness,
}: PetProps) {
  const def = PETS[kind];
  const size = def.size;

  const [pos, setPos] = useState(() => ({
    x: initialX ?? Math.random() * (window.innerWidth - size - 40) + 20,
    y: initialY ?? Math.random() * (window.innerHeight - size - 200) + 120,
  }));
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [state, setState] = useState<PetState>("walk");
  const [step, setStep] = useState(0);
  const [bubble, setBubble] = useState<string | null>(null);
  const [stats, setStats] = useState<PetStats>({ hunger: 80, happiness: 80, energy: 80 });

  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const stateRef = useRef<PetState>("walk");
  stateRef.current = state;
  const posRef = useRef(pos);
  posRef.current = pos;
  const dragOffsetRef = useRef<{ dx: number; dy: number } | null>(null);

  // Notify parent when stats change
  useEffect(() => { onStatsChange?.(stats); }, [stats, onStatsChange]);

  // Decay stats over time (every 6s)
  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => {
        const next = {
          hunger: Math.max(0, s.hunger - 2),
          happiness: Math.max(0, s.happiness - 1.5),
          energy: stateRef.current === "sleep"
            ? Math.min(100, s.energy + 6)
            : Math.max(0, s.energy - 1),
        };
        return next;
      });
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Pick random target periodically
  useEffect(() => {
    const pickTarget = () => {
      if (followCursor && cursorRef.current) {
        targetRef.current = { ...cursorRef.current };
      } else {
        targetRef.current = {
          x: Math.random() * (window.innerWidth - size - 40) + 20,
          y: Math.random() * (window.innerHeight - size - 160) + 100,
        };
      }
    };
    pickTarget();
    const id = setInterval(() => {
      if (stateRef.current === "drag" || stateRef.current === "sleep") return;
      if (Math.random() < 0.25) setState("idle");
      else setState("walk");
      pickTarget();
    }, 2500 + Math.random() * 2500);
    return () => clearInterval(id);
  }, [cursorRef, followCursor, size]);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 180);
    return () => clearInterval(id);
  }, []);

  // Movement loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const st = stateRef.current;
      if (st === "drag" || st === "sleep" || st === "idle" || st === "faint") {
        raf = requestAnimationFrame(tick);
        return;
      }
      const target = followCursor && cursorRef.current ? cursorRef.current : targetRef.current;
      if (target) {
        const speedBase = 1.4;
        const speed = stats.energy < 20 ? speedBase * 0.4 : speedBase;
        const cx = posRef.current.x + size / 2;
        const cy = posRef.current.y + size / 2;
        const dx = target.x - cx;
        const dy = target.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
          setPos({
            x: posRef.current.x + (dx / dist) * speed,
            y: posRef.current.y + (dy / dist) * speed,
          });
          setFacing(dx > 0 ? "right" : "left");
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cursorRef, followCursor, size, stats.energy]);

  // Drag handling: window-level so cursor leaving the pet doesn't break it
  useEffect(() => {
    if (state !== "drag") return;
    const move = (e: MouseEvent) => {
      const off = dragOffsetRef.current;
      if (!off) return;
      setPos({ x: e.clientX - off.dx, y: e.clientY - off.dy });
    };
    const up = () => {
      setState("walk");
      dragOffsetRef.current = null;
      playSound("pop");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [state]);

  const speak = (msg: string, ms = 1800) => {
    setBubble(msg);
    setTimeout(() => setBubble(null), ms);
  };

  // Idle thoughts: every ~14-26s pick a random thought (themed or mood-based).
  // Skipped while sleeping/fainted/dragging to not be annoying.
  const statsRef = useRef(stats);
  statsRef.current = stats;
  useEffect(() => {
    const tick = () => {
      const st = stateRef.current;
      const s = statsRef.current;
      if (st === "sleep" || st === "drag" || st === "faint") return;
      // 50% chance to skip — feels more natural, less spammy
      if (Math.random() < 0.5) return;
      // Pick mood line if a stat is in trouble, else themed/universal
      let msg: string;
      if (s.hunger < 30 && Math.random() < 0.6) msg = moodThought("hungry");
      else if (s.happiness < 30 && Math.random() < 0.6) msg = moodThought("sad");
      else if (s.energy < 25 && Math.random() < 0.6) msg = moodThought("tired");
      else if (s.happiness > 80 && s.hunger > 60 && Math.random() < 0.4) msg = moodThought("happy");
      else msg = randomThought(kind);
      setBubble(msg);
      setTimeout(() => setBubble(null), 2400);
    };
    // Initial delay then random interval
    const first = setTimeout(tick, 4000 + Math.random() * 4000);
    const id = setInterval(tick, 14000 + Math.random() * 12000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [kind]);

  // Imperative actions exposed to parent
  useEffect(() => {
    if (!actionRef) return;
    actionRef.current = {
      feed: () => {
        setStats((s) => ({ ...s, hunger: Math.min(100, s.hunger + 35) }));
        playSound("eat");
        speak("¡ñam!");
      },
      play: () => {
        setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 35), energy: Math.max(0, s.energy - 10) }));
        playSound("happy");
        speak("¡yay!");
        setState("jump");
        setTimeout(() => setState("walk"), 500);
      },
      sleep: () => {
        if (stateRef.current === "sleep") {
          setState("walk");
          playSound("pop");
        } else {
          setState("sleep");
          playSound("snore");
          speak("zzz...");
        }
      },
    };
  }, [actionRef]);

  // System awareness reactions
  const lastReactionRef = useRef<{
    tier: string; charging: boolean | null; faint: boolean; idle: boolean; tod: string; initialized: boolean;
  }>({
    tier: "full", charging: null, faint: false, idle: false,
    tod: awareness?.timeOfDay ?? "day", initialized: false,
  });
  useEffect(() => {
    if (!awareness) return;
    const r = lastReactionRef.current;

    // ---- Battery: linear mapping → happiness/energy targets ----
    // full: hap=85, en=85   good: hap=70, en=70
    // low:  hap=40, en=30   critical: hap=15, en=10 + faint
    const targets: Record<string, { hap: number; en: number }> = {
      full:     { hap: 85, en: 85 },
      good:     { hap: 70, en: 70 },
      low:      { hap: 40, en: 30 },
      critical: { hap: 15, en: 10 },
    };

    // First mount: snap stats toward battery target so it doesn't fight
    if (!r.initialized) {
      r.initialized = true;
      r.tier = awareness.batteryTier;
      r.charging = awareness.batteryCharging;
      const t = targets[awareness.batteryTier];
      setStats((s) => ({
        ...s,
        happiness: Math.round((s.happiness + t.hap) / 2),
        energy: Math.round((s.energy + t.en) / 2),
      }));
    }

    // Tier transition → smoothly nudge stats toward target
    if (awareness.batteryTier !== r.tier) {
      const prev = r.tier;
      r.tier = awareness.batteryTier;
      const t = targets[awareness.batteryTier];
      setStats((s) => ({
        ...s,
        happiness: Math.round((s.happiness * 0.4) + (t.hap * 0.6)),
        energy: Math.round((s.energy * 0.4) + (t.en * 0.6)),
      }));
      if (awareness.batteryTier === "low" && prev !== "critical") {
        playSound("sad");
        speak("estoy cansad@...");
      } else if (awareness.batteryTier === "critical") {
        playSound("sad");
        speak("¡me desmayo!");
      } else if ((awareness.batteryTier === "full" || awareness.batteryTier === "good") &&
                 (prev === "low" || prev === "critical")) {
        playSound("happy");
        speak("¡recuperad@!");
      }
    }

    // Critical → faint dramatic state
    if (awareness.criticalBattery && !r.faint && stateRef.current !== "faint") {
      r.faint = true;
      setState("faint");
      // Recover after 4s, then go to sleep
      setTimeout(() => {
        if (stateRef.current === "faint") {
          setState("sleep");
          speak("zzz...");
        }
      }, 4000);
    } else if (!awareness.criticalBattery && r.faint) {
      r.faint = false;
      if (stateRef.current === "faint" || stateRef.current === "sleep") {
        setState("walk");
      }
    }

    // Charger plug/unplug reactions (only if battery present)
    if (awareness.hasBattery && r.charging !== null && r.charging !== awareness.batteryCharging) {
      if (awareness.batteryCharging) {
        // Plugged in → celebrate
        playSound("happy");
        speak("¡yay! ⚡");
        setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 20) }));
        if (stateRef.current !== "drag" && stateRef.current !== "faint") {
          setState("jump");
          setTimeout(() => setState("walk"), 500);
        }
      } else {
        // Unplugged → worried
        playSound("sad");
        speak("¿a dónde vas?");
        setStats((s) => ({ ...s, happiness: Math.max(0, s.happiness - 8) }));
      }
    }
    r.charging = awareness.batteryCharging;

    // Idle → sleep (skip if fainted)
    if (awareness.isIdle && stateRef.current !== "sleep" &&
        stateRef.current !== "drag" && stateRef.current !== "faint") {
      if (!r.idle) {
        r.idle = true;
        setState("sleep");
        playSound("snore");
        speak("zzz...");
      }
    } else if (!awareness.isIdle && r.idle) {
      r.idle = false;
      if (stateRef.current === "sleep") {
        setState("walk");
        playSound("happy");
        speak("¡volviste!");
      }
    }

    // Time of day → mood adjust on transition
    if (awareness.timeOfDay !== r.tod) {
      r.tod = awareness.timeOfDay;
      if (awareness.timeOfDay === "night") {
        setStats((s) => ({ ...s, energy: Math.max(0, s.energy - 10) }));
      } else if (awareness.timeOfDay === "morning") {
        setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 10) }));
      }
    }
  }, [awareness]);


  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left button
    e.preventDefault();
    dragOffsetRef.current = {
      dx: e.clientX - posRef.current.x,
      dy: e.clientY - posRef.current.y,
    };
    setState("drag");
    playSound("click");
  };

  const handleClick = (e: React.MouseEvent) => {
    // distinguish click vs drag: if barely moved, treat as click
    if (state === "drag") return;
    e.stopPropagation();
    const phrases = ["¡Hola!", "♥", "*nya*", "play?", "boop!", "✨"];
    speak(phrases[Math.floor(Math.random() * phrases.length)]);
    setState("jump");
    setTimeout(() => setState("walk"), 500);
    setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 5) }));
    playSound("pop");
  };

  // Need icons over the pet
  const needIcons: { icon: string; label: string }[] = [];
  if (stats.hunger < 30) needIcons.push({ icon: "🍖", label: "hambre" });
  if (stats.happiness < 30 && state !== "faint") needIcons.push({ icon: "💔", label: "triste" });
  if (stats.energy < 20 && state !== "faint") needIcons.push({ icon: "💤", label: "cansado" });
  if (awareness?.batteryTier === "critical") needIcons.push({ icon: "🪫", label: "batería crítica" });
  else if (awareness?.batteryTier === "low") needIcons.push({ icon: "🔋", label: "batería baja" });
  if (awareness?.batteryCharging && awareness.hasBattery) needIcons.push({ icon: "⚡", label: "cargando" });
  if (awareness?.timeOfDay === "night" && stats.energy < 60) needIcons.push({ icon: "🌙", label: "noche" });

  const isFainted = state === "faint";

  return (
    <div
      className="absolute select-none pointer-events-auto"
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        zIndex: 30,
        cursor: state === "drag" ? "grabbing" : "grab",
        transition: state === "jump" || isFainted ? "transform 0.5s cubic-bezier(.5,-0.5,.5,1.5)" : undefined,
        transform: state === "jump"
          ? "translateY(-30px)"
          : isFainted ? "rotate(90deg)" : undefined,
        opacity: isFainted ? 0.55 : 1,
        filter: isFainted ? "grayscale(0.6) brightness(0.8)" : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemove(id);
      }}
      title={`${def.name} — arrastra, click para jugar`}
    >
      {/* need icons */}
      {needIcons.length > 0 && state !== "sleep" && !isFainted && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex gap-1 animate-bob">
          {needIcons.map((n) => (
            <span key={n.label} className="text-base drop-shadow" title={n.label}>{n.icon}</span>
          ))}
        </div>
      )}
      {/* sleep indicator */}
      {state === "sleep" && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-display text-xs text-neon animate-bob">
          z z Z
        </div>
      )}
      {/* faint indicator: spinning stars */}
      {isFainted && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-display text-base animate-spin">
          ✦ ✧ ✦
        </div>
      )}
      {bubble && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md glass text-xs font-display text-neon whitespace-nowrap animate-in fade-in zoom-in">
          {bubble}
        </div>
      )}
      <div className={state === "idle" || state === "sleep" ? "animate-bob w-full h-full" : "w-full h-full"}>
        {def.render(facing, step)}
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/40 blur-sm"
        style={{ bottom: -4, width: size * 0.6, height: 6 }}
      />
    </div>
  );
}
