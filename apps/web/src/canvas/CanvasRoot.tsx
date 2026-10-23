"use client";

/**
 * canvas/CanvasRoot.tsx
 *
 * The always-on Three.js canvas.
 * - In professional mode: passive decorative background. Dot = custom cursor. KeywordDrift = ambient.
 * - In cinematic mode: fullscreen interactive experience. pointer-events enabled.
 * - TIERS.NONE: canvas not rendered at all (CSS DOM fallback).
 */

import { useView } from "@/contexts/ViewContext";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { SceneRouter } from "./SceneRouter";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { Dot } from "./scenes/A_BootGenesis/Dot";
import { KeywordDrift } from "./scenes/A_BootGenesis/KeywordDrift";
import { useSceneStore } from "./store/scene.store";
import { detectCapability } from "./tiers/capability";
import { TIERS } from "./tiers/constants";
import { FpsMonitor } from "./utils/FpsMonitor";

export default function CanvasRoot() {
  const { tier, setTier, quality } = useSceneStore();
  const { view } = useView();
  const [isReady, setIsReady] = useState(false);

  useScrollProgress();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const detected = await detectCapability();
      if (mounted) {
        setTier(detected);
        setIsReady(true);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [setTier]);

  // Determine actual active tier considering user quality override
  let activeTier = tier;
  if (quality === "low") activeTier = TIERS.LOW;
  if (quality === "high" && tier !== TIERS.NONE) activeTier = TIERS.HIGH;

  if (!isReady) return null;
  if (activeTier === TIERS.NONE) return null;

  const dpr = activeTier === TIERS.HIGH ? [1, 2] : activeTier === TIERS.MEDIUM ? [1, 1.5] : [1, 1];

  // In professional mode: canvas stays behind, non-interactive, just decorative
  // In cinematic mode: canvas is the world — interactive
  const isCinematic = view === "cinematic";

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: isCinematic ? "auto" : "none" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr as [number, number]}
        frameloop="always"
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: activeTier === TIERS.HIGH, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.04} />
        <pointLight position={[0, 0, 5]} intensity={1.2} color="#6EE7F9" />

        {/* Always-on elements — present in both modes */}
        <KeywordDrift />
        <Dot />

        {/* Cinematic scenes — only in cinematic mode (SceneRouter has guards) */}
        <SceneRouter />

        {quality === "auto" && <FpsMonitor />}
      </Canvas>
    </div>
  );
}
