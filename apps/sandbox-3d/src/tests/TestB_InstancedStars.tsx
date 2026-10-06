import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const NUM_STARS = 50000;

function InstancedStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set initial positions
  useMemo(() => {
    // wait for ref to mount using layout effect or just compute initial matrix array
  }, []);

  // Set matrices after mount
  const handleMount = (mesh: THREE.InstancedMesh) => {
    for (let i = 0; i < NUM_STARS; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
      );
      // add slight random scale
      const scale = Math.random() * 0.5 + 0.5;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <instancedMesh
      ref={(el) => {
        if (el && !meshRef.current) {
          meshRef.current = el;
          handleMount(el);
        }
      }}
      args={[undefined, undefined, NUM_STARS]}
    >
      <planeGeometry args={[0.1, 0.1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
}

export default function TestB() {
  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 60 }}
      style={{ background: "#050505", width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={1} />
      <InstancedStars />
      <OrbitControls autoRotate autoRotateSpeed={0.5} enableDamping />
    </Canvas>
  );
}
