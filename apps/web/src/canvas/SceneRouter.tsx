import { PostEffects } from "./postprocessing/PostEffects";
import { BootGenesis } from "./scenes/A_BootGenesis/BootGenesis";
import { JourneySpline } from "./scenes/B_Journey/JourneySpline";
import { useSceneStore } from "./store/scene.store";

export function SceneRouter() {
  const { chapter } = useSceneStore();

  return (
    <group>
      {/* Scene A: Boot + Genesis — Chapter 0 */}
      {chapter <= 1 && <BootGenesis />}

      {/* Scene B: Journey — Chapter 1 */}
      {chapter >= 0 && chapter <= 2 && <JourneySpline />}

      {/* Post-processing effects, tier-gated */}
      <PostEffects />
    </group>
  );
}
