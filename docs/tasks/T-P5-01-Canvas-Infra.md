# T-P5-01 — Canvas Infrastructure

Roadmap ref: P5-01
Branch: main (or feat/t-p5-01-canvas-infra)

## Goal
A persistent `<Canvas>` in the root layout that survives Next.js route changes, lazy-loads, and gracefully degrades.

## Context (read first)
- docs/PORTFOLIO_MASTER_PLAN.md §10.1, §14 (Phase 5)
- .agents/rules/40-3d-performance.md (if it exists)
- Relevant ADRs: ADR-006

## Acceptance criteria (testable)
- [ ] Canvas mounts once; navigating between `/`, `/projects`, `/experience` does not remount it
- [ ] On a device reporting `prefers-reduced-motion`, canvas never mounts (`Tier.NONE`)
- [ ] Quality toggle: `Auto` -> 1 s of < 35 fps on a throttled CPU -> tier drops to LOW
- [ ] Progress bar shows real load percentage (not fake)
- [ ] No console errors; no `useFrame` allocations (vectors created outside the loop)
- [ ] DOM twin with identical information
- [ ] Reduced-motion + keyboard paths
- [ ] Budgets respected (initial 3D payload <= 3 MB)
- [ ] Tests added/updated
- [ ] Assets recorded in assets/manifest.yml (if any)

## Allowed paths
apps/web/src/canvas/**, apps/web/src/components/**, apps/web/src/contexts/**, apps/web/src/app/layout.tsx

## Out of scope
Actual 3D scenes (Boot/Genesis, Journey, etc.). This task is only for the infrastructure, store, detection, and empty Canvas wrapper.

## Verification
pnpm check
Screenshots: desktop + mobile (attach)

## Open questions (agent writes here instead of guessing)
- 

## Result (agent fills in)
- Summary: Implemented the P5-01 Canvas infrastructure. Added `detect-gpu` and `prefers-reduced-motion` capability tiering. Created global `SceneStore` with Zustand. Mounted a persistent `<Canvas>` and `<CinematicLoader>` in `layout.tsx` using Next.js `dynamic(ssr: false)`. Added a `QualityControl` and `SkipIntro` overlay, plus a `ChapterIndex`. Connected a global `Lenis` smooth scroll provider that turns off for reduced motion. Configured `FpsMonitor` to auto-downgrade WebGL tiers on poor performance. Passed `pnpm check`.
- Files changed: `layout.tsx`, `CanvasRoot.tsx`, `CanvasWrapper.tsx`, `capability.ts`, `scene.store.ts`, `constants.ts`, `FpsMonitor.tsx`, `SceneRouter.tsx`, `CinematicLoader.tsx`, `ChapterIndex.tsx`, `QualityControl.tsx`, `SkipIntro.tsx`, `ScrollContext.tsx`.
- Follow-ups: Proceed to P5-02 / P5-03 to begin mapping scroll interactions to a real dot and creating the Boot/Genesis sequence.
