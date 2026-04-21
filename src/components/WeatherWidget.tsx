import { useEffect, useState } from "react";
import { fetchWeather, WEATHER_REACTIONS, WEATHER_ACCESSORIES, type WeatherData } from "@/lib/weatherSystem";

interface Props {
  onWeatherAccessory?: (accessoryId: string | null) => void;
}

export function WeatherWidget({ onWeatherAccessory }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather().then((w) => {
      setWeather(w);
      if (w && onWeatherAccessory) {
        onWeatherAccessory(WEATHER_ACCESSORIES[w.condition]);
      }
    });
    // Refresh every 30 min
    const id = setInterval(() => {
      fetchWeather().then((w) => {
        setWeather(w);
        if (w && onWeatherAccessory) {
          onWeatherAccessory(WEATHER_ACCESSORIES[w.condition]);
        }
      });
    }, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) return null;

  const reaction = WEATHER_REACTIONS[weather.condition];

  return (
    <div className="glass rounded-xl p-3 border border-border/40">
      <div className="flex items-center gap-2">
        <span className="text-xl">{weather.icon}</span>
        <div className="flex-1">
          <p className="font-display text-[9px] text-foreground">{weather.temp}°C — {weather.description}</p>
          <p className="text-[8px] text-muted-foreground italic">{reaction}</p>
        </div>
      </div>
    </div>
  );
}
