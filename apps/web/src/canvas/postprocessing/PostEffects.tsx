import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import * as THREE from "three";
import { useSceneStore } from "../store/scene.store";
import { TIERS } from "../tiers/constants";

export function PostEffects() {
  const { tier } = useSceneStore();

  const chromaticAberrationOffset = useMemo(() => new THREE.Vector2(0.002, 0.002), []);

  // No post-processing on LOW tier or NONE
  if (tier === TIERS.LOW || tier === TIERS.NONE) return null;

  return (
    <EffectComposer multisampling={tier === TIERS.HIGH ? 4 : 0}>
      <Bloom luminanceThreshold={1} mipmapBlur intensity={tier === TIERS.HIGH ? 1.5 : 1} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} blendFunction={BlendFunction.NORMAL} />
      {tier === TIERS.HIGH && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaticAberrationOffset}
          radialModulation={false}
          modulationOffset={0}
        />
      )}
    </EffectComposer>
  );
}
