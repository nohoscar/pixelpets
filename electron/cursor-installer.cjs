// Windows cursor installer — converts SVG cursors to .cur files
// and applies them via the Windows Registry.
//
// Uses Electron's nativeImage to render SVG → PNG → CUR format.

const { app, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const CURSOR_DIR = path.join(app.getPath("userData"), "cursors");

// CUR file format: ICO header + directory entry + bitmap data
// We use PNG-in-ICO format which Windows 7+ supports.
function pngToCur(pngBuffer, hotspotX, hotspotY, width, height) {
  // ICO/CUR header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(2, 2);      // type: 2 = CUR
  header.writeUInt16LE(1, 4);      // image count: 1

  // Directory entry: 16 bytes
  const dir = Buffer.alloc(16);
  dir.writeUInt8(width >= 256 ? 0 : width, 0);   // width (0 = 256)
  dir.writeUInt8(height >= 256 ? 0 : height, 1);  // height (0 = 256)
  dir.writeUInt8(0, 2);            // color palette
  dir.writeUInt8(0, 3);            // reserved
  dir.writeUInt16LE(hotspotX, 4);  // hotspot X (CUR-specific)
  dir.writeUInt16LE(hotspotY, 6);  // hotspot Y (CUR-specific)
  dir.writeUInt32LE(pngBuffer.length, 8);  // image size
  dir.writeUInt32LE(22, 12);       // offset to image data (6 + 16 = 22)

  return Buffer.concat([header, dir, pngBuffer]);
}

// SVG cursor definitions — matching src/components/cursors/cursors.ts
// Only the most popular ones to keep it manageable
const CURSOR_SVGS = {
  csgo: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="#00ff88" stroke-width="2" stroke-linecap="square"><line x1="24" y1="6" x2="24" y2="18"/><line x1="24" y1="30" x2="24" y2="42"/><line x1="6" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="42" y2="24"/></g><circle cx="24" cy="24" r="1.2" fill="#00ff88"/></svg>`,
    hx: 16, hy: 16
  },
  valorant: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="#ff4655" stroke-width="2.4" stroke-linecap="round"><line x1="24" y1="10" x2="24" y2="20"/><line x1="24" y1="28" x2="24" y2="38"/><line x1="10" y1="24" x2="20" y2="24"/><line x1="28" y1="24" x2="38" y2="24"/></g><circle cx="24" cy="24" r="2" fill="#ff4655"/></svg>`,
    hx: 16, hy: 16
  },
  sniper: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="rgba(0,0,0,0.15)" stroke="#000" stroke-width="1.5"/><line x1="24" y1="2" x2="24" y2="46" stroke="#000" stroke-width="1"/><line x1="2" y1="24" x2="46" y2="24" stroke="#000" stroke-width="1"/><circle cx="24" cy="24" r="2" fill="#ff0033"/></svg>`,
    hx: 16, hy: 16
  },
  bow: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><circle cx="24" cy="24" r="14" fill="none" stroke="#ffffff" stroke-width="2"/><circle cx="24" cy="24" r="8" fill="none" stroke="#ffffff" stroke-width="1.5"/><line x1="24" y1="6" x2="24" y2="14" stroke="#ffffff" stroke-width="2"/><line x1="24" y1="34" x2="24" y2="42" stroke="#ffffff" stroke-width="2"/><line x1="6" y1="24" x2="14" y2="24" stroke="#ffffff" stroke-width="2"/><line x1="34" y1="24" x2="42" y2="24" stroke="#ffffff" stroke-width="2"/><circle cx="24" cy="24" r="1.5" fill="#ffffff"/></svg>`,
    hx: 16, hy: 16
  },
  pickaxe: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" shape-rendering="crispEdges"><rect x="20" y="20" width="3" height="3" fill="#8B5A2B"/><rect x="22" y="22" width="3" height="3" fill="#8B5A2B"/><rect x="24" y="24" width="3" height="3" fill="#8B5A2B"/><rect x="26" y="26" width="3" height="3" fill="#8B5A2B"/><rect x="28" y="28" width="3" height="3" fill="#8B5A2B"/><rect x="30" y="30" width="3" height="3" fill="#6e4520"/><rect x="32" y="32" width="3" height="3" fill="#6e4520"/><rect x="6" y="14" width="4" height="4" fill="#cfd5dc"/><rect x="10" y="10" width="4" height="4" fill="#e8eef5"/><rect x="14" y="6" width="4" height="4" fill="#cfd5dc"/><rect x="14" y="14" width="6" height="6" fill="#cfd5dc"/><rect x="18" y="10" width="4" height="4" fill="#e8eef5"/></svg>`,
    hx: 4, hy: 4
  },
  lightsaber: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect x="23" y="2" width="2" height="28" fill="#fff"/><rect x="22.5" y="2" width="3" height="28" fill="#bfe9ff" opacity="0.9"/><circle cx="24" cy="3" r="2" fill="#ffffff" opacity="0.9"/><rect x="20" y="30" width="8" height="10" rx="1" fill="#2a2a36"/><rect x="20" y="32" width="8" height="1.5" fill="#888"/><rect x="20" y="36" width="8" height="1.5" fill="#888"/></svg>`,
    hx: 16, hy: 2
  },
  katana: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><path d="M2 6 Q8 4 36 30 L34 32 Q8 8 2 8 Z" fill="#e8eef5" stroke="#1a1a2e" stroke-width="0.8"/><rect x="32" y="30" width="6" height="4" fill="#1a1a1a" transform="rotate(-45 35 32)"/><rect x="34" y="32" width="12" height="3" fill="#5a1a1a" stroke="#000" stroke-width="0.4" transform="rotate(-45 40 34)"/></svg>`,
    hx: 2, hy: 4
  },
  shuriken: {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="#5a6470" stroke="#1a1a2e" stroke-width="0.8"><polygon points="24,4 28,20 24,24 20,20"/><polygon points="44,24 28,28 24,24 28,20"/><polygon points="24,44 20,28 24,24 28,28"/><polygon points="4,24 20,20 24,24 20,28"/></g><circle cx="24" cy="24" r="3" fill="#1a1a2e"/><circle cx="24" cy="24" r="1.5" fill="#bfbfbf"/></svg>`,
    hx: 16, hy: 16
  },
};

function ensureCursorDir() {
  if (!fs.existsSync(CURSOR_DIR)) {
    fs.mkdirSync(CURSOR_DIR, { recursive: true });
  }
}

function generateCurFile(name, svgString, hotspotX, hotspotY) {
  ensureCursorDir();
  const size = 32;

  // Render SVG to nativeImage
  const svgBuffer = Buffer.from(svgString);
  const img = nativeImage.createFromBuffer(svgBuffer, { width: size, height: size });
  const resized = img.resize({ width: size, height: size });
  const pngBuffer = resized.toPNG();

  // Convert PNG to CUR
  const curBuffer = pngToCur(pngBuffer, hotspotX, hotspotY, size, size);
  const curPath = path.join(CURSOR_DIR, `${name}.cur`);
  fs.writeFileSync(curPath, curBuffer);
  return curPath;
}

function generateAllCursors() {
  ensureCursorDir();
  const paths = {};
  for (const [name, def] of Object.entries(CURSOR_SVGS)) {
    try {
      paths[name] = generateCurFile(name, def.svg, def.hx, def.hy);
    } catch (err) {
      console.error(`Failed to generate cursor ${name}:`, err.message);
    }
  }
  return paths;
}

function applyWindowsCursor(curPath) {
  if (!curPath || !fs.existsSync(curPath)) return false;
  try {
    // Set the cursor via registry
    const regPath = "HKCU\\Control Panel\\Cursors";
    const escaped = curPath.replace(/\\/g, "\\\\");

    // Set "Arrow" (normal select) cursor
    execSync(`reg add "${regPath}" /v Arrow /t REG_EXPAND_SZ /d "${escaped}" /f`, { stdio: "ignore" });

    // Notify the system of the change
    // SystemParametersInfo with SPI_SETCURSORS (0x0057)
    execSync(`powershell -Command "[System.Runtime.InteropServices.Marshal]::SystemDefaultCharSize; Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class CursorHelper { [DllImport(\\\"user32.dll\\\", SetLastError = true)] public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni); }'; [CursorHelper]::SystemParametersInfo(0x0057, 0, [IntPtr]::Zero, 0x01)"`, { stdio: "ignore" });

    return true;
  } catch (err) {
    console.error("Failed to apply cursor:", err.message);
    return false;
  }
}

function resetWindowsCursor() {
  try {
    const regPath = "HKCU\\Control Panel\\Cursors";
    // Reset to empty = system default
    execSync(`reg add "${regPath}" /v Arrow /t REG_EXPAND_SZ /d "" /f`, { stdio: "ignore" });
    execSync(`powershell -Command "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; public class CursorHelper2 { [DllImport(\\\"user32.dll\\\", SetLastError = true)] public static extern bool SystemParametersInfo(uint uiAction, uint uiParam, IntPtr pvParam, uint fWinIni); }'; [CursorHelper2]::SystemParametersInfo(0x0057, 0, [IntPtr]::Zero, 0x01)"`, { stdio: "ignore" });
    return true;
  } catch (err) {
    console.error("Failed to reset cursor:", err.message);
    return false;
  }
}

module.exports = { generateAllCursors, applyWindowsCursor, resetWindowsCursor, CURSOR_SVGS };
