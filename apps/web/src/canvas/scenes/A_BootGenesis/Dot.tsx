"use client";

/**
 * canvas/scenes/A_BootGenesis/Dot.tsx
 *
 * The Orb — three lives:
 *   1. Professional mode: custom cursor follower (hides native cursor)
 *   2. Cinematic mode: protagonist that travels through chapters
 *   3. NONE tier: does not render
 *
 * Rules: no allocations in useFrame — all THREE objects are pre-allocated refs.
 */

import { useView } from "@/contexts/ViewContext";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSceneStore } from "../../store/scene.store";
import { TIERS } from "../../tiers/constants";

// Pre-allocated temporaries — never reallocated in useFrame
const _targetPos = new THREE.Vector3();

export function Dot() {
  const { view } = useView();
  const { tier, chapter } = useSceneStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const { viewport } = useThree();

  // Raw NDC mouse coords — updated by event listener, not in useFrame
  const mouse = useRef({ x: 0, y: 0 });
  // Target scale for hover/click feedback
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  const color = useMemo(() => new THREE.Color("#6EE7F9"), []);

  // Hide native cursor in professional mode (orb IS the cursor)
  useEffect(() => {
    if (tier === TIERS.NONE) return;

    if (view === "professional") {
      document.documentElement.style.cursor = "none";
    } else {
      document.documentElement.style.cursor = "";
    }
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, [view, tier]);

  // Mouse tracking — passive listener, no allocations
  useEffect(() => {
    if (tier === TIERS.NONE || view !== "professional") return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // Click pulse
    const onClick = () => {
      targetScale.current = 1.6;
      setTimeout(() => {
        targetScale.current = 1;
      }, 200);
    };

    // Hover detection — expand on interactive elements
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive =
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        el.closest("a") !== null ||
        el.closest("button") !== null ||
        window.getComputedStyle(el).cursor === "pointer";
      targetScale.current = isInteractive ? 1.8 : 1;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mouseover", onOver);
    };
  }, [view, tier]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.getElapsedTime();

    // Breathing emission — always
    const breath = Math.sin(t * 1.8) * 0.5 + 0.5;

    if (view === "professional") {
      // ── CURSOR MODE ──────────────────────────────────────────────
      // Map NDC mouse to world position at z=2 (just in front of background)
      _targetPos.set(
        mouse.current.x * (viewport.width / 2),
        mouse.current.y * (viewport.height / 2),
        2,
      );
      meshRef.current.position.lerp(_targetPos, 0.12);

      // Scale spring
      currentScale.current += (targetScale.current - currentScale.current) * 0.18;
      meshRef.current.scale.setScalar(currentScale.current);

      matRef.current.emissiveIntensity = 1.5 + breath * 2;
    } else {
      // ── CINEMATIC MODE ────────────────────────────────────────────
      // Chapter 0: orb breathes at center
      if (chapter === 0) {
        _targetPos.set(0, 0, 0);
        meshRef.current.position.lerp(_targetPos, 0.05);
        meshRef.current.scale.setScalar(1);
        matRef.current.emissiveIntensity = 2 + breath * 3;
      }
      // Chapters 1+: JourneySpline and ProjectsUniverse own position
    }
  });

  if (tier === TIERS.NONE) return null;
  if (view !== "professional" && view !== "cinematic") return null;

  const radius = view === "professional" ? 0.28 : 0.5;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        ref={matRef}
        color="#ffffff"
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}
