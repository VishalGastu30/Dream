import { create } from "zustand";
import { TIERS, type Tier } from "../tiers/constants";

export type QualityMode = "auto" | "high" | "low";

interface SceneState {
  tier: Tier;
  quality: QualityMode;
  chapter: number;
  dotProgress: number;
  isIntro: boolean;
  activeProject: string | null;

  setTier: (tier: Tier) => void;
  setQuality: (quality: QualityMode) => void;
  setChapter: (chapter: number) => void;
  setDotProgress: (progress: number) => void;
  setIsIntro: (isIntro: boolean) => void;
  setActiveProject: (projectId: string | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  tier: TIERS.HIGH, // Will be updated on client mount
  quality: "auto",
  chapter: 0,
  dotProgress: 0,
  isIntro: true,
  activeProject: null,

  setTier: (tier) => set({ tier }),
  setQuality: (quality) => set({ quality }),
  setChapter: (chapter) => set({ chapter }),
  setDotProgress: (dotProgress) => set({ dotProgress }),
  setIsIntro: (isIntro) => set({ isIntro }),
  setActiveProject: (activeProject) => set({ activeProject }),
}));
