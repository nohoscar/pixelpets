export type ThemeId = "cyberpunk" | "pastel" | "retro" | "midnight";

export interface ThemeDef {
  id: ThemeId;
  label: string;
  color: string; // preview dot color
  vars: Record<string, string>;
}

export const THEMES: ThemeDef[] = [
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    color: "#39ff14",
    vars: {
      "--background": "oklch(0.16 0.03 270)",
      "--foreground": "oklch(0.96 0.01 250)",
      "--card": "oklch(0.21 0.04 270 / 0.7)",
      "--card-foreground": "oklch(0.96 0.01 250)",
      "--primary": "oklch(0.78 0.22 145)",
      "--primary-foreground": "oklch(0.14 0.03 270)",
      "--secondary": "oklch(0.27 0.05 280)",
      "--secondary-foreground": "oklch(0.96 0.01 250)",
      "--muted": "oklch(0.24 0.03 270)",
      "--muted-foreground": "oklch(0.7 0.04 260)",
      "--accent": "oklch(0.7 0.25 330)",
      "--accent-foreground": "oklch(0.14 0.03 270)",
      "--border": "oklch(0.3 0.05 280 / 0.6)",
      "--input": "oklch(0.25 0.04 275)",
      "--ring": "oklch(0.78 0.22 145)",
      "--neon": "oklch(0.85 0.2 150)",
      "--neon-pink": "oklch(0.72 0.27 340)",
      "--neon-cyan": "oklch(0.85 0.18 200)",
      "--gradient-bg": "radial-gradient(ellipse at top, oklch(0.22 0.08 280) 0%, oklch(0.12 0.03 270) 60%, oklch(0.08 0.02 265) 100%)",
    },
  },
  {
    id: "pastel",
    label: "Pastel",
    color: "#f8b4d9",
    vars: {
      "--background": "oklch(0.96 0.01 280)",
      "--foreground": "oklch(0.25 0.03 280)",
      "--card": "oklch(0.98 0.01 280 / 0.8)",
      "--card-foreground": "oklch(0.25 0.03 280)",
      "--primary": "oklch(0.7 0.15 330)",
      "--primary-foreground": "oklch(0.98 0.01 0)",
      "--secondary": "oklch(0.92 0.03 260)",
      "--secondary-foreground": "oklch(0.3 0.03 280)",
      "--muted": "oklch(0.93 0.02 270)",
      "--muted-foreground": "oklch(0.5 0.04 270)",
      "--accent": "oklch(0.75 0.12 260)",
      "--accent-foreground": "oklch(0.2 0.03 270)",
      "--border": "oklch(0.85 0.04 280 / 0.6)",
      "--input": "oklch(0.94 0.02 275)",
      "--ring": "oklch(0.7 0.15 330)",
      "--neon": "oklch(0.7 0.15 330)",
      "--neon-pink": "oklch(0.65 0.18 300)",
      "--neon-cyan": "oklch(0.75 0.12 220)",
      "--gradient-bg": "radial-gradient(ellipse at top, oklch(0.97 0.02 290) 0%, oklch(0.95 0.01 280) 60%, oklch(0.94 0.01 270) 100%)",
    },
  },
  {
    id: "retro",
    label: "Retro",
    color: "#ffb000",
    vars: {
      "--background": "oklch(0.12 0.02 90)",
      "--foreground": "oklch(0.85 0.15 90)",
      "--card": "oklch(0.16 0.03 90 / 0.7)",
      "--card-foreground": "oklch(0.85 0.15 90)",
      "--primary": "oklch(0.8 0.16 90)",
      "--primary-foreground": "oklch(0.12 0.02 90)",
      "--secondary": "oklch(0.2 0.04 100)",
      "--secondary-foreground": "oklch(0.85 0.15 90)",
      "--muted": "oklch(0.18 0.03 90)",
      "--muted-foreground": "oklch(0.6 0.08 90)",
      "--accent": "oklch(0.7 0.18 145)",
      "--accent-foreground": "oklch(0.12 0.02 90)",
      "--border": "oklch(0.3 0.06 90 / 0.6)",
      "--input": "oklch(0.18 0.03 90)",
      "--ring": "oklch(0.8 0.16 90)",
      "--neon": "oklch(0.8 0.16 90)",
      "--neon-pink": "oklch(0.7 0.18 145)",
      "--neon-cyan": "oklch(0.75 0.12 90)",
      "--gradient-bg": "radial-gradient(ellipse at top, oklch(0.16 0.04 90) 0%, oklch(0.1 0.02 90) 60%, oklch(0.08 0.01 90) 100%)",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    color: "#7c3aed",
    vars: {
      "--background": "oklch(0.13 0.04 280)",
      "--foreground": "oklch(0.92 0.02 270)",
      "--card": "oklch(0.18 0.05 280 / 0.7)",
      "--card-foreground": "oklch(0.92 0.02 270)",
      "--primary": "oklch(0.65 0.22 280)",
      "--primary-foreground": "oklch(0.98 0.01 0)",
      "--secondary": "oklch(0.22 0.05 280)",
      "--secondary-foreground": "oklch(0.92 0.02 270)",
      "--muted": "oklch(0.2 0.04 280)",
      "--muted-foreground": "oklch(0.6 0.05 270)",
      "--accent": "oklch(0.6 0.2 300)",
      "--accent-foreground": "oklch(0.13 0.04 280)",
      "--border": "oklch(0.28 0.06 280 / 0.6)",
      "--input": "oklch(0.2 0.04 280)",
      "--ring": "oklch(0.65 0.22 280)",
      "--neon": "oklch(0.7 0.2 280)",
      "--neon-pink": "oklch(0.6 0.2 300)",
      "--neon-cyan": "oklch(0.7 0.15 240)",
      "--gradient-bg": "radial-gradient(ellipse at top, oklch(0.18 0.06 280) 0%, oklch(0.11 0.04 280) 60%, oklch(0.08 0.03 275) 100%)",
    },
  },
];

export function applyTheme(themeId: ThemeId) {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
  // Also update body background
  document.body.style.background = theme.vars["--gradient-bg"];
  document.body.style.backgroundAttachment = "fixed";
}
