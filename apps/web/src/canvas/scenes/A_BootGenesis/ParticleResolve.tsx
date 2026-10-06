import { Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { useSceneStore } from "../../store/scene.store";

export function ParticleResolve() {
  // biome-ignore lint/suspicious/noExplicitAny: Temporary fix for missing troika-three-text type
  const textRef = useRef<any>(null);
  const { dotProgress } = useSceneStore();

  // As dotProgress goes from 0 to 0.1, the text fades in.
  // This is just a placeholder logic, the actual animation timeline
  // will be driven by GSAP or dotProgress.

  useFrame(() => {
    if (!textRef.current) return;
    // Fade in text based on some intro progress or scroll
    // For now, let's just make it breathe slowly
    textRef.current.fillOpacity = Math.min(1, dotProgress * 10);
  });

  return (
    <group position={[0, 0, -2]}>
      <Text
        ref={textRef}
        fontSize={2}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        VISHAL GASTU
      </Text>

      {/* Background ambient particles */}
      <Sparkles count={500} scale={20} size={2} speed={0.4} opacity={0.2} color="#6EE7F9" />
    </group>
  );
}
