import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "en" | "pt";

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  t: (key) => key,
  setLocale: () => {},
});

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Control Panel
    "control.title": "DESKTOP PETS",
    "control.subtitle": "Pets that live on your screen + game weapon cursors.",
    "control.comment": "// CONTROL_PANEL.exe",
    "control.cursor": "CURSOR / WEAPON",
    "control.pet": "YOUR PET",
    "control.remove": "REMOVE",
    "control.follow": "FOLLOW MODE",
    "control.follow.desc": "Pets chase the cursor",
    "control.accessories": "ACCESSORIES",
    "control.minigames": "MINI-GAMES",
    "control.pomodoro": "🍅 POMODORO",
    "control.achievements": "ACHIEVEMENTS",
    "control.footer": "Drag the pet · Click → play · Right-click → remove",
    "control.language": "LANGUAGE",

    // Stats Panel
    "stats.title": "STATS",
    "stats.hunger": "HUNGER",
    "stats.happiness": "HAPPINESS",
    "stats.energy": "ENERGY",
    "stats.system": "SYSTEM",
    "stats.feed": "FEED",
    "stats.play": "PLAY",
    "stats.sleep": "SLEEP",
    "stats.level": "LVL",
    "stats.pc": "PC",
    "stats.afk": "AFK",
    "stats.morning": "MORNING",
    "stats.day": "DAY",
    "stats.evening": "EVENING",
    "stats.night": "NIGHT",
    "stats.charging": "charging",
    "stats.battery": "battery",
    "stats.desktop": "Desktop (no battery)",
    "stats.idle": "idle",

    // Widget Panel
    "widget.title": "WIDGETS",
    "widget.session": "SESSION",
    "widget.weather.unavailable": "Weather unavailable ☁",
    "widget.weather.loading": "Loading...",

    // Pomodoro
    "pomodoro.work": "🍅 WORK",
    "pomodoro.break": "☕ BREAK",
    "pomodoro.idle": "IDLE",
    "pomodoro.start": "▸ START",
    "pomodoro.stop": "■ STOP",
    "pomodoro.workLabel": "WORK",
    "pomodoro.breakLabel": "BREAK",

    // Achievement Toast
    "achievement.unlocked": "ACHIEVEMENT UNLOCKED",

    // Buy Page
    "buy.hero.tag": "▸ DESKTOP_EDITION · v2.0 · LIFETIME",
    "buy.hero.title1": "Your pet",
    "buy.hero.title2": "lives on your",
    "buy.hero.title3": "desktop.",
    "buy.hero.desc": "While you work, code, or watch Netflix, your pixel pet walks, sleeps, eats, and reacts to your battery. No windows. No notifications. Just company.",
    "buy.bestseller": "▸ BEST SELLER",
    "buy.product": "PIXELPETS · DESKTOP",
    "buy.lifetime": "LIFETIME",
    "buy.free": "FREE",
    "buy.oldprice": "$4.99",
    "buy.beta": "Open beta · Try everything free",
    "buy.feature1": "42 pets + 29 cursors",
    "buy.feature2": "Win · Mac · Linux",
    "buy.feature3": "Lifetime free updates",
    "buy.feature4": "Email support",
    "buy.feature5": "No DRM, no phone home",
    "buy.email.label": "▸ EMAIL_FOR_LICENSE",
    "buy.email.placeholder": "you@email.com",
    "buy.submit": "▸ DOWNLOAD FREE",
    "buy.processing": "▸ PROCESSING...",
    "buy.secure": "🔒 Secure payment · 14-day refund",
    "buy.demo.note": "demo: activate Lovable Payments + Pro Plan to charge for real",
    "buy.features.tag": "▸ FEATURES",
    "buy.features.title": "What makes",
    "buy.features.titleHighlight": "PixelPets",
    "buy.features.titleEnd": "special",
    "buy.comparison.tag": "▸ COMPARISON",
    "buy.comparison.title": "Web demo vs",
    "buy.comparison.titleHighlight": "PixelPets Desktop",
    "buy.faq.tag": "▸ FAQ",
    "buy.faq.title": "Frequently asked questions",
    "buy.cta.title1": "Ready",
    "buy.cta.title2": "for company?",
    "buy.cta.desc": "A pixel pet costs less than a coffee ☕",
    "buy.cta.button": "▸ BUY NOW · $4.99",
    "buy.mobile.banner": "Desktop app available on Windows, Mac, and Linux only",
    "buy.mobile.demo": "▸ TRY WEB DEMO",
    "buy.mobile.sticky.label": "PIXELPETS DESKTOP",
    "buy.mobile.sticky.button": "▸ BUY",

    // Pet speech
    "pet.levelup": "Level {n}!",
    "pet.nightmode": "zzz... pajama time",
    "pet.feed": "yum!",
    "pet.play": "yay!",
    "pet.sleep": "zzz...",
    "pet.tired": "I'm tired...",
    "pet.critical": "I'm fainting!",
    "pet.recovered": "recovered!",
    "pet.charger.on": "yay! ⚡",
    "pet.charger.off": "where are you going?",
    "pet.wakeup": "you're back!",
    "pet.pomodoro.workend": "Break time! 🍅",
    "pet.pomodoro.breakend": "Back to work! 💪",

    // Index hero
    "hero.tag": "▸ SYSTEM_BOOT · v2.0",
    "hero.title1": "Pixel pets",
    "hero.title2": "for your",
    "hero.title3": "desktop.",
    "hero.desc": "42 pets — from kittens to xenomorphs, Pikachu, BB-8, and cosmic horrors — with Tamagotchi stats. Feed them, drag them, and choose from 29 cursors: Minecraft pickaxe, BFG, Keyblade, lightsaber, and more.",
    "hero.download": "▸ DOWNLOAD FREE",
    "hero.howItWorks": "▸ HOW_IT_WORKS",
    "hero.step1.title": "Choose pet",
    "hero.step1.desc": "14 styles to pick.",
    "hero.step2.title": "Care for it",
    "hero.step2.desc": "Feed · Play · Sleep.",
    "hero.step3.title": "Drag it",
    "hero.step3.desc": "Click and move.",
    "hero.footer": "// The desktop app works without a visible window — just your pet floating.",

    // Mobile header
    "mobile.header": "PIXELPETS",
  },
  pt: {
    // Control Panel
    "control.title": "DESKTOP PETS",
    "control.subtitle": "Mascotes que vivem na sua tela + cursores de armas de jogos.",
    "control.comment": "// CONTROL_PANEL.exe",
    "control.cursor": "CURSOR / ARMA",
    "control.pet": "SEU PET",
    "control.remove": "REMOVER",
    "control.follow": "MODO SEGUIR",
    "control.follow.desc": "Os pets perseguem o cursor",
    "control.accessories": "ACESSÓRIOS",
    "control.minigames": "MINI-JOGOS",
    "control.pomodoro": "🍅 POMODORO",
    "control.achievements": "CONQUISTAS",
    "control.footer": "Arraste o pet · Clique → brincar · Clique direito → remover",
    "control.language": "IDIOMA",

    // Stats Panel
    "stats.title": "STATS",
    "stats.hunger": "FOME",
    "stats.happiness": "FELICIDADE",
    "stats.energy": "ENERGIA",
    "stats.system": "SISTEMA",
    "stats.feed": "ALIMENTAR",
    "stats.play": "BRINCAR",
    "stats.sleep": "DORMIR",
    "stats.level": "NVL",
    "stats.pc": "PC",
    "stats.afk": "AFK",
    "stats.morning": "MANHÃ",
    "stats.day": "DIA",
    "stats.evening": "TARDE",
    "stats.night": "NOITE",
    "stats.charging": "carregando",
    "stats.battery": "bateria",
    "stats.desktop": "Desktop (sem bateria)",
    "stats.idle": "inativo",

    // Widget Panel
    "widget.title": "WIDGETS",
    "widget.session": "SESSÃO",
    "widget.weather.unavailable": "Clima indisponível ☁",
    "widget.weather.loading": "Carregando...",

    // Pomodoro
    "pomodoro.work": "🍅 TRABALHO",
    "pomodoro.break": "☕ PAUSA",
    "pomodoro.idle": "PARADO",
    "pomodoro.start": "▸ INICIAR",
    "pomodoro.stop": "■ PARAR",
    "pomodoro.workLabel": "TRABALHO",
    "pomodoro.breakLabel": "PAUSA",

    // Achievement Toast
    "achievement.unlocked": "CONQUISTA DESBLOQUEADA",

    // Buy Page
    "buy.hero.tag": "▸ DESKTOP_EDITION · v2.0 · LIFETIME",
    "buy.hero.title1": "Seu pet",
    "buy.hero.title2": "vive na sua",
    "buy.hero.title3": "área de trabalho.",
    "buy.hero.desc": "Enquanto você trabalha, programa ou assiste Netflix, seu pet pixel caminha, dorme, come e reage à sua bateria. Sem janelas. Sem notificações. Só companhia.",
    "buy.bestseller": "▸ MAIS VENDIDO",
    "buy.product": "PIXELPETS · DESKTOP",
    "buy.lifetime": "LIFETIME",
    "buy.free": "GRÁTIS",
    "buy.oldprice": "$4.99",
    "buy.beta": "Beta aberta · Teste tudo grátis",
    "buy.feature1": "42 pets + 29 cursores",
    "buy.feature2": "Win · Mac · Linux",
    "buy.feature3": "Atualizações grátis para sempre",
    "buy.feature4": "Suporte por email",
    "buy.feature5": "Sem DRM, sem rastreamento",
    "buy.email.label": "▸ EMAIL_PARA_LICENÇA",
    "buy.email.placeholder": "voce@email.com",
    "buy.submit": "▸ BAIXAR GRÁTIS",
    "buy.processing": "▸ PROCESSANDO...",
    "buy.secure": "🔒 Pagamento seguro · Reembolso 14 dias",
    "buy.demo.note": "demo: ative Lovable Payments + Plano Pro para cobrar de verdade",
    "buy.features.tag": "▸ FEATURES",
    "buy.features.title": "O que torna o",
    "buy.features.titleHighlight": "PixelPets",
    "buy.features.titleEnd": "especial",
    "buy.comparison.tag": "▸ COMPARAÇÃO",
    "buy.comparison.title": "Demo web vs",
    "buy.comparison.titleHighlight": "PixelPets Desktop",
    "buy.faq.tag": "▸ FAQ",
    "buy.faq.title": "Perguntas frequentes",
    "buy.cta.title1": "Pronto",
    "buy.cta.title2": "para ter companhia?",
    "buy.cta.desc": "Um pet pixel custa menos que um café ☕",
    "buy.cta.button": "▸ COMPRAR AGORA · $4.99",
    "buy.mobile.banner": "App desktop disponível apenas para Windows, Mac e Linux",
    "buy.mobile.demo": "▸ TESTAR DEMO WEB",
    "buy.mobile.sticky.label": "PIXELPETS DESKTOP",
    "buy.mobile.sticky.button": "▸ COMPRAR",

    // Pet speech
    "pet.levelup": "Nível {n}!",
    "pet.nightmode": "zzz... hora do pijama",
    "pet.feed": "nhac!",
    "pet.play": "eba!",
    "pet.sleep": "zzz...",
    "pet.tired": "estou cansado...",
    "pet.critical": "estou desmaiando!",
    "pet.recovered": "recuperado!",
    "pet.charger.on": "eba! ⚡",
    "pet.charger.off": "pra onde vai?",
    "pet.wakeup": "voltou!",
    "pet.pomodoro.workend": "Hora da pausa! 🍅",
    "pet.pomodoro.breakend": "Volta ao trabalho! 💪",

    // Index hero
    "hero.tag": "▸ SYSTEM_BOOT · v2.0",
    "hero.title1": "Pixel pets",
    "hero.title2": "para seu",
    "hero.title3": "desktop.",
    "hero.desc": "42 pets — de gatinhos a xenomorfos, Pikachu, BB-8 e horrores cósmicos — com stats Tamagotchi. Alimente-os, arraste-os e escolha entre 29 cursores: picareta do Minecraft, BFG, Keyblade, sabre de luz e mais.",
    "hero.download": "▸ BAIXAR GRÁTIS",
    "hero.howItWorks": "▸ COMO_FUNCIONA",
    "hero.step1.title": "Escolha o pet",
    "hero.step1.desc": "14 estilos para escolher.",
    "hero.step2.title": "Cuide dele",
    "hero.step2.desc": "Alimentar · Brincar · Dormir.",
    "hero.step3.title": "Arraste-o",
    "hero.step3.desc": "Clique e mova.",
    "hero.footer": "// O app desktop funciona sem janela visível — só seu pet flutuando.",

    // Mobile header
    "mobile.header": "PIXELPETS",
  },
};

function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("pt")) return "pt";
  return "en";
}

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? detectLocale());

  // Sync with external locale changes (e.g., from useGameState)
  useEffect(() => {
    if (initialLocale && initialLocale !== locale) {
      setLocaleState(initialLocale);
    }
  }, [initialLocale]);

  const t = (key: string): string => {
    return translations[locale][key] ?? key;
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
