import { useEffect, useState } from "react";

export type TimeOfDay = "morning" | "day" | "evening" | "night";
export type BatteryTier = "full" | "good" | "low" | "critical";

export interface SystemAwareness {
  /** true cuando el navegador soporta Battery API y devolvió datos */
  hasBattery: boolean;
  /** 0..1, null si el dispositivo no tiene batería (PC sobremesa) */
  batteryLevel: number | null;
  batteryCharging: boolean;
  /** Tier discreto basado en el nivel: full(>0.6), good(0.3-0.6), low(0.15-0.3), critical(<0.15) */
  batteryTier: BatteryTier;
  /** true cuando la batería < 20% y no está cargando */
  lowBattery: boolean;
  /** true cuando la batería < 10% y no está cargando */
  criticalBattery: boolean;
  /** segundos sin actividad de mouse/teclado */
  idleSeconds: number;
  /** true cuando idleSeconds > umbral (45s) */
  isIdle: boolean;
  /** true cuando la pestaña no está visible */
  isHidden: boolean;
  timeOfDay: TimeOfDay;
  hour: number;
  /** true cuando se detecta música (Spotify, YouTube, etc.) — solo en Electron */
  musicDetected: boolean;
}

interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}
interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

const IDLE_THRESHOLD = 45; // seg

function getTimeOfDay(h: number): TimeOfDay {
  if (h >= 5 && h < 9) return "morning";
  if (h >= 9 && h < 18) return "day";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

function getBatteryTier(level: number | null, charging: boolean): BatteryTier {
  // PC sin batería → tratamos como "cargando al 100%"
  if (level === null) return "full";
  if (charging) return level >= 0.6 ? "full" : "good";
  if (level >= 0.6) return "full";
  if (level >= 0.3) return "good";
  if (level >= 0.15) return "low";
  return "critical";
}

export function useSystemAwareness(): SystemAwareness {
  const [hasBattery, setHasBattery] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState(true);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [hour, setHour] = useState(() => new Date().getHours());
  const [musicDetected, setMusicDetected] = useState(false);

  // Music detection from Electron IPC
  useEffect(() => {
    const w = window as any;
    if (w.pixelpets?.onMusicUpdate) {
      w.pixelpets.onMusicUpdate((info: { musicDetected: boolean }) => {
        setMusicDetected(info.musicDetected);
      });
    }
  }, []);

  // Battery
  useEffect(() => {
    let mounted = true;
    const nav = navigator as NavigatorWithBattery;
    if (typeof nav.getBattery !== "function") return;
    nav.getBattery().then((batt) => {
      if (!mounted) return;
      setHasBattery(true);
      const update = () => {
        setBatteryLevel(batt.level);
        setBatteryCharging(batt.charging);
      };
      update();
      batt.addEventListener("levelchange", update);
      batt.addEventListener("chargingchange", update);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Idle detection — check every 3s, only update state when value changes
  useEffect(() => {
    let last = Date.now();
    const reset = () => { last = Date.now(); };
    const events: (keyof WindowEventMap)[] = ["mousemove", "mousedown", "keydown", "wheel", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    let prevSeconds = 0;
    const t = setInterval(() => {
      const seconds = Math.floor((Date.now() - last) / 1000);
      if (seconds !== prevSeconds) {
        prevSeconds = seconds;
        setIdleSeconds(seconds);
      }
    }, 3000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearInterval(t);
    };
  }, []);

  // Tab visibility
  useEffect(() => {
    const onVis = () => setIsHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Hour ticker
  useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);

  const tier = getBatteryTier(batteryLevel, batteryCharging);

  return {
    hasBattery,
    batteryLevel,
    batteryCharging: hasBattery ? batteryCharging : true,
    batteryTier: tier,
    lowBattery: hasBattery && batteryLevel !== null && batteryLevel < 0.2 && !batteryCharging,
    criticalBattery: hasBattery && batteryLevel !== null && batteryLevel < 0.1 && !batteryCharging,
    idleSeconds,
    isIdle: idleSeconds > IDLE_THRESHOLD,
    isHidden,
    timeOfDay: getTimeOfDay(hour),
    hour,
    musicDetected,
  };
}

