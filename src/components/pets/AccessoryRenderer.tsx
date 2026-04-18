import type { AccessorySlot, AccessoryId } from "@/hooks/useGameState";

interface AccessoryRendererProps {
  equipped: Record<AccessorySlot, AccessoryId | null>;
  facing: "left" | "right";
  petSize: number;
  petState: string;
}

// SVG accessory graphics positioned in a 32x32 viewBox
function renderAccessorySvg(id: AccessoryId, facing: "left" | "right") {
  const flip = facing === "left";
  const transform = flip ? "translate(32, 0) scale(-1, 1)" : undefined;

  switch (id) {
    case "basic-hat":
      return (
        <g transform={transform}>
          <rect x="10" y="2" width="12" height="5" rx="1" fill="#e74c3c" />
          <rect x="8" y="6" width="16" height="3" rx="1" fill="#c0392b" />
        </g>
      );
    case "glasses":
      return (
        <g transform={transform}>
          <circle cx="12" cy="13" r="3" fill="none" stroke="#333" strokeWidth="0.8" />
          <circle cx="20" cy="13" r="3" fill="none" stroke="#333" strokeWidth="0.8" />
          <line x1="15" y1="13" x2="17" y2="13" stroke="#333" strokeWidth="0.6" />
          <line x1="9" y1="13" x2="7" y2="12" stroke="#333" strokeWidth="0.5" />
          <line x1="23" y1="13" x2="25" y2="12" stroke="#333" strokeWidth="0.5" />
        </g>
      );
    case "bow":
      return (
        <g transform={transform}>
          <ellipse cx="13" cy="20" rx="3" ry="2" fill="#ff69b4" />
          <ellipse cx="19" cy="20" rx="3" ry="2" fill="#ff69b4" />
          <circle cx="16" cy="20" r="1.5" fill="#ff1493" />
        </g>
      );
    case "scarf":
      return (
        <g transform={transform}>
          <path d="M8 19 Q16 22 24 19 L24 23 Q16 26 8 23 Z" fill="#3498db" opacity="0.9" />
          <rect x="20" y="22" width="3" height="6" rx="1" fill="#2980b9" />
        </g>
      );
    case "cape":
      return (
        <g transform={transform}>
          <path d="M12 18 L12 30 Q16 32 20 30 L20 18 Z" fill="#9b59b6" opacity="0.8" />
          <path d="M12 18 L20 18" stroke="#8e44ad" strokeWidth="1" />
        </g>
      );
    case "pajamas":
      return (
        <g transform={transform}>
          <rect x="10" y="16" width="12" height="12" rx="2" fill="#a8d8ea" opacity="0.6" />
          <circle cx="13" cy="20" r="0.8" fill="#fff" opacity="0.8" />
          <circle cx="16" cy="22" r="0.8" fill="#fff" opacity="0.8" />
          <circle cx="19" cy="20" r="0.8" fill="#fff" opacity="0.8" />
          {/* Nightcap */}
          <path d="M11 6 Q16 0 21 6 L20 8 L12 8 Z" fill="#a8d8ea" />
          <circle cx="16" cy="2" r="1.2" fill="#fff" />
        </g>
      );
    default:
      return null;
  }
}

export function AccessoryRenderer({ equipped, facing, petSize, petState }: AccessoryRendererProps) {
  const slots: AccessorySlot[] = ["back", "special", "neck", "head", "eyes"];
  const activeAccessories = slots
    .map((slot) => equipped[slot])
    .filter((id): id is string => id !== null);

  if (activeAccessories.length === 0) return null;

  const isFainted = petState === "faint";

  return (
    <svg
      viewBox="0 0 32 32"
      width={petSize}
      height={petSize}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: isFainted ? 0.55 : 1,
        filter: isFainted ? "grayscale(0.6) brightness(0.8)" : undefined,
      }}
    >
      {slots.map((slot) => {
        const id = equipped[slot];
        if (!id) return null;
        return <g key={slot}>{renderAccessorySvg(id, facing)}</g>;
      })}
    </svg>
  );
}
