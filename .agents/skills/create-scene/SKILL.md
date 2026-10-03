# Skill: create-scene

Scaffold, implement, and verify a new React Three Fiber scene with all tier fallbacks.

## Before writing any code
1. Read the storyboard for this scene in `docs/storyboards/<scene-name>.md`.
2. Read `.agents/rules/40-3d-performance.md` and `.agents/rules/50-accessibility.md`.
3. Confirm the scene's DOM twin design is described in the storyboard.
4. Have a task file open at `docs/tasks/T-xxxx.md` — do not work without one.

## Scaffold structure
Create `apps/web/src/scenes/<scene-name>/` with:
```
<SceneName>Scene.tsx       — R3F scene component (lazy, dynamic import, no SSR)
<SceneName>Dom.tsx         — DOM twin (identical information, no canvas dependency)
<SceneName>Scene.test.tsx  — smoke test (renders without error, no console errors)
index.ts                   — re-exports both components
```

## Implementation order
1. **DOM twin first** — build the readable HTML version before touching the canvas
2. **High tier** — full 3D experience
3. **Medium tier** — reduced particles/post-processing via the quality store
4. **Low tier** — DOM twin shown, canvas hidden
5. **None tier** (`prefers-reduced-motion`) — DOM twin with fade/instant transitions only

## R3F rules (from `.agents/rules/40-3d-performance.md`)
- No allocations in `useFrame`
- Dispose geometries/materials/textures in `useEffect` cleanup
- Use `instancedMesh` for repeated geometry
- `aria-hidden="true"` on the canvas element
- Lazy-load with `next/dynamic({ ssr: false })`

## Performance gate
Measure FPS on the target tier before marking the scene as done.
Record results in `docs/perf-baseline.md` using the template in that file.

## Definition of Done
- [ ] DOM twin with identical information (screen reader navigable)
- [ ] Reduced-motion (None tier) path — fade/instant only
- [ ] Keyboard path — every interactive element reachable and operable
- [ ] High / Medium / Low / None tiers all tested
- [ ] FPS budget met — recorded in `docs/perf-baseline.md`
- [ ] Assets in `assets/manifest.yml`
- [ ] Smoke test passes, 0 console errors
- [ ] axe-core: 0 serious/critical on the DOM twin
- [ ] Screenshots attached (desktop + mobile)
