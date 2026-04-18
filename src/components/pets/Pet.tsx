import { useEffect, useRef, useState, useCallback } from "react";
import { PETS, type PetKind } from "./petSprites";
import { randomThought, moodThought } from "./petThoughts";
import { playSound } from "@/lib/audio";
import type { SystemAwareness } from "@/hooks/useSystemAwareness";
import type { GameState } from "@/hooks/useGameState";
import { AccessoryRenderer } from "./AccessoryRenderer";
import { ParticleSystem, type ParticleConfig } from "./ParticleSystem";

export type PetStats = {
  hunger: number;    // 0 (hambriento) → 100 (lleno)
  happiness: number; // 0 (triste) → 100 (feliz)
  energy: number;    // 0 (cansado) → 100 (lleno de energía)
  xp: number;
  level: number;
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
  onStatsChange?: (stats: PetStats) => void;
  actionRef?: React.MutableRefObject<{
    feed: () => void;
    play: () => void;
    sleep: () => void;
  } | null>;
  awareness?: SystemAwareness;
  gameState?: GameState;
  paused?: boolean;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  onPetClick?: () => void;
  speakRef?: { current: ((msg: string) => void) | null };
}

export function Pet({
  id, kind, initialX, initialY, cursorRef, followCursor, onRemove,
  onStatsChange, actionRef, awareness, gameState, paused, onPositionChange, onPetClick,
  speakRef,
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
  const [stats, setStats] = useState<PetStats>({ hunger: 80, happiness: 80, energy: 80, xp: gameState?.xp ?? 0, level: gameState?.level ?? 1 });

  const [particles, setParticles] = useState<ParticleConfig[]>([]);
  const lastLevelRef = useRef(gameState?.level ?? 1);

  const targetRef = useRef<{ x: number; y: number } | null>(null);
  const stateRef = useRef<PetState>("walk");
  stateRef.current = state;
  const posRef = useRef(pos);
  posRef.current = pos;
  const dragOffsetRef = useRef<{ dx: number; dy: number } | null>(null);

  // Notify parent when stats change
  useEffect(() => { onStatsChange?.(stats); }, [stats, onStatsChange]);

  // Notify parent of position changes for interaction detection
  useEffect(() => { onPositionChange?.(pos); }, [pos, onPositionChange]);

  // Decay stats over time (every 6s)
  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => {
        const next: PetStats = {
          ...s,
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
      if (st === "drag" || st === "sleep" || st === "idle" || st === "faint" || paused) {
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
  }, [cursorRef, followCursor, size, stats.energy, paused]);

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

  // Expose speak to parent for interaction triggers
  useEffect(() => {
    if (speakRef) speakRef.current = (msg: string) => {
      speak(msg);
      // Also boost happiness by 3 for pet interactions
      setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 3) }));
    };
    return () => { if (speakRef) speakRef.current = null; };
  });

  // Particle emitter helper
  const emitParticles = useCallback((type: ParticleConfig["type"]) => {
    const configs: Record<ParticleConfig["type"], Omit<ParticleConfig, "origin">> = {
      stars: { type: "stars", count: 8, duration: 400 },
      food: { type: "food", count: 5, duration: 500 },
      confetti: { type: "confetti", count: 14, duration: 800 },
    };
    const cfg = configs[type];
    const p: ParticleConfig = { ...cfg, origin: { x: size / 2, y: size / 2 } };
    setParticles((prev) => [...prev, p]);
    setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, cfg.duration + 100);
  }, [size]);

  // Level-up detection
  useEffect(() => {
    if (!gameState) return;
    const currentLevel = gameState.level;
    if (currentLevel > lastLevelRef.current) {
      // Level up!
      setState("jump");
      playSound("happy");
      speak(`Level ${currentLevel}!`, 2500);
      emitParticles("confetti");
      setTimeout(() => setState("walk"), 500);
    }
    lastLevelRef.current = currentLevel;
    // Sync xp/level into stats for display
    setStats((s) => ({ ...s, xp: gameState.xp, level: gameState.level }));
  }, [gameState?.xp, gameState?.level, emitParticles]);

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
        emitParticles("food");
        if (gameState) {
          gameState.addXp(5);
          gameState.incrementFeedCount();
        }
      },
      play: () => {
        setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 35), energy: Math.max(0, s.energy - 10) }));
        playSound("happy");
        speak("¡yay!");
        setState("jump");
        emitParticles("stars");
        setTimeout(() => setState("walk"), 500);
        if (gameState) {
          gameState.addXp(8);
          gameState.incrementPlayCount();
        }
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
  }, [actionRef, gameState, emitParticles]);

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
    onPetClick?.();
    const phrases = ["¡Hola!", "♥", "*nya*", "play?", "boop!", "✨"];
    speak(phrases[Math.floor(Math.random() * phrases.length)]);
    setState("jump");
    emitParticles("stars");
    setTimeout(() => setState("walk"), 500);
    setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 5) }));
    playSound("pop");
    if (gameState) {
      gameState.addXp(2);
      gameState.incrementClickCount();
    }
  };

  // Touch interaction handlers (Task 14.2)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<number>(0);
  const touchDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    touchDraggingRef.current = false;

    // Double-tap detection
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double-tap → remove pet
      lastTapRef.current = 0;
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      onRemove(id);
      return;
    }
    lastTapRef.current = now;

    // Long-press timer (500ms) → enter drag
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      touchDraggingRef.current = true;
      dragOffsetRef.current = {
        dx: touch.clientX - posRef.current.x,
        dy: touch.clientY - posRef.current.y,
      };
      setState("drag");
      playSound("click");
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const start = touchStartRef.current;

    // Cancel long-press if moved > 10px
    if (start && longPressTimerRef.current) {
      const dist = Math.hypot(touch.clientX - start.x, touch.clientY - start.y);
      if (dist > 10) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    // If dragging, follow touch
    if (touchDraggingRef.current && dragOffsetRef.current) {
      e.preventDefault();
      setPos({
        x: touch.clientX - dragOffsetRef.current.dx,
        y: touch.clientY - dragOffsetRef.current.dy,
      });
    }
  };

  const handleTouchEnd = (_e: React.TouchEvent) => {
    // Clear long-press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (touchDraggingRef.current) {
      // End drag
      touchDraggingRef.current = false;
      setState("walk");
      dragOffsetRef.current = null;
      playSound("pop");
    } else {
      // Tap → same as click
      onPetClick?.();
      const phrases = ["¡Hola!", "♥", "*nya*", "play?", "boop!", "✨"];
      speak(phrases[Math.floor(Math.random() * phrases.length)]);
      setState("jump");
      emitParticles("stars");
      setTimeout(() => setState("walk"), 500);
      setStats((s) => ({ ...s, happiness: Math.min(100, s.happiness + 5) }));
      playSound("pop");
      if (gameState) {
        gameState.addXp(2);
        gameState.incrementClickCount();
      }
    }

    touchStartRef.current = null;
  };

  // Night Mode: auto-equip pajamas (task 3.3)
  const nightModeAppliedRef = useRef(false);
  useEffect(() => {
    if (!awareness || !gameState) return;
    const isNight = awareness.timeOfDay === "night";

    if (isNight && !nightModeAppliedRef.current && !gameState.nightModeManualOverride) {
      nightModeAppliedRef.current = true;
      gameState.equipAccessory("special", "pajamas");
      speak("zzz... pijama time", 2000);
    } else if (!isNight && nightModeAppliedRef.current) {
      nightModeAppliedRef.current = false;
      // Only unequip if pajamas are currently in special slot
      if (gameState.accessories.special === "pajamas") {
        gameState.equipAccessory("special", null);
      }
    }
  }, [awareness?.timeOfDay, gameState]);

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
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
      {/* Accessory overlay (task 2.8) */}
      {gameState && (
        <AccessoryRenderer
          equipped={gameState.accessories}
          facing={facing}
          petSize={size}
          petState={state}
        />
      )}
      {/* Particle effects (task 3.2) */}
      <ParticleSystem particles={particles} />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/40 blur-sm"
        style={{ bottom: -4, width: size * 0.6, height: 6 }}
      />
    </div>
  );
}
