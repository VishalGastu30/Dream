import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function ComplexCrystal() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.2;
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[2, 2]} />
      {/* Ghost light / glass unified material */}
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={1}
        chromaticAberration={0.05}
        anisotropy={0.1}
        distortion={0.2}
        distortionScale={0.5}
        temporalDistortion={0.1}
        color="#F2F4F8"
        attenuationDistance={0.5}
        attenuationColor="#4A90E2"
      />
    </mesh>
  );
}

export default function TestC() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6] }}
      style={{ background: "#050505", width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <ComplexCrystal />

      {/* Needed for reflections in the transmission material */}
      <Environment preset="city" />
      <OrbitControls enableDamping />
    </Canvas>
  );
}
