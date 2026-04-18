import { useState, useEffect } from "react";
import { PETS } from "./pets/petSprites";

const STORAGE_KEY = "pixelpets-onboarded";

export function useOnboarding() {
  const [show, setShow] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setShow(false);
  };

  return { showOnboarding: show, dismissOnboarding: dismiss };
}

export function Onboarding({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [textPhase, setTextPhase] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setTextPhase(1), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  const catDef = PETS["cat"];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        background: "radial-gradient(ellipse at center, oklch(0.18 0.06 280 / 0.97) 0%, oklch(0.08 0.03 270 / 0.99) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Neon grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--neon) 15%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--neon) 15%, transparent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="relative flex flex-col items-center gap-6 p-8 rounded-2xl glass max-w-sm mx-4"
        style={{
          boxShadow: "0 0 60px color-mix(in oklab, var(--neon) 30%, transparent), 0 0 120px color-mix(in oklab, var(--neon-pink) 15%, transparent)",
          transform: visible ? "scale(1)" : "scale(0.9)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Pet animation */}
        <div className="w-24 h-24 animate-bob">
          {catDef.render("right", step)}
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-lg text-neon">
            ¡Hola! Soy Mochi 🐾
          </h1>
          <p
            className="text-sm text-muted-foreground leading-relaxed"
            style={{
              opacity: textPhase >= 1 ? 1 : 0,
              transform: textPhase >= 1 ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.5s ease-out",
            }}
          >
            Cuídame, aliméntame y te acompaño en tu escritorio.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleDismiss}
          className="mt-2 px-8 py-3 rounded-md bg-primary text-primary-foreground font-display text-[11px] hover:shadow-[0_0_28px_var(--primary)] transition-all animate-pulse-glow"
          style={{
            opacity: textPhase >= 1 ? 1 : 0,
            transition: "opacity 0.4s ease-out 0.3s",
          }}
        >
          ▸ EMPEZAR
        </button>
      </div>
    </div>
  );
}
