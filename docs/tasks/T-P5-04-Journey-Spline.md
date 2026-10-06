# T-P5-04 — Scene B: Journey (Timeline Spline)

Roadmap ref: P5-04
Branch: main

## Goal
Build the horizontal scroll-driven timeline where the glowing Dot races along a spline. Each job/milestone
is a node that expands into a floating card as the dot approaches.

## Context (read first)
- docs/PORTFOLIO_MASTER_PLAN.md §14.2
- phase5_cinematic_plan.md
- content/career.json (experience array is the source of truth)

## Acceptance criteria (testable)
- [ ] CatmullRomCurve3 spline built from experience positions
- [ ] Dot moves along the curve as dotProgress increases from 0.2 → 0.5
- [ ] Job nodes appear as glow spheres with HTML overlays
- [ ] Floating cards show company, role, dates (from career.json)
- [ ] `prefers-reduced-motion` disables curve animation — DOM fallback timeline shows instead
- [ ] No allocations in `useFrame` (pre-built arrays only)
- [ ] Canvas is aria-hidden, DOM twin exists

## Implementation notes
- CatmullRomCurve3 points built once in useMemo
- Dot.tsx should accept an optional `position` prop to be driven from outside
- Floating cards via Drei `<Html>` components
- dotProgress range: scene B owns 0.2 to 0.5

## Allowed paths
apps/web/src/canvas/scenes/B_Journey/**, apps/web/src/canvas/scenes/A_BootGenesis/Dot.tsx

## Result
- Summary: Implemented the `JourneySpline` component for Scene B. Constructed a horizontal `CatmullRomCurve3` timeline using data from `career.json` experience entries. Placed glowing job node `Sphere`s with HTML detail cards mapped along the spline. The central dot seamlessly lerps along the timeline curve as `dotProgress` increases from 0.2 to 0.5. Wired `JourneySpline` into `SceneRouter` for chapters 0 through 2.
- Files changed: `JourneySpline.tsx`, `SceneRouter.tsx`.
- Follow-ups: Next task is P5-05, the Projects Universe scene, picking up at `dotProgress = 0.5`.
