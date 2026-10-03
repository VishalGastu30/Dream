# Skill: optimize-3d-asset

Run the gltf-transform pipeline on a sourced 3D model and add it to the repo correctly.

## Pre-flight checklist (before any work)
- [ ] Licence is CC0 or CC-BY (no NC, no ND)
- [ ] Real glTF/GLB (not a converted STL or proprietary format)
- [ ] ≤ 50k triangles (hero) / ≤ 10k (background)
- [ ] Looks acceptable as a silhouette (it will be restyled)

## Steps
1. **Inspect** the raw model in a glTF viewer (gltf.report or Don McCurdy's viewer — verify URLs at implementation time).

2. **Optimise** with `gltf-transform`:
   ```bash
   npx @gltf-transform/cli optimize input.glb output.glb \
     --compress draco \
     --texture-compress webp \
     --texture-size 1024
   ```
   Verify current CLI flags in the gltf-transform docs at implementation time.

3. **Verify** triangle count and file size are within budgets (rule 40).

4. **Generate R3F component**:
   ```bash
   npx gltfjsx output.glb -t -r /assets/models/<name>/
   ```

5. **Place files** in `assets/models/<name>/`:
   - `<name>.glb` (optimised)
   - `<name>.tsx` (generated R3F component)
   - `LICENSE.txt` (copy of the asset's licence)

6. **Add manifest entry** to `assets/manifest.yml`:
   ```yaml
   - id: <name>
     type: model
     file: assets/models/<name>/<name>.glb
     source_url: <original page URL>
     author: <author name>
     license: CC-BY-4.0
     attribution: '"<Title>" by <Author>, licensed under <Licence>'
     retrieved: YYYY-MM-DD
     modified: [decimated, textures removed, draco]
     triangles: <count>
     size_kb: <size after optimisation>
     used_in: [<scene-name>]
   ```

7. **Apply unified material** — replace original textures with dark glass + fresnel rim + scanlines.
   Never use the model's original textures.

8. **Run** `pnpm check:assets` — must pass.

9. **Test on Low tier** — model must degrade gracefully (hidden or replaced by procedural fallback).
