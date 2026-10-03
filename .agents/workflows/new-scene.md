# Workflow: new-scene

Scaffold and implement a complete R3F scene end-to-end, from storyboard to merged PR.

## Steps
1. **Storyboard exists** — ensure `docs/storyboards/<scene-name>.md` exists (owner creates in Phase 2). Do not proceed without it.

2. **Create task file** — run the `plan-task` workflow to create `docs/tasks/T-xxxx.md` for this scene.

3. **Owner approves** the task file — do not write code until approved.

4. **Scaffold** — use the `create-scene` skill to create the scene folder structure.

5. **Build DOM twin first** — identical information, no canvas dependency.

6. **Implement High tier** — full 3D experience.

7. **Implement Medium tier** — reduced particles/post-processing via the quality store.

8. **Implement Low tier** — DOM twin shown, canvas hidden.

9. **Implement None tier** (`prefers-reduced-motion`) — DOM twin with fade/instant transitions.

10. **Measure FPS** on:
    - Dev machine (High tier baseline)
    - Chrome DevTools throttled mid-range mobile simulation
    - Real device if available

11. **Record** FPS results in `docs/perf-baseline.md`.

12. **Run** `pnpm check` — all gates pass.

13. **Attach** desktop + mobile screenshots to the task file result section.

14. **Open PR** — link the task file; request review.
