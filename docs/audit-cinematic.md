# Cinematic Layer Audit — X0
**Date:** 2026-10-25  
**Task:** Spec §15 X0 — Audit & Quarantine

---

## 1. Why the previous build failed

| Root cause | Detail |
|---|---|
| **View state wired to nothing** | `ViewContext` stored `"professional"\|"cinematic"` but `page.tsx`, `Header`, and `main` never read it. Switching to cinematic changed nothing in the layout. |
| **Loader depended on drei asset load** | `CinematicLoader` used `useProgress()` which fires only while R3F assets load — essentially zero assets → disappeared in ~50 ms. Never felt like a boot screen. |
| **20 px dot** | `Dot.tsx` used `sphereGeometry args={[0.2, ...]}` at camera z=10, fov=45 → ~20 px on screen. Cheap polygon sphere with no shader; default `MeshStandardMaterial`. |
| **Global text overlay** | `ParticleResolve` rendered `<Text fontSize={2}>` in world space with no view guard. As user scrolled, `dotProgress` raised its opacity — covering the professional page. |
| **Entry buttons in wrong position** | `EntryButtons` used R3F `<Html position={[0,-3,0]}>` — world-space y=-3 at z=10 fov=45 ≈ mid-screen, floating over content. |
| **No state machine** | Scene progression driven by raw `chapter: number` and raw scroll `dotProgress` with no defined transitions, no interruptibility, no URL reflection. |
| **No first-paint black** | No CSS-only black layer before JS hydrates. Flash of Reader content on cold load. |
| **No shader warm-up** | First frame of warp would hitch (uncompiled shaders). |
| **No capture/verify harness** | No way to freeze-frame or run the capture script; no freeze-frame test was ever applied. |
| **No text sampler** | `ParticleResolve` used drei `<Text>` positioned manually — not pixel-sampled from DOM text, so alignment was impossible to verify. |

---

## 2. Every cinematic-related file — Keep / Rewrite / Delete

### `apps/web/src/canvas/` — the R3F layer

| File | What it does | Decision | Reason |
|---|---|---|---|
| `CanvasRoot.tsx` | Mounts `<Canvas>`, detects tier, wires Dot + KeywordDrift + SceneRouter | **REWRITE** | Good tier detection pattern; canvas mount approach is correct. But spec wants `experience/gl/Stage.tsx`; structure and shader warm-up missing. |
| `CanvasWrapper.tsx` | Dynamic import wrapper (`ssr:false`) | **KEEP** (adapt) | Pattern is correct; move to `experience/gl/` path. |
| `SceneRouter.tsx` | Routes R3F scenes by `chapter` + view guard | **REWRITE** | `chapter` integer is too coarse; spec uses Director + state machine. |
| `store/scene.store.ts` | Zustand store: tier, quality, chapter, dotProgress, isIntro, activeProject | **REWRITE** | `chapter`, `dotProgress`, `isIntro` are the old approach. Spec replaces with `fx` uniform bag + typed state machine. |
| `hooks/useScrollProgress.ts` | Lenis/native scroll → `dotProgress` | **REWRITE** | Spec uses GSAP ScrollTrigger → `fx.storyProgress`; Lenis sync is different. |
| `postprocessing/PostEffects.tsx` | Bloom + vignette + chromatic aberration | **REWRITE** | Good starting point for effects list; spec adds grain/dither, drives bloom via `fx.bloom`. |
| `tiers/capability.ts` | GPU tier detection via `detect-gpu` | **KEEP** (move) | Logic is sound; move to `experience/lib/tiers.ts`. |
| `tiers/constants.ts` | Tier type/constants | **KEEP** (move) | Move to `experience/lib/tiers.ts`. |
| `utils/FpsMonitor.tsx` | Live FPS → downgrade tier | **KEEP** (adapt) | Spec requires live FPS monitor; adapt into the debug overlay. |

### `apps/web/src/canvas/scenes/` — the scene files

| File | What it does | Decision | Reason |
|---|---|---|---|
| `A_BootGenesis/BootGenesis.tsx` | Scene group: Dot + KeywordDrift + ParticleResolve | **DELETE** | Spec uses `experience/gl/` structure; this scene is replaced entirely. |
| `A_BootGenesis/Dot.tsx` | Three-mode orb (cursor / cinematic / none) | **DELETE** | Spec requires `DotGlow` billboard shader (never a mesh); this uses a sphere mesh. Violates §1.2 hard rule. |
| `A_BootGenesis/EntryButtons.tsx` | R3F Html entry buttons | **DELETE** | Replaced by DOM `IntroOverlay` + `Question` components. |
| `A_BootGenesis/KeywordDrift.tsx` | Tags drifting as `<Text>` labels | **REWRITE** | The concept (ambient word field) reappears but is implemented via Stardust (§5), not drei `<Text>`. |
| `A_BootGenesis/ParticleResolve.tsx` | drei `<Text fontSize={2}>` + Sparkles | **DELETE** | Wrong technique (§1.2): giant mesh text, `<Sparkles>`. Replaced by Stardust text sampler. |
| `B_Journey/JourneySpline.tsx` | CatmullRom spline + job nodes + Html cards | **REWRITE** | Concept is the Story path (§11); but implementation uses `Html` cards and `THREE.Line` (violates §1.2). |
| `C_Projects/ProjectsUniverse.tsx` | Orbiting planet system | **REWRITE** | Concept maps to Explore galaxy clusters (§12); planets → star clusters. |
| `C_ProjectsUniverse/` | Empty directory | **DELETE** | Empty. |
| `D_Galaxy/` | Empty directory | **DELETE** | Empty. |
| `D_Outro/Outro.tsx` | Descent + contact panel | **REWRITE** | Becomes Story finale (§11.7) + Explore (§12). |
| `E_Finale/` | Empty directory | **DELETE** | Empty. |

### `apps/web/src/components/` — DOM overlay components

| File | What it does | Decision | Reason |
|---|---|---|---|
| `BootScreen.tsx` | CSS fullscreen boot overlay: orb + typewriter + keywords + buttons | **DELETE** | Replaced by spec's `IntroOverlay` + Director (no CSS-only orb; spec uses DotGlow shader + DOM text). The session-gate idea (sessionStorage) transfers to `flags.ts`. |
| `ChapterNav.tsx` | Chapter dot nav (cinematic only) | **REWRITE** | Concept kept; must become a real `<nav>` per §11.8 with `lenis.scrollTo()`. |
| `ChapterIndex.tsx` | Older chapter dots | **DELETE** | Superseded by `ChapterNav.tsx` → and that is superseded by `experience/dom/ChapterNav.tsx`. |
| `CinematicLoader.tsx` | drei `useProgress` loading bar | **DELETE** | Wrong: depended on asset load time. Replaced by Director's `INITIALIZING` beat (§4.1 B1). |
| `CommandPalette.tsx` | Keyboard command palette | **KEEP** | Unrelated to cinematic; Reader feature. |
| `Footer.tsx` | Site footer | **KEEP** | Reader. |
| `Header.tsx` | Site header | **KEEP** | Reader. |
| `QualityControl.tsx` | Quality toggle (cinematic-only) | **REWRITE** | Becomes part of the HUD settings (§12.5); moves to `experience/dom/Hud.tsx`. |
| `SkipIntro.tsx` | Skip button | **DELETE** | Replaced by `experience/dom/IntroOverlay.tsx` Skip control. |
| `SkipLink.tsx` | Accessible skip-to-content | **KEEP** | Accessibility requirement; keep in layout. |
| `ViewAwareLayout.tsx` | Hides Reader in cinematic mode; 500vh spacer | **REWRITE** | Concept is right (Reader hidden behind intro). But spacer approach is for old scroll method; spec uses CSS sticky (§11.2) + Director. |
| `ViewToggle.tsx` | Prof/Cinematic toggle buttons in header | **DELETE** | Replaced by the HUD's Story/Reader/Explore links. |

### `apps/web/src/contexts/`

| File | What it does | Decision | Reason |
|---|---|---|---|
| `ViewContext.tsx` | `"professional"\|"cinematic"` state + localStorage | **REWRITE** | Becomes the Director's state machine + `experience/director/store.ts`. The `"professional"\|"cinematic"` binary is replaced by `boot\|intro\|choice\|story\|explore\|reader`. |
| `ScrollContext.tsx` | Lenis instance provider | **REWRITE** | Lenis setup moves to `experience/director/` with proper GSAP sync per §3.6. |

### `apps/web/src/components/` — spec-required new files (not yet built)

| Needed by spec | Status |
|---|---|
| `experience/director/director.ts` | Missing |
| `experience/director/intro.timeline.ts` | Missing |
| `experience/director/state-machine.ts` | Missing |
| `experience/director/store.ts` | Missing |
| `experience/director/flags.ts` | Missing |
| `experience/gl/Stage.tsx` | Missing |
| `experience/gl/stardust/StardustPoints.tsx` + shaders | Missing |
| `experience/gl/warp/WarpStreaks.tsx` + shaders | Missing |
| `experience/gl/dot/DotGlow.tsx` + shaders | Missing |
| `experience/gl/ribbon/PathRibbon.tsx` + shaders | Missing |
| `experience/gl/post/Effects.tsx` | Missing |
| `experience/dom/IntroOverlay.tsx` | Missing |
| `experience/dom/Greeting.tsx` | Missing |
| `experience/dom/Question.tsx` | Missing |
| `experience/dom/NoButton.tsx` | Missing |
| `experience/dom/FlashOverlay.tsx` | Missing |
| `experience/dom/Hud.tsx` | Missing |
| `experience/dom/ChapterNav.tsx` | Missing |
| `experience/fx/cursor/CursorFx.tsx` + engine | Missing |
| `experience/lib/prng.ts` | Missing |
| `experience/lib/easing.ts` | Missing |
| `experience/lib/tiers.ts` | Missing (exists as `canvas/tiers/`) |
| `experience/lib/units.ts` | Missing |
| `experience/debug/DebugOverlay.tsx` | Missing |
| `experience/debug/harness.ts` | Missing |
| `scripts/capture-intro.ts` | Missing |
| `content/intro.yml` | Missing |
| `content/story.yml` | Missing |

---

## 3. What X0 does

### 3.1 Move old cinematic code to `_legacy/`
Everything marked **DELETE** or **REWRITE** goes to `apps/web/src/_legacy/` for reference.  
Nothing is permanently deleted until Vishal approves.

### 3.2 Make `/` render a clean black placeholder → Reader
- Layout strips all broken cinematic components.
- A CSS-only black `data-intro="pending"` layer appears instantly.
- Reader (professional view) is always visible and unbroken.
- No console errors.

### 3.3 Reader pages untouched
`/projects`, `/experience`, `/forge`, `/contact`, `/studio/*`, `/resume/*`, `/t` — all untouched.

---

## 4. Keep / Rewrite / Delete summary

| Decision | Count | Files |
|---|---|---|
| **KEEP** | 6 | CanvasWrapper, tiers/capability, tiers/constants, FpsMonitor, CommandPalette, Footer, Header, SkipLink |
| **KEEP (adapt/move)** | 3 | tiers/capability.ts → lib/tiers.ts; tiers/constants.ts → lib/tiers.ts; FpsMonitor → debug overlay |
| **REWRITE** | 9 | CanvasRoot, SceneRouter, scene.store, useScrollProgress, PostEffects, JourneySpline, ProjectsUniverse, Outro, ChapterNav, ViewAwareLayout, ViewContext, ScrollContext, QualityControl |
| **DELETE** | 14 | BootGenesis, Dot, EntryButtons, ParticleResolve, KeywordDrift (concept moves to Stardust), BootScreen, ChapterIndex, CinematicLoader, SkipIntro, ViewToggle, C_ProjectsUniverse/, D_Galaxy/, E_Finale/, scene.store |

---

## 5. 🚦 RG0 Gate — questions for Vishal

1. **Approve the Delete list** — listed above. Nothing is permanently gone until you say so; they are in `_legacy/`.
2. **Greeting line** (§18 decision 1): "You made it. I'm" / "Hi. I'm" / "Hello, traveller. I'm" — which do you want?
3. **No-button label** (§18 decision 2): "Nope" / "Not now" / "I'll explore myself"?
4. **No-button trajectory** (§18 decision 3): `lissajous` / `orbit` / `bounce`?
5. **Clash Display font** (§18 decision 6): the spec calls for Clash Display. It is distributed by Fontshare under a free licence that permits personal and commercial use including web embedding. Confirmed ✅ — should I proceed with self-hosting it, or use an alternative?

Once you approve, I proceed to X1.
