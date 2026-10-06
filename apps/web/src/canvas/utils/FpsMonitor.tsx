import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useSceneStore } from "../store/scene.store";
import { TIERS } from "../tiers/constants";

export function FpsMonitor() {
  const { tier, setTier, quality } = useSceneStore();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsTime = useRef(0);
  const [fps, setFps] = useState(0);

  useFrame(() => {
    if (quality !== "auto") return;

    const now = performance.now();
    frameCount.current++;

    if (now - lastTime.current >= 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      setFps(currentFps);

      // Auto-downgrade logic
      if (currentFps < 35 && tier !== TIERS.LOW && tier !== TIERS.NONE) {
        lowFpsTime.current++;
        // If FPS < 35 for 3 consecutive seconds, downgrade
        if (lowFpsTime.current >= 3) {
          if (tier === TIERS.HIGH) setTier(TIERS.MEDIUM);
          else if (tier === TIERS.MEDIUM) setTier(TIERS.LOW);
          lowFpsTime.current = 0; // Reset after downgrade
        }
      } else {
        lowFpsTime.current = 0;
      }

      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Html position={[-window.innerWidth / 2 + 10, window.innerHeight / 2 - 10, 0]}>
      <div className="bg-black/80 text-green-500 p-2 font-mono text-sm rounded pointer-events-none fixed top-4 left-4 z-[9999]">
        FPS: {fps}
      </div>
    </Html>
  );
}
