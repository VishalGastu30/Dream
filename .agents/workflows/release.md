# Workflow: release

Full release procedure from `main` → production. Run the `release-check` skill end-to-end first.

## Steps
1. **Ensure all tasks** for the release milestone are merged to `main`.

2. **Run `release-check` skill** — every step must pass before continuing.

3. **If any check fails**: fix on a branch, merge to `main`, start from step 2.

4. **Create a Git tag**:
   ```bash
   git tag -a v<x>.<y>.<z> -m "Release vX.Y.Z: <one-line summary of what's new>"
   ```

5. **Push the tag**:
   ```bash
   git push origin v<x>.<y>.<z>
   ```
   CI/CD deploys to production automatically on tag push (or trigger the deploy workflow manually).

6. **Run production smoke tests** (listed in `release-check` skill, step 11).

7. **Update `CHANGELOG.md`**:
   ```markdown
   ## vX.Y.Z — YYYY-MM-DD
   ### Added
   - ...
   ### Fixed
   - ...
   ### Changed
   - ...
   ```

8. **Update `docs/verified-facts.md`** re-verify date if any service limits were touched in this release.

9. **Announce**:
   - Update GitHub profile README with the live link
   - Update LinkedIn featured section
   - Send link to mentors/contacts who were waiting

## Version numbering
- `v1.0.0` = M1 milestone (professional view + resume engine live)
- `v2.0.0` = cinematic layer complete (Phase 5 done)
- `v3.0.0` = platform features (Phase 6 done)
- Minor versions: completed scenes, new content, resume presets
- Patch versions: bug fixes, content corrections
