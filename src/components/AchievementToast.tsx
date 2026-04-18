import { useEffect } from "react";
import { playSound } from "@/lib/audio";
import { useI18n } from "@/lib/i18n";

interface AchievementToastProps {
  name: string;
  icon: string;
}

export function AchievementToast({ name, icon }: AchievementToastProps) {
  useEffect(() => {
    playSound("coin");
  }, []);

  const { t } = useI18n();

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-500"
      style={{
        animation: "fadeInOut 3000ms ease-in-out forwards",
      }}
    >
      <div className="glass rounded-xl px-6 py-4 flex items-center gap-3 shadow-[0_0_24px_var(--primary)]">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="font-display text-[9px] text-neon-pink">{t("achievement.unlocked")}</p>
          <p className="font-display text-sm text-neon mt-0.5">{name}</p>
        </div>
      </div>
    </div>
  );
}
