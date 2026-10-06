import careerData from "@/data/career.json";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

// Flatten all tag categories into one array
const RAW_TAGS = Object.values(careerData.tags).flat() as string[];

// Display-friendly label
const toLabel = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function KeywordDrift() {
  const groupRef = useRef<THREE.Group>(null);

  // Fixed random data computed once per session — no allocations inside useFrame
  const particles = useMemo(() => {
    return RAW_TAGS.map((word) => ({
      word: toLabel(word),
      // Spread them wide enough so they don't occlude the Dot
      px: (Math.random() - 0.5) * 28,
      py: (Math.random() - 0.5) * 16,
      pz: (Math.random() - 0.5) * 8 - 4,
      speed: Math.random() * 0.008 + 0.004,
      opacity: Math.random() * 0.15 + 0.05,
      size: Math.random() * 0.2 + 0.25,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const p = particles[i];
      if (!child || !p) continue;
      child.position.y += p.speed;
      if (child.position.y > 9) {
        child.position.y = -9;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <Text
          key={p.word + i}
          position={[p.px, p.py, p.pz]}
          fontSize={p.size}
          color="#6EE7F9"
          fillOpacity={p.opacity}
          anchorX="center"
          anchorY="middle"
        >
          {p.word}
        </Text>
      ))}
    </group>
  );
}
