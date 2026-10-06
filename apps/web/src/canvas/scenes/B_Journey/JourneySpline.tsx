import careerData from "@/data/career.json";
import { Html, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { useSceneStore } from "../../store/scene.store";

type ExperienceEntry = (typeof careerData.experience)[number];

// Build spline control points from experience count
function buildCurvePoints(count: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    points.push(
      new THREE.Vector3(
        (t - 0.5) * 20, // X: spread across screen
        Math.sin(t * Math.PI) * 3, // Y: gentle arc
        Math.cos(t * Math.PI * 2) * 1.5, // Z: slight depth wave
      ),
    );
  }
  return points;
}

function JobNode({
  position,
  entry,
  isActive,
}: {
  position: THREE.Vector3;
  entry: ExperienceEntry;
  isActive: boolean;
}) {
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.5 + 0.5;
    glowRef.current.emissiveIntensity = isActive ? 2 + pulse * 2 : 0.5;
  });

  return (
    <group position={position}>
      <Sphere args={[0.12, 16, 16]}>
        <meshStandardMaterial
          ref={glowRef}
          color="#fff"
          emissive="#6EE7F9"
          emissiveIntensity={isActive ? 2 : 0.5}
          toneMapped={false}
        />
      </Sphere>
      {isActive && (
        <Html center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="bg-bg-1/90 border border-border rounded-lg p-4 w-56 backdrop-blur-md shadow-2xl">
            <p className="text-signal text-[10px] font-mono uppercase tracking-widest mb-1">
              {entry.period.start} — {entry.period.end ?? "Present"}
            </p>
            <h3 className="text-text-0 text-sm font-bold leading-tight mb-1">{entry.title}</h3>
            <p className="text-text-2 text-xs">{entry.organization}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-2 text-text-2 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function JourneySpline() {
  const { dotProgress } = useSceneStore();
  const dotRef = useRef<THREE.Mesh>(null);

  const timelineExp = useMemo(
    () => careerData.experience.filter((e) => e.visibility?.timeline !== false),
    [],
  );

  const curve = useMemo(() => {
    const pts = buildCurvePoints(timelineExp.length);
    return new THREE.CatmullRomCurve3(pts, false, "centripetal");
  }, [timelineExp]);

  const nodePositions = useMemo(
    () =>
      timelineExp.map((_, i) => {
        const t = i / Math.max(timelineExp.length - 1, 1);
        return curve.getPoint(t);
      }),
    [curve, timelineExp],
  );

  // Build tube geometry once
  const tubePoints = useMemo(() => curve.getPoints(120), [curve]);
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(tubePoints);
    return geom;
  }, [tubePoints]);

  // Journey owns dotProgress range 0.2 → 0.5
  const journeyProgress = useMemo(() => {
    const raw = (dotProgress - 0.2) / 0.3;
    return Math.max(0, Math.min(1, raw));
  }, [dotProgress]);

  // Active node index
  const activeNode = Math.round(journeyProgress * (timelineExp.length - 1));

  // Move dot along curve — no allocations
  const dotPosTarget = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!dotRef.current) return;
    curve.getPointAt(journeyProgress, dotPosTarget);
    dotRef.current.position.lerp(dotPosTarget, 0.08);
  });

  return (
    <group>
      {/* Timeline line */}
      <line>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial color="#6EE7F9" opacity={0.15} transparent />
      </line>

      {/* Job nodes */}
      {timelineExp.map((entry, i) => (
        <JobNode
          key={entry.id}
          position={nodePositions[i] ?? new THREE.Vector3()}
          entry={entry}
          isActive={i === activeNode}
        />
      ))}

      {/* Dot protagonist along spline */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#6EE7F9"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
