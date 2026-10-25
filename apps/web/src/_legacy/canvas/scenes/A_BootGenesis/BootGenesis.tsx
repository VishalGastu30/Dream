import { useView } from "@/contexts/ViewContext";
import { useSceneStore } from "../../store/scene.store";
import { Dot } from "./Dot";
import { KeywordDrift } from "./KeywordDrift";
import { ParticleResolve } from "./ParticleResolve";

export function BootGenesis() {
  const { chapter } = useSceneStore();
  const { view } = useView();

  // Only render this scene in cinematic mode
  if (view !== "cinematic") return null;
  if (chapter > 1) return null;

  return (
    <group>
      <Dot />
      <KeywordDrift />
      <ParticleResolve />
    </group>
  );
}
