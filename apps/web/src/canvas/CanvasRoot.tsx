"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { SceneRouter } from "./SceneRouter";
import { useSceneStore } from "./store/scene.store";
import { detectCapability } from "./tiers/capability";
import { TIERS } from "./tiers/constants";
import { FpsMonitor } from "./utils/FpsMonitor";
import { CinematicLoader } from "@/components/CinematicLoader";

export default function CanvasRoot() {
  const { tier, setTier, quality } = useSceneStore();
  const [isReady, setIsReady] = useState(false);

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

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-0 pointer-events-none">
        <div className="text-signal font-mono text-sm animate-pulse">DETECTING HARDWARE...</div>
      </div>
    );
  }

  if (activeTier === TIERS.NONE) {
    return null; // CSS DOM fallback handles it
  }

  const dpr = activeTier === TIERS.HIGH ? [1, 2] : activeTier === TIERS.MEDIUM ? [1, 1.5] : [1, 1];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <CinematicLoader />
      <Canvas
        dpr={dpr as [number, number]}
        frameloop="demand"
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ pointerEvents: "auto", background: "transparent" }}
      >
        <SceneRouter />
        {quality === "auto" && <FpsMonitor />}
      </Canvas>
    </div>
  );
}
