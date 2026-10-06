# T-P5-05 — Scene C: Projects Universe

Roadmap ref: P5-05
Branch: main

## Goal
Build the orbital Projects Universe where the dot transitions into a central sun and projects orbit it as planets.

## Context (read first)
- docs/PORTFOLIO_MASTER_PLAN.md §14.3
- phase5_cinematic_plan.md
- content/career.json (projects array is the source of truth)

## Acceptance criteria (testable)
- [ ] Central sun sphere (the protagonist dot taking a new form)
- [ ] Orbital rings for each project
- [ ] Project "planets" orbiting at different speeds
- [ ] Hover interactions pause orbit and expand an HTML card showing project details
- [ ] Camera/group pushes forward as dotProgress goes from 0.5 to 0.8
- [ ] No allocations in `useFrame`
- [ ] DOM twin handled implicitly by existing pages

## Implementation notes
- 3 projects = 3 rings
- Use `TorusGeometry` or `LineBasicMaterial` for rings
- Use `Html` for project cards
- The transition from Journey to Projects (at dotProgress = 0.5) will be a crossfade or positional swap orchestrated by `SceneRouter`.

## Allowed paths
apps/web/src/canvas/scenes/C_Projects/**

## Result
- Summary: Built the `ProjectsUniverse` scene. It pulls the projects from `career.json` and renders them as orbiting planets around a central glowing Sun (which represents the protagonist Dot). The orbit speed and camera pushing forward are driven by `dotProgress` from 0.5 to 0.8. Implemented a hover interaction that halts a planet's orbit and fades in a gorgeous glassmorphic detail card showing the stack and a CTA button. Integrated seamlessly into `SceneRouter`.
- Files changed: `ProjectsUniverse.tsx`, `SceneRouter.tsx`.
- Follow-ups: Next task is P5-06, the Outro / Contact scene, picking up at `dotProgress = 0.8`.
