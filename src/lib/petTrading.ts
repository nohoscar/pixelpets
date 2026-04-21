// PixelPets · Pet Trading System
// Share pets via encoded codes (no server needed — all data in the code)

export interface TradePet {
  kind: string;
  name: string;
  level: number;
  xp: number;
  accessories: Record<string, string | null>;
}

// Encode pet data into a shareable code
export function encodePetCode(pet: TradePet): string {
  const data = JSON.stringify(pet);
  // Base64 encode + add prefix
  const encoded = btoa(unescape(encodeURIComponent(data)));
  // Add checksum (first 4 chars of hash)
  const checksum = simpleHash(encoded).toString(16).slice(0, 4).toUpperCase();
  return `PXL-${checksum}-${encoded}`;
}

// Decode a pet code back to pet data
export function decodePetCode(code: string): TradePet | null {
  try {
    if (!code.startsWith("PXL-")) return null;
    const parts = code.split("-");
    if (parts.length < 3) return null;
    const checksum = parts[1];
    const encoded = parts.slice(2).join("-");

    // Verify checksum
    const expectedChecksum = simpleHash(encoded).toString(16).slice(0, 4).toUpperCase();
    if (checksum !== expectedChecksum) return null;

    const data = JSON.parse(decodeURIComponent(escape(atob(encoded))));

    // Validate structure
    if (!data.kind || typeof data.kind !== "string") return null;
    if (!data.name || typeof data.name !== "string") return null;

    return {
      kind: data.kind,
      name: data.name || "Unknown",
      level: data.level || 1,
      xp: data.xp || 0,
      accessories: data.accessories || {},
    };
  } catch {
    return null;
  }
}

// Simple hash for checksum
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate a short share URL (uses the code as query param)
export function getShareUrl(code: string): string {
  return `https://pixelpets.sbkoscar.workers.dev/trade?code=${encodeURIComponent(code)}`;
}
