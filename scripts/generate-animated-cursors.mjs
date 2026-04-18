// Generate animated .ani cursors from SVG frames using sharp.
// ANI format: RIFF container with sequential CUR frames.
// Run: node scripts/generate-animated-cursors.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "cursors");

// ---- Helpers ----

function pngToCur(pngBuf, hx, hy, w, h) {
  const hdr = Buffer.alloc(6);
  hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(2, 2); hdr.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(w >= 256 ? 0 : w, 0); dir.writeUInt8(h >= 256 ? 0 : h, 1);
  dir.writeUInt8(0, 2); dir.writeUInt8(0, 3);
  dir.writeUInt16LE(hx, 4); dir.writeUInt16LE(hy, 6);
  dir.writeUInt32LE(pngBuf.length, 8); dir.writeUInt32LE(22, 12);
  return Buffer.concat([hdr, dir, pngBuf]);
}

function buildAni(curFrames, jiffies = 4) {
  // RIFF 'ACON' container
  // anih chunk: 36 bytes of header data
  // LIST 'fram' chunk: sequence of 'icon' chunks (each is a CUR file)
  // rate chunk: display rate per frame in jiffies (1/60s)

  const nFrames = curFrames.length;
  const nSteps = nFrames;

  // anih: 36 bytes
  const anih = Buffer.alloc(36);
  anih.writeUInt32LE(36, 0);       // cbSize
  anih.writeUInt32LE(nFrames, 4);  // nFrames
  anih.writeUInt32LE(nSteps, 8);   // nSteps
  anih.writeUInt32LE(0, 12);       // iWidth (0 = use frame)
  anih.writeUInt32LE(0, 16);       // iHeight
  anih.writeUInt32LE(0, 20);       // iBitCount
  anih.writeUInt32LE(1, 24);       // nPlanes
  anih.writeUInt32LE(jiffies, 28); // iDispRate (jiffies, 1/60s)
  anih.writeUInt32LE(0x01, 32);    // bfAttributes: AF_ICON (1 = contains CUR/ICO data)

  // Build LIST 'fram'
  const iconChunks = [];
  for (const cur of curFrames) {
    // 'icon' chunk: 4 bytes tag + 4 bytes size + data (padded to even)
    const padded = cur.length % 2 === 0 ? cur : Buffer.concat([cur, Buffer.alloc(1)]);
    const chunk = Buffer.alloc(8 + padded.length);
    chunk.write("icon", 0, 4, "ascii");
    chunk.writeUInt32LE(cur.length, 4);
    padded.copy(chunk, 8);
    iconChunks.push(chunk);
  }
  const framData = Buffer.concat(iconChunks);
  const listFram = Buffer.alloc(12 + framData.length);
  listFram.write("LIST", 0, 4, "ascii");
  listFram.writeUInt32LE(4 + framData.length, 4);
  listFram.write("fram", 8, 4, "ascii");
  framData.copy(listFram, 12);

  // anih chunk wrapper
  const anihChunk = Buffer.alloc(8 + anih.length);
  anihChunk.write("anih", 0, 4, "ascii");
  anihChunk.writeUInt32LE(anih.length, 4);
  anih.copy(anihChunk, 8);

  // rate chunk
  const rateData = Buffer.alloc(4 * nSteps);
  for (let i = 0; i < nSteps; i++) rateData.writeUInt32LE(jiffies, i * 4);
  const rateChunk = Buffer.alloc(8 + rateData.length);
  rateChunk.write("rate", 0, 4, "ascii");
  rateChunk.writeUInt32LE(rateData.length, 4);
  rateData.copy(rateChunk, 8);

  // RIFF wrapper
  const body = Buffer.concat([anihChunk, rateChunk, listFram]);
  const riff = Buffer.alloc(12 + body.length);
  riff.write("RIFF", 0, 4, "ascii");
  riff.writeUInt32LE(4 + body.length, 4);
  riff.write("ACON", 8, 4, "ascii");
  body.copy(riff, 12);

  return riff;
}

async function svgToPng(svgStr, size = 32) {
  return sharp(Buffer.from(svgStr)).resize(size, size).png().toBuffer();
}

// ---- Animated cursor definitions ----
// Each has a function that generates SVG for frame index (0..N-1)

const SIZE = 32;
const ANIMATED = {
  shuriken: {
    hx: 16, hy: 16, frames: 8, jiffies: 3,
    svg: (i) => {
      const angle = (i / 8) * 360;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g fill="#6a7480" stroke="#1a1a2e" stroke-width="1" transform="rotate(${angle} 24 24)"><polygon points="24,4 28,20 24,24 20,20"/><polygon points="44,24 28,28 24,24 28,20"/><polygon points="24,44 20,28 24,24 28,28"/><polygon points="4,24 20,20 24,24 20,28"/></g><circle cx="24" cy="24" r="3.5" fill="#1a1a2e"/><circle cx="24" cy="24" r="1.8" fill="#ccc"/></svg>`;
    },
  },
  lightsaber: {
    hx: 16, hy: 2, frames: 6, jiffies: 5,
    svg: (i) => {
      const glow = 0.6 + Math.sin(i / 6 * Math.PI * 2) * 0.3;
      const w = 2.5 + Math.sin(i / 6 * Math.PI * 2) * 0.8;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><rect x="${24-w/2}" y="2" width="${w}" height="30" fill="#bfe9ff" opacity="${glow}"/><rect x="23" y="2" width="2" height="30" fill="#fff"/><circle cx="24" cy="3" r="${1.5 + Math.sin(i/6*Math.PI*2)*0.5}" fill="#fff"/><rect x="20" y="32" width="8" height="12" rx="1" fill="#2a2a36"/><rect x="20" y="34" width="8" height="1.5" fill="#888"/><rect x="20" y="38" width="8" height="1.5" fill="#888"/></svg>`;
    },
  },
  bomb: {
    hx: 16, hy: 18, frames: 6, jiffies: 5,
    svg: (i) => {
      const flicker = i % 2 === 0;
      const sparkR = flicker ? 3 : 2;
      const sparkColor = flicker ? "#ffeb3b" : "#ff7a00";
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><circle cx="24" cy="28" r="14" fill="#333" stroke="#000" stroke-width="1"/><ellipse cx="20" cy="22" rx="3" ry="2" fill="#666" opacity="0.6"/><rect x="22" y="10" width="4" height="6" fill="#3a2a1a"/><path d="M24 10 Q30 6 28 2" fill="none" stroke="#5a3a1a" stroke-width="2" stroke-linecap="round"/><circle cx="28" cy="2" r="${sparkR}" fill="${sparkColor}"/><circle cx="28" cy="2" r="1" fill="#fff" opacity="${flicker ? 1 : 0.5}"/></svg>`;
    },
  },
  magicWand: {
    hx: 4, hy: 4, frames: 8, jiffies: 4,
    svg: (i) => {
      const angle = (i / 8) * 360;
      const r1x = 14 + Math.cos(angle * Math.PI / 180) * 4;
      const r1y = 4 + Math.sin(angle * Math.PI / 180) * 4;
      const r2x = 4 + Math.cos((angle + 120) * Math.PI / 180) * 5;
      const r2y = 14 + Math.sin((angle + 120) * Math.PI / 180) * 5;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><line x1="6" y1="6" x2="36" y2="36" stroke="#5a3a1a" stroke-width="3.5" stroke-linecap="round"/><rect x="32" y="32" width="6" height="6" rx="1" fill="#3a2a1a"/><circle cx="6" cy="6" r="5" fill="#ffeb3b" opacity="0.8"/><circle cx="6" cy="6" r="2.5" fill="#fff"/><circle cx="${r1x}" cy="${r1y}" r="1.2" fill="#ffeb3b"/><circle cx="${r2x}" cy="${r2y}" r="1" fill="#ff66ff"/><circle cx="${4 + Math.cos((angle+240)*Math.PI/180)*3}" cy="${4 + Math.sin((angle+240)*Math.PI/180)*3}" r="0.8" fill="#5affff"/></svg>`;
    },
  },
  chainsaw: {
    hx: 4, hy: 24, frames: 4, jiffies: 2,
    svg: (i) => {
      const vib = i % 2 === 0 ? 0 : 1;
      const teeth = i % 2 === 0;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g transform="translate(0 ${vib})"><rect x="2" y="20" width="28" height="8" rx="1" fill="#bfbfbf" stroke="#1a1a1a" stroke-width="0.8"/><rect x="2" y="22" width="28" height="4" fill="#888"/><g fill="#1a1a1a">${teeth ? '<polygon points="4,20 6,18 8,20"/><polygon points="14,20 16,18 18,20"/><polygon points="24,20 26,18 28,20"/><polygon points="9,28 11,30 13,28"/><polygon points="19,28 21,30 23,28"/>' : '<polygon points="9,20 11,18 13,20"/><polygon points="19,20 21,18 23,20"/><polygon points="4,28 6,30 8,28"/><polygon points="14,28 16,30 18,28"/><polygon points="24,28 26,30 28,28"/>'}</g><rect x="28" y="14" width="14" height="20" rx="2" fill="#ff7a00" stroke="#5a2a00" stroke-width="0.8"/><rect x="34" y="34" width="4" height="10" fill="#3a2a1a"/></g></svg>`;
    },
  },
  csgo: {
    hx: 16, hy: 16, frames: 4, jiffies: 8,
    svg: (i) => {
      const pulse = 1.5 + Math.sin(i / 4 * Math.PI * 2) * 0.5;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g fill="none" stroke="#00ff88" stroke-width="2.5"><line x1="24" y1="6" x2="24" y2="18"/><line x1="24" y1="30" x2="24" y2="42"/><line x1="6" y1="24" x2="18" y2="24"/><line x1="30" y1="24" x2="42" y2="24"/></g><circle cx="24" cy="24" r="${pulse}" fill="#00ff88"/></svg>`;
    },
  },
  valorant: {
    hx: 16, hy: 16, frames: 4, jiffies: 8,
    svg: (i) => {
      const pulse = 2 + Math.sin(i / 4 * Math.PI * 2) * 0.8;
      const dashOff = i * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><g fill="none" stroke="#ff4655" stroke-width="2.8" stroke-linecap="round"><line x1="24" y1="10" x2="24" y2="20"/><line x1="24" y1="28" x2="24" y2="38"/><line x1="10" y1="24" x2="20" y2="24"/><line x1="28" y1="24" x2="38" y2="24"/></g><circle cx="24" cy="24" r="${pulse}" fill="#ff4655"/><circle cx="24" cy="24" r="11" fill="none" stroke="#ff4655" stroke-width="1" stroke-dasharray="2 4" stroke-dashoffset="${dashOff}" opacity="0.6"/></svg>`;
    },
  },
  katana: {
    hx: 2, hy: 4, frames: 4, jiffies: 4,
    svg: (i) => {
      const gleam = i * 8;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><path d="M2 6 Q8 4 36 30 L34 32 Q8 8 2 8 Z" fill="#e8eef5" stroke="#1a1a2e" stroke-width="1"/><line x1="3" y1="7" x2="35" y2="31" stroke="#a0a8b0" stroke-width="0.4"/><line x1="${3+gleam}" y1="${7+gleam*0.75}" x2="${5+gleam}" y2="${8.5+gleam*0.75}" stroke="#fff" stroke-width="1.5" opacity="0.7"/><rect x="32" y="30" width="6" height="4" fill="#1a1a1a" transform="rotate(-45 35 32)"/><rect x="34" y="32" width="12" height="3" fill="#5a1a1a" transform="rotate(-45 40 34)"/></svg>`;
    },
  },
  crossbow: {
    hx: 16, hy: 4, frames: 4, jiffies: 6,
    svg: (i) => {
      const tension = 6 + Math.sin(i / 4 * Math.PI * 2) * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><path d="M4 20 Q24 ${tension} 44 20" fill="none" stroke="#5a3a1a" stroke-width="3.5" stroke-linecap="round"/><line x1="6" y1="20" x2="42" y2="20" stroke="#bbb" stroke-width="0.6"/><rect x="20" y="20" width="8" height="20" fill="#5a3a1a" stroke="#1a1a1a" stroke-width="0.6"/><polygon points="22,4 26,4 24,20" fill="#bfbfbf" stroke="#000" stroke-width="0.6"/></svg>`;
    },
  },
  bow: {
    hx: 16, hy: 16, frames: 4, jiffies: 6,
    svg: (i) => {
      const r = 14 + Math.sin(i / 4 * Math.PI * 2) * 1;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><circle cx="24" cy="24" r="${r}" fill="none" stroke="#fff" stroke-width="2"/><circle cx="24" cy="24" r="8" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="24" y1="6" x2="24" y2="14" stroke="#fff" stroke-width="2"/><line x1="24" y1="34" x2="24" y2="42" stroke="#fff" stroke-width="2"/><line x1="6" y1="24" x2="14" y2="24" stroke="#fff" stroke-width="2"/><line x1="34" y1="24" x2="42" y2="24" stroke="#fff" stroke-width="2"/><circle cx="24" cy="24" r="2" fill="#fff"/></svg>`;
    },
  },
  sniper: {
    hx: 16, hy: 16, frames: 4, jiffies: 8,
    svg: (i) => {
      const breathe = Math.sin(i / 4 * Math.PI * 2) * 0.5;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="rgba(0,0,0,${0.15 + breathe * 0.05})" stroke="#111" stroke-width="1.5"/><line x1="24" y1="2" x2="24" y2="46" stroke="#111" stroke-width="1.2"/><line x1="2" y1="24" x2="46" y2="24" stroke="#111" stroke-width="1.2"/><circle cx="24" cy="24" r="${2.5 + breathe}" fill="#ff0033"/></svg>`;
    },
  },
  halo: {
    hx: 4, hy: 4, frames: 6, jiffies: 4,
    svg: (i) => {
      const glow = 0.3 + Math.sin(i / 6 * Math.PI * 2) * 0.2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><path d="M4 4 L18 18 L14 22 Z" fill="#5fd0ff" stroke="#fff" stroke-width="0.8" opacity="${0.8 + glow}"/><path d="M8 4 L22 18 L18 22 L4 8 Z" fill="#3aaaff" stroke="#fff" stroke-width="0.8" opacity="${0.7 + glow}"/><rect x="20" y="22" width="10" height="6" rx="1.5" fill="#3a3a4a" transform="rotate(-45 25 25)"/><circle cx="10" cy="10" r="${3 + Math.sin(i/6*Math.PI*2)*1.5}" fill="#5fd0ff" opacity="${glow}"/></svg>`;
    },
  },
  wolverine: {
    hx: 4, hy: 4, frames: 4, jiffies: 3,
    svg: (i) => {
      const slash = i * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><rect width="48" height="48" fill="none"/><polygon points="${2-slash},${2-slash} ${6-slash},${2-slash} ${22+slash},${22+slash} ${18+slash},${26+slash}" fill="#e8eef5" stroke="#1a1a2e" stroke-width="0.8"/><polygon points="${6-slash},${6-slash} ${12-slash},${4-slash} ${26+slash},${22+slash} ${22+slash},${26+slash}" fill="#d0d5dc" stroke="#1a1a2e" stroke-width="0.8"/><polygon points="${12-slash},${8-slash} ${18-slash},${8-slash} ${30+slash},${22+slash} ${26+slash},${28+slash}" fill="#e8eef5" stroke="#1a1a2e" stroke-width="0.8"/><path d="M18 26 L34 28 Q40 30 38 36 L24 38 Q18 36 18 26 Z" fill="#c9a44a" stroke="#5a3a1a" stroke-width="0.8"/></svg>`;
    },
  },
};

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [name, def] of Object.entries(ANIMATED)) {
    try {
      const curFrames = [];
      for (let i = 0; i < def.frames; i++) {
        const svgStr = def.svg(i);
        const pngBuf = await svgToPng(svgStr, SIZE);
        curFrames.push(pngToCur(pngBuf, def.hx, def.hy, SIZE, SIZE));
      }
      const aniBuf = buildAni(curFrames, def.jiffies);
      const outPath = path.join(OUT_DIR, `${name}.ani`);
      fs.writeFileSync(outPath, aniBuf);
      console.log(`  ✓ ${name}.ani (${def.frames} frames, ${aniBuf.length} bytes)`);
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`);
    }
  }

  console.log("\n✓ Animated cursors generated!");
}

main().catch(console.error);
