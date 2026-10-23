import { useView } from "@/contexts/ViewContext";
import careerData from "@/data/career.json";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";

// Flatten all tag categories into one array and deduplicate
const RAW_TAGS = Array.from(new Set(Object.values(careerData.tags).flat())) as string[];

// Display-friendly label
const toLabel = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function KeywordDrift() {
  const { view } = useView();
  const groupRef = useRef<THREE.Group>(null);

  // Fixed random data computed once per session — no allocations inside useFrame
  const particles = useMemo(() => {
    return RAW_TAGS.map((word) => ({
      word: toLabel(word),
      px: (Math.random() - 0.5) * 32,
      py: (Math.random() - 0.5) * 18,
      pz: (Math.random() - 0.5) * 6 - 6,
      speed: Math.random() * 0.006 + 0.003,
      // In professional mode, keywords are very subtle background elements
      // In cinematic mode, they're more prominent
      opacity: Math.random() * 0.12 + 0.04,
      size: Math.random() * 0.18 + 0.22,
    }));
  }, []);

  // Professional mode: very subtle. Cinematic: slightly more visible
  const opacityScale = view === "cinematic" ? 1.8 : 1.0;

  useFrame(() => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const p = particles[i];
      if (!child || !p) continue;
      child.position.y += p.speed;
      if (child.position.y > 10) {
        child.position.y = -10;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p) => (
        <Text
          key={p.word}
          position={[p.px, p.py, p.pz]}
          fontSize={p.size}
          color="#6EE7F9"
          fillOpacity={p.opacity * opacityScale}
          anchorX="center"
          anchorY="middle"
        >
          {p.word}
        </Text>
      ))}
    </group>
  );
}
