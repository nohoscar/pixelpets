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
    case "witch-hat":
      return (
        <g transform={transform}>
          <polygon points="16,0 8,10 24,10" fill="#2d1b69" />
          <rect x="7" y="9" width="18" height="3" rx="1" fill="#1a0f40" />
          <rect x="13" y="6" width="6" height="2" rx="1" fill="#ff8c00" />
        </g>
      );
    case "santa-hat":
      return (
        <g transform={transform}>
          <path d="M10 8 Q16 -2 22 8 L20 10 L12 10 Z" fill="#cc0000" />
          <rect x="9" y="8" width="14" height="3" rx="1" fill="#fff" />
          <circle cx="22" cy="2" r="2" fill="#fff" />
        </g>
      );
    case "heart-crown":
      return (
        <g transform={transform}>
          <path d="M12 6 Q12 2 16 4 Q20 2 20 6 L16 10 Z" fill="#ff1493" />
          <path d="M9 6 Q9 3 12 4 Q15 3 15 6 L12 9 Z" fill="#ff69b4" opacity="0.7" />
          <path d="M17 6 Q17 3 20 4 Q23 3 23 6 L20 9 Z" fill="#ff69b4" opacity="0.7" />
        </g>
      );
    case "summer-sunglasses":
      return (
        <g transform={transform}>
          <rect x="9" y="11" width="6" height="4" rx="1" fill="#1a1a1a" opacity="0.8" />
          <rect x="17" y="11" width="6" height="4" rx="1" fill="#1a1a1a" opacity="0.8" />
          <line x1="15" y1="13" x2="17" y2="13" stroke="#1a1a1a" strokeWidth="0.8" />
          <line x1="9" y1="12" x2="7" y2="11" stroke="#1a1a1a" strokeWidth="0.6" />
          <line x1="23" y1="12" x2="25" y2="11" stroke="#1a1a1a" strokeWidth="0.6" />
          <rect x="9" y="11" width="6" height="2" rx="0.5" fill="#ff6b00" opacity="0.3" />
          <rect x="17" y="11" width="6" height="2" rx="0.5" fill="#ff6b00" opacity="0.3" />
        </g>
      );
    default:
      return null;
  }
}

export function AccessoryRenderer({ equipped, facing, petSize, petState }: AccessoryRendererProps) {
  const slots: AccessorySlot[] = ["back", "neck", "head", "eyes", "special"];
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
        zIndex: 10,
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
