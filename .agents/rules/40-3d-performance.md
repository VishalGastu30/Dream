# Rule 40 — 3D, Performance & Quality Tiers

## Quality tiers
| Tier | Who | Experience |
|---|---|---|
| **High** | Capable desktop/laptop | Full scenes, post-processing, high particles, DPR ≤ 2 |
| **Medium** | Mid laptops, modern mobiles | Reduced particles, no chromatic aberration, DPR ≤ 1.5 |
| **Low** | Older/weak devices, battery-saver | DOM-only or minimal canvas, no post-processing |
| **None** | `prefers-reduced-motion: reduce` | DOM-only, zero animation (fade/instant only) |

## Tier detection
Use `detect-gpu` (or equivalent), `navigator.hardwareConcurrency`,
`matchMedia('(prefers-reduced-motion)')`, and drei's `PerformanceMonitor` for
live FPS-based tier switching. Provide a manual "Quality" toggle in the UI.

## Performance budgets (🔒)
| Item | Budget |
|---|---|
| Initial 3D payload (before first interaction) | ≤ 3 MB |
| Any single model after gltf-transform | ≤ 1.5 MB |
| Total lazy-loaded 3D assets | ≤ 25 MB |
| Textures: default | 1024px (KTX2 or WebP) |
| Textures: hero objects | 2048px max |
| Draw calls (typical frame) | < 150 |
| On-screen triangles | < 500k |
| Particles: High tier | ≤ ~100k |
| Particles: Medium tier | ≤ ~40k |
| Particles: Low tier | ≤ ~10k |

## R3F coding rules (🔒)
- **No allocations in `useFrame`** — declare vectors/matrices/objects outside the callback and reuse
- **Dispose** geometries, materials, and textures in `useEffect` cleanup
- Use `instancedMesh` for any repeated geometry (galaxy stars, particle fields, markers)
- Lazy-load the entire canvas chunk with `next/dynamic` (`{ ssr: false }`)
- The **LCP element is HTML text**, never the canvas
- The canvas is **persistent** in the root layout; scenes mount/unmount inside it
- Mark the canvas `aria-hidden="true"`; all meaningful content lives in the DOM twin

## Post-processing budget
- Always: Bloom + Vignette
- Optional (High only): chromatic aberration (strength ≤ 0.0015) + film grain
- **Disable all post-processing on Low tier and when `prefers-reduced-motion` is on**

## Asset rules
Before any model enters the repo, verify:
1. Licence is CC0 or CC-BY (no NC/ND)
2. Real glTF/GLB (not a converted STL or proprietary format)
3. ≤ 50k triangles for hero objects; ≤ 10k for background objects
4. One mesh/material preferred; origin centred; scale sane
5. Looks acceptable as a **silhouette** (it will be restyled with the unified material)
6. Run gltf-transform optimisation pipeline (see `optimize-3d-asset` skill)
7. Add an entry to `assets/manifest.yml` before opening the PR

## Unified material rule
Apply the shared stylised material to ALL sourced models: dark glass + fresnel rim glow + faint scanlines.
**Never use a sourced model's original textures.**
This makes different authors' models look like one coherent set.

## Procedural-first principle
Particles, lines, tubes, instanced points, shaders, and drei `Text` cover ~80% of the experience.
Sourced models are the exception — only use them when a recognisable object adds real meaning.
