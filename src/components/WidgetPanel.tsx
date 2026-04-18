import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

// --- Clock Widget ---
function ClockWidget() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    };
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base">🕐</span>
      <span className="font-display text-sm text-neon tabular-nums">{time}</span>
    </div>
  );
}

// --- Session Timer Widget ---
function SessionTimerWidget() {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startRef.current) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setElapsed(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base">⏱️</span>
      <span className="font-display text-[10px] text-muted-foreground">SESSION</span>
      <span className="font-display text-xs text-foreground tabular-nums">{elapsed}</span>
    </div>
  );
}

// --- Weather Widget ---
interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
}

function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const cacheRef = useRef<{ data: WeatherData; timestamp: number } | null>(null);

  useEffect(() => {
    // Check cache
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < 30 * 60 * 1000) {
      setWeather(cacheRef.current.data);
      return;
    }

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const temp = data.current?.temperature_2m ?? 0;
        const code = data.current?.weather_code ?? 0;
        const { desc, icon } = weatherCodeToInfo(code);
        const result: WeatherData = { temperature: Math.round(temp), description: desc, icon };
        cacheRef.current = { data: result, timestamp: Date.now() };
        setWeather(result);
      } catch {
        setError(true);
      }
    };

    if (!navigator.geolocation) {
      setError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => setError(true),
      { timeout: 5000 }
    );
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-base">☁</span>
        <span className="font-display text-[9px] text-muted-foreground">Weather unavailable ☁</span>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-base">⏳</span>
        <span className="font-display text-[9px] text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{weather.icon}</span>
      <span className="font-display text-xs text-foreground">{weather.temperature}°C</span>
      <span className="font-display text-[8px] text-muted-foreground">{weather.description}</span>
    </div>
  );
}

function weatherCodeToInfo(code: number): { desc: string; icon: string } {
  if (code === 0) return { desc: "Clear", icon: "☀️" };
  if (code <= 3) return { desc: "Cloudy", icon: "⛅" };
  if (code <= 49) return { desc: "Fog", icon: "🌫️" };
  if (code <= 59) return { desc: "Drizzle", icon: "🌦️" };
  if (code <= 69) return { desc: "Rain", icon: "🌧️" };
  if (code <= 79) return { desc: "Snow", icon: "🌨️" };
  if (code <= 84) return { desc: "Showers", icon: "🌧️" };
  if (code <= 94) return { desc: "Snow", icon: "❄️" };
  return { desc: "Storm", icon: "⛈️" };
}

// --- Main WidgetPanel ---
export function WidgetPanel() {
  const { t } = useI18n();
  return (
    <details className="glass rounded-xl p-4" open>
      <summary className="font-display text-[10px] text-neon-pink cursor-pointer mb-3 select-none">
        {t("widget.title")}
      </summary>
      <div className="space-y-3">
        <ClockWidget />
        <SessionTimerWidget />
        <WeatherWidget />
      </div>
    </details>
  );
}
