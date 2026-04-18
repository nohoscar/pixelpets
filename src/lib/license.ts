// License key generation utilities
// Format: PIXL-XXXX-XXXX-XXXX-XXXX (20 chars alphanumeric)

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

export function generateLicenseKey(): string {
  const segments: string[] = [];
  for (let s = 0; s < 4; s++) {
    let seg = "";
    for (let i = 0; i < 4; i++) {
      const arr = new Uint8Array(1);
      crypto.getRandomValues(arr);
      seg += CHARS[arr[0] % CHARS.length];
    }
    segments.push(seg);
  }
  return `PIXL-${segments.join("-")}`;
}

export function isValidLicenseFormat(key: string): boolean {
  return /^PIXL-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(key);
}
