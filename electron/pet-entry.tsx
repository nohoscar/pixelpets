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
      setMouseHit: (hit: boolean) => void;
    };
  }
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

  // Track mouse position and do hit-testing with asymmetric debounce
  // Enter pet area: respond quickly (150ms). Leave pet area: delay 300ms to prevent flicker.
  useEffect(() => {
    let lastHit = false;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };

      // Check if mouse is over any pet element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isOverPet = el !== null && el !== document.body && el !== document.documentElement
        && el.id !== "root" && !el.matches("#root");

      if (isOverPet && !lastHit) {
        // Entering pet area — respond quickly
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const elNow = document.elementFromPoint(e.clientX, e.clientY);
          const stillOverPet = elNow !== null && elNow !== document.body && elNow !== document.documentElement
            && elNow.id !== "root" && !elNow.matches("#root");
          if (stillOverPet && !lastHit) {
            lastHit = true;
            window.pixelpets?.setMouseHit(true);
          }
        }, 150);
      } else if (!isOverPet && lastHit) {
        // Leaving pet area — delay before ignoring again to prevent flicker
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          lastHit = false;
          window.pixelpets?.setMouseHit(false);
        }, 300);
      }
    };
    window.addEventListener("mousemove", handler);
    return () => {
      window.removeEventListener("mousemove", handler);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
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
if (root) createRoot(root).render(<PetOverlay />);
