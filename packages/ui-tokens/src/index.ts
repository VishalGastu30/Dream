/**
 * Design tokens as TypeScript constants.
 * Import from here in 3D shaders and theme utilities (the bridge between DOM and WebGL).
 * The canonical source of truth is tokens.css — this file mirrors it.
 *
 * See MASTER_PLAN.md §8.2 for the full token spec.
 * See .agents/rules/30-design-system.md for usage rules.
 */

export const tokens = {
  // Backgrounds
  bg0: "#05060A",
  bg1: "#0B0D14",

  // Surfaces (glass)
  surface: "rgba(255, 255, 255, 0.04)",
  surfaceStrong: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.10)",

  // Text
  text0: "#F2F4F8",
  text1: "#B4BBCB",
  text2: "#8B93A7",

  // Accent
  signal: "#F2F4F8", // ghost light — near-white signal; the only interaction accent
  ember: "#FFB86B", // rare: warnings / highlights
  danger: "#FF6B6B",

  // Radii
  radiusS: "8px",
  radiusM: "14px",
  radiusL: "24px",

  // Easing
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeIn: "cubic-bezier(0.64, 0, 0.78, 0)",
} as const;

export type TokenKey = keyof typeof tokens;
export type TokenValue = (typeof tokens)[TokenKey];

/**
 * Signal colour as an RGB triple for use in GLSL shaders.
 * Usage: `uniform vec3 uSignal; // [0.949, 0.957, 0.973]`
 */
export const signalRgb: [number, number, number] = [0.949, 0.957, 0.973];
