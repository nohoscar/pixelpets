// SVG-based custom cursors. Each returns a data URL ready for `cursor: url(...)`.
// All sized 48x48 with the hotspot in the center (24 24) unless overridden.

export type CursorKind =
  | "default" | "csgo" | "valorant" | "bow" | "sniper"
  | "pickaxe" | "halo" | "lightsaber" | "wolverine"
  // New batch — videogame weapons
  | "portalgun" | "keyblade" | "masterSword" | "gravityGun" | "bfg"
  | "kar98" | "awp" | "buster" | "gunblade" | "warhammer"
  | "chainsaw" | "plasmaRifle" | "needler" | "crossbow" | "katana"
  | "shuriken" | "magicWand" | "bomb" | "fishingRod" | "boomerang";

const enc = (svg: string, hx = 24, hy = 24) =>
  `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${hx} ${hy}, crosshair`;

const csgoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <g fill="none" stroke="#00ff88" stroke-width="2" stroke-linecap="square">
    <line x1="24" y1="6" x2="24" y2="18"/>
    <line x1="24" y1="30" x2="24" y2="42"/>
    <line x1="6" y1="24" x2="18" y2="24"/>
    <line x1="30" y1="24" x2="42" y2="24"/>
  </g>
  <circle cx="24" cy="24" r="1.2" fill="#00ff88"/>
</svg>`;

const valorantSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <g fill="none" stroke="#ff4655" stroke-width="2.4" stroke-linecap="round">
    <line x1="24" y1="10" x2="24" y2="20"/>
    <line x1="24" y1="28" x2="24" y2="38"/>
    <line x1="10" y1="24" x2="20" y2="24"/>
    <line x1="28" y1="24" x2="38" y2="24"/>
  </g>
  <circle cx="24" cy="24" r="2" fill="#ff4655"/>
  <circle cx="24" cy="24" r="11" fill="none" stroke="#ff4655" stroke-width="1" stroke-dasharray="2 4" opacity="0.6"/>
</svg>`;

const bowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="14" fill="none" stroke="#ffffff" stroke-width="2"/>
  <circle cx="24" cy="24" r="8" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="24" y1="6" x2="24" y2="14" stroke="#ffffff" stroke-width="2"/>
  <line x1="24" y1="34" x2="24" y2="42" stroke="#ffffff" stroke-width="2"/>
  <line x1="6" y1="24" x2="14" y2="24" stroke="#ffffff" stroke-width="2"/>
  <line x1="34" y1="24" x2="42" y2="24" stroke="#ffffff" stroke-width="2"/>
  <circle cx="24" cy="24" r="1.5" fill="#ffffff"/>
</svg>`;

const sniperSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="20" fill="rgba(0,0,0,0.15)" stroke="#000" stroke-width="1.5"/>
  <line x1="24" y1="2" x2="24" y2="46" stroke="#000" stroke-width="1"/>
  <line x1="2" y1="24" x2="46" y2="24" stroke="#000" stroke-width="1"/>
  <circle cx="24" cy="24" r="2" fill="#ff0033"/>
</svg>`;

const pickaxeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" shape-rendering="crispEdges">
  <rect x="20" y="20" width="3" height="3" fill="#8B5A2B"/>
  <rect x="22" y="22" width="3" height="3" fill="#8B5A2B"/>
  <rect x="24" y="24" width="3" height="3" fill="#8B5A2B"/>
  <rect x="26" y="26" width="3" height="3" fill="#8B5A2B"/>
  <rect x="28" y="28" width="3" height="3" fill="#8B5A2B"/>
  <rect x="30" y="30" width="3" height="3" fill="#6e4520"/>
  <rect x="32" y="32" width="3" height="3" fill="#6e4520"/>
  <rect x="6"  y="14" width="4" height="4" fill="#cfd5dc"/>
  <rect x="10" y="10" width="4" height="4" fill="#e8eef5"/>
  <rect x="14" y="6"  width="4" height="4" fill="#cfd5dc"/>
  <rect x="14" y="14" width="6" height="6" fill="#cfd5dc"/>
  <rect x="18" y="10" width="4" height="4" fill="#e8eef5"/>
  <rect x="22" y="14" width="4" height="4" fill="#cfd5dc"/>
  <rect x="26" y="10" width="4" height="4" fill="#e8eef5"/>
  <rect x="30" y="6"  width="4" height="4" fill="#cfd5dc"/>
  <rect x="34" y="10" width="4" height="4" fill="#cfd5dc"/>
</svg>`;

const haloSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="haloblade" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#9affff"/>
      <stop offset="0.5" stop-color="#3aaaff"/>
      <stop offset="1" stop-color="#1a4aff"/>
    </linearGradient>
    <filter id="halog" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.4"/>
    </filter>
  </defs>
  <path d="M4 4 L20 20 L28 28 L36 36 L26 30 L18 22 Z" fill="#5fd0ff" opacity="0.45" filter="url(#halog)"/>
  <path d="M4 4 L18 18 L14 22 Z" fill="url(#haloblade)" stroke="#fff" stroke-width="0.6"/>
  <path d="M8 4 L22 18 L18 22 L4 8 Z" fill="url(#haloblade)" stroke="#fff" stroke-width="0.6" opacity="0.85"/>
  <rect x="20" y="22" width="10" height="6" rx="1.5" fill="#3a3a4a" transform="rotate(-45 25 25)"/>
  <rect x="22" y="24" width="6" height="2" fill="#9affff" transform="rotate(-45 25 25)"/>
</svg>`;

const lightsaberSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <filter id="lsg" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.6"/>
    </filter>
  </defs>
  <rect x="22" y="2" width="4" height="32" fill="#6ec8ff" opacity="0.55" filter="url(#lsg)"/>
  <rect x="23" y="2" width="2" height="32" fill="#fff"/>
  <rect x="22.5" y="2" width="3" height="32" fill="#bfe9ff" opacity="0.9"/>
  <circle cx="24" cy="3" r="2" fill="#ffffff" opacity="0.9"/>
  <rect x="20" y="34" width="8" height="10" rx="1" fill="#2a2a36"/>
  <rect x="20" y="36" width="8" height="1.5" fill="#888"/>
  <rect x="20" y="40" width="8" height="1.5" fill="#888"/>
  <rect x="22" y="33" width="4" height="2" fill="#888"/>
</svg>`;

const wolverineSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="claw" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#f5f7fa"/>
      <stop offset="1" stop-color="#7c8590"/>
    </linearGradient>
  </defs>
  <polygon points="2,2 6,2 22,22 18,26" fill="url(#claw)" stroke="#1a1a2e" stroke-width="0.6"/>
  <polygon points="6,6 12,4 26,22 22,26" fill="url(#claw)" stroke="#1a1a2e" stroke-width="0.6"/>
  <polygon points="12,8 18,8 30,22 26,28" fill="url(#claw)" stroke="#1a1a2e" stroke-width="0.6"/>
  <path d="M18 26 L34 28 Q40 30 38 36 L24 38 Q18 36 18 26 Z" fill="#c9a44a" stroke="#5a3a1a" stroke-width="0.8"/>
  <circle cx="24" cy="32" r="1" fill="#1a1a2e"/>
  <circle cx="30" cy="33" r="1" fill="#1a1a2e"/>
</svg>`;

// ---- NEW: Portal Gun (Portal) ----
const portalgunSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <radialGradient id="pg-orange" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffd089"/><stop offset="1" stop-color="#ff7a00"/>
    </radialGradient>
    <radialGradient id="pg-blue" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#a5e8ff"/><stop offset="1" stop-color="#0080ff"/>
    </radialGradient>
  </defs>
  <rect x="14" y="22" width="22" height="10" rx="3" fill="#d1d4d8" stroke="#222" stroke-width="0.8"/>
  <rect x="30" y="18" width="10" height="14" rx="2" fill="#bfc3c8" stroke="#222" stroke-width="0.8"/>
  <circle cx="35" cy="25" r="4" fill="url(#pg-orange)"/>
  <rect x="20" y="32" width="6" height="10" rx="1" fill="#2a2a36" stroke="#000" stroke-width="0.6"/>
  <circle cx="6" cy="8" r="3.5" fill="url(#pg-blue)" opacity="0.95"/>
  <circle cx="6" cy="8" r="1.5" fill="#fff"/>
</svg>`;

// ---- NEW: Keyblade (Kingdom Hearts) ----
const keybladeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <line x1="6" y1="6" x2="32" y2="32" stroke="#e8b84a" stroke-width="3"/>
  <line x1="6" y1="6" x2="32" y2="32" stroke="#fff3b0" stroke-width="1"/>
  <rect x="2" y="2" width="6" height="6" fill="#ffd966" stroke="#5a3a1a" stroke-width="0.8"/>
  <rect x="3" y="3" width="2" height="2" fill="#fff"/>
  <rect x="28" y="34" width="10" height="4" fill="#5a3a1a" transform="rotate(-45 33 36)"/>
  <rect x="30" y="36" width="12" height="6" rx="1" fill="#3a2a1a" stroke="#1a1a1a" stroke-width="0.6"/>
  <circle cx="40" cy="42" r="3" fill="#ffd966" stroke="#5a3a1a" stroke-width="0.8"/>
  <path d="M40 42 m-1.5,0 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0" fill="#5a3a1a"/>
</svg>`;

// ---- NEW: Master Sword (Zelda) ----
const masterSwordSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <polygon points="24,2 26,4 26,32 22,32 22,4" fill="#e0e6ee" stroke="#1a1a2e" stroke-width="0.8"/>
  <line x1="24" y1="4" x2="24" y2="30" stroke="#7d8590" stroke-width="0.6"/>
  <rect x="14" y="32" width="20" height="3" fill="#ffd966" stroke="#5a3a1a" stroke-width="0.6"/>
  <polygon points="14,32 18,30 18,35" fill="#ffd966" stroke="#5a3a1a" stroke-width="0.6"/>
  <polygon points="34,32 30,30 30,35" fill="#ffd966" stroke="#5a3a1a" stroke-width="0.6"/>
  <rect x="22" y="35" width="4" height="9" fill="#3aaaff" stroke="#0a4a8a" stroke-width="0.6"/>
  <circle cx="24" cy="44" r="2.5" fill="#ffd966" stroke="#5a3a1a" stroke-width="0.6"/>
</svg>`;

// ---- NEW: Gravity Gun (Half-Life) ----
const gravityGunSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <radialGradient id="gg-core" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#ffaa33"/><stop offset="1" stop-color="#ff5500"/>
    </radialGradient>
  </defs>
  <rect x="16" y="20" width="20" height="8" rx="1" fill="#3a3a3a" stroke="#000" stroke-width="0.6"/>
  <polygon points="6,18 16,18 16,30 6,30 2,24" fill="#ffa033" stroke="#5a3a1a" stroke-width="0.6"/>
  <polygon points="6,14 16,18 16,30 6,34" fill="#ffa033" stroke="#5a3a1a" stroke-width="0.6"/>
  <circle cx="9" cy="24" r="3" fill="url(#gg-core)"/>
  <rect x="22" y="28" width="6" height="12" rx="1" fill="#2a2a2a" stroke="#000" stroke-width="0.6"/>
  <rect x="30" y="20" width="3" height="6" fill="#888"/>
</svg>`;

// ---- NEW: BFG 9000 (DOOM) ----
const bfgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <radialGradient id="bfg-core" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#eaffea"/><stop offset="0.4" stop-color="#33ff66"/><stop offset="1" stop-color="#0a5a1a"/>
    </radialGradient>
    <filter id="bfg-glow"><feGaussianBlur stdDeviation="1.4"/></filter>
  </defs>
  <rect x="14" y="20" width="24" height="10" rx="1" fill="#5a5a5a" stroke="#000" stroke-width="0.8"/>
  <rect x="2" y="22" width="14" height="6" rx="1" fill="#3a3a3a" stroke="#000" stroke-width="0.8"/>
  <circle cx="9" cy="25" r="5" fill="#33ff66" opacity="0.5" filter="url(#bfg-glow)"/>
  <circle cx="9" cy="25" r="3" fill="url(#bfg-core)"/>
  <rect x="20" y="30" width="8" height="12" rx="1" fill="#2a2a2a" stroke="#000" stroke-width="0.6"/>
  <rect x="30" y="14" width="6" height="8" fill="#5a5a5a" stroke="#000" stroke-width="0.6"/>
</svg>`;

// ---- NEW: Kar98 (PUBG/COD) ----
const kar98Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <rect x="2" y="22" width="42" height="3" fill="#1a1a1a"/>
  <rect x="20" y="20" width="14" height="7" rx="1" fill="#5a3a1a" stroke="#1a1a1a" stroke-width="0.6"/>
  <rect x="32" y="22" width="6" height="3" fill="#3a2a1a"/>
  <rect x="22" y="14" width="10" height="6" rx="1" fill="#2a2a2a" stroke="#000" stroke-width="0.6"/>
  <circle cx="27" cy="17" r="1.5" fill="#3aaaff"/>
  <rect x="34" y="26" width="4" height="6" fill="#3a2a1a"/>
  <line x1="32" y1="25" x2="38" y2="32" stroke="#5a3a1a" stroke-width="2"/>
</svg>`;

// ---- NEW: AWP scope (CS:GO) ----
const awpSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.4)" stroke="#1a1a1a" stroke-width="2"/>
  <circle cx="24" cy="24" r="18" fill="none" stroke="#1a1a1a" stroke-width="0.6"/>
  <line x1="24" y1="2" x2="24" y2="20" stroke="#000" stroke-width="1.5"/>
  <line x1="24" y1="28" x2="24" y2="46" stroke="#000" stroke-width="1.5"/>
  <line x1="2" y1="24" x2="20" y2="24" stroke="#000" stroke-width="1.5"/>
  <line x1="28" y1="24" x2="46" y2="24" stroke="#000" stroke-width="1.5"/>
  <line x1="24" y1="20" x2="24" y2="28" stroke="#ff0033" stroke-width="0.8"/>
  <line x1="20" y1="24" x2="28" y2="24" stroke="#ff0033" stroke-width="0.8"/>
  <text x="6" y="44" font-family="monospace" font-size="6" fill="#33ff33">x4</text>
</svg>`;

// ---- NEW: Mega Buster (Mega Man) ----
const busterSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" shape-rendering="crispEdges">
  <rect x="16" y="16" width="20" height="16" fill="#0099ff" stroke="#003366" stroke-width="0.8"/>
  <rect x="18" y="18" width="16" height="2" fill="#66ccff"/>
  <rect x="34" y="18" width="2" height="12" fill="#003366"/>
  <rect x="6" y="20" width="10" height="8" fill="#0066cc" stroke="#003366" stroke-width="0.8"/>
  <circle cx="11" cy="24" r="3" fill="#ffeb3b" stroke="#cc8800" stroke-width="0.6"/>
  <circle cx="11" cy="24" r="1" fill="#fff"/>
  <rect x="20" y="32" width="8" height="10" fill="#ff3344" stroke="#660000" stroke-width="0.6"/>
</svg>`;

// ---- NEW: Gunblade (FF8) ----
const gunbladeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <polygon points="2,4 6,2 36,32 32,36" fill="#dee3ea" stroke="#1a1a2e" stroke-width="0.8"/>
  <line x1="6" y1="2" x2="34" y2="34" stroke="#7d8590" stroke-width="0.6"/>
  <rect x="30" y="30" width="14" height="6" rx="1" fill="#2a2a36" stroke="#000" stroke-width="0.6" transform="rotate(-45 36 33)"/>
  <circle cx="36" cy="40" r="2" fill="#ffd966"/>
  <rect x="40" y="42" width="4" height="2" fill="#1a1a1a"/>
  <text x="22" y="20" font-family="serif" font-size="6" fill="#3aaaff" transform="rotate(45 24 18)">⚔</text>
</svg>`;

// ---- NEW: Warhammer (Thor) ----
const warhammerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <rect x="6" y="6" width="20" height="14" rx="1" fill="#7d8590" stroke="#1a1a2e" stroke-width="0.8"/>
  <rect x="6" y="6" width="20" height="3" fill="#a5b0bc"/>
  <rect x="6" y="17" width="20" height="3" fill="#5a6470"/>
  <rect x="10" y="10" width="3" height="6" fill="#3a4450"/>
  <rect x="19" y="10" width="3" height="6" fill="#3a4450"/>
  <rect x="24" y="20" width="4" height="20" fill="#5a3a1a" stroke="#1a1a1a" stroke-width="0.6" transform="rotate(35 26 30)"/>
  <rect x="22" y="38" width="8" height="3" fill="#3a2a1a" transform="rotate(35 26 40)"/>
</svg>`;

// ---- NEW: Chainsaw (DOOM/RE4) ----
const chainsawSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <rect x="2" y="20" width="28" height="8" rx="1" fill="#bfbfbf" stroke="#1a1a1a" stroke-width="0.8"/>
  <rect x="2" y="22" width="28" height="4" fill="#888"/>
  <g fill="#1a1a1a">
    <polygon points="4,20 6,18 8,20"/>
    <polygon points="9,20 11,18 13,20"/>
    <polygon points="14,20 16,18 18,20"/>
    <polygon points="19,20 21,18 23,20"/>
    <polygon points="24,20 26,18 28,20"/>
    <polygon points="4,28 6,30 8,28"/>
    <polygon points="9,28 11,30 13,28"/>
    <polygon points="14,28 16,30 18,28"/>
    <polygon points="19,28 21,30 23,28"/>
    <polygon points="24,28 26,30 28,28"/>
  </g>
  <rect x="28" y="14" width="14" height="20" rx="2" fill="#ff7a00" stroke="#5a2a00" stroke-width="0.8"/>
  <rect x="30" y="16" width="10" height="4" fill="#1a1a1a"/>
  <rect x="34" y="34" width="4" height="10" fill="#3a2a1a"/>
  <text x="32" y="29" font-family="monospace" font-size="5" fill="#fff" font-weight="bold">RIP</text>
</svg>`;

// ---- NEW: Plasma Rifle (Halo) ----
const plasmaRifleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="pr-body" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#6b4ec9"/><stop offset="1" stop-color="#3a2580"/>
    </linearGradient>
  </defs>
  <path d="M4 22 Q14 18 28 22 L36 22 Q42 24 36 28 L28 28 Q14 30 4 26 Z" fill="url(#pr-body)" stroke="#1a0d3a" stroke-width="0.8"/>
  <circle cx="36" cy="25" r="3" fill="#33eaff"/>
  <circle cx="36" cy="25" r="1.5" fill="#fff"/>
  <rect x="14" y="28" width="6" height="10" rx="1" fill="#2a1a55" stroke="#000" stroke-width="0.6"/>
  <rect x="6" y="20" width="4" height="2" fill="#33eaff" opacity="0.8"/>
</svg>`;

// ---- NEW: Needler (Halo) ----
const needlerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <rect x="10" y="22" width="22" height="8" rx="1" fill="#5a2080" stroke="#2a0a40" stroke-width="0.8"/>
  <g fill="#ff66ff" stroke="#aa00aa" stroke-width="0.5">
    <polygon points="10,22 8,16 12,16"/>
    <polygon points="14,22 12,14 16,14"/>
    <polygon points="18,22 16,12 20,12"/>
    <polygon points="22,22 20,14 24,14"/>
    <polygon points="26,22 24,16 28,16"/>
  </g>
  <rect x="32" y="22" width="6" height="3" fill="#3a1058"/>
  <rect x="14" y="30" width="6" height="10" rx="1" fill="#3a1058" stroke="#000" stroke-width="0.6"/>
</svg>`;

// ---- NEW: Crossbow ----
const crossbowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <path d="M4 20 Q24 6 44 20" fill="none" stroke="#5a3a1a" stroke-width="3" stroke-linecap="round"/>
  <line x1="6" y1="20" x2="42" y2="20" stroke="#bbb" stroke-width="0.6"/>
  <rect x="20" y="20" width="8" height="20" fill="#5a3a1a" stroke="#1a1a1a" stroke-width="0.6"/>
  <polygon points="20,40 28,40 30,46 18,46" fill="#3a2a1a" stroke="#1a1a1a" stroke-width="0.6"/>
  <polygon points="22,4 26,4 24,20" fill="#bfbfbf" stroke="#000" stroke-width="0.6"/>
  <rect x="23" y="14" width="2" height="8" fill="#5a3a1a"/>
</svg>`;

// ---- NEW: Katana ----
const katanaSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <path d="M2 6 Q8 4 36 30 L34 32 Q8 8 2 8 Z" fill="#e8eef5" stroke="#1a1a2e" stroke-width="0.8"/>
  <line x1="3" y1="7" x2="35" y2="31" stroke="#a0a8b0" stroke-width="0.4"/>
  <rect x="32" y="30" width="6" height="4" fill="#1a1a1a" transform="rotate(-45 35 32)"/>
  <rect x="34" y="32" width="12" height="3" fill="#5a1a1a" stroke="#000" stroke-width="0.4" transform="rotate(-45 40 34)"/>
  <g stroke="#3a2a1a" stroke-width="0.6" transform="rotate(-45 40 34)">
    <line x1="36" y1="32" x2="36" y2="35"/>
    <line x1="40" y1="32" x2="40" y2="35"/>
    <line x1="44" y1="32" x2="44" y2="35"/>
  </g>
</svg>`;

// ---- NEW: Shuriken (Naruto/ninja) ----
const shurikenSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <g fill="#5a6470" stroke="#1a1a2e" stroke-width="0.8">
    <polygon points="24,4 28,20 24,24 20,20"/>
    <polygon points="44,24 28,28 24,24 28,20"/>
    <polygon points="24,44 20,28 24,24 28,28"/>
    <polygon points="4,24 20,20 24,24 20,28"/>
  </g>
  <circle cx="24" cy="24" r="3" fill="#1a1a2e"/>
  <circle cx="24" cy="24" r="1.5" fill="#bfbfbf"/>
</svg>`;

// ---- NEW: Magic Wand (HP/Magic) ----
const magicWandSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <radialGradient id="mw-spark" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#ffeb3b"/><stop offset="1" stop-color="#ff66ff" stop-opacity="0"/>
    </radialGradient>
    <filter id="mw-glow"><feGaussianBlur stdDeviation="1.2"/></filter>
  </defs>
  <line x1="6" y1="6" x2="36" y2="36" stroke="#5a3a1a" stroke-width="3" stroke-linecap="round"/>
  <line x1="7" y1="7" x2="35" y2="35" stroke="#8b5a2b" stroke-width="1"/>
  <rect x="32" y="32" width="6" height="6" rx="1" fill="#3a2a1a"/>
  <circle cx="6" cy="6" r="6" fill="url(#mw-spark)" filter="url(#mw-glow)"/>
  <circle cx="6" cy="6" r="2" fill="#fff"/>
  <g fill="#ffeb3b">
    <circle cx="14" cy="4" r="1"/>
    <circle cx="4" cy="14" r="1"/>
    <circle cx="18" cy="10" r="0.8"/>
  </g>
</svg>`;

// ---- NEW: Bomb (Bomberman/cartoon bomb) ----
const bombSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <radialGradient id="bomb-shine" cx="0.35" cy="0.35" r="0.5">
      <stop offset="0" stop-color="#666"/><stop offset="1" stop-color="#1a1a1a"/>
    </radialGradient>
  </defs>
  <circle cx="24" cy="28" r="14" fill="url(#bomb-shine)" stroke="#000" stroke-width="0.8"/>
  <ellipse cx="20" cy="22" rx="3" ry="2" fill="#888" opacity="0.6"/>
  <rect x="22" y="10" width="4" height="6" fill="#3a2a1a"/>
  <path d="M24 10 Q30 6 28 2" fill="none" stroke="#5a3a1a" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="28" cy="2" r="2" fill="#ff7a00"/>
  <circle cx="28" cy="2" r="1" fill="#ffeb3b"/>
  <g fill="#ffeb3b">
    <polygon points="28,-2 29,1 32,2 29,3 28,6 27,3 24,2 27,1"/>
  </g>
</svg>`;

// ---- NEW: Fishing Rod (Animal Crossing) ----
const fishingRodSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <line x1="6" y1="42" x2="36" y2="6" stroke="#5a3a1a" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="36" y1="6" x2="40" y2="40" stroke="#fff" stroke-width="0.6"/>
  <rect x="2" y="40" width="10" height="4" rx="1" fill="#3a2a1a"/>
  <circle cx="12" cy="38" r="2" fill="#bbb" stroke="#000" stroke-width="0.4"/>
  <circle cx="40" cy="40" r="2" fill="#ff3344" stroke="#660000" stroke-width="0.6"/>
  <circle cx="40" cy="40" r="1" fill="#fff"/>
  <path d="M40 42 Q42 44 40 46 Q38 44 40 42" fill="#33aaff" opacity="0.6"/>
</svg>`;

// ---- NEW: Boomerang ----
const boomerangSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <path d="M8 8 Q24 4 40 16 L36 22 Q24 14 14 18 L20 30 L14 32 Z" fill="#c9a44a" stroke="#5a3a1a" stroke-width="1"/>
  <path d="M10 10 Q22 8 36 18" fill="none" stroke="#5a3a1a" stroke-width="0.6"/>
  <path d="M16 22 L20 30" stroke="#5a3a1a" stroke-width="0.6"/>
  <g fill="none" stroke="#fff" stroke-width="1" opacity="0.5">
    <path d="M40 36 Q44 40 40 44"/>
    <path d="M36 38 Q42 44 38 48"/>
  </g>
</svg>`;

export const CURSORS: Record<CursorKind, { label: string; value: string; sub: string }> = {
  default:     { label: "Default",    value: "auto",                       sub: "Tu mouse normal" },
  csgo:        { label: "CS:GO",      value: enc(csgoSvg),                 sub: "Crosshair clásico verde" },
  valorant:    { label: "Valorant",   value: enc(valorantSvg),             sub: "Reticle rojo táctico" },
  bow:         { label: "MC Bow",     value: enc(bowSvg),                  sub: "Mira de arco" },
  sniper:      { label: "Sniper",     value: enc(sniperSvg),               sub: "Mira de francotirador" },
  pickaxe:     { label: "Pickaxe",    value: enc(pickaxeSvg, 6, 6),        sub: "Pico de Minecraft ⛏️" },
  halo:        { label: "Halo Sword", value: enc(haloSvg, 4, 4),           sub: "Energy sword azul" },
  lightsaber:  { label: "Lightsaber", value: enc(lightsaberSvg, 24, 4),    sub: "Sable de luz ⚔️" },
  wolverine:   { label: "Claws",      value: enc(wolverineSvg, 4, 4),      sub: "Garra de Wolverine" },
  // New batch
  portalgun:   { label: "Portal Gun", value: enc(portalgunSvg, 6, 8),      sub: "ASHPD — Portal" },
  keyblade:    { label: "Keyblade",   value: enc(keybladeSvg, 4, 4),       sub: "Llave-espada Sora" },
  masterSword: { label: "M. Sword",   value: enc(masterSwordSvg, 24, 4),   sub: "Espada Maestra de Zelda" },
  gravityGun: { label: "Gravity Gun", value: enc(gravityGunSvg, 4, 24),    sub: "Half-Life 2" },
  bfg:         { label: "BFG 9000",   value: enc(bfgSvg, 4, 24),           sub: "DOOM — boom verde" },
  kar98:       { label: "Kar98",      value: enc(kar98Svg, 4, 24),         sub: "Rifle de cerrojo" },
  awp:         { label: "AWP Scope",  value: enc(awpSvg),                  sub: "Mira AWP CS:GO" },
  buster:      { label: "Mega Buster",value: enc(busterSvg, 6, 24),        sub: "Cañón de Mega Man" },
  gunblade:    { label: "Gunblade",   value: enc(gunbladeSvg, 4, 4),       sub: "Squall — FF8" },
  warhammer:   { label: "Mjolnir",    value: enc(warhammerSvg, 8, 8),      sub: "Martillo de guerra" },
  chainsaw:    { label: "Chainsaw",   value: enc(chainsawSvg, 4, 24),      sub: "Motosierra — DOOM" },
  plasmaRifle: { label: "Plasma",     value: enc(plasmaRifleSvg, 4, 24),   sub: "Rifle de plasma Covenant" },
  needler:     { label: "Needler",    value: enc(needlerSvg, 4, 26),       sub: "Agujas rosas explosivas" },
  crossbow:    { label: "Crossbow",   value: enc(crossbowSvg, 24, 4),      sub: "Ballesta medieval" },
  katana:      { label: "Katana",     value: enc(katanaSvg, 2, 6),         sub: "Filo japonés" },
  shuriken:    { label: "Shuriken",   value: enc(shurikenSvg),             sub: "Estrella ninja" },
  magicWand:   { label: "Magic Wand", value: enc(magicWandSvg, 6, 6),      sub: "Varita mágica ✨" },
  bomb:        { label: "Bomb",       value: enc(bombSvg, 24, 28),         sub: "Bomberman 💣" },
  fishingRod:  { label: "Fishing",    value: enc(fishingRodSvg, 36, 6),    sub: "Caña de Animal Crossing" },
  boomerang:   { label: "Boomerang",  value: enc(boomerangSvg, 24, 16),    sub: "Vuelve siempre" },
};

// Visual preview SVG (for buttons)
export const CURSOR_PREVIEWS: Record<CursorKind, string> = {
  default: "",
  csgo: csgoSvg, valorant: valorantSvg, bow: bowSvg, sniper: sniperSvg,
  pickaxe: pickaxeSvg, halo: haloSvg, lightsaber: lightsaberSvg, wolverine: wolverineSvg,
  portalgun: portalgunSvg, keyblade: keybladeSvg, masterSword: masterSwordSvg,
  gravityGun: gravityGunSvg, bfg: bfgSvg, kar98: kar98Svg, awp: awpSvg,
  buster: busterSvg, gunblade: gunbladeSvg, warhammer: warhammerSvg,
  chainsaw: chainsawSvg, plasmaRifle: plasmaRifleSvg, needler: needlerSvg,
  crossbow: crossbowSvg, katana: katanaSvg, shuriken: shurikenSvg,
  magicWand: magicWandSvg, bomb: bombSvg, fishingRod: fishingRodSvg, boomerang: boomerangSvg,
};

/** Sound effect to play when clicking with this cursor. */
export const CURSOR_SOUND: Record<CursorKind, string | null> = {
  default: null,
  csgo: "shoot", valorant: "shoot", bow: "bow", sniper: "sniper",
  pickaxe: "pickaxe", halo: "halo", lightsaber: "lightsaber", wolverine: "claws",
  // New batch
  portalgun:   "portal",
  keyblade:    "keyblade",
  masterSword: "swordSlash",
  gravityGun:  "gravity",
  bfg:         "bfg",
  kar98:       "kar98",
  awp:         "awp",
  buster:      "buster",
  gunblade:    "gunblade",
  warhammer:   "hammer",
  chainsaw:    "chainsaw",
  plasmaRifle: "plasma",
  needler:     "needler",
  crossbow:    "crossbow",
  katana:      "katana",
  shuriken:    "shuriken",
  magicWand:   "magic",
  bomb:        "bomb",
  fishingRod:  "splash",
  boomerang:   "whoosh",
};
