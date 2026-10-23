import { useView } from "@/contexts/ViewContext";
import { Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useSceneStore } from "../../store/scene.store";

export function ParticleResolve() {
  // biome-ignore lint/suspicious/noExplicitAny: Temporary fix for missing troika-three-text type
  const textRef = useRef<any>(null);
  const { dotProgress } = useSceneStore();
  const { view } = useView();

  // Only show in cinematic mode — this is the scene-level "VISHAL GASTU" text
  // In professional mode this caused the giant overlay bug (no guard before)
  if (view !== "cinematic") return null;

  useFrame(() => {
    if (!textRef.current) return;
    // Fade in text based on scroll progress in chapter 0 (dotProgress 0 → 0.15)
    textRef.current.fillOpacity = Math.min(1, dotProgress * 7);
  });

  return (
    <group position={[0, 0, -3]}>
      <Text
        ref={textRef}
        fontSize={1.6}
        color="#f2f4f8"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        fillOpacity={0}
      >
        VISHAL GASTU
      </Text>

      {/* Background ambient particles */}
      <Sparkles count={400} scale={18} size={1.5} speed={0.3} opacity={0.15} color="#6EE7F9" />
    </group>
  );
}
