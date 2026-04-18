// Standalone pet renderer for the Electron transparent window.
// No React, no bundler — runs directly in the BrowserWindow.

const SPRITES = {
  cat: ({ facing, step }) => `
    <svg viewBox="0 0 32 32" width="80" height="80" style="transform:${facing==='left'?'scaleX(-1)':'none'};image-rendering:pixelated">
      <rect x="6" y="14" width="20" height="10" rx="3" fill="#f5b35a"/>
      <rect x="6" y="14" width="20" height="2" fill="#e69a3d"/>
      <rect x="9" y="6" width="14" height="11" rx="2" fill="#ffc879"/>
      <polygon points="9,6 13,2 13,8" fill="#f5b35a"/>
      <polygon points="23,6 19,2 19,8" fill="#f5b35a"/>
      <polygon points="11,5 12,3 13,5" fill="#ff9bbf"/>
      <polygon points="21,5 20,3 19,5" fill="#ff9bbf"/>
      <rect x="12" y="10" width="2" height="3" fill="#1a1a1a"/>
      <rect x="18" y="10" width="2" height="3" fill="#1a1a1a"/>
      <rect x="15" y="13" width="2" height="1" fill="#ff7aa8"/>
      <rect x="8" y="${24 + (step%2===0?0:-1)}" width="3" height="4" fill="#e69a3d"/>
      <rect x="13" y="${24 - (step%2===0?0:-1)}" width="3" height="4" fill="#e69a3d"/>
      <rect x="17" y="${24 + (step%2===0?0:-1)}" width="3" height="4" fill="#e69a3d"/>
      <rect x="22" y="${24 - (step%2===0?0:-1)}" width="3" height="4" fill="#e69a3d"/>
      <rect x="26" y="12" width="2" height="8" fill="#f5b35a" transform="rotate(20 27 16)"/>
    </svg>`,
  dog: ({ facing, step }) => `
    <svg viewBox="0 0 32 32" width="80" height="80" style="transform:${facing==='left'?'scaleX(-1)':'none'};image-rendering:pixelated">
      <rect x="5" y="14" width="22" height="10" rx="3" fill="#d8a070"/>
      <rect x="8" y="6" width="14" height="11" rx="3" fill="#e8b685"/>
      <rect x="6" y="7" width="4" height="9" rx="2" fill="#a86f4a"/>
      <rect x="22" y="7" width="4" height="9" rx="2" fill="#a86f4a"/>
      <rect x="11" y="10" width="2" height="3" fill="#1a1a1a"/>
      <rect x="17" y="10" width="2" height="3" fill="#1a1a1a"/>
      <rect x="14" y="13" width="3" height="2" fill="#1a1a1a"/>
      <rect x="7" y="${24 + (step%2===0?0:-1)}" width="3" height="4" fill="#b87f55"/>
      <rect x="12" y="${24 - (step%2===0?0:-1)}" width="3" height="4" fill="#b87f55"/>
      <rect x="17" y="${24 + (step%2===0?0:-1)}" width="3" height="4" fill="#b87f55"/>
      <rect x="22" y="${24 - (step%2===0?0:-1)}" width="3" height="4" fill="#b87f55"/>
    </svg>`,
  slime: ({ step }) => {
    const sq = step % 2 === 0 ? 1 : 0.92;
    return `
    <svg viewBox="0 0 32 32" width="80" height="80" style="image-rendering:pixelated">
      <g transform="translate(16 28) scale(${sq} ${1/sq}) translate(-16 -28)">
        <path d="M4 26 Q4 10 16 10 Q28 10 28 26 Z" fill="#7af5b0"/>
        <ellipse cx="11" cy="14" rx="2" ry="3" fill="#1a1a1a"/>
        <ellipse cx="21" cy="14" rx="2" ry="3" fill="#1a1a1a"/>
        <path d="M13 19 Q16 22 19 19" stroke="#1a1a1a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="9" cy="11" rx="2" ry="1" fill="#fff" opacity="0.7"/>
      </g>
    </svg>`;
  },
  dragon: ({ facing, step }) => {
    const wy = step%2===0?0:-2;
    return `
    <svg viewBox="0 0 32 32" width="80" height="80" style="transform:${facing==='left'?'scaleX(-1)':'none'};image-rendering:pixelated">
      <rect x="6" y="13" width="20" height="11" rx="4" fill="#b56cff"/>
      <path d="M11 ${10+wy} Q16 ${2+wy} 21 ${10+wy} L18 14 L14 14 Z" fill="#7a2fb5"/>
      <rect x="9" y="6" width="14" height="11" rx="3" fill="#c386ff"/>
      <rect x="12" y="10" width="2" height="3" fill="#1a1a1a"/>
      <rect x="18" y="10" width="2" height="3" fill="#1a1a1a"/>
      <rect x="14" y="14" width="4" height="1" fill="#ff5599"/>
      <rect x="9" y="24" width="3" height="4" fill="#9648d8"/>
      <rect x="20" y="24" width="3" height="4" fill="#9648d8"/>
    </svg>`;
  },
  ghost: ({ step }) => {
    const f = step%2===0?0:-2;
    return `
    <svg viewBox="0 0 32 32" width="80" height="80" style="transform:translateY(${f}px);image-rendering:pixelated">
      <path d="M6 14 Q6 4 16 4 Q26 4 26 14 V26 L23 23 L20 26 L17 23 L14 26 L11 23 L8 26 L6 24 Z" fill="#e8edff"/>
      <ellipse cx="12" cy="14" rx="2" ry="3" fill="#1a1a2e"/>
      <ellipse cx="20" cy="14" rx="2" ry="3" fill="#1a1a2e"/>
      <ellipse cx="11" cy="19" rx="2" ry="1" fill="#ffb3c8" opacity="0.7"/>
      <ellipse cx="21" cy="19" rx="2" ry="1" fill="#ffb3c8" opacity="0.7"/>
    </svg>`;
  },
  robot: ({ facing, step }) => {
    const eb = step%2===0?3:1;
    return `
    <svg viewBox="0 0 32 32" width="80" height="80" style="transform:${facing==='left'?'scaleX(-1)':'none'};image-rendering:pixelated">
      <rect x="15" y="2" width="2" height="3" fill="#9ad4ff"/>
      <circle cx="16" cy="2" r="1.5" fill="#ff5577"/>
      <rect x="8" y="5" width="16" height="11" rx="2" fill="#5b6ad0"/>
      <rect x="11" y="9" width="3" height="${eb}" fill="#9affff"/>
      <rect x="18" y="9" width="3" height="${eb}" fill="#9affff"/>
      <rect x="13" y="13" width="6" height="1" fill="#1a1a2e"/>
      <rect x="6" y="16" width="20" height="9" rx="2" fill="#7686e8"/>
      <rect x="9" y="25" width="4" height="4" fill="#3e4ca8"/>
      <rect x="19" y="25" width="4" height="4" fill="#3e4ca8"/>
    </svg>`;
  },
};

const PHRASES = ["¡Hola!", "♥", "*nya*", "play?", "boop!", "✨", "zzz...", "(•ᴗ•)"];

const params = new URLSearchParams(window.location.search);
let kind = params.get("kind") || "cat";
let follow = params.get("follow") === "1";

const pet = document.getElementById("pet");
const SIZE = 80;
let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let target = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };
let facing = "right";
let step = 0;
let idle = false;
let cursor = { x: pos.x, y: pos.y };

function render() {
  if (!SPRITES[kind]) kind = "cat";
  pet.innerHTML = SPRITES[kind]({ facing, step });
  pet.style.left = pos.x + "px";
  pet.style.top = pos.y + "px";
}

window.addEventListener("mousemove", (e) => {
  cursor = { x: e.clientX, y: e.clientY };
});

setInterval(() => {
  idle = Math.random() < 0.2;
  target = {
    x: Math.random() * (window.innerWidth - SIZE - 40) + 20,
    y: Math.random() * (window.innerHeight - SIZE - 100) + 50,
  };
}, 3500);

setInterval(() => { step++; render(); }, 180);

function tick() {
  if (!idle) {
    const t = follow ? cursor : target;
    const cx = pos.x + SIZE / 2;
    const cy = pos.y + SIZE / 2;
    const dx = t.x - cx;
    const dy = t.y - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > 6) {
      const speed = 1.6;
      pos.x += (dx / dist) * speed;
      pos.y += (dy / dist) * speed;
      facing = dx > 0 ? "right" : "left";
    }
  }
  render();
  requestAnimationFrame(tick);
}
render();
tick();

setInterval(() => {
  if (Math.random() < 0.3) {
    const b = document.createElement("div");
    b.className = "bubble";
    b.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    b.style.left = (pos.x + SIZE / 2) + "px";
    b.style.top = pos.y + "px";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1700);
  }
}, 8000);

window.addEventListener("message", (e) => {
  if (e.data?.type === "set-pet") { kind = e.data.kind; render(); }
  if (e.data?.type === "set-follow") { follow = !!e.data.value; }
});

// === System awareness ===
function speakOnce(text, ttl) {
  const b = document.createElement("div");
  b.className = "bubble";
  b.textContent = text;
  b.style.left = (pos.x + SIZE / 2) + "px";
  b.style.top = pos.y + "px";
  document.body.appendChild(b);
  setTimeout(() => b.remove(), ttl || 2200);
}

// Idle detection (mousemove forwarded by transparent window)
let lastMove = Date.now();
window.addEventListener("mousemove", () => { lastMove = Date.now(); });
let isSleeping = false;
setInterval(() => {
  const idleSec = (Date.now() - lastMove) / 1000;
  if (idleSec > 45 && !isSleeping) {
    isSleeping = true; idle = true; speakOnce("zzz...");
  } else if (idleSec < 5 && isSleeping) {
    isSleeping = false; idle = false; speakOnce("¡volviste!");
  }
}, 2000);

// Battery awareness
if (navigator.getBattery) {
  navigator.getBattery().then((batt) => {
    let warned = false;
    const check = () => {
      if (batt.level < 0.2 && !batt.charging && !warned) {
        warned = true; speakOnce("¡batería baja! 🪫", 3000);
      } else if ((batt.level >= 0.25 || batt.charging) && warned) {
        warned = false;
      }
    };
    check();
    batt.addEventListener("levelchange", check);
    batt.addEventListener("chargingchange", check);
  }).catch(() => {});
}

// Time of day greeting
(function greet() {
  const h = new Date().getHours();
  let msg = null;
  if (h >= 5 && h < 9) msg = "¡buenos días! 🌅";
  else if (h >= 22 || h < 5) msg = "tarde, ¿no? 🌙";
  if (msg) setTimeout(() => speakOnce(msg, 3000), 1500);
})();
