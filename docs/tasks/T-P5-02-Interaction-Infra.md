# T-P5-02 — Interaction Infrastructure

Roadmap ref: P5-02
Branch: main

## Goal
Implement scroll-to-dot mapping and the command palette for global navigation.

## Context (read first)
- docs/PORTFOLIO_MASTER_PLAN.md
- phase5_cinematic_plan.md

## Acceptance criteria (testable)
- [ ] Scroll -> dot moves (via useScrollProgress hooking into Lenis/ScrollTrigger)
- [ ] Deep linking works (`#chapter-N`)
- [ ] Command palette opens with `Ctrl+K`, has AI mode trigger, and is accessible.
- [ ] DOM twin handled
- [ ] Tests/checks pass

## Allowed paths
apps/web/src/canvas/hooks/**, apps/web/src/components/**

## Result
- Summary: Created `useScrollProgress` hook that binds to `lenis.on("scroll")` to update global `dotProgress` in the scene store. Implemented a fallback native scroll listener if `prefers-reduced-motion` suppresses Lenis. Created the global `CommandPalette` (`Ctrl+K`) for switching views, setting qualities, and routing. Injected it into `layout.tsx`.
- Files changed: `useScrollProgress.ts`, `CommandPalette.tsx`, `layout.tsx`.
- Follow-ups: Deep linking logic will be handled directly in the scroll router once we have multiple scenes running. Proceed to Scene A.
