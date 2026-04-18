import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pet } from "@/components/pets/Pet";
import type { PetKind } from "@/components/pets/petSprites";

export const Route = createFileRoute("/pet")({
  component: PetOnly,
  head: () => ({
    meta: [
      { title: "Desktop Pet" },
      { name: "description", content: "Tu mascotita de escritorio." },
    ],
  }),
});

/**
 * Vista sin UI — solo la mascota sobre fondo transparente.
 * La usa la app Electron para mostrar la mascota flotando sobre el escritorio.
 *
 * URL params:
 *   ?kind=cat|dog|slime|dragon|ghost|robot   (default: cat)
 *   ?follow=1                                (sigue al cursor)
 */
function PetOnly() {
  const [kind, setKind] = useState<PetKind>("cat");
  const [followCursor, setFollowCursor] = useState(false);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const k = params.get("kind") as PetKind | null;
    if (k) setKind(k);
    if (params.get("follow") === "1") setFollowCursor(true);

    // Make body fully transparent for Electron transparent window
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    document.body.style.cursor = "none";
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Listen to messages from Electron main process to swap pet at runtime
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "set-pet" && e.data.kind) {
        setKind(e.data.kind);
      }
      if (e.data?.type === "set-follow") {
        setFollowCursor(!!e.data.value);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <ClientOnly fallback={null}>
        <Pet
          id="solo"
          kind={kind}
          cursorRef={cursorRef}
          followCursor={followCursor}
          onRemove={() => {}}
        />
      </ClientOnly>
    </div>
  );
}
