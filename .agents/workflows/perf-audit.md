# Workflow: perf-audit

Run a full performance audit and produce a report in `docs/perf-baseline.md`.
Run monthly (or after any scene/bundle change that might affect performance).

## Steps
1. **Deploy** current `main` to the preview environment (or use a local build).

2. **Lighthouse CI** against the preview URL:
   ```bash
   pnpm --filter web build && npx lighthouse-ci autorun
   ```
   Pages to test: home (cinematic view), home (professional view), a project detail page, Resume Forge.
   Profile: Lighthouse mobile preset (throttled mid-range mobile).

3. **Bundle check**:
   ```bash
   pnpm check:budget
   ```
   Note any category approaching its limit.

4. **Asset check**:
   ```bash
   pnpm check:assets
   ```
   Note any assets approaching their size budget.

5. **FPS measurement** (if a real device is available):
   - Open the cinematic view on a real device
   - Use Chrome DevTools remote debugging to read FPS from the Performance tab
   - Test High and Medium tiers
   - Record results in `docs/perf-baseline.md`

6. **Write a report** in `docs/perf-baseline.md` using the template:
   ```
   ### Date: YYYY-MM-DD | Phase: N | Trigger: <what changed>
   | Metric         | Value  | Budget | Pass? |
   |----------------|--------|--------|-------|
   | Lighthouse Perf| —      | ≥ 90   | —     |
   | LCP            | —      | ≤ 2.5s | —     |
   | INP            | —      | ≤ 200ms| —     |
   | CLS            | —      | ≤ 0.1  | —     |
   | JS bundle (gz) | —      | TBD    | —     |
   | FPS High tier  | —      | 60     | —     |
   | FPS Medium tier| —      | ≥ 30   | —     |
   Notes: <regressions, device tested, etc.>
   ```

7. **If Lighthouse perf < 80 (cinematic) or < 90 (professional)**:
   Create a task file for the regression using `plan-task` workflow.
