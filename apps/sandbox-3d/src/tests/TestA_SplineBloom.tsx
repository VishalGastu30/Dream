import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function SplineCurve() {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(-2, 2, -2),
      new THREE.Vector3(2, -2, -4),
      new THREE.Vector3(5, 0, -6),
    ]);
  }, []);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const dotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const t = (clock.getElapsedTime() * 0.1) % 1; // Loop over time
    const position = curve.getPointAt(t);
    dotRef.current.position.copy(position);
  });

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#444" linewidth={1} />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        {/* Emissive material for bloom */}
        <meshStandardMaterial color="#fff" emissive="#FFB86B" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}

export default function TestA() {
  return (
    <Canvas style={{ background: "#050505", width: "100vw", height: "100vh" }}>
      <ambientLight intensity={0.2} />
      <SplineCurve />
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={2} />
      </EffectComposer>
    </Canvas>
  );
}
