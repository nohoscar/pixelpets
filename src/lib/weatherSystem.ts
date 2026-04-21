// PixelPets · Weather System
// Uses free wttr.in API (no key needed) to get real weather

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "windy" | "foggy" | "hot" | "cold" | "night";

export interface WeatherData {
  condition: WeatherCondition;
  temp: number; // Celsius
  description: string;
  icon: string;
}

// Map wttr.in weather codes to our conditions
function codeToCondition(code: number, temp: number, hour: number): WeatherCondition {
  if (hour < 6 || hour > 20) return "night";
  if (code >= 200 && code < 300) return "stormy"; // thunderstorm
  if (code >= 300 && code < 600) return "rainy";
  if (code >= 600 && code < 700) return "snowy";
  if (code >= 700 && code < 800) return "foggy";
  if (temp > 35) return "hot";
  if (temp < 5) return "cold";
  if (code === 800) return "sunny";
  if (code > 800) return "cloudy";
  return "sunny";
}

const CONDITION_ICONS: Record<WeatherCondition, string> = {
  sunny: "☀️",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
  windy: "💨",
  foggy: "🌫️",
  hot: "🔥",
  cold: "🥶",
  night: "🌙",
};

// Pet reactions to weather
export const WEATHER_REACTIONS: Record<WeatherCondition, string> = {
  sunny: "☀️ Loving the sunshine!",
  cloudy: "☁️ Cozy day...",
  rainy: "🌧️ *opens tiny umbrella*",
  snowy: "❄️ Brrr! So cold!",
  stormy: "⛈️ *hides under blanket*",
  windy: "💨 Wheee! So windy!",
  foggy: "🌫️ Can't see anything...",
  hot: "🔥 Need ice cream NOW",
  cold: "🥶 *shivers*",
  night: "🌙 Sleepy time...",
};

// Accessory suggestions based on weather
export const WEATHER_ACCESSORIES: Record<WeatherCondition, string | null> = {
  sunny: "summer-sunglasses",
  cloudy: null,
  rainy: null, // could add umbrella later
  snowy: "scarf",
  stormy: null,
  windy: "scarf",
  foggy: null,
  hot: "summer-sunglasses",
  cold: "scarf",
  night: "pajamas",
};

let cachedWeather: { data: WeatherData; timestamp: number } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function fetchWeather(): Promise<WeatherData | null> {
  // Return cached if fresh
  if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION) {
    return cachedWeather.data;
  }

  try {
    const res = await fetch("https://wttr.in/?format=j1", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return cachedWeather?.data ?? null;
    const json = await res.json();

    const current = json.current_condition?.[0];
    if (!current) return null;

    const temp = parseInt(current.temp_C) || 20;
    const code = parseInt(current.weatherCode) || 800;
    const hour = new Date().getHours();
    const condition = codeToCondition(code, temp, hour);

    const data: WeatherData = {
      condition,
      temp,
      description: current.weatherDesc?.[0]?.value || "Clear",
      icon: CONDITION_ICONS[condition],
    };

    cachedWeather = { data, timestamp: Date.now() };
    return data;
  } catch {
    return cachedWeather?.data ?? null;
  }
}
