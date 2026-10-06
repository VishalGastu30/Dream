import { getGPUTier } from "detect-gpu";
import { TIERS, type Tier } from "./constants";

export async function detectCapability(): Promise<Tier> {
  // Check prefers-reduced-motion
  if (typeof window !== "undefined") {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return TIERS.NONE;
    }
  }

  try {
    const gpuTier = await getGPUTier();

    // If WebGL fails or mobile device is very weak
    if (gpuTier.tier === 0) {
      return TIERS.NONE;
    }

    if (gpuTier.isMobile) {
      if (gpuTier.tier >= 3) return TIERS.MEDIUM;
      return TIERS.LOW;
    }

    // Desktop
    if (gpuTier.tier >= 3) return TIERS.HIGH;
    if (gpuTier.tier >= 2) return TIERS.MEDIUM;
    return TIERS.LOW;
  } catch (error) {
    console.warn("Failed to detect GPU capability, falling back to LOW tier", error);
    return TIERS.LOW;
  }
}
