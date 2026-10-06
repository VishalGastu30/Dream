import { useSceneStore } from "./store/scene.store";

export function SceneRouter() {
  const _store = useSceneStore(); // Just calling it to keep the import for later

  // For P5-01, we just return a placeholder group.
  // In later tasks, this will switch based on chapter and dotProgress.
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#6EE7F9" wireframe />
      </mesh>
    </group>
  );
}
