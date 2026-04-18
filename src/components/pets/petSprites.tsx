import type { ReactNode } from "react";

export type PetKind =
  | "cat" | "dog" | "slime" | "dragon" | "ghost" | "robot"
  | "axolotl" | "capybara" | "penguin" | "fox" | "panda" | "unicorn" | "bunny" | "monkey"
  | "cthulhu" | "shoggoth" | "blackgoat" | "necronomicon"
  | "slimemage" | "yurei" | "mushroom" | "alien"
  // Videogames
  | "pikachu" | "kirby" | "creeper" | "yoshi" | "metroid"
  | "companionCube" | "chocobo" | "booMario" | "bulborb" | "headcrab"
  | "isaac"
  // Sci-fi / Horror
  | "facehugger" | "xenomorph" | "dalek" | "tribble" | "bb8"
  | "weepingAngel" | "gremlin" | "chestburster" | "yautja"
  // New batch 2
  | "mario" | "sonic" | "amongUs" | "totoro" | "jigglypuff"
  | "doge" | "nyanCat" | "bear" | "turtle" | "owl";

export type PetDef = {
  kind: PetKind;
  name: string;
  style: string;
  size: number;
  render: (facing: "left" | "right", step: number) => ReactNode;
};

const flip = (facing: "left" | "right") =>
  facing === "left" ? "scale(-1,1)" : "scale(1,1)";

// ---------- Originals ----------

function CatSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="6" y="14" width="20" height="10" rx="3" fill="#f5b35a" />
      <rect x="6" y="14" width="20" height="2" fill="#e69a3d" />
      <rect x="9" y="6" width="14" height="11" rx="2" fill="#ffc879" />
      <polygon points="9,6 13,2 13,8" fill="#f5b35a" />
      <polygon points="23,6 19,2 19,8" fill="#f5b35a" />
      <polygon points="11,5 12,3 13,5" fill="#ff9bbf" />
      <polygon points="21,5 20,3 19,5" fill="#ff9bbf" />
      <rect x="12" y="10" width="2" height="3" fill="#1a1a1a" />
      <rect x="18" y="10" width="2" height="3" fill="#1a1a1a" />
      <rect x="12" y="10" width="1" height="1" fill="#fff" />
      <rect x="18" y="10" width="1" height="1" fill="#fff" />
      <rect x="15" y="13" width="2" height="1" fill="#ff7aa8" />
      <rect x="8" y={24 + legY} width="3" height="4" fill="#e69a3d" />
      <rect x="13" y={24 - legY} width="3" height="4" fill="#e69a3d" />
      <rect x="17" y={24 + legY} width="3" height="4" fill="#e69a3d" />
      <rect x="22" y={24 - legY} width="3" height="4" fill="#e69a3d" />
      <rect x="26" y="12" width="2" height="8" fill="#f5b35a" transform="rotate(20 27 16)" />
    </svg>
  );
}
function DogSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="5" y="14" width="22" height="10" rx="3" fill="#d8a070" />
      <rect x="8" y="6" width="14" height="11" rx="3" fill="#e8b685" />
      <rect x="6" y="7" width="4" height="9" rx="2" fill="#a86f4a" />
      <rect x="22" y="7" width="4" height="9" rx="2" fill="#a86f4a" />
      <rect x="11" y="10" width="2" height="3" fill="#1a1a1a" />
      <rect x="17" y="10" width="2" height="3" fill="#1a1a1a" />
      <rect x="14" y="13" width="3" height="2" fill="#1a1a1a" />
      <rect x="7" y={24 + legY} width="3" height="4" fill="#b87f55" />
      <rect x="12" y={24 - legY} width="3" height="4" fill="#b87f55" />
      <rect x="17" y={24 + legY} width="3" height="4" fill="#b87f55" />
      <rect x="22" y={24 - legY} width="3" height="4" fill="#b87f55" />
      <rect x="27" y="14" width="3" height="2" fill="#d8a070" />
    </svg>
  );
}
function SlimeSprite({ step }: { facing: "left" | "right"; step: number }) {
  const squish = step % 2 === 0 ? 1 : 0.92;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <g transform={`translate(16 28) scale(${squish} ${1/squish}) translate(-16 -28)`}>
        <path d="M4 26 Q4 10 16 10 Q28 10 28 26 Z" fill="#7af5b0" />
        <path d="M4 26 Q4 14 16 14 Q28 14 28 26 Z" fill="#9affc8" />
        <ellipse cx="11" cy="14" rx="2" ry="3" fill="#1a1a1a" />
        <ellipse cx="21" cy="14" rx="2" ry="3" fill="#1a1a1a" />
        <ellipse cx="10.5" cy="13" rx="0.7" ry="1" fill="#fff" />
        <ellipse cx="20.5" cy="13" rx="0.7" ry="1" fill="#fff" />
        <path d="M13 19 Q16 22 19 19" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <ellipse cx="9" cy="11" rx="2" ry="1" fill="#fff" opacity="0.7" />
      </g>
    </svg>
  );
}
function DragonSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const wingY = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <path d="M28 18 Q32 22 28 26" stroke="#a05ad8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="6" y="13" width="20" height="11" rx="4" fill="#b56cff" />
      <rect x="6" y="13" width="20" height="3" fill="#9648d8" />
      <path d={`M11 ${10 + wingY} Q16 ${2 + wingY} 21 ${10 + wingY} L18 14 L14 14 Z`} fill="#7a2fb5" />
      <rect x="9" y="6" width="14" height="11" rx="3" fill="#c386ff" />
      <polygon points="10,6 12,3 13,7" fill="#7a2fb5" />
      <polygon points="22,6 20,3 19,7" fill="#7a2fb5" />
      <rect x="12" y="10" width="2" height="3" fill="#1a1a1a" />
      <rect x="18" y="10" width="2" height="3" fill="#1a1a1a" />
      <rect x="14" y="14" width="4" height="1" fill="#ff5599" />
      <rect x="9" y="24" width="3" height="4" fill="#9648d8" />
      <rect x="20" y="24" width="3" height="4" fill="#9648d8" />
    </svg>
  );
}
function GhostSprite({ step }: { facing: "left" | "right"; step: number }) {
  const float = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${float}px)`, imageRendering: "pixelated" }}>
      <path d="M6 14 Q6 4 16 4 Q26 4 26 14 V26 L23 23 L20 26 L17 23 L14 26 L11 23 L8 26 L6 24 Z" fill="#e8edff" />
      <ellipse cx="12" cy="14" rx="2" ry="3" fill="#1a1a2e" />
      <ellipse cx="20" cy="14" rx="2" ry="3" fill="#1a1a2e" />
      <ellipse cx="11" cy="19" rx="2" ry="1" fill="#ffb3c8" opacity="0.7" />
      <ellipse cx="21" cy="19" rx="2" ry="1" fill="#ffb3c8" opacity="0.7" />
    </svg>
  );
}
function RobotSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const eyeBlink = step % 2 === 0 ? 3 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="15" y="2" width="2" height="3" fill="#9ad4ff" />
      <circle cx="16" cy="2" r="1.5" fill="#ff5577" />
      <rect x="8" y="5" width="16" height="11" rx="2" fill="#5b6ad0" />
      <rect x="11" y={9} width="3" height={eyeBlink} fill="#9affff" />
      <rect x="18" y={9} width="3" height={eyeBlink} fill="#9affff" />
      <rect x="13" y="13" width="6" height="1" fill="#1a1a2e" />
      <rect x="6" y="16" width="20" height="9" rx="2" fill="#7686e8" />
      <circle cx="12" cy="20" r="1.2" fill="#ff5577" />
      <circle cx="16" cy="20" r="1.2" fill="#ffd055" />
      <circle cx="20" cy="20" r="1.2" fill="#9affc8" />
      <rect x="9" y="25" width="4" height="4" fill="#3e4ca8" />
      <rect x="19" y="25" width="4" height="4" fill="#3e4ca8" />
    </svg>
  );
}

// ---------- New mascots ----------

function AxolotlSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const wig = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <path d="M28 18 Q32 22 28 26" stroke="#ff8fb8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="6" y="14" width="20" height="11" rx="6" fill="#ffb3d1" />
      <rect x="9" y="7" width="14" height="11" rx="5" fill="#ffc4dc" />
      {/* gills */}
      <path d={`M9 ${8 + wig} Q5 ${10 + wig} 7 ${14 + wig}`} stroke="#ff7aa8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M9 ${10 - wig} Q4 ${13 - wig} 7 ${17 - wig}`} stroke="#ff7aa8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M23 ${8 + wig} Q27 ${10 + wig} 25 ${14 + wig}`} stroke="#ff7aa8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M23 ${10 - wig} Q28 ${13 - wig} 25 ${17 - wig}`} stroke="#ff7aa8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="12" r="1.4" fill="#1a1a2e" />
      <circle cx="19" cy="12" r="1.4" fill="#1a1a2e" />
      <circle cx="12.6" cy="11.6" r="0.4" fill="#fff" />
      <circle cx="18.6" cy="11.6" r="0.4" fill="#fff" />
      <path d="M14 15 Q16 17 18 15" stroke="#1a1a2e" strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="14" rx="1.2" ry="0.7" fill="#ff7aa8" opacity="0.6" />
      <ellipse cx="21" cy="14" rx="1.2" ry="0.7" fill="#ff7aa8" opacity="0.6" />
    </svg>
  );
}

function CapybaraSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <ellipse cx="17" cy="18" rx="12" ry="7" fill="#a37050" />
      <ellipse cx="9" cy="14" rx="6" ry="5" fill="#b58060" />
      <rect x="3" y="13" width="3" height="3" rx="1" fill="#a37050" />
      <rect x="6" y="11" width="2" height="2" fill="#a37050" />
      <circle cx="7" cy="14" r="1" fill="#1a1a2e" />
      <rect x="4" y="14" width="2" height="1" fill="#1a1a2e" />
      <rect x={8 + legY} y="22" width="2" height="4" fill="#7a4f30" />
      <rect x={14 - legY} y="22" width="2" height="4" fill="#7a4f30" />
      <rect x={20 + legY} y="22" width="2" height="4" fill="#7a4f30" />
      <rect x={25 - legY} y="22" width="2" height="4" fill="#7a4f30" />
      {/* tiny orange on head */}
      <circle cx="9" cy="9" r="2" fill="#ff8c42" />
      <path d="M9 7 Q10 6 11 7" stroke="#3a8a3e" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function PenguinSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const wing = step % 2 === 0 ? 0 : 2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="17" rx="9" ry="11" fill="#1a1a2e" />
      <ellipse cx="16" cy="19" rx="6" ry="9" fill="#f5f5fa" />
      <circle cx="13" cy="11" r="1.3" fill="#fff" />
      <circle cx="19" cy="11" r="1.3" fill="#fff" />
      <circle cx="13" cy="11" r="0.7" fill="#1a1a2e" />
      <circle cx="19" cy="11" r="0.7" fill="#1a1a2e" />
      {/* beak */}
      <polygon points="14,14 18,14 16,17" fill="#ff8c1f" />
      {/* wings */}
      <path d={`M7 ${14 + wing} Q4 18 7 22 L9 21 L9 15 Z`} fill="#1a1a2e" />
      <path d={`M25 ${14 - wing} Q28 18 25 22 L23 21 L23 15 Z`} fill="#1a1a2e" />
      {/* feet */}
      <rect x="12" y="27" width="3" height="2" fill="#ff8c1f" />
      <rect x="17" y="27" width="3" height="2" fill="#ff8c1f" />
    </svg>
  );
}

function FoxSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="6" y="14" width="20" height="10" rx="3" fill="#ff7a3d" />
      <rect x="6" y="20" width="20" height="4" rx="2" fill="#fff5e6" />
      <rect x="9" y="6" width="14" height="11" rx="3" fill="#ff8a4a" />
      <polygon points="9,6 11,1 14,7" fill="#ff7a3d" />
      <polygon points="23,6 21,1 18,7" fill="#ff7a3d" />
      <polygon points="11,4 12,2 13,5" fill="#1a1a2e" />
      <polygon points="21,4 20,2 19,5" fill="#1a1a2e" />
      {/* white face */}
      <path d="M11 12 Q16 18 21 12 L21 17 L11 17 Z" fill="#fff5e6" />
      <circle cx="13" cy="11" r="1.2" fill="#1a1a2e" />
      <circle cx="19" cy="11" r="1.2" fill="#1a1a2e" />
      <circle cx="16" cy="14.5" r="0.8" fill="#1a1a2e" />
      <rect x={8 + legY} y="24" width="3" height="4" fill="#1a1a2e" />
      <rect x={13 - legY} y="24" width="3" height="4" fill="#1a1a2e" />
      <rect x={17 + legY} y="24" width="3" height="4" fill="#1a1a2e" />
      <rect x={22 - legY} y="24" width="3" height="4" fill="#1a1a2e" />
      {/* fluffy tail */}
      <ellipse cx="28" cy="16" rx="3" ry="5" fill="#ff7a3d" transform="rotate(20 28 16)" />
      <ellipse cx="29" cy="13" rx="2" ry="2" fill="#fff5e6" />
    </svg>
  );
}

function PandaSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="6" y="14" width="20" height="10" rx="4" fill="#fafafa" />
      <ellipse cx="9" cy="17" rx="3" ry="4" fill="#1a1a2e" />
      <ellipse cx="23" cy="17" rx="3" ry="4" fill="#1a1a2e" />
      <rect x="9" y="6" width="14" height="12" rx="5" fill="#fafafa" />
      {/* ears */}
      <circle cx="10" cy="6" r="2.5" fill="#1a1a2e" />
      <circle cx="22" cy="6" r="2.5" fill="#1a1a2e" />
      {/* eye patches */}
      <ellipse cx="13" cy="12" rx="2" ry="2.5" fill="#1a1a2e" transform="rotate(-15 13 12)" />
      <ellipse cx="19" cy="12" rx="2" ry="2.5" fill="#1a1a2e" transform="rotate(15 19 12)" />
      <circle cx="13" cy="12" r="0.8" fill="#fff" />
      <circle cx="19" cy="12" r="0.8" fill="#fff" />
      <circle cx="16" cy="15" r="0.8" fill="#1a1a2e" />
      <path d="M14 16.5 Q16 18 18 16.5" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      <rect x={8 + legY} y="24" width="3" height="4" fill="#1a1a2e" />
      <rect x={21 - legY} y="24" width="3" height="4" fill="#1a1a2e" />
    </svg>
  );
}

function UnicornSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <defs>
        <linearGradient id="mane" x1="0" x2="1">
          <stop offset="0" stopColor="#ff5599" />
          <stop offset="0.5" stopColor="#ffd055" />
          <stop offset="1" stopColor="#7af5b0" />
        </linearGradient>
      </defs>
      <rect x="5" y="14" width="22" height="10" rx="4" fill="#fff" />
      <rect x="9" y="6" width="13" height="11" rx="3" fill="#fff" />
      {/* horn */}
      <polygon points="14,2 16,8 12,8" fill="#ffd055" />
      {/* mane */}
      <path d="M21 6 Q26 4 26 14 Q22 12 21 14 Z" fill="url(#mane)" />
      <path d="M9 16 Q5 16 6 24 Q9 22 11 22 Z" fill="url(#mane)" />
      <circle cx="13" cy="11" r="1.2" fill="#1a1a2e" />
      <circle cx="18" cy="11" r="1.2" fill="#1a1a2e" />
      <circle cx="20" cy="14" r="0.6" fill="#ff7aa8" />
      <rect x={7 + legY} y="24" width="3" height="4" fill="#fff" />
      <rect x={12 - legY} y="24" width="3" height="4" fill="#fff" />
      <rect x={17 + legY} y="24" width="3" height="4" fill="#fff" />
      <rect x={22 - legY} y="24" width="3" height="4" fill="#fff" />
    </svg>
  );
}

function BunnySprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const hop = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `${flip(facing)} translateY(${hop}px)`, imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="22" rx="8" ry="6" fill="#fafafa" />
      <ellipse cx="16" cy="14" rx="6" ry="6" fill="#fff" />
      {/* ears */}
      <ellipse cx="13" cy="5" rx="1.8" ry="5" fill="#fff" />
      <ellipse cx="19" cy="5" rx="1.8" ry="5" fill="#fff" />
      <ellipse cx="13" cy="6" rx="0.8" ry="3.5" fill="#ffb3c8" />
      <ellipse cx="19" cy="6" rx="0.8" ry="3.5" fill="#ffb3c8" />
      <circle cx="13.5" cy="13" r="1.2" fill="#1a1a2e" />
      <circle cx="18.5" cy="13" r="1.2" fill="#1a1a2e" />
      <circle cx="13.5" cy="12.6" r="0.4" fill="#fff" />
      <circle cx="18.5" cy="12.6" r="0.4" fill="#fff" />
      <polygon points="15,16 17,16 16,17.5" fill="#ff7aa8" />
      <path d="M14 18 Q16 19.5 18 18" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      {/* tail/feet */}
      <circle cx="24" cy="22" r="2.5" fill="#fafafa" />
      <ellipse cx="11" cy="28" rx="2" ry="1.2" fill="#fafafa" />
      <ellipse cx="17" cy="28" rx="2" ry="1.2" fill="#fafafa" />
    </svg>
  );
}

function MonkeySprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const armY = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* tail */}
      <path d="M7 20 Q2 22 4 28 Q7 26 8 24" stroke="#7a4f30" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="17" cy="20" rx="9" ry="7" fill="#a37050" />
      <ellipse cx="17" cy="22" rx="6" ry="5" fill="#e8c8a0" />
      {/* ears */}
      <circle cx="9" cy="11" r="2.5" fill="#a37050" />
      <circle cx="25" cy="11" r="2.5" fill="#a37050" />
      <circle cx="9" cy="11" r="1.5" fill="#e8c8a0" />
      <circle cx="25" cy="11" r="1.5" fill="#e8c8a0" />
      {/* head */}
      <ellipse cx="17" cy="11" rx="7" ry="6" fill="#a37050" />
      <ellipse cx="17" cy="13" rx="5" ry="4.5" fill="#e8c8a0" />
      <circle cx="14" cy="11" r="1.2" fill="#1a1a2e" />
      <circle cx="20" cy="11" r="1.2" fill="#1a1a2e" />
      <ellipse cx="16" cy="14" rx="0.7" ry="0.4" fill="#1a1a2e" />
      <ellipse cx="18" cy="14" rx="0.7" ry="0.4" fill="#1a1a2e" />
      <path d="M15 15.5 Q17 17 19 15.5" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      {/* arms */}
      <rect x="7" y={18 + armY} width="3" height="6" rx="1" fill="#a37050" />
      <rect x={22} y={18 - armY} width="3" height="6" rx="1" fill="#a37050" />
    </svg>
  );
}

// ---------- Lovecraftian ----------

function CthulhuSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const wig = step % 2 === 0 ? 0 : 1;
  const wingY = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* wings */}
      <path d={`M5 ${12 + wingY} Q1 ${6 + wingY} 8 ${8 + wingY} L9 14 Z`} fill="#1f4d3a" />
      <path d={`M27 ${12 - wingY} Q31 ${6 - wingY} 24 ${8 - wingY} L23 14 Z`} fill="#1f4d3a" />
      {/* body */}
      <ellipse cx="16" cy="20" rx="9" ry="7" fill="#3a8f5a" />
      <ellipse cx="16" cy="22" rx="6" ry="4" fill="#5fb87f" />
      {/* head */}
      <ellipse cx="16" cy="11" rx="7" ry="6" fill="#3a8f5a" />
      <circle cx="13" cy="10" r="1.5" fill="#1a1a2e" />
      <circle cx="19" cy="10" r="1.5" fill="#1a1a2e" />
      <circle cx="13" cy="9.6" r="0.5" fill="#9affa0" />
      <circle cx="19" cy="9.6" r="0.5" fill="#9affa0" />
      {/* tentacle mouth */}
      <path d={`M12 ${14 + wig} Q13 ${17 + wig} 12 ${20 + wig}`} stroke="#1f4d3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={`M14 ${15 - wig} Q14 ${18 - wig} 14 ${20 - wig}`} stroke="#1f4d3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={`M16 ${15 + wig} Q16 ${18 + wig} 16 ${21 + wig}`} stroke="#1f4d3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={`M18 ${15 - wig} Q18 ${18 - wig} 18 ${20 - wig}`} stroke="#1f4d3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={`M20 ${14 + wig} Q19 ${17 + wig} 20 ${20 + wig}`} stroke="#1f4d3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* feet tentacles */}
      <path d={`M10 26 Q8 ${28 + wig} 10 30`} stroke="#1f4d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M22 26 Q24 ${28 - wig} 22 30`} stroke="#1f4d3a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ShoggothSprite({ step }: { facing: "left" | "right"; step: number }) {
  const sq = step % 2 === 0 ? 1 : 0.93;
  const blink = step % 4 === 0;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <g transform={`translate(16 22) scale(${sq} ${1/sq}) translate(-16 -22)`}>
        {/* blob body */}
        <path d="M3 24 Q3 8 16 8 Q29 8 29 24 Q29 30 16 30 Q3 30 3 24 Z" fill="#1a1a3a" />
        <path d="M5 23 Q5 12 16 12 Q27 12 27 23" fill="#2d2d5a" />
        {/* many eyes */}
        <circle cx="10" cy="14" r="1.6" fill="#fff200" />
        <circle cx="10" cy="14" r="0.6" fill="#1a1a2e" />
        <circle cx="20" cy="13" r="1.8" fill="#fff200" />
        <circle cx="20" cy="13" r="0.7" fill="#1a1a2e" />
        <circle cx="15" cy="17" r="1.4" fill="#fff200" />
        <circle cx="15" cy="17" r={blink ? 0.1 : 0.5} fill="#1a1a2e" />
        <circle cx="24" cy="18" r="1.2" fill="#9aff5a" />
        <circle cx="24" cy="18" r="0.4" fill="#1a1a2e" />
        <circle cx="7" cy="20" r="1.2" fill="#9aff5a" />
        <circle cx="7" cy="20" r="0.4" fill="#1a1a2e" />
        <circle cx="18" cy="22" r="1" fill="#fff200" />
        <circle cx="18" cy="22" r="0.3" fill="#1a1a2e" />
        {/* tentacle bumps */}
        <path d="M5 26 Q4 30 7 28" stroke="#1a1a3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M27 26 Q28 30 25 28" stroke="#1a1a3a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function BlackGoatSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* body */}
      <ellipse cx="17" cy="19" rx="10" ry="6" fill="#0d0d1a" />
      <ellipse cx="17" cy="20" rx="7" ry="4" fill="#1f1f3a" />
      {/* head */}
      <ellipse cx="9" cy="12" rx="5" ry="5" fill="#0d0d1a" />
      {/* horns */}
      <path d="M5 9 Q3 4 7 6" stroke="#5a3a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M11 8 Q15 3 13 9" stroke="#5a3a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* central eye */}
      <circle cx="9" cy="12" r="2.2" fill="#ff2244" />
      <circle cx="9" cy="12" r="1.2" fill="#ffe066" />
      <rect x="8.4" y="11" width="1.2" height="2" fill="#1a1a2e" />
      {/* small side eyes */}
      <circle cx="6" cy="11" r="0.6" fill="#ff2244" />
      <circle cx="12" cy="11" r="0.6" fill="#ff2244" />
      {/* legs */}
      <rect x={11 + legY} y="24" width="2" height="5" fill="#0d0d1a" />
      <rect x={15 - legY} y="24" width="2" height="5" fill="#0d0d1a" />
      <rect x={19 + legY} y="24" width="2" height="5" fill="#0d0d1a" />
      <rect x={23 - legY} y="24" width="2" height="5" fill="#0d0d1a" />
      {/* tail */}
      <rect x="26" y="17" width="3" height="1.5" fill="#0d0d1a" />
    </svg>
  );
}

function NecronomiconSprite({ step }: { facing: "left" | "right"; step: number }) {
  const float = step % 2 === 0 ? 0 : -2;
  const blink = step % 4 === 0;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${float}px)`, imageRendering: "pixelated" }}>
      {/* book back */}
      <rect x="4" y="6" width="24" height="22" rx="1" fill="#3a1a0d" />
      <rect x="5" y="7" width="22" height="20" fill="#5a2a18" />
      {/* leather face/skin */}
      <rect x="6" y="8" width="20" height="18" fill="#7a3a25" />
      {/* central eye socket */}
      <ellipse cx="16" cy="17" rx="6" ry="4" fill="#1a0a05" />
      {/* eye */}
      <circle cx="16" cy="17" r="3" fill="#fff5dc" />
      <circle cx="16" cy="17" r={blink ? 0.2 : 1.6} fill="#1a1a2e" />
      <circle cx="16.4" cy="16.6" r={blink ? 0 : 0.4} fill="#fff" />
      {/* stitches */}
      <line x1="6" y1="13" x2="10" y2="13" stroke="#1a0a05" strokeWidth="0.6" strokeDasharray="1 1" />
      <line x1="22" y1="13" x2="26" y2="13" stroke="#1a0a05" strokeWidth="0.6" strokeDasharray="1 1" />
      <line x1="6" y1="22" x2="26" y2="22" stroke="#1a0a05" strokeWidth="0.6" strokeDasharray="1 1" />
      {/* spine */}
      <rect x="15" y="6" width="2" height="22" fill="#2a0d05" />
      {/* glow */}
      <circle cx="16" cy="17" r="8" fill="none" stroke="#9aff5a" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ---------- Other styles ----------

function SlimeMageSprite({ step }: { facing: "left" | "right"; step: number }) {
  const sq = step % 2 === 0 ? 1 : 0.94;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <g transform={`translate(16 28) scale(${sq} ${1/sq}) translate(-16 -28)`}>
        {/* slime body */}
        <path d="M5 26 Q5 14 16 14 Q27 14 27 26 Z" fill="#a060ff" />
        <path d="M5 26 Q5 18 16 18 Q27 18 27 26 Z" fill="#c690ff" />
        {/* eyes */}
        <ellipse cx="12" cy="20" rx="1.6" ry="2" fill="#1a1a2e" />
        <ellipse cx="20" cy="20" rx="1.6" ry="2" fill="#1a1a2e" />
        <ellipse cx="11.5" cy="19.5" rx="0.5" ry="0.7" fill="#fff" />
        <ellipse cx="19.5" cy="19.5" rx="0.5" ry="0.7" fill="#fff" />
        <path d="M13 23 Q16 25 19 23" stroke="#1a1a2e" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* wizard hat */}
        <polygon points="16,2 9,14 23,14" fill="#1a1a4a" />
        <polygon points="16,2 11,12 21,12" fill="#2a2a6a" />
        <circle cx="16" cy="3" r="1" fill="#ffd055" />
        <rect x="8" y="13" width="16" height="2" rx="1" fill="#1a1a4a" />
        {/* stars on hat */}
        <text x="14" y="12" fontSize="3" fill="#ffd055">★</text>
      </g>
    </svg>
  );
}

function YureiSprite({ step }: { facing: "left" | "right"; step: number }) {
  const float = step % 2 === 0 ? 0 : -2;
  const flame = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${float}px)`, imageRendering: "pixelated" }}>
      {/* hitodama flame */}
      <path d={`M3 ${4 + flame} Q1 ${8 + flame} 5 ${10 + flame} Q4 ${6 + flame} 6 ${4 + flame} Q4 ${2 + flame} 3 ${4 + flame} Z`} fill="#5affff" />
      <ellipse cx="4" cy="7" rx="0.5" ry="1.2" fill="#fff" opacity="0.8" />
      {/* body — flowing white robe */}
      <path d="M9 8 Q9 4 16 4 Q23 4 23 8 L24 28 Q22 30 20 28 Q18 30 16 28 Q14 30 12 28 Q10 30 8 28 Z" fill="#f8f8ff" />
      <path d="M9 8 Q9 4 16 4 Q23 4 23 8 L23 14 L9 14 Z" fill="#e5e5f5" opacity="0.5" />
      {/* hair drop */}
      <path d="M11 6 Q12 14 11 18" stroke="#1a1a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M21 6 Q20 14 21 18" stroke="#1a1a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M16 4 Q16 10 16 16" stroke="#1a1a2e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* sad empty eyes */}
      <ellipse cx="13" cy="11" rx="1.2" ry="2" fill="#1a1a2e" />
      <ellipse cx="19" cy="11" rx="1.2" ry="2" fill="#1a1a2e" />
      <path d="M14 15 Q16 13 18 15" stroke="#1a1a2e" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* tears */}
      <ellipse cx="13" cy="14" rx="0.4" ry="0.8" fill="#5affff" />
      <ellipse cx="19" cy="14" rx="0.4" ry="0.8" fill="#5affff" />
    </svg>
  );
}

function MushroomSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* cap */}
      <path d="M3 16 Q3 4 16 4 Q29 4 29 16 Z" fill="#e02030" />
      <path d="M3 16 Q3 8 16 8 Q29 8 29 16 Z" fill="#ff4055" />
      {/* spots */}
      <circle cx="9" cy="11" r="2" fill="#fffaf0" />
      <circle cx="22" cy="9" r="2.5" fill="#fffaf0" />
      <circle cx="16" cy="6" r="1.5" fill="#fffaf0" />
      <circle cx="25" cy="14" r="1.8" fill="#fffaf0" />
      <circle cx="6" cy="14" r="1.2" fill="#fffaf0" />
      {/* stem face */}
      <rect x="9" y="16" width="14" height="11" rx="3" fill="#fff5e0" />
      {/* eyes */}
      <ellipse cx="13" cy="20" rx="1.3" ry="1.6" fill="#1a1a2e" />
      <ellipse cx="19" cy="20" rx="1.3" ry="1.6" fill="#1a1a2e" />
      <circle cx="12.6" cy="19.6" r="0.4" fill="#fff" />
      <circle cx="18.6" cy="19.6" r="0.4" fill="#fff" />
      {/* blush */}
      <ellipse cx="11" cy="22.5" rx="1" ry="0.6" fill="#ffb3c8" opacity="0.7" />
      <ellipse cx="21" cy="22.5" rx="1" ry="0.6" fill="#ffb3c8" opacity="0.7" />
      <path d="M14 23 Q16 25 18 23" stroke="#1a1a2e" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* feet */}
      <rect x={11 + legY} y="27" width="3" height="2" fill="#d8c8a0" />
      <rect x={18 - legY} y="27" width="3" height="2" fill="#d8c8a0" />
    </svg>
  );
}

function AlienSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const drool = step % 2 === 0 ? 0 : 1;
  const tailY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* tail */}
      <path d={`M24 18 Q30 ${20 + tailY} 28 ${26 + tailY}`} stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points={`28,${26 + tailY} 30,${28 + tailY} 26,${28 + tailY}`} fill="#1a1a2e" />
      {/* body */}
      <ellipse cx="14" cy="20" rx="8" ry="6" fill="#1a1a2e" />
      <ellipse cx="14" cy="22" rx="5" ry="3" fill="#3a3a5a" />
      {/* elongated head */}
      <ellipse cx="10" cy="11" rx="7" ry="4.5" fill="#1a1a2e" transform="rotate(-15 10 11)" />
      <ellipse cx="13" cy="10" rx="3" ry="2" fill="#3a3a5a" transform="rotate(-15 13 10)" />
      {/* inner mouth */}
      <ellipse cx="6" cy="12" rx="2" ry="1.2" fill="#5a1a2e" />
      <polygon points="4,12 6,11.4 6,13" fill="#fff" />
      <polygon points="6,11.4 8,12 8,13 6,13" fill="#fff" />
      {/* drool */}
      <ellipse cx={5} cy={14 + drool} rx="0.4" ry="0.8" fill="#9affb0" />
      {/* dome shine */}
      <ellipse cx="11" cy="9.5" rx="2" ry="1" fill="#5a5a8a" opacity="0.6" />
      {/* legs */}
      <rect x="10" y="25" width="2" height="4" fill="#1a1a2e" />
      <rect x="16" y="25" width="2" height="4" fill="#1a1a2e" />
      {/* arm claws */}
      <path d="M19 17 Q22 15 21 13" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Videogame mascots ----------

function PikachuSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const cheek = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* tail (zigzag) */}
      <polygon points="26,16 30,10 28,14 32,8 28,18 30,20 26,18" fill="#ffd700" stroke="#5a3a00" strokeWidth="0.5" />
      <polygon points="26,16 28,14 28,18" fill="#7a4f00" />
      {/* body */}
      <ellipse cx="14" cy="18" rx="8" ry="7" fill="#ffe600" />
      <ellipse cx="14" cy="20" rx="6" ry="4" fill="#ffec33" />
      {/* head */}
      <circle cx="14" cy="11" r="7" fill="#ffe600" />
      {/* ears */}
      <polygon points="9,5 11,1 13,8" fill="#ffe600" stroke="#1a1a1a" strokeWidth="0.6" />
      <polygon points="11,1 13,3 12,4" fill="#1a1a1a" />
      <polygon points="19,5 17,1 15,8" fill="#ffe600" stroke="#1a1a1a" strokeWidth="0.6" />
      <polygon points="17,1 15,3 16,4" fill="#1a1a1a" />
      {/* eyes */}
      <circle cx="11" cy="11" r="1.5" fill="#1a1a1a" />
      <circle cx="17" cy="11" r="1.5" fill="#1a1a1a" />
      <circle cx="11.4" cy="10.6" r="0.5" fill="#fff" />
      <circle cx="17.4" cy="10.6" r="0.5" fill="#fff" />
      {/* cheeks */}
      <circle cx="8" cy={13 + cheek} r="1.6" fill="#ff3344" />
      <circle cx="20" cy={13 + cheek} r="1.6" fill="#ff3344" />
      <circle cx="14" cy="13" r="0.5" fill="#1a1a1a" />
      <path d="M12 14 Q14 16 16 14" stroke="#1a1a1a" strokeWidth="0.8" fill="none" />
      {/* legs */}
      <rect x="10" y="24" width="3" height="3" fill="#ffe600" />
      <rect x="15" y="24" width="3" height="3" fill="#ffe600" />
    </svg>
  );
}

function KirbySprite({ step }: { facing: "left" | "right"; step: number }) {
  const float = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${float}px)`, imageRendering: "pixelated" }}>
      <circle cx="16" cy="16" r="11" fill="#ffb3d1" stroke="#1a1a2e" strokeWidth="0.6" />
      <ellipse cx="16" cy="14" rx="8" ry="6" fill="#ffc8de" />
      {/* eyes */}
      <ellipse cx="13" cy="14" rx="1.2" ry="2.5" fill="#1a1a2e" />
      <ellipse cx="19" cy="14" rx="1.2" ry="2.5" fill="#1a1a2e" />
      <ellipse cx="13" cy="13" rx="0.5" ry="1" fill="#fff" />
      <ellipse cx="19" cy="13" rx="0.5" ry="1" fill="#fff" />
      {/* mouth */}
      <ellipse cx="16" cy="18" rx="1.2" ry="0.8" fill="#5a1a2e" />
      {/* cheeks */}
      <ellipse cx="11" cy="17" rx="1.2" ry="0.8" fill="#ff5599" opacity="0.7" />
      <ellipse cx="21" cy="17" rx="1.2" ry="0.8" fill="#ff5599" opacity="0.7" />
      {/* arms */}
      <ellipse cx="6" cy="17" rx="2" ry="2.5" fill="#ffb3d1" />
      <ellipse cx="26" cy="17" rx="2" ry="2.5" fill="#ffb3d1" />
      {/* feet */}
      <ellipse cx="11" cy="27" rx="3" ry="2" fill="#d8203a" />
      <ellipse cx="21" cy="27" rx="3" ry="2" fill="#d8203a" />
    </svg>
  );
}

function CreeperSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }} shapeRendering="crispEdges">
      {/* head */}
      <rect x="8" y="2" width="16" height="14" fill="#5fb04a" />
      <rect x="8" y="2" width="16" height="2" fill="#4a8a38" />
      <rect x="22" y="2" width="2" height="14" fill="#4a8a38" />
      <rect x="8" y="2" width="2" height="14" fill="#7ac860" />
      {/* face */}
      <rect x="11" y="6" width="3" height="3" fill="#1a1a1a" />
      <rect x="18" y="6" width="3" height="3" fill="#1a1a1a" />
      <rect x="13" y="10" width="6" height="2" fill="#1a1a1a" />
      <rect x="11" y="12" width="3" height="3" fill="#1a1a1a" />
      <rect x="18" y="12" width="3" height="3" fill="#1a1a1a" />
      <rect x="14" y="13" width="4" height="2" fill="#1a1a1a" />
      {/* body */}
      <rect x="10" y="16" width="12" height="10" fill="#5fb04a" />
      <rect x="10" y="16" width="2" height="10" fill="#7ac860" />
      <rect x="20" y="16" width="2" height="10" fill="#4a8a38" />
      {/* legs */}
      <rect x="10" y={26 + legY} width="5" height="4" fill="#5fb04a" />
      <rect x="17" y={26 - legY} width="5" height="4" fill="#5fb04a" />
    </svg>
  );
}

function YoshiSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* shell */}
      <ellipse cx="20" cy="20" rx="9" ry="6" fill="#ff5544" />
      <ellipse cx="20" cy="20" rx="7" ry="4" fill="#ff8877" />
      {/* body */}
      <ellipse cx="13" cy="18" rx="6" ry="7" fill="#5fc850" />
      {/* head */}
      <ellipse cx="9" cy="11" rx="6" ry="5" fill="#5fc850" />
      <ellipse cx="6" cy="13" rx="3" ry="2" fill="#5fc850" />
      {/* nose */}
      <ellipse cx="4" cy="14" rx="1.2" ry="0.6" fill="#3a8a38" />
      {/* eyes */}
      <ellipse cx="9" cy="7" rx="2.5" ry="3" fill="#fff" stroke="#1a1a1a" strokeWidth="0.6" />
      <circle cx="9" cy="8" r="1.2" fill="#1a1a1a" />
      <circle cx="9.4" cy="7.6" r="0.4" fill="#fff" />
      {/* cheek */}
      <circle cx="11" cy="13" r="1" fill="#ff8888" opacity="0.6" />
      {/* legs */}
      <rect x={11 + legY} y="24" width="3" height="4" fill="#5fc850" />
      <rect x={17 - legY} y="24" width="3" height="4" fill="#5fc850" />
      <rect x={11 + legY} y="27" width="4" height="2" fill="#ffaa22" />
      <rect x={17 - legY} y="27" width="4" height="2" fill="#ffaa22" />
    </svg>
  );
}

function MetroidSprite({ step }: { facing: "left" | "right"; step: number }) {
  const float = step % 2 === 0 ? 0 : -2;
  const pulse = step % 2 === 0 ? 1 : 0.92;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${float}px) scale(${pulse})`, transformOrigin: "center", imageRendering: "pixelated" }}>
      {/* membrane */}
      <ellipse cx="16" cy="14" rx="11" ry="9" fill="#aaffcc" opacity="0.5" />
      <ellipse cx="16" cy="14" rx="9" ry="7" fill="#88ddaa" opacity="0.7" stroke="#3a8855" strokeWidth="0.6" />
      {/* nuclei */}
      <circle cx="13" cy="12" r="3" fill="#ff3344" />
      <circle cx="19" cy="12" r="3" fill="#ff3344" />
      <circle cx="13" cy="16" r="2.5" fill="#ff3344" />
      <circle cx="19" cy="16" r="2.5" fill="#ff3344" />
      <circle cx="13" cy="12" r="1" fill="#fff" />
      <circle cx="19" cy="12" r="1" fill="#fff" />
      {/* fangs */}
      <polygon points="10,20 12,26 13,21" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
      <polygon points="14,21 15,28 17,21" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
      <polygon points="18,21 19,28 21,21" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
      <polygon points="22,20 20,26 19,21" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
    </svg>
  );
}

function CompanionCubeSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const tilt = step % 2 === 0 ? 0 : 3;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `${flip(facing)} rotate(${tilt}deg)`, imageRendering: "pixelated" }}>
      {/* cube faces */}
      <polygon points="6,10 16,4 26,10 26,24 16,30 6,24" fill="#d8d4c8" stroke="#5a5448" strokeWidth="0.8" />
      <polygon points="16,4 26,10 16,16 6,10" fill="#e8e4d8" />
      <polygon points="16,16 26,10 26,24 16,30" fill="#b8b4a8" />
      {/* edges/strips */}
      <polygon points="6,10 8,11 8,23 6,24" fill="#888070" />
      <polygon points="26,10 24,11 24,23 26,24" fill="#888070" />
      {/* heart */}
      <path d="M12 14 Q12 12 14 12 Q16 12 16 14 Q16 12 18 12 Q20 12 20 14 Q20 17 16 20 Q12 17 12 14 Z" fill="#ffb3c8" stroke="#ff5599" strokeWidth="0.6" />
      {/* corner buttons */}
      <circle cx="9" cy="11" r="1" fill="#888070" />
      <circle cx="23" cy="11" r="1" fill="#888070" />
      <circle cx="9" cy="23" r="1" fill="#888070" />
      <circle cx="23" cy="23" r="1" fill="#888070" />
    </svg>
  );
}

function ChocoboSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* tail feathers */}
      <path d="M26 14 Q31 10 30 18 Q28 16 26 18 Z" fill="#ffe600" />
      <path d="M26 18 Q31 18 30 22 Z" fill="#ffd000" />
      {/* body */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="#ffe600" />
      <ellipse cx="17" cy="20" rx="6" ry="4" fill="#fff200" />
      {/* head */}
      <ellipse cx="11" cy="9" rx="5" ry="5" fill="#ffe600" />
      {/* head feathers */}
      <path d="M9 4 L11 1 L13 4 Z" fill="#ffe600" />
      <path d="M11 3 L13 0 L15 3 Z" fill="#ffe600" />
      {/* beak */}
      <polygon points="6,9 4,10 6,11" fill="#ffaa22" />
      {/* eye */}
      <circle cx="11" cy="8" r="1.4" fill="#1a1a1a" />
      <circle cx="11.4" cy="7.6" r="0.5" fill="#fff" />
      {/* legs */}
      <rect x={14 + legY} y="24" width="2" height="4" fill="#ffaa22" />
      <rect x={20 - legY} y="24" width="2" height="4" fill="#ffaa22" />
      <polygon points={`${13 + legY},28 ${17 + legY},28 ${15 + legY},30`} fill="#ffaa22" />
      <polygon points={`${19 - legY},28 ${23 - legY},28 ${21 - legY},30`} fill="#ffaa22" />
    </svg>
  );
}

function BooMarioSprite({ step }: { facing: "left" | "right"; step: number }) {
  const float = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${float}px)`, imageRendering: "pixelated" }}>
      {/* round ghost body */}
      <circle cx="16" cy="16" r="12" fill="#fafafa" stroke="#bbb" strokeWidth="0.6" />
      <path d="M4 22 Q7 28 10 22 Q13 28 16 22 Q19 28 22 22 Q25 28 28 22 L28 16 L4 16 Z" fill="#fafafa" stroke="#bbb" strokeWidth="0.6" />
      {/* tongue out */}
      <ellipse cx="16" cy="20" rx="4" ry="3" fill="#5a1a2e" />
      <ellipse cx="16" cy="22" rx="3" ry="2" fill="#ff7aa8" />
      {/* fangs */}
      <polygon points="13,18 14,22 15,18" fill="#fff" />
      <polygon points="17,18 18,22 19,18" fill="#fff" />
      {/* shy eyes */}
      <ellipse cx="12" cy="13" rx="1.5" ry="2" fill="#1a1a2e" />
      <ellipse cx="20" cy="13" rx="1.5" ry="2" fill="#1a1a2e" />
      {/* arms */}
      <circle cx="6" cy="14" r="2" fill="#fafafa" stroke="#bbb" strokeWidth="0.5" />
      <circle cx="26" cy="14" r="2" fill="#fafafa" stroke="#bbb" strokeWidth="0.5" />
    </svg>
  );
}

function BulborbSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* body */}
      <ellipse cx="18" cy="20" rx="11" ry="8" fill="#e84438" />
      {/* spots */}
      <circle cx="14" cy="16" r="2" fill="#fafafa" />
      <circle cx="20" cy="14" r="2.2" fill="#fafafa" />
      <circle cx="25" cy="18" r="1.8" fill="#fafafa" />
      <circle cx="22" cy="22" r="1.5" fill="#fafafa" />
      {/* head pale */}
      <ellipse cx="9" cy="20" rx="5" ry="6" fill="#f5e6c8" />
      {/* mouth open */}
      <ellipse cx="6" cy="22" rx="3" ry="2.5" fill="#1a0a05" />
      {/* fangs */}
      <polygon points="4,21 5,25 6,21" fill="#fff" />
      <polygon points="6,21 7,25 8,21" fill="#fff" />
      {/* eyes on stalks */}
      <line x1="8" y1="14" x2="6" y2="9" stroke="#f5e6c8" strokeWidth="1.5" />
      <line x1="11" y1="14" x2="13" y2="9" stroke="#f5e6c8" strokeWidth="1.5" />
      <circle cx="6" cy="8" r="1.8" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
      <circle cx="13" cy="8" r="1.8" fill="#fff" stroke="#1a1a2e" strokeWidth="0.5" />
      <circle cx="6" cy="8" r="0.8" fill="#1a1a2e" />
      <circle cx="13" cy="8" r="0.8" fill="#1a1a2e" />
      {/* legs */}
      <rect x={14 + legY} y="27" width="3" height="3" fill="#e84438" />
      <rect x={22 - legY} y="27" width="3" height="3" fill="#e84438" />
    </svg>
  );
}

function HeadcrabSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* body dome */}
      <ellipse cx="16" cy="16" rx="10" ry="7" fill="#a87850" />
      <ellipse cx="16" cy="14" rx="8" ry="4" fill="#c89870" />
      {/* underbelly mouth */}
      <ellipse cx="16" cy="22" rx="6" ry="2" fill="#5a1a2e" />
      <polygon points="12,21 13,24 14,21" fill="#fff" />
      <polygon points="15,21 16,25 17,21" fill="#fff" />
      <polygon points="18,21 19,24 20,21" fill="#fff" />
      {/* small eyes */}
      <circle cx="13" cy="13" r="0.8" fill="#1a1a2e" />
      <circle cx="19" cy="13" r="0.8" fill="#1a1a2e" />
      {/* front legs */}
      <path d={`M6 18 Q2 ${22 + legY} 4 26`} stroke="#7a5538" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M10 22 Q6 ${26 + legY} 8 30`} stroke="#7a5538" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* back legs */}
      <path d={`M26 18 Q30 ${22 - legY} 28 26`} stroke="#7a5538" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d={`M22 22 Q26 ${26 - legY} 24 30`} stroke="#7a5538" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IsaacSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const tear = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* body */}
      <ellipse cx="16" cy="22" rx="6" ry="5" fill="#fce8d0" />
      {/* head big */}
      <circle cx="16" cy="13" r="9" fill="#fce8d0" stroke="#1a1a2e" strokeWidth="0.6" />
      {/* sad eyes */}
      <ellipse cx="12" cy="13" rx="1.5" ry="2.2" fill="#1a1a2e" />
      <ellipse cx="20" cy="13" rx="1.5" ry="2.2" fill="#1a1a2e" />
      <ellipse cx="12.4" cy="12.4" rx="0.5" ry="0.8" fill="#fff" />
      <ellipse cx="20.4" cy="12.4" rx="0.5" ry="0.8" fill="#fff" />
      {/* tears */}
      <ellipse cx="12" cy={16 + tear} rx="0.5" ry="1.2" fill="#5affff" />
      <ellipse cx="20" cy={16 + tear} rx="0.5" ry="1.2" fill="#5affff" />
      {/* sad mouth */}
      <path d="M14 17 Q16 16 18 17" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      {/* tiny legs */}
      <rect x="13" y="26" width="2" height="3" fill="#fce8d0" />
      <rect x="17" y="26" width="2" height="3" fill="#fce8d0" />
    </svg>
  );
}

// ---------- Sci-fi / Horror ----------

function FacehuggerSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const tail = step % 2 === 0 ? 0 : 2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* tail */}
      <path d={`M22 18 Q28 ${20 + tail} 26 ${28 + tail}`} stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* body palm */}
      <ellipse cx="14" cy="16" rx="9" ry="6" fill="#e8c8a0" stroke="#7a4f30" strokeWidth="0.6" />
      <ellipse cx="14" cy="18" rx="6" ry="3" fill="#d8b890" />
      {/* finger legs */}
      <path d="M6 13 Q1 10 3 7" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8 11 Q5 6 8 4" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M11 10 Q11 5 14 4" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 10 Q16 4 20 5" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M17 11 Q21 7 23 9" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M19 13 Q24 11 24 14" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* lower legs */}
      <path d="M8 21 Q5 26 7 28" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 22 Q14 27 16 28" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 21 Q23 26 21 28" stroke="#d8b890" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function XenomorphSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const tail = step % 2 === 0 ? 0 : -2;
  const drool = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* tail */}
      <path d={`M22 18 Q30 ${15 + tail} 28 ${8 + tail}`} stroke="#0a0a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points={`28,${8 + tail} 30,${4 + tail} 26,${6 + tail}`} fill="#0a0a1a" />
      {/* body */}
      <ellipse cx="14" cy="20" rx="8" ry="6" fill="#0a0a1a" />
      {/* dorsal spines */}
      <polygon points="10,16 11,12 12,16" fill="#0a0a1a" />
      <polygon points="13,15 14,11 15,15" fill="#0a0a1a" />
      <polygon points="16,16 17,12 18,16" fill="#0a0a1a" />
      {/* elongated head */}
      <ellipse cx="8" cy="11" rx="8" ry="3.5" fill="#0a0a1a" transform="rotate(-10 8 11)" />
      <ellipse cx="11" cy="10" rx="3" ry="1.5" fill="#2a2a3a" transform="rotate(-10 11 10)" />
      {/* inner mouth */}
      <ellipse cx="3" cy="12" rx="2" ry="1" fill="#3a1a1a" />
      <polygon points="1,12 3,11 3,13" fill="#fff" />
      <polygon points="3,11 5,12 5,13 3,13" fill="#fff" />
      {/* drool */}
      <ellipse cx={2} cy={14 + drool} rx="0.4" ry="0.8" fill="#aaffcc" />
      {/* legs */}
      <rect x="10" y="25" width="2" height="4" fill="#0a0a1a" />
      <rect x="16" y="25" width="2" height="4" fill="#0a0a1a" />
    </svg>
  );
}

function DalekSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const eyeBlink = step % 2 === 0 ? 1 : 0.3;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* skirt */}
      <polygon points="6,28 26,28 24,16 8,16" fill="#c9a44a" stroke="#5a3a1a" strokeWidth="0.6" />
      {/* bumps */}
      <circle cx="11" cy="20" r="1.2" fill="#5a3a1a" />
      <circle cx="15" cy="20" r="1.2" fill="#5a3a1a" />
      <circle cx="19" cy="20" r="1.2" fill="#5a3a1a" />
      <circle cx="23" cy="20" r="1.2" fill="#5a3a1a" />
      <circle cx="11" cy="24" r="1.2" fill="#5a3a1a" />
      <circle cx="15" cy="24" r="1.2" fill="#5a3a1a" />
      <circle cx="19" cy="24" r="1.2" fill="#5a3a1a" />
      <circle cx="23" cy="24" r="1.2" fill="#5a3a1a" />
      {/* mid */}
      <rect x="9" y="12" width="14" height="4" fill="#b8943a" stroke="#5a3a1a" strokeWidth="0.4" />
      {/* arm + plunger */}
      <line x1="22" y1="14" x2="29" y2="10" stroke="#888" strokeWidth="1.5" />
      <ellipse cx="29" cy="10" rx="2" ry="1.5" fill="#444" />
      {/* gun */}
      <line x1="10" y1="14" x2="3" y2="11" stroke="#888" strokeWidth="1.5" />
      <rect x="2" y="10" width="2" height="2" fill="#222" />
      {/* dome head */}
      <path d="M10 12 Q10 4 16 4 Q22 4 22 12 Z" fill="#c9a44a" stroke="#5a3a1a" strokeWidth="0.6" />
      {/* eyestalk */}
      <line x1="16" y1="6" x2="16" y2="2" stroke="#888" strokeWidth="1" />
      <circle cx="16" cy="2" r="1.5" fill="#444" />
      <ellipse cx="16" cy="2" rx="0.6" ry={eyeBlink} fill="#33ddff" />
      {/* lights */}
      <circle cx="13" cy="8" r="0.8" fill="#fff" />
      <circle cx="19" cy="8" r="0.8" fill="#fff" />
    </svg>
  );
}

function TribbleSprite({ step }: { facing: "left" | "right"; step: number }) {
  const sq = step % 2 === 0 ? 1 : 0.95;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `scale(${sq} ${1/sq})`, transformOrigin: "center", imageRendering: "pixelated" }}>
      {/* fluff base */}
      <ellipse cx="16" cy="20" rx="13" ry="9" fill="#d8a070" />
      {/* fur strands */}
      <g stroke="#a87a52" strokeWidth="1" strokeLinecap="round">
        <line x1="4" y1="18" x2="2" y2="14" />
        <line x1="6" y1="14" x2="5" y2="9" />
        <line x1="10" y1="11" x2="10" y2="6" />
        <line x1="14" y1="10" x2="13" y2="5" />
        <line x1="18" y1="10" x2="19" y2="5" />
        <line x1="22" y1="11" x2="22" y2="6" />
        <line x1="26" y1="14" x2="27" y2="9" />
        <line x1="28" y1="18" x2="30" y2="14" />
        <line x1="4" y1="22" x2="2" y2="24" />
        <line x1="28" y1="22" x2="30" y2="24" />
        <line x1="8" y1="28" x2="7" y2="31" />
        <line x1="16" y1="29" x2="16" y2="32" />
        <line x1="24" y1="28" x2="25" y2="31" />
      </g>
      {/* highlight */}
      <ellipse cx="12" cy="18" rx="3" ry="2" fill="#e8b890" opacity="0.6" />
    </svg>
  );
}

function BB8Sprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const roll = step * 12;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* head dome */}
      <path d="M11 10 Q11 4 16 4 Q21 4 21 10 Z" fill="#fafafa" stroke="#1a1a2e" strokeWidth="0.6" />
      <rect x="11" y="9" width="10" height="1.5" fill="#888" />
      {/* head antenna */}
      <line x1="14" y1="4" x2="14" y2="2" stroke="#888" strokeWidth="0.8" />
      <line x1="18" y1="4" x2="18" y2="1" stroke="#888" strokeWidth="0.8" />
      {/* head eye */}
      <circle cx="15" cy="7" r="1.5" fill="#1a1a2e" />
      <circle cx="15" cy="7" r="0.7" fill="#33aaff" />
      <circle cx="18" cy="7" r="0.7" fill="#1a1a2e" />
      {/* body sphere */}
      <circle cx="16" cy="20" r="9" fill="#fafafa" stroke="#1a1a2e" strokeWidth="0.6" />
      {/* orange circles rotating */}
      <g transform={`rotate(${roll} 16 20)`}>
        <circle cx="11" cy="18" r="2.5" fill="none" stroke="#ff7a22" strokeWidth="1" />
        <circle cx="11" cy="18" r="1" fill="#ff7a22" />
        <circle cx="21" cy="22" r="2.5" fill="none" stroke="#ff7a22" strokeWidth="1" />
        <circle cx="21" cy="22" r="1" fill="#ff7a22" />
        <circle cx="16" cy="26" r="1.5" fill="#ff7a22" />
      </g>
    </svg>
  );
}

function WeepingAngelSprite({ step }: { facing: "left" | "right"; step: number }) {
  const blink = step % 4 === 0;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      {/* wings behind */}
      <path d="M3 16 Q1 8 8 6 Q6 12 9 18 Z" fill="#a8a89a" stroke="#5a5a48" strokeWidth="0.5" />
      <path d="M29 16 Q31 8 24 6 Q26 12 23 18 Z" fill="#a8a89a" stroke="#5a5a48" strokeWidth="0.5" />
      {/* body robe */}
      <path d="M9 28 Q9 14 16 12 Q23 14 23 28 Z" fill="#c8c8b8" stroke="#5a5a48" strokeWidth="0.6" />
      {/* head */}
      <ellipse cx="16" cy="10" rx="4" ry="5" fill="#c8c8b8" stroke="#5a5a48" strokeWidth="0.5" />
      {/* hair */}
      <path d="M12 8 Q16 5 20 8 Q19 13 16 13 Q13 13 12 8 Z" fill="#a8a89a" />
      {/* hands covering face */}
      <ellipse cx="14" cy="11" rx="2" ry="2.5" fill="#c8c8b8" stroke="#5a5a48" strokeWidth="0.4" />
      <ellipse cx="18" cy="11" rx="2" ry="2.5" fill="#c8c8b8" stroke="#5a5a48" strokeWidth="0.4" />
      {/* eye between fingers */}
      {!blink && <circle cx="16" cy="11" r="0.6" fill="#1a1a2e" />}
      {/* cracks */}
      <line x1="11" y1="20" x2="13" y2="24" stroke="#5a5a48" strokeWidth="0.4" />
      <line x1="20" y1="22" x2="22" y2="26" stroke="#5a5a48" strokeWidth="0.4" />
    </svg>
  );
}

function GremlinSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const ear = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* body */}
      <ellipse cx="16" cy="22" rx="8" ry="6" fill="#5fa83a" />
      <ellipse cx="16" cy="24" rx="5" ry="3" fill="#88c860" />
      {/* head */}
      <ellipse cx="16" cy="12" rx="8" ry="7" fill="#5fa83a" />
      {/* big bat ears */}
      <polygon points={`4,${12 + ear} 1,4 9,9`} fill="#5fa83a" stroke="#1a1a2e" strokeWidth="0.5" />
      <polygon points={`28,${12 + ear} 31,4 23,9`} fill="#5fa83a" stroke="#1a1a2e" strokeWidth="0.5" />
      <polygon points={`5,${11 + ear} 3,6 8,9`} fill="#3a7a22" />
      <polygon points={`27,${11 + ear} 29,6 24,9`} fill="#3a7a22" />
      {/* eyes evil red */}
      <ellipse cx="13" cy="11" rx="2" ry="1.8" fill="#ffeb3b" />
      <ellipse cx="19" cy="11" rx="2" ry="1.8" fill="#ffeb3b" />
      <circle cx="13" cy="11" r="0.8" fill="#1a1a2e" />
      <circle cx="19" cy="11" r="0.8" fill="#1a1a2e" />
      {/* evil grin with fangs */}
      <path d="M11 15 Q16 19 21 15" stroke="#1a1a2e" strokeWidth="1" fill="#1a1a2e" />
      <polygon points="13,15 13.5,18 14,15" fill="#fff" />
      <polygon points="18,15 18.5,18 19,15" fill="#fff" />
      {/* claws */}
      <rect x="6" y="22" width="2" height="3" fill="#5fa83a" />
      <rect x="24" y="22" width="2" height="3" fill="#5fa83a" />
    </svg>
  );
}

function ChestbursterSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const wig = step % 2 === 0 ? 0 : 2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* worm body curving */}
      <path d={`M4 28 Q10 ${22 + wig} 14 22 Q20 ${20 - wig} 24 14 Q26 8 22 4`} stroke="#d8b8a0" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d={`M4 28 Q10 ${22 + wig} 14 22 Q20 ${20 - wig} 24 14 Q26 8 22 4`} stroke="#a87850" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* head */}
      <ellipse cx="22" cy="5" rx="3.5" ry="3" fill="#d8b8a0" stroke="#7a4f30" strokeWidth="0.5" />
      {/* mouth */}
      <ellipse cx="22" cy="6" rx="2" ry="1" fill="#5a1a2e" />
      <polygon points="20,5.5 21,8 22,5.5" fill="#fff" />
      <polygon points="22,5.5 23,8 24,5.5" fill="#fff" />
      {/* tiny eyes */}
      <circle cx="20" cy="3.5" r="0.4" fill="#1a1a2e" />
      <circle cx="24" cy="3.5" r="0.4" fill="#1a1a2e" />
      {/* blood drops */}
      <ellipse cx="6" cy="29" rx="1" ry="1.5" fill="#aa1a22" />
      <ellipse cx="10" cy="27" rx="0.6" ry="1" fill="#aa1a22" />
    </svg>
  );
}

function YautjaSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const dread = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      {/* body */}
      <ellipse cx="16" cy="22" rx="8" ry="6" fill="#5a4a3a" />
      <ellipse cx="16" cy="24" rx="5" ry="3" fill="#7a6a4a" />
      {/* mesh chest */}
      <line x1="11" y1="20" x2="21" y2="20" stroke="#1a1a1a" strokeWidth="0.4" />
      <line x1="11" y1="22" x2="21" y2="22" stroke="#1a1a1a" strokeWidth="0.4" />
      <line x1="13" y1="18" x2="13" y2="25" stroke="#1a1a1a" strokeWidth="0.4" />
      <line x1="19" y1="18" x2="19" y2="25" stroke="#1a1a1a" strokeWidth="0.4" />
      {/* head */}
      <ellipse cx="16" cy="11" rx="6" ry="6" fill="#7a6a4a" stroke="#3a2a1a" strokeWidth="0.5" />
      {/* mask */}
      <path d="M11 10 Q16 6 21 10 L21 14 Q16 16 11 14 Z" fill="#a8a89a" stroke="#1a1a1a" strokeWidth="0.5" />
      <circle cx="13.5" cy="11" r="1" fill="#1a1a1a" />
      <circle cx="18.5" cy="11" r="1" fill="#1a1a1a" />
      <circle cx="13.5" cy="11" r="0.4" fill="#ff3344" />
      <circle cx="18.5" cy="11" r="0.4" fill="#ff3344" />
      {/* dreadlocks */}
      <path d={`M10 13 Q8 ${18 + dread} 9 ${22 + dread}`} stroke="#3a2a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M22 13 Q24 ${18 - dread} 23 ${22 - dread}`} stroke="#3a2a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M11 14 Q11 ${20 + dread} 12 ${24 + dread}`} stroke="#3a2a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={`M21 14 Q21 ${20 - dread} 20 ${24 - dread}`} stroke="#3a2a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* shoulder cannon */}
      <rect x="22" y="14" width="4" height="2" fill="#444" />
      <circle cx="26" cy="15" r="0.6" fill="#ff3344" />
      {/* legs */}
      <rect x="12" y="27" width="3" height="3" fill="#5a4a3a" />
      <rect x="17" y="27" width="3" height="3" fill="#5a4a3a" />
    </svg>
  );
}

// ---------- New batch 2 ----------

function MarioSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="10" y="4" width="12" height="4" fill="#ff0000" />
      <rect x="8" y="4" width="16" height="2" fill="#ff0000" />
      <rect x="9" y="8" width="14" height="8" rx="2" fill="#ffb68a" />
      <rect x="10" y="6" width="12" height="4" fill="#ff0000" />
      <rect x="8" y="8" width="3" height="3" fill="#4a2a0a" />
      <circle cx="13" cy="11" r="1.2" fill="#1a1a2e" />
      <circle cx="18" cy="11" r="1.2" fill="#1a1a2e" />
      <ellipse cx="16" cy="14" rx="1.5" ry="0.8" fill="#ffb68a" />
      <rect x="8" y="16" width="16" height="8" rx="2" fill="#0050d0" />
      <rect x="12" y="16" width="8" height="3" fill="#ff0000" />
      <circle cx="16" cy="18" r="1" fill="#ffd700" />
      <rect x={9 + legY} y="24" width="4" height="5" fill="#4a2a0a" />
      <rect x={19 - legY} y="24" width="4" height="5" fill="#4a2a0a" />
    </svg>
  );
}

function SonicSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <path d="M20 4 Q28 2 26 8 Q24 6 22 8" fill="#1a5aff" />
      <path d="M22 2 Q30 0 28 6" fill="#1a5aff" />
      <path d="M18 6 Q24 4 24 10" fill="#1a5aff" />
      <ellipse cx="14" cy="12" rx="8" ry="7" fill="#1a5aff" />
      <ellipse cx="12" cy="13" rx="4" ry="4" fill="#ffcc88" />
      <circle cx="11" cy="11" r="1.8" fill="#fff" />
      <circle cx="15" cy="11" r="1.8" fill="#fff" />
      <circle cx="11.5" cy="11" r="0.9" fill="#1a1a2e" />
      <circle cx="15.5" cy="11" r="0.9" fill="#1a1a2e" />
      <ellipse cx="13" cy="15" rx="1" ry="0.5" fill="#1a1a2e" />
      <ellipse cx="14" cy="20" rx="6" ry="5" fill="#1a5aff" />
      <rect x={9 + legY} y="24" width="3" height="4" fill="#ff2222" />
      <rect x={16 - legY} y="24" width="3" height="4" fill="#ff2222" />
      <rect x={9 + legY} y="27" width="4" height="2" fill="#fff" />
      <rect x={16 - legY} y="27" width="4" height="2" fill="#fff" />
    </svg>
  );
}

function AmongUsSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <path d="M10 8 Q10 2 18 2 Q26 2 26 8 L26 24 Q26 28 22 28 L20 28 L20 24 L16 24 L16 28 L14 28 Q10 28 10 24 Z" fill="#ff2222" />
      <rect x="6" y="12" width="6" height="10" rx="3" fill="#cc1a1a" />
      <rect x="14" y="6" width="10" height="8" rx="2" fill="#8ad4ff" opacity="0.9" />
      <rect x="15" y="7" width="8" height="6" rx="1" fill="#c8eeff" />
      <rect x={12 + legY} y="26" width="4" height="4" rx="1" fill="#ff2222" />
      <rect x={20 - legY} y="26" width="4" height="4" rx="1" fill="#ff2222" />
    </svg>
  );
}

function TotoroSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const bob = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `${flip(facing)} translateY(${bob}px)`, imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="18" rx="11" ry="12" fill="#7a8a7a" />
      <ellipse cx="16" cy="20" rx="8" ry="9" fill="#d8d0b8" />
      <polygon points="10,4 12,10 8,10" fill="#7a8a7a" />
      <polygon points="22,4 20,10 24,10" fill="#7a8a7a" />
      <circle cx="12" cy="12" r="2.5" fill="#fff" />
      <circle cx="20" cy="12" r="2.5" fill="#fff" />
      <circle cx="12.5" cy="12" r="1.2" fill="#1a1a2e" />
      <circle cx="20.5" cy="12" r="1.2" fill="#1a1a2e" />
      <ellipse cx="16" cy="16" rx="1.5" ry="0.8" fill="#1a1a2e" />
      <path d="M10 17 Q16 22 22 17" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      <line x1="10" y1="20" x2="22" y2="20" stroke="#7a8a7a" strokeWidth="0.6" />
      <line x1="11" y1="22" x2="21" y2="22" stroke="#7a8a7a" strokeWidth="0.6" />
      <line x1="12" y1="24" x2="20" y2="24" stroke="#7a8a7a" strokeWidth="0.6" />
    </svg>
  );
}

function JigglypuffSprite({ step }: { facing: "left" | "right"; step: number }) {
  const bob = step % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `translateY(${bob}px)`, imageRendering: "pixelated" }}>
      <circle cx="16" cy="16" r="12" fill="#ffaacc" />
      <circle cx="16" cy="16" r="10" fill="#ffbbdd" />
      <ellipse cx="16" cy="4" rx="4" ry="3" fill="#ffaacc" />
      <circle cx="12" cy="14" r="2.5" fill="#fff" />
      <circle cx="20" cy="14" r="2.5" fill="#fff" />
      <circle cx="12.5" cy="14" r="1.2" fill="#33bbaa" />
      <circle cx="20.5" cy="14" r="1.2" fill="#33bbaa" />
      <circle cx="12.5" cy="13.5" r="0.4" fill="#fff" />
      <circle cx="20.5" cy="13.5" r="0.4" fill="#fff" />
      <ellipse cx="16" cy="19" rx="1.5" ry="1" fill="#ff5577" />
      <ellipse cx="8" cy="18" rx="2" ry="1.2" fill="#ff88aa" opacity="0.5" />
      <ellipse cx="24" cy="18" rx="2" ry="1.2" fill="#ff88aa" opacity="0.5" />
      <rect x="6" y="22" width="4" height="4" rx="2" fill="#ffaacc" />
      <rect x="22" y="22" width="4" height="4" rx="2" fill="#ffaacc" />
    </svg>
  );
}

function DogeSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="19" rx="10" ry="7" fill="#e8c870" />
      <ellipse cx="16" cy="20" rx="7" ry="5" fill="#f0d888" />
      <ellipse cx="12" cy="11" rx="7" ry="7" fill="#e8c870" />
      <path d="M6 6 Q8 2 10 6" fill="#c8a850" />
      <path d="M16 4 Q18 0 20 4" fill="#c8a850" />
      <circle cx="10" cy="10" r="1.5" fill="#1a1a2e" />
      <circle cx="15" cy="10" r="1.5" fill="#1a1a2e" />
      <circle cx="10" cy="9.5" r="0.5" fill="#fff" />
      <circle cx="15" cy="9.5" r="0.5" fill="#fff" />
      <ellipse cx="12" cy="13" rx="1.5" ry="1" fill="#1a1a2e" />
      <path d="M10 15 Q12 17 14 15" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      <rect x={8 + legY} y="24" width="3" height="4" fill="#c8a850" />
      <rect x={13 - legY} y="24" width="3" height="4" fill="#c8a850" />
      <rect x={18 + legY} y="24" width="3" height="4" fill="#c8a850" />
      <rect x={22 - legY} y="24" width="3" height="4" fill="#c8a850" />
      <path d="M26 17 Q30 15 28 20 Q26 18 26 17" fill="#e8c870" />
    </svg>
  );
}

function NyanCatSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const wave = step % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <rect x="8" y="10" width="18" height="12" rx="2" fill="#ff88aa" />
      <rect x="9" y="11" width="16" height="10" fill="#ff99bb" />
      <circle cx="12" cy="14" r="0.8" fill="#ff5577" />
      <circle cx="16" cy="16" r="0.8" fill="#ff5577" />
      <circle cx="20" cy="13" r="0.8" fill="#ff5577" />
      <rect x="4" y="12" width="6" height="10" rx="2" fill="#888" />
      <circle cx="6" cy="15" r="1" fill="#1a1a2e" />
      <circle cx="9" cy="15" r="1" fill="#1a1a2e" />
      <ellipse cx="7" cy="18" rx="1" ry="0.5" fill="#ffaaaa" />
      <path d="M5 19 Q7 20 9 19" stroke="#1a1a2e" strokeWidth="0.6" fill="none" />
      <rect x={8 + wave} y="22" width="2" height="3" fill="#888" />
      <rect x={14 - wave} y="22" width="2" height="3" fill="#888" />
      <rect x={20 + wave} y="22" width="2" height="3" fill="#888" />
      <rect x="26" y="14" width="4" height="2" fill="#888" />
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={0} y={10 + i * 2} width="8" height="2" fill={["#ff0000","#ff8800","#ffff00","#00ff00","#0088ff","#8800ff"][i]} opacity="0.7" />
      ))}
    </svg>
  );
}

function BearSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="19" rx="10" ry="8" fill="#8B5A2B" />
      <ellipse cx="16" cy="21" rx="7" ry="5" fill="#a87040" />
      <ellipse cx="16" cy="11" rx="8" ry="7" fill="#8B5A2B" />
      <circle cx="10" cy="6" r="3" fill="#8B5A2B" />
      <circle cx="22" cy="6" r="3" fill="#8B5A2B" />
      <circle cx="10" cy="6" r="1.5" fill="#a87040" />
      <circle cx="22" cy="6" r="1.5" fill="#a87040" />
      <circle cx="13" cy="11" r="1.5" fill="#1a1a2e" />
      <circle cx="19" cy="11" r="1.5" fill="#1a1a2e" />
      <circle cx="13" cy="10.5" r="0.5" fill="#fff" />
      <circle cx="19" cy="10.5" r="0.5" fill="#fff" />
      <ellipse cx="16" cy="14" rx="1.5" ry="1" fill="#1a1a2e" />
      <path d="M14 16 Q16 18 18 16" stroke="#1a1a2e" strokeWidth="0.8" fill="none" />
      <rect x={9 + legY} y="25" width="4" height="4" fill="#6e4520" />
      <rect x={19 - legY} y="25" width="4" height="4" fill="#6e4520" />
    </svg>
  );
}

function TurtleSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const legY = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: flip(facing), imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="18" rx="11" ry="7" fill="#2a8a2a" />
      <ellipse cx="16" cy="17" rx="9" ry="6" fill="#3aaa3a" />
      <path d="M10 14 L16 12 L22 14 L20 18 L12 18 Z" fill="#2a7a2a" />
      <line x1="16" y1="12" x2="16" y2="18" stroke="#1a5a1a" strokeWidth="0.6" />
      <line x1="12" y1="16" x2="20" y2="16" stroke="#1a5a1a" strokeWidth="0.6" />
      <ellipse cx="7" cy="14" rx="4" ry="3" fill="#88c870" />
      <circle cx="5" cy="13" r="1" fill="#1a1a2e" />
      <circle cx="5" cy="12.5" r="0.3" fill="#fff" />
      <path d="M4 15 Q5 16 6 15" stroke="#1a1a2e" strokeWidth="0.6" fill="none" />
      <rect x={8 + legY} y="23" width="3" height="3" fill="#88c870" />
      <rect x={14 - legY} y="23" width="3" height="3" fill="#88c870" />
      <rect x={19 + legY} y="23" width="3" height="3" fill="#88c870" />
      <rect x={24 - legY} y="23" width="3" height="3" fill="#88c870" />
      <path d="M26 18 Q30 18 28 20" fill="#88c870" />
    </svg>
  );
}

function OwlSprite({ facing, step }: { facing: "left" | "right"; step: number }) {
  const blink = step % 4 === 0;
  const bob = step % 2 === 0 ? 0 : -1;
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full" style={{ transform: `${flip(facing)} translateY(${bob}px)`, imageRendering: "pixelated" }}>
      <ellipse cx="16" cy="18" rx="9" ry="10" fill="#8B6A3E" />
      <ellipse cx="16" cy="20" rx="6" ry="7" fill="#c8a870" />
      <polygon points="10,6 12,12 8,12" fill="#8B6A3E" />
      <polygon points="22,6 20,12 24,12" fill="#8B6A3E" />
      <circle cx="12" cy="14" r="3" fill="#fff" />
      <circle cx="20" cy="14" r="3" fill="#fff" />
      <circle cx="12" cy="14" r={blink ? 0.2 : 1.5} fill="#ff8800" />
      <circle cx="20" cy="14" r={blink ? 0.2 : 1.5} fill="#ff8800" />
      <circle cx="12" cy="13.5" r={blink ? 0 : 0.5} fill="#1a1a2e" />
      <circle cx="20" cy="13.5" r={blink ? 0 : 0.5} fill="#1a1a2e" />
      <polygon points="15,17 17,17 16,19" fill="#ff8800" />
      <path d="M8 22 Q10 26 12 22" fill="#8B6A3E" />
      <path d="M20 22 Q22 26 24 22" fill="#8B6A3E" />
      <rect x="12" y="28" width="3" height="2" fill="#ff8800" />
      <rect x="17" y="28" width="3" height="2" fill="#ff8800" />
    </svg>
  );
}

// ---------- Registry ----------

export const PETS: Record<PetKind, PetDef> = {
  cat:           { kind: "cat",           name: "Mochi",   style: "Pixel kawaii",    size: 64, render: (f, s) => <CatSprite facing={f} step={s} /> },
  dog:           { kind: "dog",           name: "Pixel",   style: "Pixel retro",     size: 64, render: (f, s) => <DogSprite facing={f} step={s} /> },
  slime:         { kind: "slime",         name: "Goo",     style: "Cartoon kawaii",  size: 60, render: (f, s) => <SlimeSprite facing={f} step={s} /> },
  dragon:        { kind: "dragon",        name: "Byte",    style: "Fantasy chibi",   size: 68, render: (f, s) => <DragonSprite facing={f} step={s} /> },
  ghost:         { kind: "ghost",         name: "Boo",     style: "Spooky cute",     size: 60, render: (f, s) => <GhostSprite facing={f} step={s} /> },
  robot:         { kind: "robot",         name: "Bit-9",   style: "Retro mecha",     size: 64, render: (f, s) => <RobotSprite facing={f} step={s} /> },
  axolotl:       { kind: "axolotl",       name: "Axo",     style: "Aquatic kawaii",  size: 64, render: (f, s) => <AxolotlSprite facing={f} step={s} /> },
  capybara:      { kind: "capybara",      name: "Caps",    style: "Chill vibes",     size: 68, render: (f, s) => <CapybaraSprite facing={f} step={s} /> },
  penguin:       { kind: "penguin",       name: "Pip",     style: "Antartic cute",   size: 60, render: (f, s) => <PenguinSprite facing={f} step={s} /> },
  fox:           { kind: "fox",           name: "Foxy",    style: "Wild cute",       size: 66, render: (f, s) => <FoxSprite facing={f} step={s} /> },
  panda:         { kind: "panda",         name: "Bao",     style: "Bamboo bro",      size: 64, render: (f, s) => <PandaSprite facing={f} step={s} /> },
  unicorn:       { kind: "unicorn",       name: "Sparkle", style: "Magic rainbow",   size: 66, render: (f, s) => <UnicornSprite facing={f} step={s} /> },
  bunny:         { kind: "bunny",         name: "Bun",     style: "Hop hop",         size: 60, render: (f, s) => <BunnySprite facing={f} step={s} /> },
  monkey:        { kind: "monkey",        name: "Mango",   style: "Jungle goof",     size: 64, render: (f, s) => <MonkeySprite facing={f} step={s} /> },
  cthulhu:       { kind: "cthulhu",       name: "Cthuli",  style: "Ancient horror",  size: 68, render: (f, s) => <CthulhuSprite facing={f} step={s} /> },
  shoggoth:      { kind: "shoggoth",      name: "Shog",    style: "Eldritch blob",   size: 66, render: (f, s) => <ShoggothSprite facing={f} step={s} /> },
  blackgoat:     { kind: "blackgoat",     name: "Shubby",  style: "Black goat",      size: 68, render: (f, s) => <BlackGoatSprite facing={f} step={s} /> },
  necronomicon:  { kind: "necronomicon",  name: "Necro",   style: "Cursed tome",     size: 60, render: (f, s) => <NecronomiconSprite facing={f} step={s} /> },
  slimemage:     { kind: "slimemage",     name: "Magi",    style: "D&D wizard",      size: 62, render: (f, s) => <SlimeMageSprite facing={f} step={s} /> },
  yurei:         { kind: "yurei",         name: "Yumi",    style: "Yokai japonés",   size: 64, render: (f, s) => <YureiSprite facing={f} step={s} /> },
  mushroom:      { kind: "mushroom",      name: "Shrum",   style: "Magic fungi",     size: 64, render: (f, s) => <MushroomSprite facing={f} step={s} /> },
  alien:         { kind: "alien",         name: "Xeno",    style: "Sci-fi horror",   size: 66, render: (f, s) => <AlienSprite facing={f} step={s} /> },
  // Videogames
  pikachu:       { kind: "pikachu",       name: "Pika",    style: "Pokémon ⚡",       size: 64, render: (f, s) => <PikachuSprite facing={f} step={s} /> },
  kirby:         { kind: "kirby",         name: "Kiby",    style: "Dream Land",      size: 60, render: (f, s) => <KirbySprite facing={f} step={s} /> },
  creeper:       { kind: "creeper",       name: "Crpr",    style: "Minecraft sssss", size: 64, render: (f, s) => <CreeperSprite facing={f} step={s} /> },
  yoshi:         { kind: "yoshi",         name: "Yosh",    style: "Mushroom Kingdom",size: 66, render: (f, s) => <YoshiSprite facing={f} step={s} /> },
  metroid:       { kind: "metroid",       name: "Metro",   style: "Metroid Prime",   size: 60, render: (f, s) => <MetroidSprite facing={f} step={s} /> },
  companionCube: { kind: "companionCube", name: "Cube",    style: "Portal ❤",        size: 60, render: (f, s) => <CompanionCubeSprite facing={f} step={s} /> },
  chocobo:       { kind: "chocobo",       name: "Choco",   style: "Final Fantasy",   size: 66, render: (f, s) => <ChocoboSprite facing={f} step={s} /> },
  booMario:      { kind: "booMario",      name: "Boowo",   style: "Mario ghost",     size: 60, render: (f, s) => <BooMarioSprite facing={f} step={s} /> },
  bulborb:       { kind: "bulborb",       name: "Bulb",    style: "Pikmin",          size: 66, render: (f, s) => <BulborbSprite facing={f} step={s} /> },
  headcrab:      { kind: "headcrab",      name: "Crab",    style: "Half-Life",       size: 60, render: (f, s) => <HeadcrabSprite facing={f} step={s} /> },
  isaac:         { kind: "isaac",         name: "Isaac",   style: "Binding of Isaac",size: 62, render: (f, s) => <IsaacSprite facing={f} step={s} /> },
  // Sci-fi / Horror
  facehugger:    { kind: "facehugger",    name: "Hugs",    style: "Alien ☠",         size: 64, render: (f, s) => <FacehuggerSprite facing={f} step={s} /> },
  xenomorph:     { kind: "xenomorph",     name: "Xeno-X",  style: "Alien hunter",    size: 68, render: (f, s) => <XenomorphSprite facing={f} step={s} /> },
  dalek:         { kind: "dalek",         name: "Dalek",   style: "Doctor Who",      size: 64, render: (f, s) => <DalekSprite facing={f} step={s} /> },
  tribble:       { kind: "tribble",       name: "Trib",    style: "Star Trek",       size: 60, render: (f, s) => <TribbleSprite facing={f} step={s} /> },
  bb8:           { kind: "bb8",           name: "BB-8",    style: "Star Wars droid", size: 64, render: (f, s) => <BB8Sprite facing={f} step={s} /> },
  weepingAngel:  { kind: "weepingAngel",  name: "Angel",   style: "Don't blink",     size: 64, render: (f, s) => <WeepingAngelSprite facing={f} step={s} /> },
  gremlin:       { kind: "gremlin",       name: "Mogwai",  style: "Gremlins",        size: 64, render: (f, s) => <GremlinSprite facing={f} step={s} /> },
  chestburster:  { kind: "chestburster",  name: "Burst",   style: "Alien larva",     size: 60, render: (f, s) => <ChestbursterSprite facing={f} step={s} /> },
  yautja:        { kind: "yautja",        name: "Predator",style: "The Predator",    size: 68, render: (f, s) => <YautjaSprite facing={f} step={s} /> },
  // New batch 2
  mario:         { kind: "mario",         name: "Mario",   style: "Super Mario",     size: 64, render: (f, s) => <MarioSprite facing={f} step={s} /> },
  sonic:         { kind: "sonic",         name: "Sonic",   style: "Gotta go fast",   size: 64, render: (f, s) => <SonicSprite facing={f} step={s} /> },
  amongUs:       { kind: "amongUs",       name: "Crew",    style: "Among Us sus",    size: 62, render: (f, s) => <AmongUsSprite facing={f} step={s} /> },
  totoro:        { kind: "totoro",        name: "Totoro",  style: "Studio Ghibli",   size: 66, render: (f, s) => <TotoroSprite facing={f} step={s} /> },
  jigglypuff:    { kind: "jigglypuff",    name: "Jiggly",  style: "Pokémon singer",  size: 60, render: (f, s) => <JigglypuffSprite facing={f} step={s} /> },
  doge:          { kind: "doge",          name: "Doge",    style: "Much wow",        size: 66, render: (f, s) => <DogeSprite facing={f} step={s} /> },
  nyanCat:       { kind: "nyanCat",       name: "Nyan",    style: "Rainbow cat",     size: 64, render: (f, s) => <NyanCatSprite facing={f} step={s} /> },
  bear:          { kind: "bear",          name: "Teddy",   style: "Forest bear",     size: 64, render: (f, s) => <BearSprite facing={f} step={s} /> },
  turtle:        { kind: "turtle",        name: "Shell",   style: "Slow & steady",   size: 66, render: (f, s) => <TurtleSprite facing={f} step={s} /> },
  owl:           { kind: "owl",           name: "Hoot",    style: "Night watcher",   size: 62, render: (f, s) => <OwlSprite facing={f} step={s} /> },
};

export const PET_LIST: PetKind[] = [
  // Cute classics
  "cat", "dog", "bunny", "fox", "panda",
  "axolotl", "capybara", "penguin", "monkey", "unicorn",
  "slime", "slimemage", "mushroom",
  // Original fantasy
  "dragon", "ghost", "robot",
  // Videogames
  "pikachu", "kirby", "yoshi", "creeper",
  "metroid", "companionCube", "chocobo", "booMario", "bulborb",
  "headcrab", "isaac",
  // Lovecraft
  "cthulhu", "shoggoth", "blackgoat", "necronomicon",
  // Sci-fi / horror
  "yurei", "alien", "facehugger", "xenomorph", "chestburster",
  "dalek", "tribble", "bb8", "weepingAngel", "gremlin", "yautja",
  // New batch 2
  "mario", "sonic", "amongUs", "totoro", "jigglypuff",
  "doge", "nyanCat", "bear", "turtle", "owl",
];

