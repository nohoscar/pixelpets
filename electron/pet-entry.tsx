// Standalone entry point for the Electron pet overlay window.
// Full-featured: all 42 sprites, stats, thoughts, and system awareness.

import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Pet, type PetStats } from "../src/components/pets/Pet";
import type { PetKind } from "../src/components/pets/petSprites";
import { useSystemAwareness } from "../src/hooks/useSystemAwareness";

declare global {
  interface Window {
    pixelpets?: {
      onSetPet: (cb: (kind: string) => void) => void;
      onSetFollow: (cb: (value: boolean) => void) => void;
      onPetAction: (cb: (action: string) => void) => void;
      sendStats: (stats: PetStats) => void;
    };
  }
}

function DesktopClock() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    };
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      padding: "4px 8px",
      borderRadius: 6,
      background: "rgba(20, 16, 40, 0.7)",
      border: "1px solid rgba(122, 245, 176, 0.3)",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: 10,
      color: "#7af5b0",
      zIndex: 5,
      pointerEvents: "none",
    }}>
      {time}
    </div>
  );
}

function PetOverlay() {
  const [kind, setKind] = useState<PetKind>("cat");
  const [followCursor, setFollowCursor] = useState(false);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const actionRef = useRef<{
    feed: () => void;
    play: () => void;
    sleep: () => void;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const k = params.get("kind") as PetKind | null;
    if (k) setKind(k);
    if (params.get("follow") === "1") setFollowCursor(true);
  }, []);

  // Track mouse position (overlay is always click-through, no hit-testing needed)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // IPC listeners from main process
  useEffect(() => {
    window.pixelpets?.onSetPet?.((k) => setKind(k as PetKind));
    window.pixelpets?.onSetFollow?.((v) => setFollowCursor(!!v));
    window.pixelpets?.onPetAction?.((action) => {
      if (action === "feed") actionRef.current?.feed();
      if (action === "play") actionRef.current?.play();
      if (action === "sleep") actionRef.current?.sleep();
    });
  }, []);

  // Send stats back to panel via IPC
  const handleStatsChange = useCallback((stats: PetStats) => {
    window.pixelpets?.sendStats?.(stats);
  }, []);

  const awareness = useSystemAwareness();

  return (
    <Pet
      id="solo"
      kind={kind}
      cursorRef={cursorRef}
      followCursor={followCursor}
      onRemove={() => {}}
      awareness={awareness}
      onStatsChange={handleStatsChange}
      actionRef={actionRef}
    />
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(
  <>
    <PetOverlay />
    {window.pixelpets && <DesktopClock />}
  </>
);
