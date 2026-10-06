import { useSceneStore } from "../../store/scene.store";
import { Dot } from "./Dot";
import { EntryButtons } from "./EntryButtons";
import { KeywordDrift } from "./KeywordDrift";
import { ParticleResolve } from "./ParticleResolve";

export function BootGenesis() {
  const { chapter } = useSceneStore();

  // If we've moved completely past chapter 0 (e.g. Journey or Projects), we might want to hide this scene entirely for performance.
  // For now, we always render but components handle their own fade out based on dotProgress.
  if (chapter > 1) return null;

  return (
    <group>
      <Dot />
      <KeywordDrift />
      <ParticleResolve />
      <EntryButtons />
    </group>
  );
}
