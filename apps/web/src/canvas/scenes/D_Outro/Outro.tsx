import { useView } from "@/contexts/ViewContext";
import { Html, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useSceneStore } from "../../store/scene.store";

export function Outro() {
  const { dotProgress } = useSceneStore();
  const { setView } = useView();
  const router = useRouter();
  const dotRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);

  // Outro owns dotProgress range 0.8 → 1.0
  const outroProgress = useMemo(() => {
    const raw = (dotProgress - 0.8) / 0.2;
    return Math.max(0, Math.min(1, raw));
  }, [dotProgress]);

  useFrame(({ clock }) => {
    if (!dotRef.current || !glowRef.current) return;

    // The dot descends from above and settles in the center
    const yPos = THREE.MathUtils.lerp(5, 0, outroProgress);
    dotRef.current.position.y = yPos;

    // The dot shrinks back down to standard size from the sun size
    const scale = THREE.MathUtils.lerp(0.8, 0.2, outroProgress);
    dotRef.current.scale.set(scale, scale, scale);

    // Pulse effect
    const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.5 + 1.5;
    glowRef.current.emissiveIntensity = pulse;
  });

  return (
    <group visible={outroProgress > 0}>
      {/* Final Dot */}
      <Sphere ref={dotRef} args={[1, 32, 32]}>
        <meshStandardMaterial
          ref={glowRef}
          color="#fff"
          emissive="#6EE7F9"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>

      {/* CTA Overlay */}
      <Html
        position={[0, -2, 0]}
        center
        transform
        wrapperClass="transition-opacity duration-1000"
        style={{
          opacity: outroProgress > 0.8 ? 1 : 0,
          pointerEvents: outroProgress > 0.8 ? "auto" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-8 w-[400px]">
          <h2 className="text-text-0 text-xl font-bold tracking-widest uppercase">
            System Standby
          </h2>
          <p className="text-text-2 text-center text-sm leading-relaxed">
            The cinematic sequence has concluded. You may now explore the standard professional
            interface or restart the simulation.
          </p>

          <div className="flex flex-col w-full gap-3 mt-4">
            <button
              type="button"
              className="w-full py-3 border-2 border-signal text-signal hover:bg-signal/10 transition-colors uppercase tracking-widest text-xs font-bold"
              onClick={() => {
                setView("professional");
                router.push("/");
              }}
            >
              Enter Professional View
            </button>
            <button
              type="button"
              className="w-full py-3 border border-border text-text-1 hover:text-text-0 hover:border-text-2 transition-colors uppercase tracking-widest text-xs"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Restart Simulation
            </button>
          </div>

          <div className="flex gap-6 mt-6 pt-6 border-t border-border/50 w-full justify-center">
            <a
              href="mailto:vishalgastu30@gmail.com"
              className="text-text-2 hover:text-signal transition-colors text-xs uppercase tracking-wider"
            >
              Email
            </a>
            <a
              href="https://github.com/VishalGastu30"
              target="_blank"
              rel="noreferrer"
              className="text-text-2 hover:text-signal transition-colors text-xs uppercase tracking-wider"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/vishalgastu"
              target="_blank"
              rel="noreferrer"
              className="text-text-2 hover:text-signal transition-colors text-xs uppercase tracking-wider"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </Html>
    </group>
  );
}
