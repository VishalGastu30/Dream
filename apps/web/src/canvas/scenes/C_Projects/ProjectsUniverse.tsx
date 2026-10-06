import careerData from "@/data/career.json";
import { Html, Sphere, Torus } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useSceneStore } from "../../store/scene.store";

type ProjectEntry = (typeof careerData.projects)[number];

function ProjectPlanet({
  project,
  radius,
  speed,
  angleOffset,
}: {
  project: ProjectEntry;
  radius: number;
  speed: number;
  angleOffset: number;
}) {
  const planetGroup = useRef<THREE.Group>(null);
  const planetMesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { dotProgress } = useSceneStore();

  const accentColor = project.scene?.accent || "#6EE7F9";

  // Calculate local progress (0 to 1 over the 0.5 - 0.8 range)
  const localProgress = useMemo(() => {
    const raw = (dotProgress - 0.5) / 0.3;
    return Math.max(0, Math.min(1, raw));
  }, [dotProgress]);

  useFrame(({ clock }) => {
    if (!planetGroup.current || !planetMesh.current) return;

    // Only orbit if not hovered, and scale orbit speed by progress to create a cool entry
    const time = clock.getElapsedTime();
    const currentAngle = hovered
      ? planetGroup.current.userData.lastAngle || angleOffset
      : angleOffset + time * speed * Math.min(localProgress * 2, 1);

    if (hovered) {
      planetGroup.current.userData.lastAngle = currentAngle;
    }

    // Position along orbit
    planetGroup.current.position.x = Math.cos(currentAngle) * radius;
    planetGroup.current.position.z = Math.sin(currentAngle) * radius;

    // Self rotation
    planetMesh.current.rotation.y += 0.01;
    planetMesh.current.rotation.x += 0.005;

    // Pulse effect when hovered
    const pulse = hovered ? Math.sin(time * 5) * 0.5 + 1.5 : 1;
    (planetMesh.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
  });

  return (
    <group>
      {/* Orbit Ring */}
      <Torus args={[radius, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={accentColor} transparent opacity={0.15} />
      </Torus>

      {/* Planet */}
      <group
        ref={planetGroup}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Sphere ref={planetMesh} args={[0.3, 32, 32]}>
          <meshStandardMaterial
            color="#fff"
            emissive={accentColor}
            emissiveIntensity={1}
            toneMapped={false}
          />
        </Sphere>

        {/* Project Card */}
        <Html
          position={[0.5, 0.5, 0]}
          center
          distanceFactor={10}
          style={{
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        >
          <div className="bg-bg-1/90 border border-border rounded-xl p-5 w-72 backdrop-blur-md shadow-2xl">
            <h3 className="text-text-0 text-lg font-bold mb-1">{project.title}</h3>
            <p className="text-text-2 text-xs mb-3 leading-relaxed">{project.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.stack?.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-2 text-text-1"
                >
                  {tech}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="text-xs text-signal uppercase tracking-widest hover:underline"
              onClick={() => {
                // Navigate or open modal later
                console.log("View project:", project.id);
              }}
            >
              Explore Project ↗
            </button>
          </div>
        </Html>
      </group>
    </group>
  );
}

export function ProjectsUniverse() {
  const { dotProgress } = useSceneStore();
  const groupRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);

  // Projects owns dotProgress range 0.5 → 0.8
  const universeProgress = useMemo(() => {
    const raw = (dotProgress - 0.5) / 0.3;
    return Math.max(0, Math.min(1, raw));
  }, [dotProgress]);

  // Animation constants
  const orbitRadii = [3, 5, 7];
  const orbitSpeeds = [0.4, 0.25, 0.15];

  useFrame(({ clock }) => {
    if (!groupRef.current || !sunRef.current) return;

    // The universe slowly rotates as a whole
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;

    // The camera/group pushes forward slightly through the universe based on progress
    groupRef.current.position.z = THREE.MathUtils.lerp(0, 5, universeProgress);
    groupRef.current.position.y = THREE.MathUtils.lerp(0, -2, universeProgress);

    // Sun pulsing
    const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.5 + 2.5;
    (sunRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
  });

  return (
    <group ref={groupRef} visible={universeProgress > 0}>
      {/* Central Sun (The Dot, transformed) */}
      <Sphere ref={sunRef} args={[0.8, 64, 64]}>
        <meshStandardMaterial
          color="#fff"
          emissive="#6EE7F9"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </Sphere>

      {/* Sun glow/halo */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial
          color="#6EE7F9"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Planets (Projects) */}
      {careerData.projects.slice(0, 3).map((project, i) => (
        <ProjectPlanet
          key={project.id}
          project={project}
          radius={orbitRadii[i] ?? 3}
          speed={orbitSpeeds[i] ?? 0.2}
          angleOffset={(Math.PI * 2 * i) / 3}
        />
      ))}
    </group>
  );
}
