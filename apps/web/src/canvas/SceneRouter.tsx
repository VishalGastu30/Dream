import { PostEffects } from "./postprocessing/PostEffects";
import { BootGenesis } from "./scenes/A_BootGenesis/BootGenesis";

export function SceneRouter() {
  return (
    <group>
      {/* Scene A: Boot + Genesis — Chapter 0 */}
      <BootGenesis />
      {/* Post-processing effects, tier-gated */}
      <PostEffects />
    </group>
  );
}
