import { useState } from "react";
import { encodePetCode, decodePetCode, getShareUrl, type TradePet } from "@/lib/petTrading";
import type { GameState } from "@/hooks/useGameState";
import type { PetKind } from "@/components/pets/petSprites";

interface Props {
  gameState: GameState;
  activePetKind: PetKind;
}

export function PetTrading({ gameState, activePetKind }: Props) {
  const [mode, setMode] = useState<"idle" | "share" | "receive">("idle");
  const [shareCode, setShareCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [receivedPet, setReceivedPet] = useState<TradePet | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const petData: TradePet = {
      kind: activePetKind,
      name: gameState.petNames[activePetKind] || activePetKind,
      level: Math.floor((gameState.petXpHistory[activePetKind] ?? 0) / 100) + 1,
      xp: gameState.petXpHistory[activePetKind] ?? 0,
      accessories: gameState.accessories,
    };
    const code = encodePetCode(petData);
    setShareCode(code);
    setMode("share");
  };

  const handleReceive = () => {
    setError("");
    const pet = decodePetCode(inputCode.trim());
    if (!pet) {
      setError("Invalid code! Check and try again.");
      return;
    }
    setReceivedPet(pet);
    // Add XP for the received pet kind
    gameState.addPetXp(pet.kind, Math.floor(pet.xp * 0.3)); // 30% of original XP
    gameState.addXp(10); // bonus for trading
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode === "share") {
    return (
      <div className="glass rounded-xl p-3 border border-border/40">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display text-[9px] text-muted-foreground">🎁 SHARE PET</h4>
          <button onClick={() => setMode("idle")} className="text-[9px] text-muted-foreground hover:text-foreground">← Back</button>
        </div>
        <p className="text-[8px] text-muted-foreground mb-2">Send this code to a friend:</p>
        <div className="bg-background/50 rounded p-2 break-all text-[7px] font-mono text-neon border border-neon/20">
          {shareCode}
        </div>
        <button
          onClick={handleCopy}
          className="mt-2 w-full py-1.5 rounded text-[9px] font-display bg-neon/20 text-neon border border-neon/40 hover:bg-neon/30 transition-all"
        >
          {copied ? "✅ Copied!" : "📋 Copy Code"}
        </button>
      </div>
    );
  }

  if (mode === "receive") {
    return (
      <div className="glass rounded-xl p-3 border border-border/40">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-display text-[9px] text-muted-foreground">📥 RECEIVE PET</h4>
          <button onClick={() => { setMode("idle"); setReceivedPet(null); setError(""); }} className="text-[9px] text-muted-foreground hover:text-foreground">← Back</button>
        </div>
        {receivedPet ? (
          <div className="text-center py-2">
            <span className="text-2xl block animate-bob">🎉</span>
            <p className="font-display text-[10px] text-neon mt-2">Received: {receivedPet.name}</p>
            <p className="text-[8px] text-muted-foreground">Level {receivedPet.level} {receivedPet.kind}</p>
            <p className="text-[8px] text-neon mt-1">+{Math.floor(receivedPet.xp * 0.3)} XP bonus!</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste PXL-XXXX code here..."
              className="w-full bg-background/50 rounded p-2 text-[9px] font-mono border border-border/40 focus:border-neon/50 outline-none"
            />
            {error && <p className="text-[8px] text-red-400 mt-1">{error}</p>}
            <button
              onClick={handleReceive}
              disabled={!inputCode.trim()}
              className="mt-2 w-full py-1.5 rounded text-[9px] font-display bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 transition-all disabled:opacity-40"
            >
              Redeem Code
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-3 border border-border/40">
      <h4 className="font-display text-[9px] text-muted-foreground mb-2">🔄 PET TRADING</h4>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleShare}
          className="rounded-lg p-2 border border-border/30 hover:border-neon/50 transition-all text-center"
        >
          <span className="text-lg block">🎁</span>
          <p className="font-display text-[8px] mt-1">Share Pet</p>
        </button>
        <button
          onClick={() => setMode("receive")}
          className="rounded-lg p-2 border border-border/30 hover:border-primary/50 transition-all text-center"
        >
          <span className="text-lg block">📥</span>
          <p className="font-display text-[8px] mt-1">Receive Pet</p>
        </button>
      </div>
    </div>
  );
}
