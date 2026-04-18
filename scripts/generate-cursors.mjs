// Script to generate .cur files from SVG cursor definitions.
// Run with: node scripts/generate-cursors.mjs
// Requires: sharp (npm i -D sharp)
// Output: public/cursors/ folder with .cur files + a README

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "cursors");

// PNG to CUR converter (ICO type 2 with PNG payload)
function pngToCur(pngBuffer, hotspotX, hotspotY, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(2, 2); // type 2 = CUR
  header.writeUInt16LE(1, 4); // 1 image

  const dir = Buffer.alloc(16);
  dir.writeUInt8(width >= 256 ? 0 : width, 0);
  dir.writeUInt8(height >= 256 ? 0 : height, 1);
  dir.writeUInt8(0, 2);
  dir.writeUInt8(0, 3);
  dir.writeUInt16LE(hotspotX, 4);
  dir.writeUInt16LE(hotspotY, 6);
  dir.writeUInt32LE(pngBuffer.length, 8);
  dir.writeUInt32LE(22, 12);

  return Buffer.concat([header, dir, pngBuffer]);
}

// All cursor SVGs at 32x32
const CURSORS = {
  csgo: { hx:16, hy:16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g fill="none" stroke="#00ff88" stroke-width="2.5"><line x1="24" y1="6" x2="24" y2="18"/><line x1="24" y1="30" x2="24" y2="42"/><line x1="6" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="42" y2="24"/></g><circle cx="24" cy="24" r="1.5" fill="#00ff88"/></svg>` },
  valorant: { hx:16, hy:16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g fill="none" stroke="#ff4655" stroke-width="2.8" stroke-linecap="round"><line x1="24" y1="10" x2="24" y2="20"/><line x1="24" y1="28" x2="24" y2="38"/><line x1="10" y1="24" x2="20" y2="24"/><line x1="28" y1="24" x2="38" y2="24"/></g><circle cx="24" cy="24" r="2.5" fill="#ff4655"/></svg>` },
  bow: { hx:16, hy:16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><circle cx="24" cy="24" r="14" fill="none" stroke="#fff" stroke-width="2"/><circle cx="24" cy="24" r="8" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="24" y1="6" x2="24" y2="14" stroke="#fff" stroke-width="2"/><line x1="24" y1="34" x2="24" y2="42" stroke="#fff" stroke-width="2"/><line x1="6" y1="24" x2="14" y2="24" stroke="#fff" stroke-width="2"/><line x1="34" y1="24" x2="42" y2="24" stroke="#fff" stroke-width="2"/><circle cx="24" cy="24" r="2" fill="#fff"/></svg>` },
  sniper: { hx:16, hy:16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="rgba(0,0,0,0.2)" stroke="#111" stroke-width="1.5"/><line x1="24" y1="2" x2="24" y2="46" stroke="#111" stroke-width="1.2"/><line x1="2" y1="24" x2="46" y2="24" stroke="#111" stroke-width="1.2"/><circle cx="24" cy="24" r="2.5" fill="#ff0033"/></svg>` },
  pickaxe: { hx:4, hy:4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" shape-rendering="crispEdges"><rect width="48" height="48" fill="none"/><rect x="20" y="20" width="3" height="3" fill="#8B5A2B"/><rect x="22" y="22" width="3" height="3" fill="#8B5A2B"/><rect x="24" y="24" width="3" height="3" fill="#8B5A2B"/><rect x="26" y="26" width="3" height="3" fill="#8B5A2B"/><rect x="28" y="28" width="3" height="3" fill="#8B5A2B"/><rect x="30" y="30" width="3" height="3" fill="#6e4520"/><rect x="32" y="32" width="3" height="3" fill="#6e4520"/><rect x="6" y="14" width="4" height="4" fill="#cfd5dc"/><rect x="10" y="10" width="4" height="4" fill="#e8eef5"/><rect x="14" y="6" width="4" height="4" fill="#cfd5dc"/><rect x="14" y="14" width="6" height="6" fill="#cfd5dc"/><rect x="18" y="10" width="4" height="4" fill="#e8eef5"/></svg>` },
  halo: { hx:4, hy:4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><path d="M4 4 L18 18 L14 22 Z" fill="#5fd0ff" stroke="#fff" stroke-width="0.8"/><path d="M8 4 L22 18 L18 22 L4 8 Z" fill="#3aaaff" stroke="#fff" stroke-width="0.8"/><rect x="20" y="22" width="10" height="6" rx="1.5" fill="#3a3a4a" transform="rotate(-45 25 25)"/></svg>` },
  lightsaber: { hx:16, hy:2, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><rect x="23" y="2" width="2.5" height="30" fill="#fff"/><rect x="22" y="2" width="4" height="30" fill="#bfe9ff" opacity="0.7"/><circle cx="24" cy="3" r="2.5" fill="#fff"/><rect x="20" y="32" width="8" height="12" rx="1" fill="#2a2a36"/><rect x="20" y="34" width="8" height="1.5" fill="#888"/><rect x="20" y="38" width="8" height="1.5" fill="#888"/></svg>` },
  wolverine: { hx:4, hy:4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><polygon points="2,2 6,2 22,22 18,26" fill="#e8eef5" stroke="#1a1a2e" stroke-width="0.8"/><polygon points="6,6 12,4 26,22 22,26" fill="#d0d5dc" stroke="#1a1a2e" stroke-width="0.8"/><polygon points="12,8 18,8 30,22 26,28" fill="#e8eef5" stroke="#1a1a2e" stroke-width="0.8"/><path d="M18 26 L34 28 Q40 30 38 36 L24 38 Q18 36 18 26 Z" fill="#c9a44a" stroke="#5a3a1a" stroke-width="0.8"/></svg>` },
  katana: { hx:2, hy:4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><path d="M2 6 Q8 4 36 30 L34 32 Q8 8 2 8 Z" fill="#e8eef5" stroke="#1a1a2e" stroke-width="1"/><rect x="32" y="30" width="6" height="4" fill="#1a1a1a" transform="rotate(-45 35 32)"/><rect x="34" y="32" width="12" height="3" fill="#5a1a1a" transform="rotate(-45 40 34)"/></svg>` },
  shuriken: { hx:16, hy:16, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g fill="#6a7480" stroke="#1a1a2e" stroke-width="1"><polygon points="24,4 28,20 24,24 20,20"/><polygon points="44,24 28,28 24,24 28,20"/><polygon points="24,44 20,28 24,24 28,28"/><polygon points="4,24 20,20 24,24 20,28"/></g><circle cx="24" cy="24" r="3.5" fill="#1a1a2e"/><circle cx="24" cy="24" r="1.8" fill="#ccc"/></svg>` },
  crossbow: { hx:16, hy:4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><path d="M4 20 Q24 6 44 20" fill="none" stroke="#5a3a1a" stroke-width="3.5" stroke-linecap="round"/><rect x="20" y="20" width="8" height="20" fill="#5a3a1a" stroke="#1a1a1a" stroke-width="0.8"/><polygon points="22,4 26,4 24,20" fill="#bfbfbf" stroke="#000" stroke-width="0.8"/></svg>` },
  magicWand: { hx:4, hy:4, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><line x1="6" y1="6" x2="36" y2="36" stroke="#5a3a1a" stroke-width="3.5" stroke-linecap="round"/><rect x="32" y="32" width="6" height="6" rx="1" fill="#3a2a1a"/><circle cx="6" cy="6" r="5" fill="#ffeb3b"/><circle cx="6" cy="6" r="2.5" fill="#fff"/><circle cx="14" cy="4" r="1.2" fill="#ffeb3b"/><circle cx="4" cy="14" r="1.2" fill="#ffeb3b"/></svg>` },
  bomb: { hx:16, hy:18, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><circle cx="24" cy="28" r="14" fill="#333" stroke="#000" stroke-width="1"/><ellipse cx="20" cy="22" rx="3" ry="2" fill="#666" opacity="0.6"/><rect x="22" y="10" width="4" height="6" fill="#3a2a1a"/><path d="M24 10 Q30 6 28 2" fill="none" stroke="#5a3a1a" stroke-width="2" stroke-linecap="round"/><circle cx="28" cy="2" r="3" fill="#ff7a00"/><circle cx="28" cy="2" r="1.5" fill="#ffeb3b"/></svg>` },
};

async function main() {
  // Try to use sharp, fall back to raw SVG→PNG if not available
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.log("sharp not installed. Install with: npm i -D sharp");
    console.log("Generating .cur files with embedded SVG as PNG fallback...");
    sharp = null;
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [name, def] of Object.entries(CURSORS)) {
    try {
      let pngBuf;
      if (sharp) {
        pngBuf = await sharp(Buffer.from(def.svg))
          .resize(32, 32)
          .png()
          .toBuffer();
      } else {
        // Without sharp, create a minimal 32x32 PNG with just a dot as placeholder
        // Users should install sharp for proper rendering
        console.log(`  Skipping ${name} (no sharp)`);
        continue;
      }

      const curBuf = pngToCur(pngBuf, def.hx, def.hy, 32, 32);
      const outPath = path.join(OUT_DIR, `${name}.cur`);
      fs.writeFileSync(outPath, curBuf);
      console.log(`  ✓ ${name}.cur (${curBuf.length} bytes)`);
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`);
    }
  }

  // Write README
  const readme = `# PixelPets Cursor Pack 🎮

Cursores de armas y herramientas de videojuegos en formato Windows (.cur).

## Cursores incluidos
${Object.keys(CURSORS).map(n => `- ${n}.cur`).join("\n")}

## Cómo instalar en Windows

1. Copia los archivos .cur a una carpeta permanente (ej: C:\\Cursors\\PixelPets\\)
2. Abre **Configuración** → **Bluetooth y dispositivos** → **Mouse**
3. Click en **Configuración adicional del mouse**
4. Ve a la pestaña **Punteros**
5. Selecciona "Selección normal" → **Examinar** → elige el .cur que quieras
6. Click **Aplicar**

Para volver al cursor normal: click en **Predeterminado** en la misma pestaña.

## Créditos
Generado por PixelPets · pixelpets.app
`;
  fs.writeFileSync(path.join(OUT_DIR, "README.txt"), readme);
  console.log("\n✓ README.txt written");
  console.log(`\nCursors saved to: ${OUT_DIR}`);
}

main().catch(console.error);
