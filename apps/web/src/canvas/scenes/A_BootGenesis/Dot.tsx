import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useSceneStore } from "../../store/scene.store";

export function Dot() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  // dotProgress + isIntro wired in later when scene routing is complete
  const _store = useSceneStore();

  const color = useMemo(() => new THREE.Color("#6EE7F9"), []);

  useFrame(({ clock }) => {
    if (!materialRef.current || !meshRef.current) return;

    // Breathing animation
    const time = clock.getElapsedTime();
    const breathing = Math.sin(time * 2) * 0.5 + 0.5; // 0 to 1

    // In intro, it just breathes.
    // In journey, its position might change, handled in SceneRouter or a parent component

    materialRef.current.emissiveIntensity = 2 + breathing * 4;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#fff"
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}
