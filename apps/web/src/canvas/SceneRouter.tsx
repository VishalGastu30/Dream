import { useView } from "@/contexts/ViewContext";
import { PostEffects } from "./postprocessing/PostEffects";
import { BootGenesis } from "./scenes/A_BootGenesis/BootGenesis";
import { JourneySpline } from "./scenes/B_Journey/JourneySpline";
import { ProjectsUniverse } from "./scenes/C_Projects/ProjectsUniverse";
import { Outro } from "./scenes/D_Outro/Outro";
import { useSceneStore } from "./store/scene.store";

export function SceneRouter() {
  const { chapter } = useSceneStore();
  const { view } = useView();

  // All cinematic scenes are only active in cinematic mode
  if (view !== "cinematic") {
    // In professional mode: only post-effects (bloom/vignette on the background)
    return <PostEffects />;
  }

  return (
    <group>
      {/* Scene A: Boot + Genesis — Chapter 0 */}
      {chapter <= 1 && <BootGenesis />}

      {/* Scene B: Journey — Chapter 1 */}
      {chapter >= 0 && chapter <= 2 && <JourneySpline />}

      {/* Scene C: Projects Universe — Chapter 2 */}
      {chapter >= 1 && chapter <= 3 && <ProjectsUniverse />}

      {/* Scene D: Outro — Chapter 3 */}
      {chapter >= 2 && <Outro />}

      {/* Post-processing effects */}
      <PostEffects />
    </group>
  );
}
