# EXPERIENCE SPEC — "First Contact"
### Opening sequence · Cursor FX · Guided Story · Explore Galaxy

| | |
|---|---|
| **Version** | 1.0 |
| **Written** | 2026-10-25 |
| **Owner** | Vishal Gastu |
| **Audience** | Google Antigravity agents (primary), Vishal (reviewer) |
| **Supersedes** | The cinematic scene definitions in `docs/PORTFOLIO_MASTER_PLAN.md` §7.1–7.5 and Phase 5 task list. Everything else in the master plan (content pipeline, resume engine, API, AI, budgets, ₹0 rules) still applies. |
| **Why this exists** | The first cinematic build failed: no loading screen, no cinematic layer, no galaxy, a 20 px "ball", a giant text overlay, a view toggle wired to nothing. Root cause: five phases of scaffolding before a single visible moment existed, no beat sheet, and no one looked at the result until the end. This spec fixes that with a **vertical slice first**, a **frame-by-frame beat sheet**, and a **deterministic capture harness** so every task is judged by looking at real frames. |

---

## 0. READ THIS FIRST — agent operating protocol (🔒)

1. **Work on exactly one task (`X#`) at a time.** Tasks are in §15. After finishing a task you **STOP** and post the review packet (below). You never start the next task until Vishal says so. "Continue" from Vishal means "continue *this* task", not "start the next one".
2. **Nothing is "done" until it has been looked at.** Every visual task ends with captured frames (§14) that *you have opened and inspected*. If a frame looks empty, clipped, ugly, off-centre or cheap, fix it before reporting.
3. **Review packet** (post at the end of every task): (a) what changed (files), (b) acceptance checklist with ✅/❌ per line, (c) contact-sheet image of captured frames (desktop 1440×900 and mobile 390×844), (d) measured numbers (p95 frame time, JS/asset sizes), (e) open questions, (f) what you deliberately did *not* do.
4. **No scope creep.** Do not add features, libraries or "improvements" outside the task. Write ideas into `docs/ideas.md`.
5. **Never create polygon-looking visuals** (see §1.2). If you are about to use a default Three.js mesh/material to represent a visual element, stop and re-read §1.
6. **₹0 rules stay in force:** no paid services, no card prompts, no secrets in code, no unlicensed assets (record every asset in `assets/manifest.yml`).
7. **Stability:** `pnpm check` must be green before you report. Zero TypeScript errors, zero lint errors, zero console errors/warnings at runtime in the captured session.
8. **Do not modify the Reader (professional) view** except where a task says so. It must keep working at every step.
9. **When unsure, ask in the review packet.** Do not guess about design intent; the intent is in this document.
10. **Commits:** small, meaningful commits (one logical change each, conventional messages). Do not pad commit counts.

---

## 1. Quality bar — what "high-profile, not cheap" means

### 1.1 The feeling

Expensive, calm, cinematic. Think a title sequence from a premium sci-fi film, not a game jam. Pure black, tiny bright details, soft light, restrained colour (white / cool white only; brand tokens `--text-0 #F2F4F8`, `--bg-0 #05060A`), motion with weight and intention. Nothing flashy-for-flashy's-sake, nothing that hurts the eyes (Vishal's brief: *premium, soothing, mesmerizing; never cluttered, blinding or cheap*).

### 1.2 Hard rules — never do these ("cheap tells")

| ❌ Never | ✅ Instead |
|---|---|
| Faceted/low-segment spheres, `flatShading`, default `MeshStandardMaterial` blobs for the glowing dot or any light source | Light sources are **screen-space billboards with analytic radial falloff in a shader** (smooth by construction, no polygons), with HDR values so bloom picks them up |
| `THREE.Points` with default square points; `THREE.LineSegments`/`Line` 1 px lines for streaks or paths | **Soft round sprites** (shader falloff, additive blending) and **screen-space ribbon quads** with feathered edges |
| drei `<Stars>`/default `<Sparkles>` as the main particle visuals | The custom **Stardust** engine (§5) |
| Linear or default easing; `transition: all` | Named easings (§4.2); animate `transform`/`opacity` only |
| Colour banding in dark gradients/glows | Subtle film grain/dither on the final image (§13.5) |
| Text important to the user rendered only in WebGL | Real **DOM text** (crisp, accessible); particles are the *visual twin*, DOM text carries meaning |
| React state updates every frame | Mutable `fx` uniform bag read in `useFrame`/ticker (§3.3) |
| `setInterval`/`setTimeout` for animation | One master GSAP timeline + `gsap.ticker`/`useFrame` |
| Big blurry `filter: blur()` over large DOM areas | Opacity/transform animations; blur only on small elements |
| Pure `#FFF` on large areas except the single flash moment | Tokens only |
| Autoplay audio | Sound is opt-in, muted by default |
| First-frame stutter when the warp starts | **Shader warm-up** during "INITIALIZING" (§4.1) |

### 1.3 Measurable criteria

- **Freeze-frame test:** a screenshot at *any* half-second of the intro looks composed and intentional — no awkward empty frames, nothing half-loaded, nothing misaligned.
- **Smoothness:** High tier, dev laptop, real GPU (not headless): p95 frame time ≤ 18 ms through the whole intro; no single frame > 50 ms after warm-up.
- **No banding** visible in the flash collapse and glow falloff at 100% zoom (view screenshots at full size).
- **Typography:** name and headings in **Clash Display**, body in **DM Sans**; optical alignment checked (no clipped descenders, consistent baselines, tracking set deliberately). ⚠️ Confirm Clash Display's licence permits self-hosted web use before shipping; it is distributed via Fontshare.
- **Motion:** every moving thing has an easing curve and a reason. No motion shorter than 120 ms except micro-feedback; nothing blocks input longer than the skip button needs.
- **Consistency:** the same dot/dust/glow vocabulary appears in every scene.

---

## 2. Product flow & state machine

### 2.1 The visitor journey (summary)

```text
 first visit
    │
    ▼
 ┌────────┐   ┌───────────────────────────────────────────────────────────┐
 │  BOOT  │──▶│ INTRO: black → INITIALIZING → warp → white-out → collapse │
 └────────┘   │        → greeting → question                              │
              └───────────────┬───────────────────────────────────────────┘
                              │ (Skip is available from t=0)
                    ┌─────────┴──────────┐
        "Show me"   ▼                    ▼   "No" (moving button)
              ┌──────────┐         ┌───────────┐
              │  STORY   │◀───────▶│  EXPLORE  │   (switch anytime)
              │ (guided) │         │  (galaxy) │
              └────┬─────┘         └─────┬─────┘
                   └────────┬────────────┘
                            ▼
                     ┌────────────┐
                     │   READER   │   (professional view; reachable from anywhere; default for
                     └────────────┘    reduced-motion, no-WebGL, and `?view=reader`)
```

### 2.2 Explicit states and transitions (implement as a typed state machine — XState-style or a hand-rolled reducer)

| State | Entry | Exit |
|---|---|---|
| `boot` | page load (JS present, WebGL probe running) | probe done + fonts ready → `intro`; failure/reduced-motion → `reader` |
| `intro` | auto | finishes → `choice`; **Skip** → `choice` (short crossfade, not a hard cut) |
| `choice` | question visible | "Show me" → `story`; "No" → `explore`; Reader link → `reader` |
| `story` | dispersal transition done | switch → `explore` / `reader` |
| `explore` | galaxy formed | switch → `story` / `reader` |
| `reader` | explicit | switch → `story` / `explore` (if capable) |

Rules: transitions are **animated and interruptible** (clicking Skip/Reader mid-transition resolves cleanly, no half states). The current state is reflected in the URL (`/` for the intro/choice, `/#story`, `/#explore`, `/reader` or `?view=reader`) so links and refreshes behave.

### 2.3 Returning visitors

| Condition | Behaviour |
|---|---|
| First visit | Full intro (~8 s to the question) |
| Returning (localStorage `introSeen` ≥ current `INTRO_VERSION`) | **Short intro** (~2.8 s): black 0.2 s → dot → greeting assembles fast → question |
| `?intro=full` | Force full |
| `?intro=skip` | Go straight to `choice` |
| Footer link "Replay intro" | Clears the flag and replays |

---

## 3. Architecture

### 3.1 Layers (bottom → top)

| Z | Layer | Tech | Pointer events |
|---|---|---|---|
| 0 | **Reader content** (the professional site, SSR/static HTML) | Next.js | `inert` while `intro`/`choice` is active |
| 10 | **Scene canvas** — Stardust, warp, dot, ribbon, galaxy | R3F `<Canvas>` (dynamic import, `ssr:false`), custom shaders, postprocessing | `none` in intro; `auto` in explore |
| 20 | **DOM stage** — intro text, question, buttons, story panels, HUD | React + GSAP | auto (per element) |
| 30 | **Flash overlay** | one `<div>` with radial gradient, `transform: scale()` | none |
| 40 | **Cursor FX canvas** | 2D canvas, additive blending | **none** (never blocks clicks) |

### 3.2 First-paint rule (important)

- The **server HTML** must paint a pure black full-screen element **before any JS** loads (CSS-only). No flash of Reader content: an inline `<head>` script sets `data-intro="pending"` on `<html>` on a first visit, and CSS hides the Reader behind the black layer. `<noscript>` and reduced-motion override this so the Reader is visible.
- The "INITIALIZING" text is HTML/CSS, available instantly. The 3D chunk loads *under* it.
- The Reader content remains in the HTML for SEO and no-JS users.

### 3.3 The non-React uniform bag (🔒 performance rule)

All animated values live in one mutable object that GSAP writes and render loops read. **No React state per frame.**

```ts
export const fx = {
  t: 0,
  warp: 0,
  fov: 50,
  flash: 0,
  bloom: 0.6,
  textMix: 0,
  disperse: 0,
  galaxyMix: 0,
  storyProgress: 0,
  cursor: { x: 0, y: 0, vx: 0, vy: 0, down: false },
  pulse: { x: 0, y: 0, t: -10, strength: 0 },
};
```

### 3.4 The Director

One module owns time and state.

- A **master GSAP timeline** for the intro with named labels (`black`, `initializing`, `warp`, `flashUp`, `collapse`, `greeting`, `tagline`, `question`).
- `director.seek(seconds)` and `director.freeze()` exist always but are exposed on `window.__director` **only when `?debug=1`**.
- Uses `gsap.context()` and strict cleanup so React Strict Mode (double-invoked effects in dev) never creates duplicate timelines.
- Reads `prefers-reduced-motion`, tier, and flags once at start and exposes them via a tiny store.

### 3.5 Proposed layout (agents: audit the existing tree first, §15 X0, then adapt)

```text
apps/web/src/experience/
  director/    director.ts  intro.timeline.ts  state-machine.ts  store.ts  flags.ts
  gl/
    Stage.tsx                      # <Canvas>, tiers, context-loss handling, post-processing
    stardust/  StardustPoints.tsx  shaders.ts  layouts.ts  text-sampler.ts
    warp/      WarpStreaks.tsx  shaders.ts
    dot/       DotGlow.tsx  shaders.ts
    ribbon/    PathRibbon.tsx  shaders.ts
    galaxy/    GalaxyStars.tsx  layout.ts
    post/      Effects.tsx
  dom/         IntroOverlay.tsx  Greeting.tsx  Question.tsx  NoButton.tsx
               FlashOverlay.tsx  Hud.tsx  ChapterPanel.tsx  ChapterNav.tsx
  fx/cursor/   CursorFx.tsx  engine.ts  sprites.ts  config.ts
  story/       path.ts  camera-rig.ts  chapters.ts
  explore/     ExploreScene.tsx  clusters.ts  panels/
  debug/       DebugOverlay.tsx  harness.ts
  lib/         prng.ts  easing.ts  tiers.ts  units.ts
content/intro.yml     content/story.yml
scripts/capture-intro.ts
```

### 3.6 Stack (use what is installed; verify versions before changing anything)

Next.js (static export) · React 19 · R3F v9 · drei (import **specific** helpers only) · `three` · `@react-three/postprocessing` · GSAP (+ ScrollTrigger) · **Lenis** (`npm i lenis`; React bindings under `lenis/react`) · Zustand or a plain store for UI state · Biome · Vitest · Playwright. ✅ Lenis + ScrollTrigger sync (documented pattern): call `lenis.on('scroll', ScrollTrigger.update)`, drive `lenis.raf(time * 1000)` from `gsap.ticker`, and set `gsap.ticker.lagSmoothing(0)`; include Lenis's recommended CSS.

---

## 4. The Opening Sequence — frame-accurate beat sheet

All times are seconds on the master timeline at **High tier** (full intro). Copy lives in `content/intro.yml` (§17). Easing names are defined in §4.2.

### 4.1 Beats

| # | Time | Beat | Exact behaviour | Tech notes |
|---|---|---|---|---|
| B0 | 0.00–0.50 | **Pit black** | `#000` full-screen. Nothing else. A held beat so the room "goes dark". | CSS-only element in server HTML |
| B1 | 0.50–1.80 | **INITIALIZING** | Small caps text (DM Sans, ~12–13 px, uppercase, tracking animates `0.6em → 0.42em`), colour `rgba(242,244,248,0.7)`, fade-in 400 ms (`outSoft`). Beneath it a 1 px hairline, 120 px wide, filling left→right. **The fill is tied to real loading** (fonts, GL init, shader compile, text sampling, texture decode) with a **minimum visible duration of 1.3 s**; if loading is slower, the text gently pulses and waits. | **Shader warm-up here:** build all scene materials, call `renderer.compileAsync(scene, camera)` (or equivalent), render one hidden frame, pre-sample text targets. This is what prevents the first-frame hitch when the warp starts. |
| B2 | 1.80–2.20 | **Ignition** | "INITIALIZING" fades out (300 ms, `inSoft`) while a **single point of light** fades in at screen centre: 2 px bright core, soft halo (~24 px radius), HDR values so bloom lifts it. It pulses once (scale 1→1.6→1 over 600 ms, `inOut`). | `DotGlow` billboard — **never a mesh** |
| B3 | 2.20–4.20 | **Warp** | White particles stream outward from the centre; speed ramps from almost-still to extreme with `inCubic` over 1.6 s then holds 0.4 s. Streaks **lengthen** with speed. Camera FOV widens 50° → 95°. Centre glow grows. Subtle vignette tightens. See §6. | `WarpStreaks`: instanced, screen-space quads |
| B4 | 3.90–4.65 | **White-out** | A soft white swell expands from the centre until the screen is covered (**not** a hard cut): ramp ~600 ms (`inQuad`) to peak, **hold 150 ms** at peak, **exactly one flash — no strobing, no repeats.** Peak colour `#F5F7FA` (≈ 0.96 luminance), never harsh-clipped pure `#FFF`. Bloom intensity ramps `0.6 → 2.4` in sync. | `FlashOverlay` DOM div (`transform: scale`, feathered radial gradient) **plus** bloom ramp in the canvas (§7) |
| B5 | 4.65–5.55 | **Collapse** | The white **shrinks inward toward the centre** (900 ms, `inOutCubic`) leaving black; as it retreats it reveals the **dot** at centre at full brightness. Warp particles are already gone (hidden under the white) and the field has been reset to sparse, faint dust. Background cross-fades `#000 → #05060A` over 1.2 s (imperceptible, avoids a hard colour mismatch later). | |
| B6 | 5.55–6.55 | **Hand-off & greeting forms** | The dot travels to its anchor (default: the **full stop after the greeting's first line**; stretch goal: the **tittle of the "i" in "Hi"** using a dotless `ı` + positioned dot, only if alignment is pixel-perfect — otherwise keep the full stop). Particles assemble into the large name from the dust (§5.4), staggered left→right with per-particle jitter, `outExpo`, 1.0 s. **Cursor FX begins emitting here** (ramp over 800 ms). | Text sampler (§5.3) |
| B7 | 6.30–6.80 | **DOM text crossfade** | Crisp DOM text fades in over the particle text (opacity 0→1, 400 ms); particle text drops to ~25 % opacity and keeps shimmering. Line 1 (e.g. "You made it. I'm") enters with blur 8 px→0, y 12→0. | Pixel alignment between DOM and particles is a **test** (§14.4) |
| B8 | 7.10–7.70 | **Tagline** | One line, DM Sans, 55–65 % opacity, fades in. | |
| B9 | 7.90–8.50 | **Question + buttons** | Question fades in. **"Show me"** appears centred-left, static, primary style. The **"No" button** begins its trajectory (§8.3). From 8.0 s everything is interactive. | |
| — | any time | **Skip** | A small "Skip ›" control is visible from t = 0 (low-contrast, bottom-right, keyboard-reachable). It jumps to B9 using a **400 ms crossfade** (no hard cut, no flash). | |

**Reduced motion / no WebGL:** no warp, no flash. Black → INITIALIZING → greeting crossfades in → question (≈ 2.5 s). Same copy, same choices.

**Short intro (returning visitor):** B0 0.2 s → B2 dot → B6 assemble (0.7 s) → B7–B9 compressed. ≈ 2.8 s.

### 4.2 Named easings (define once in `lib/easing.ts`; use only these)

| Name | Curve | Use |
|---|---|---|
| `outSoft` | `cubic-bezier(0.22, 1, 0.36, 1)` | entrances, fades in |
| `inSoft` | `cubic-bezier(0.64, 0, 0.78, 0)` | exits, fades out |
| `inOut` | `power2.inOut` | pulses, transitions |
| `inCubic` | `power3.in` | warp acceleration |
| `inQuad` | `power2.in` | flash ramp |
| `inOutCubic` | `power3.inOut` | collapse |
| `outExpo` | `expo.out` | particle assembly, bursts |

### 4.3 What the visitor should feel

Darkness → anticipation → acceleration → overwhelm → release → *arrival*. The collapse into a single point is the emotional hinge ("the world just got small and quiet; now someone is about to speak"). Do not rush it and do not pad it.

---

## 5. Stardust — the one particle system

**One GPU particle system carries the entire experience.** The same particles are: warp field → dust → name text → dispersal burst → story starfield → galaxy dust. Continuity is the point, and it keeps cost down.

### 5.1 Rendering (must look premium)

- Draw as `THREE.Points` with a custom `ShaderMaterial`. **No square points.** Fragment shader makes a soft disc: radial falloff (smooth, squared) plus a small hot core; no `discard` edges.
- `blending: AdditiveBlending`, `depthWrite: false`, `transparent: true`, `toneMapped: false` (✅ required for HDR values to reach bloom).
- Output colour in **linear HDR** (values may exceed 1.0, e.g. core ×2.5) so bloom lifts only the bright cores.
- Size is perspective-correct: `gl_PointSize = aSize * uPixelRatio * (uScale / -mvPosition.z)`, clamped (e.g. 1.0–48.0 px).
- Per-particle attributes: random seed, size, brightness, phase (for twinkle). Twinkle is subtle (±12 %), never strobing.
- Depth cues: farther = smaller + dimmer; optional slight depth fade.

### 5.2 Layout targets (positions are *data*, morphing is a shader mix)

| Layout | Meaning | Source |
|---|---|---|
| `dust` | sparse ambient field (rest state) | seeded random volume |
| `text` | greeting/name/tagline/question shapes | text sampler (§5.3) |
| `burst` | dispersal velocity field | computed in shader from `aSeed` + curl-style noise |
| `storyField` | parallax layers for the story | 3 depth bands |
| `galaxy` | spiral/cluster distribution | `galaxy/layout.ts` |

Morphing: vertex shader does `pos = mix(posA, posB, ease(progress, delay(seed)))` plus noise displacement scaled by a "turbulence" uniform. **v1 is vertex-shader-only (no FBO/GPGPU).** Cursor reaction and shockwave pulses are analytic displacements from `uCursor`/`uPulse`. GPGPU simulation is a later optional upgrade.

### 5.3 Text sampler (`text-sampler.ts`)

1. Wait for fonts: `await document.fonts.load(...)` for Clash Display and DM Sans.
2. For each DOM text element, read its computed style and `Range.getClientRects()` per line.
3. Draw each line on an offscreen canvas **glyph by glyph** using `measureText` advances plus the element's letter-spacing (do **not** rely on `CanvasRenderingContext2D.letterSpacing` ⚠️ browser support varies).
4. Sample pixels with alpha > 128 on a grid; jitter each sample inside its cell; map CSS pixels to world units with `unitsPerPx = (2 · distance · tan(fov/2)) / window.innerHeight` (so 1 world px = 1 CSS px at the text plane).
5. Output a `Float32Array` target and a per-line index range. Cap counts by tier: **High ≈ 18 k, Medium ≈ 9 k, Low ≈ 4 k** (name line gets the largest share).
6. Re-sample on resize (debounced 200 ms) and after fonts load. Provide a debug overlay that draws sampled points over the DOM text to verify alignment.

### 5.4 Assembly and dispersal behaviours

- **Assemble (B6):** particles move from `dust` to `text`. Per-particle delay = `xNormalized * 0.45 + seed * 0.2`; duration 1.0 s; `outExpo`; slight overshoot shimmer; small z-jitter so the text has depth.
- **Disperse (§10.1):** from `text` to `burst`. Velocity direction = outward from the text's centre of mass + curl noise; speed 1.5–4 world-units/s; exponential damping; particle size shrinks to micro; brightness fades to the ambient level over ~1.6 s, settling into `storyField`.
- **Counts per tier (total particles):** High 60 k (warp separate), Medium 30 k, Low 12 k. Tune by measurement; never exceed the frame budget.
- Seeded PRNG (`lib/prng.ts`) so `?seed=` makes every capture reproducible.

---

## 6. The Warp (B3)

### 6.1 Visual target

Deep-space hyperspace, restrained: **white streaks only**, thin and crisp at the centre, longer and faster toward the edges, a bright but soft core glow, a faint vignette. It should feel like acceleration, not like a screensaver.

### 6.2 Technique (required)

- **One draw call.** `InstancedBufferGeometry` quad per streak; all motion computed in the vertex shader from per-instance seeds and a few uniforms. No per-instance CPU updates.
- Per-instance attributes: `aSeed (vec4)` = angle, radius, z-phase, random.
- **Distribution:** cylindrical tube around the view axis. Radius = `mix(rMin, rMax, pow(rand, 0.6))` with a small empty core (`rMin > 0`) so streaks *emanate* from the centre instead of piling into a blob. z wraps seamlessly: `z = -mod(zPhase * L + uTravel, L)`.
- **Screen-space streaks:** compute head and tail positions in view space (`tail = head + len` along z), project both to clip space, and build the quad **perpendicular to the projected direction in screen space**. Half-width 0.5–1.4 px (random per streak) plus a feather. This keeps thickness consistent at every speed (this is what separates a premium streak from a thin GL line).
- **Alpha:** bright head, long fading tail (`pow(1 - v, 1.5)`), soft across the width (`1 - smoothstep`). Fade out as streaks approach the near plane to avoid popping.
- **Length is the motion blur:** `len = uLenBase + uLenGain * fx.warp`.
- Colour: white (`#F2F4F8` core) with *luminance* variation only. HDR multiplier up to ~2.5 on bright streaks so bloom lifts them.
- `blending: AdditiveBlending`, `depthWrite: false`, `toneMapped: false`.

### 6.3 Determinism (so `director.seek()` works)

Animate **distance** (`fx.travel`) and **intensity** (`fx.warp`, `fx.fov`) as tweens on the master timeline; do **not** integrate speed with `dt` in a render loop. Same time ⇒ same frame.

### 6.4 Parameters (starting values; tune by eye)

| Param | High | Medium | Low |
|---|---|---|---|
| Streak count | 6,000 | 3,000 | 1,200 |
| FOV | 50° → 95° (`inCubic`, B3) | 50° → 85° | 50° → 75° |
| Tube radius | 0.4 → 9 world units | same | same |
| Tube length `L` | 60 | 60 | 60 |
| Bloom during warp | 0.6 → 1.2 | 0.5 → 0.9 | off |
| Centre glow radius | 24 px → 220 px | 24 → 160 | 24 → 120 |

### 6.5 Acceptance

- At t = 3.0 s the frame shows long thin streaks radiating from the centre with a soft glow; at t = 2.4 s streaks are short and sparse; at t = 3.8 s the centre is blown out and the edges are fast.
- No visible polygon edges, no aliasing shimmer on streak edges at 1× and 2× DPR.
- p95 frame time ≤ 18 ms (High tier, real GPU).

---

## 7. White-out, collapse and the dot

### 7.1 Flash overlay (DOM)

- One `<div>` of size `2·D` × `2·D` px where `D = hypot(viewportWidth, viewportHeight)`, centred with `translate(-50%, -50%)`.
- Background: `radial-gradient(circle, #F5F7FA 0%, #F5F7FA 60%, rgba(245,247,250,0) 100%)` — opaque core covers the farthest corner at `scale(1)`, with a feathered edge.
- Animate only `transform: scale(s)` (0 → 1 for white-out, 1 → 0 for collapse) with `will-change: transform`. No `filter`, no layout properties.
- One flash per intro. Never repeat. Never faster than the ramp times in §4.1.

### 7.2 In-canvas sync

- `fx.bloom` ramps with the overlay (`0.6 → 2.4` up, `2.4 → 0.9` down) so the glow in the canvas "agrees" with the DOM white.
- Optional (Medium/High): a very small chromatic aberration pulse (offset ≤ 0.002) at the peak; stretch goal.

### 7.3 The dot (`DotGlow`) — the narrator

- A **billboard quad with an analytic radial profile in the fragment shader** (core + halo + faint outer bloom), HDR values (core ≈ 3.0, halo ≈ 0.8).
- Core radius ≈ 5 CSS px; halo ≈ 28 CSS px at rest. **Never a mesh sphere.**
- Behaviours across scenes: ignition pulse (B2) → grows with warp (B3) → hidden in white → revealed in collapse (B5) → hand-off to the greeting anchor (B6) → idle breathing (±6 % scale, 4 s period) → story: leads the path (§11) → explore: small pulse at the hub you hover.
- Optional comet trail via the ribbon system in the story (§11.4).

### 7.4 Acceptance

- Frame at t = 4.4 s: screen essentially fully white with a feathered edge visible only in the first half of the ramp; **no banding**, **no hard edge**, **no clipped pure white**.
- Frame at t = 5.3 s: a small bright disc of white retreating; frame at t = 5.6 s: a single point of light centred on pure black.

---

## 8. Greeting, question, buttons

### 8.1 Copy and typography (copy is data in `content/intro.yml`)

Starting options (Vishal picks; §18):

- Line 1: **"You made it. I'm"** · or **"Hi. I'm"** · or **"Hello, traveller. I'm"**
- Name: **VISHAL GASTU** (the all-caps instance, used once, as the brand brief says; everywhere else "Vishal Gastu")
- Tagline: **"I create what doesn't exist yet."** (derived from the brand tagline: *"Creating what doesn't exist yet, and building it well enough to change what comes next."*)
- Question: **"Want to see how I got here?"**
- Buttons: **"Show me"** (static) and the moving one: **"Nope"** · **"Not now"** · **"I'll explore myself"**

| Element | Font | Size | Notes |
|---|---|---|---|
| Line 1 | DM Sans 400 | `clamp(16px, 1.9vw, 26px)` | colour `--text-1`, tracking 0.01em |
| Name | Clash Display 600 | `clamp(44px, 9.2vw, 150px)` | uppercase, tracking 0.02–0.04em, line-height 0.95, `--text-0` |
| Tagline | DM Sans 400 | `clamp(14px, 1.4vw, 18px)` | 55–65 % opacity, max-width 46 ch |
| Question | Clash Display 500 | `clamp(22px, 2.6vw, 36px)` | |

Layout: centred stack on an 8-pt rhythm; the name's baseline sits near 46 % viewport height; the question block near 72 %. On mobile portrait the name may wrap to two lines ("VISHAL" / "GASTU") — the sampler must handle multiple lines.

### 8.2 "Show me" button (static, primary)

- Pill, 1 px border `rgba(255,255,255,0.22)`, background `rgba(255,255,255,0.06)`, small `backdrop-filter: blur(12px)` (small area only), padding 14×28, radius 999.
- Hover: border → 0.42, background → 0.10, soft glow `0 0 40px rgba(242,244,248,0.12)`, **magnetic pull ≤ 6 px** toward the cursor (transform only, no layout shift).
- Active: `scale(0.98)`. Focus-visible: 2 px `--signal` ring, 3 px offset.
- Click: fires a cursor-FX burst at the button centre, then the Yes transition (§10.1).

### 8.3 The moving "No" button — trajectory spec

**Intent:** a playful, always-moving target the visitor can chase and catch — never a trap. It follows a smooth predefined trajectory (not reactive dodging).

| Parameter | Value |
|---|---|
| Trajectory (`content/intro.yml: trajectory`) | `lissajous` (default) · `orbit` (circles the "Show me" button) · `bounce` (soft billiard in a lane) |
| Lissajous | `x = cx + Ax·sin(φ)`, `y = cy + Ay·sin(2φ + 0.6)`, with the phase `φ` accumulated: `φ += ω·dt·speedScale`, `ω = 2π/10` (one 10 s loop) |
| Lane | right of "Show me": `Ax = min(0.14·vw, 220 px)`, `Ay = min(0.03·vh, 30 px)`; clamp to the question block's safe zone computed from DOM rects (never overlaps text or "Show me") |
| Tilt | `rotateZ(clamp(vx·0.02, -4°, 4°))` |
| Slow-near-cursor | within 140 px of the pointer, `speedScale` eases to **0.3** (so it stays chaseable) |
| Pause | on `:hover`, `:focus-visible`, and `pointerdown`, `speedScale` eases to **0** in 150 ms |
| Hit area | visible pill **plus** 12 px invisible padding; min 48×48 px on touch |
| Rendering | wrapper moved with `translate3d`; never `left/top` |
| Trail | 3–5 tiny particles/s emitted behind it via the cursor-FX engine (same vocabulary) |
| Touch | speed ×0.55; `pointerdown` pauses it and registers the tap |
| Reduced motion | static position in the lane; no trail |
| Accessible name | `aria-label="No thanks — let me explore on my own"`; visible label from content |
| Tab order | Skip → Show me → No → Reader view |
| Tests | `data-testid="no-button"`; Playwright can click it by pausing (focus) — it must always be clickable within 3 attempts by a human |

**WCAG note (2.2.2):** moving content that lasts > 5 s needs a way to pause/stop it. Provide the persistent **"Pause motion"** control in the UI chrome (also affects background drift) and honour `prefers-reduced-motion`.

### 8.4 Interactions on the question screen

- Stardust dust **reacts to the cursor** (soft repel within ~140 px, eased) — the screen feels alive.
- Pressing and holding anywhere triggers the "charge" effect (§9) — playful discoverable detail.

### 8.5 Acceptance

- A first-time user can reach "Show me" or "Nope" within 10 s of the question appearing, on desktop and touch.
- "Nope" never overlaps text or "Show me" at any viewport from 360×640 to 2560×1440.
- Keyboard-only: Tab/Enter works; the moving button stops while focused.

---

## 9. Cursor FX — keep the native cursor, add life

### 9.1 Principles

- **The user's real cursor stays untouched.** No custom cursor image, no `cursor: none`.
- Particles stream from the pointer as it moves; clicks have distinct effects; interactive elements respond. Premium = **subtle at rest, generous in motion**.
- Starts at B6 (when the greeting forms), active in `choice`, `story`, `explore`; **subtle** (half intensity) in Reader view; **off** for reduced motion; **tap bursts only** on touch. A "Cursor effects: On / Subtle / Off" control lives in the HUD settings (stored in localStorage).

### 9.2 Implementation (required approach)

- **Separate full-screen 2D canvas** (layer 40), `position: fixed; inset: 0; pointer-events: none; z-index` top. It must **never block clicks**. Own `requestAnimationFrame` loop with `dt` clamped (≤ 50 ms), independent of the WebGL loop so it stays smooth even if the scene is busy.
- DPR-aware (clamp to 2). Pre-render **one soft radial-gradient sprite** (64×64) once; draw with `globalCompositeOperation = 'lighter'`.
- **Struct-of-arrays** typed arrays (`x, y, vx, vy, age, life, size, seed, kind`) — **zero allocations per frame**; dead particles are removed by swap-remove.
- **Loop control:** the loop runs only while there are live particles or active effects; when idle it stops (zero CPU). Pointer or click events wake it. Pause on `visibilitychange`/window blur; clear on blur.
- Input: `pointermove` listener on `window` (`passive: true`); use `getCoalescedEvents()` where supported ⚠️; **interpolate emission along the segment** between the previous and current pointer positions so fast moves leave a continuous trail with no gaps.

### 9.3 Emission model

| Quantity | Rule |
|---|---|
| Emission | `count = distance_px × emissionPerPx × speedFactor`, `speedFactor` ramps 0.3 (slow) → 1.0 (≥ 600 px/s) |
| Spawn | position = point ± 2 px; velocity = `0.25 × pointerVelocity` + random direction × `rand(10..60) px/s`; slight upward drift (`−8 px/s²`) |
| Life | `rand(0.7..1.4) s` (High) |
| Size | core `rand(1.2..3.2) px`; 25 % are faint halo particles `8–18 px` at alpha ≈ 0.08 |
| Motion | exponential drag `v *= exp(-2.2·dt)`; no gravity beyond the drift |
| Colour | white `#F2F4F8`, ±4 % luminance only |
| Alpha | `(1 − age/life)^1.6 × brightness × twinkle(seed)` |
| Ambient | pointer idle ≥ 0.6 s → a few slow motes near the cursor (High 6/s, Medium 3/s, Low 0), stopping after 4 s idle |

### 9.4 Tier table

| | High | Medium | Low | Reduced motion |
|---|---|---|---|---|
| Max live particles | 420 | 220 | 90 | 0 |
| `emissionPerPx` | 0.35 | 0.25 | 0.15 | 0 |
| Click burst count | 22 + ring | 14 + ring | 8 + ring | none |
| Halo particles | yes | yes | no | — |

### 9.5 Click effects

| Event | Effect |
|---|---|
| `pointerdown` | tiny **inward pinch ring** (radius 18 → 6 px, 120 ms) — anticipation |
| `pointerup`/click | **expanding ring** 6 → 64–90 px over 520 ms (`outExpo`, line 1.2 → 0.4 px, alpha 0.7 → 0) **plus** a radial burst (speeds 90–320 px/s, life 0.5–1.1 s) **plus** a **shockwave pulse** written to `fx.pulse` so the Stardust field in the WebGL scene ripples outward (radius ~200 px, 600 ms) |
| **Hold** ≥ 220 ms | **Charge:** particles spawn on a ring (R 90–140 px) and spiral **inward** to the cursor; ring breathes; on release the burst scales `1 + min(hold, 900 ms)/900 × 1.2` |
| Hover on `[data-fx="magnetic"]` | emission ×1.6 near the element; element pulls toward the cursor ≤ 6 px |
| Hover on `a`, `button` | one small "tick" ring on enter (subtle) |
| Touch `pointerdown` | burst; touch-drag leaves a short trail |
| Text selection | nothing special |

### 9.6 API (so scenes can trigger effects)

```ts
cursorFx.burst(x: number, y: number, opts?: { strength?: number });
cursorFx.setMode("full" | "subtle" | "off");
cursorFx.setIntensity(value: number);
cursorFx.attachEmitter(el: HTMLElement, opts?: { rate?: number });
```

The moving "No" button uses `attachEmitter` for its trail.

### 9.7 Acceptance

- Moving the mouse quickly in a circle draws a smooth, continuous, luminous trail with no gaps and no polygon artefacts; slow movement produces a gentle few-particle shimmer; idle produces a faint breathing glow that fades.
- Click shows pinch → ring → burst; hold shows charge → bigger release.
- CPU: with 420 particles on screen, the cursor loop averages < 1.5 ms/frame on the dev laptop; idle CPU ≈ 0 (loop stopped).
- Never blocks interaction (click-through verified by a Playwright test clicking buttons beneath particles).
- Zero particles in reduced-motion mode.

---

## 10. Choice transitions

### 10.1 "Show me" → Story (t = 0 at click)

| Time | Event |
|---|---|
| 0.00 | Button press feedback + cursor-FX burst at the button; `lenis.stop()` (scroll locked during the transition) |
| 0.05–0.45 | All intro DOM (greeting, tagline, question, buttons) fades/blurs out with a 40 ms stagger by distance from the click point; **their particle twins already sit in the exact same positions and switch to `burst`** — visually the text *becomes* particles |
| 0.20–1.80 | Particles disperse (outward + curl noise), shrink to micro size, damp, and settle into `storyField` (the story's far/mid starfield); slight camera dolly-in for depth |
| 0.90–1.60 | The **dot re-materialises** at the world start (18 % from left, 50 % vertical) with a soft pulse; the **path ribbon's first segment draws** |
| 1.60 | State = `story`; `lenis.start()`; a subtle "Scroll" cue appears near the dot and disappears after 10 % progress; the Reader DOM is hidden from layout so the document height equals the story spacer |

### 10.2 "No" → Explore (t = 0 at click)

| Time | Event |
|---|---|
| 0.00 | Click feedback + burst |
| 0.05–0.45 | Intro DOM fades out; particle twins released |
| 0.20–2.00 | Particles flow (curl-noise paths) toward `galaxy` layout targets (the diffuse spiral dust); camera dollies back `z 12 → 30` with a slight tilt; **repo/project stars fade in** staggered by distance from the centre |
| 1.40 | HUD fades in; cluster hubs and labels appear |
| 2.00 | State = `explore`; slow auto-drift begins (disabled for reduced motion) |

---

## 11. Story world (guided path — horizontal ⇄ vertical)

### 11.1 Concept

The visitor scrolls **vertically** (native scroll, Lenis-smoothed). That scroll drives a **camera travelling along a path** through a 2D world that continues **right** (time moves forward) and turns **down** (a deeper dive into a moment). The glowing dot leads; the path line draws behind it; chapters appear as the camera arrives.

**Direction semantics (document them in the UI via subtle cues):**
- **Right = time passes** (school → college → internship → hackathons).
- **Down = going deeper** (a project deep-dive, a key moment).
- The path **never goes up**; after a drop it continues right at the new lower level (a descending staircase). The finale zooms out to reveal the whole staircase as a constellation.

### 11.2 Scroll mechanics (🔒 do not hijack scroll)

- A tall spacer element sets the total scroll length; the stage is `position: sticky; top: 0; height: 100vh` (CSS sticky — **no GSAP pin spacer**).
- Lenis provides smoothing; GSAP ScrollTrigger provides **progress** only (`onUpdate` → `fx.storyProgress`). Use `scrub: true` with Lenis's smoothing; **do not add a second smoothing layer** (it feels mushy).
- Keyboard works natively (Space, PageDown, arrows, Home/End). Never prevent default on wheel/touch.
- Total scroll length ≈ **900–1,200 vh** depending on chapter count (mobile ≈ 15 % shorter). Segment weights come from `story.yml`.

### 11.3 Coordinate system

- World coordinates are in **screens**: `x` in multiples of viewport width, `y` in multiples of viewport height. Layout is automatically responsive.
- 3D mapping: `unitsPerPx = (2 · distance · tan(fov/2)) / window.innerHeight`, so one CSS pixel equals the same distance in 3D at the content plane.
- **Path model:** polyline of waypoints (stations and drop endpoints) with **rounded corners** (Chaikin or quadratic Béziers, corner radius ≈ 0.35 screen) → arc-length parametrised table `s ∈ [0,1]`.
- **Dwell profile:** camera speed along the path slows near stations: `speed(s) = base × (1 − 0.65 · gauss(s − s_k, w))` so panels are readable instead of whipping past. Scroll progress → `s` via the cumulative table.
- **Look-ahead:** the dot sits ~35 % from the leading edge (left for rightward travel, ~30 % from top for downward travel); the offset interpolates smoothly through corners using the path tangent.

### 11.4 Layers and parallax

| Layer | Content | Parallax factor |
|---|---|---|
| L0 | far dust | 0.10 |
| L1 | mid dust | 0.25 |
| L2 | **path ribbon + dot + station nodes** | 1.00 |
| L3 | **content panels (DOM)** | 1.00 |
| L4 | near particles / soft bokeh (big, faint, blurred sprites) | 1.4–1.8 |
| L5 | HUD (fixed) | 0 |

- **Path ribbon:** a **triangle-strip ribbon** (width 2–3 px) with a fragment shader giving a soft feathered edge and gentle travelling pulse; `uProgress` reveals it up to the dot. Not `THREE.Line`.
- **Dot (`DotGlow`):** brightness rises slightly with scroll velocity; emits a few sparks (via the particle engine) while moving; short comet trail along the ribbon.
- **Station nodes:** small ring nodes on the path with a soft pulse as the dot passes; a tick label.

### 11.5 Panels (DOM, crisp)

- Each chapter = a panel anchored at its station in world coordinates. Content: big chapter number, title (Clash Display), 1–3 short paragraphs (DM Sans), optional media (project image in a frame with inner parallax ±6 %), links.
- **Entrance:** when the station is within ~1.2 viewport-lengths ahead along the path: opacity 0→1, translate 40 px **along the travel direction** → 0, blur 10 → 0, 600 ms `outSoft`. **Exit:** opacity → 0, translate −20 px, 350 ms `inSoft`.
- Layout rule: panels never cover the dot; they sit ahead/beside it.
- Project images come from `assets/images/projects/` (optimised AVIF/WebP with explicit dimensions).
- **Transmissions** (testimonials) appear as signal-ring stations that open a glass panel (reuses the plan in the master doc §7.3).

### 11.6 Chapters (data in `content/story.yml`; §17)

Template — Vishal supplies the real beats (§18):

1. **Spark** — what pulled you in
2. **First code**
3. **College** — SRM, the learning curve
4. **Self-taught ML / LLMs** *(drop)*
5. **First internship** — QubeWire, backend/Go *(station + transmission)*
6. **Builds** — 3–4 **project drops** (one per featured project) + a "more builds" station with the rest
7. **Hackathons / achievements**
8. **Zoom-out finale** — constellation + GitHub stars
9. **Next** — what you're building toward; Resume · Contact · Ask

Guidance: `maxDrops: 4` (more makes the journey too long); every drop ≤ 1.5 screens tall; every station ≥ 1 and ≤ 3 sentences of body copy.

### 11.7 Finale — the zoom-out

From `s ≈ 0.90 → 1.0`: the camera pulls back (uniform scale of the world and FOV) from 1.0 to ≈ 0.18, panels fade out before they become unreadable (opacity → 0 by zoom ≈ 0.5), the ribbon dims, stations become stars, and **GitHub repo stars fade in** around the constellation. A final CTA panel offers **Explore the galaxy** (→ `explore`, using the *same* final camera as the Explore scene's initial camera for a seamless handoff), **Resume**, **Contact**, **Ask**.

### 11.8 Mobile, reduced motion, accessibility

- Portrait: panels ~86 vw wide; horizontal segments ≈ 100 vw per station; drops ≈ 100 vh. Same scroll mapping (vertical swipe → travel).
- **Reduced motion / no WebGL / `?view=reader`:** the same chapters render as a normal vertical Reader page with a static CSS starfield. No camera motion.
- DOM order = chapter order; each panel has an `h2`; chapter changes announce via an `aria-live="polite"` region (not every scroll tick); `ChapterNav` is a real `<nav>` with buttons and `aria-current`; it uses `lenis.scrollTo()` for jumps.

### 11.9 Acceptance

- Scrubbing from 0 → 100 % scroll shows no empty stretches longer than ~1.5 screens of scroll without a visual event (dot sparks, parallax, panel, node).
- Direction changes are smooth (rounded corners, no snapping); the dot is always visible and leading.
- Panels are fully readable at rest (dwell) on 360×640 and 2560×1440.
- Scrolling backwards works perfectly (reversible, no stuck states).
- p95 frame time ≤ 18 ms (High), ≤ 28 ms (Medium) during continuous scroll.

---

## 12. Explore (the galaxy)

### 12.1 What it is

The "No" path (and the destination of "Explore the galaxy" from the story finale). A navigable galaxy where **clusters = the parts of your life/work**: **Work · Education · Projects · Achievements**, plus your GitHub stars. Everything is also reachable as plain accessible content.

### 12.2 Layout & visuals

- Layout: 4 spiral arms; each arm roots at a **cluster hub** (a brighter `DotGlow` with a label). Stars within a cluster are placed by a deterministic hash (stable between visits).
- Stars: **white only**, luminance and size varied; featured projects larger with a soft halo; repos from `content/generated/github.json` sized by importance (featured > starred > recent > rest). The diffuse spiral dust is the same Stardust particles that came from the greeting text.
- Post: Bloom + light vignette + grain (same grading as the intro).

### 12.3 Interaction

| Input | Behaviour |
|---|---|
| Idle | slow orbit drift (off for reduced motion) |
| Drag | damped orbit with limits |
| Wheel/pinch | zoom with limits |
| Hover star/hub | highlight + tooltip (DOM) with name + one line. **Picking is CPU screen-space:** project star centres when the pointer moves; nearest within 18 px (no raycasting against Points) |
| Click hub/star | camera **fly-to** (1.4 s, `inOutCubic`); panel opens |
| `Esc` | close panel, fly back |

### 12.4 Panels (DOM)

- **Work & Education timeline:** vertical timeline with year markers, role/degree, one-line outcomes, links. Real semantic list.
- **Projects:** grid of project cards (image, tagline, stack chips) linking to the case study pages.
- **Achievements:** list with dates and links.
- **GitHub star:** repo name, description, languages, stars, link.

### 12.5 HUD

Top-left: name mark ("Vishal Gastu", not caps). Top-right: **Story · Reader · Resume · ⚙** (Quality, Sound, Cursor effects, Reduce/Pause motion). Bottom-centre hint: *Drag to orbit · Scroll to zoom · Click a cluster*. A **List view** toggle swaps the 3D for a pure DOM list of every cluster and item.

### 12.6 Accessibility & fallback

- Visually-hidden DOM buttons mirror every cluster hub (focusable; Enter opens; arrow keys cycle).
- If WebGL is unavailable or the tier is `none`, `explore` renders the List view directly.

### 12.7 Acceptance

- Initial view shows a composed galaxy (not clipped, not empty) at 1440×900 and 390×844.
- Fly-to and return are smooth and reversible; panels are readable and keyboard-operable.
- The Work & Education timeline is readable without touching the 3D at all.

---

## 13. Tiers, performance, accessibility, finishing

### 13.1 Tier detection and behaviour

| Tier | Selected when | Intro | Particles | Post | Cursor FX |
|---|---|---|---|---|---|
| **High** | capable GPU, desktop/laptop, no `Save-Data` | full | 60 k + 6 k streaks | bloom + vignette + grain (+ CA at peak) | full |
| **Medium** | mid laptops, good phones | full | 30 k + 3 k | bloom + vignette + grain | medium |
| **Low** | weak/old phones, or live FPS < 45 for ~3 s | full, simplified | 12 k + 1.2 k | none (grain via DOM overlay) | low |
| **None** | no WebGL, context lost, reduced motion, user choice | CSS/HTML intro (≈ 2.5 s) → Reader | — | — | off |

- Capability detection at boot (GPU class lib such as `detect-gpu` ⚠️, `hardwareConcurrency`, `matchMedia('(prefers-reduced-motion)')`, `matchMedia('(pointer: coarse)')`, `Save-Data`), **plus a live FPS monitor** that downgrades during the experience and never upgrades without a reload.
- The user can override with **Quality: Auto / High / Low** in the HUD settings.
- Handle `webglcontextlost` (prevent default; fall back to `None` with a friendly message; restore if the context returns).

### 13.2 Budgets (targets — measure and record in `docs/perf-baseline.md`)

| Item | Budget |
|---|---|
| JS before the 3D chunk (HTML black screen + INITIALIZING + loader + Reader) | ≤ ~120 KB gzip |
| 3D chunk (three + R3F + drei subset + postprocessing + our code), lazy-loaded under INITIALIZING | ≤ ~500 KB gzip (measure; reduce by importing specific modules only) |
| Fonts (Clash Display + DM Sans, subset WOFF2) | ≤ 120 KB total |
| Initial 3D assets | ≤ 3 MB (this plan is almost entirely procedural: ~0 MB models) |
| Frame time | p95 ≤ 18 ms High, ≤ 28 ms Medium |
| Memory | no unbounded growth over a 5-minute session (dispose geometries/materials/textures on unmount) |
| CLS | 0 caused by the intro (overlay is fixed) |

### 13.3 Engineering rules

- `Canvas` loaded with `dynamic(() => import(...), { ssr: false })`.
- Import drei helpers individually; never import the whole drei barrel into the intro path.
- Reuse geometries/materials; no allocation inside `useFrame` or the cursor loop.
- Resize handling debounced; DPR clamped (High ≤ 2, Medium ≤ 1.5, Low 1).
- Pause rendering when the tab is hidden; `frameloop="demand"` when nothing animates (e.g. Reader view).
- Strict cleanup of GSAP contexts, ScrollTriggers, Lenis, event listeners and WebGL resources on unmount (dev Strict Mode double-mount must not leak).

### 13.4 Accessibility (🔒 WCAG 2.2 AA)

- **Photosensitivity:** exactly **one** flash per intro, ramped (≥ 600 ms up, 900 ms down), peak below pure white; never more than 3 flashes in any second (technically zero repeats). Reduced motion removes the flash entirely.
- **Reduced motion:** no warp, no flash, no scroll-driven camera, no cursor FX, no auto-drift; same content in the Reader/crossfade presentation.
- **Keyboard:** Skip is the first tab stop; every interactive element has a visible focus ring; `Esc` closes panels; the moving "No" stops on focus.
- **Screen readers:** the intro is a real `<main>` region with headings; the underlying Reader is `inert` while the intro runs; chapter changes announce politely; canvases are `aria-hidden`.
- **Contrast:** verify every token pair; never rely on glow for information.
- **Pause control:** persistent "Pause motion" in the HUD (WCAG 2.2.2).
- **No-JS:** `<noscript>` shows the Reader view normally.

### 13.5 Finishing layer (this is what reads as "expensive")

- **Film grain / dither:** in-canvas `Noise` effect (≈ 0.02–0.03 opacity, soft-light blend) **and** a DOM grain overlay (tiny tiled noise image, ≈ 0.04 opacity) so the flash and DOM text also get dithering. Eliminates banding in dark gradients.
- **Vignette:** subtle (`darkness ≈ 0.9`, `offset ≈ 0.25`), stronger during warp.
- **Bloom:** `mipmapBlur`, threshold near 0.9–1.0, intensity driven by `fx.bloom`. ✅ Bloom only picks up values **above the threshold**, so glow materials must output HDR values and use `toneMapped: false`. Use `multisampling={0}` on the composer for performance.
- **Colour:** no tone mapping needed for white-on-black additive visuals; if A/B captures show a benefit, test a neutral tone-mapper. Output sRGB.
- **Micro-details:** 1 px hairlines, optical kerning on the name, consistent 8-pt spacing, tabular numerals for chapter numbers, no orphan words.
- **Sound (optional, Phase X10):** off by default; one small speaker toggle; enabling it unlocks audio and plays a low whoosh under the warp on replays and a soft ambient bed in the story. All audio CC0, ≤ 500 KB per loop, recorded in the manifest. The *first* load stays silent because browsers block audio until a user gesture.

---

## 14. Debug & capture harness (how agents verify visuals)

### 14.1 URL flags (only active with `?debug=1` unless noted)

| Flag | Effect |
|---|---|
| `?debug=1` | shows the debug overlay: FPS, p95 frame ms, draw calls, triangles, live particle counts, tier, current state/time; exposes `window.__director` |
| `?t=4.2&freeze=1` | seek the intro timeline to 4.2 s and freeze |
| `?tier=high|medium|low|none` | force tier |
| `?intro=full|short|skip` | (also works without debug) |
| `?seed=42` | seeded PRNG for reproducible particle layouts |
| `?cursorfx=on|subtle|off` | (also works without debug) |
| `?view=reader` | (also works without debug) |

### 14.2 `scripts/capture-intro.ts` (Playwright)

- Launches the dev build at **1440×900** and **390×844** (DPR 2 for mobile).
- For each `t` in `[0.2, 0.6, 1.2, 1.9, 2.4, 3.0, 3.6, 4.0, 4.4, 4.8, 5.3, 5.6, 6.0, 6.5, 7.2, 8.2]` → opens `/?debug=1&seed=42&t=<t>&freeze=1`, waits for two animation frames, saves `docs/captures/<date>/<viewport>/t-<t>.png`.
- Produces a **contact sheet** (`montage.png`) and a markdown index `docs/captures/<date>/README.md`.
- Also captures story checkpoints (`storyProgress` = 0, 0.1 … 1.0) and the explore overview once those exist.

**Important:** headless Chromium may render WebGL in software (SwiftShader) on many setups ⚠️. Use headless captures for **visual correctness**, **never for FPS numbers**. Measure performance with a real browser on a real GPU (Antigravity's browser tool or Vishal's machine) using the debug overlay.

### 14.3 Required checks per visual task

1. Run the capture script; open every frame; apply the **freeze-frame test** (§1.3).
2. Record p95 frame time from a real-GPU run of the relevant segment.
3. Check the console is clean.
4. Attach the contact sheet to the review packet.

### 14.4 DOM ↔ particle alignment test

Debug option `?debug=1&align=1` overlays the sampled particle targets on top of the DOM text. Acceptance: for the name line at 1440×900 and 390×844, sampled points lie within ±2 px of glyph edges; no systematic offset; wraps correctly on mobile.

---

## 15. Task plan (execute in order; STOP after each; review gates marked 🚦)

> Each task lists: **Goal · Scope · Deliverables · Acceptance · Verification**. Do not start the next task without Vishal's go-ahead.

### X0 — Audit & quarantine (no new features)

- **Goal:** know what exists, remove what is broken from the user's path without losing working work.
- **Scope:** read the repo; write `docs/audit-cinematic.md` listing every cinematic-related file (canvas/, BootScreen, ViewAwareLayout, ChapterNav, SceneRouter, Dot, KeywordDrift, etc.), what it does, whether it is reusable, and why the previous version failed (view state unused, loader depending on asset load, 20 px dot, global text overlay, etc.).
- **Do:** move the old cinematic code to `apps/web/src/_legacy/` (or delete only after Vishal approves); make `/` render a **clean black placeholder → Reader** so the site is never broken; keep the professional/Reader pages, content pipeline, schema, CI and Stitch-based pages intact.
- **Acceptance:** `pnpm check` green; `/` loads with no console errors; Reader view unchanged; audit doc exists with a **keep / rewrite / delete** table.
- **🚦 RG0:** Vishal approves the table.

### X1 — Foundations: Director, store, flags, harness, fonts

- **Goal:** the scaffolding that makes every later visual verifiable.
- **Deliverables:** `experience/` folders (§3.5); `fx` uniform bag; Director with master timeline stub + `seek/freeze` + `window.__director` (debug only); flags parser (§14.1); seeded PRNG; easing module (§4.2); tiers module; debug overlay (FPS/p95/draw calls/particles/tier/state/time); Playwright capture script (§14.2) working on a **blank black scene**; self-hosted fonts (Clash Display, DM Sans — subset WOFF2; ⚠️ confirm licence) with metric-matched fallbacks; Lenis + ScrollTrigger sync installed but unused; first-paint black layer with the `data-intro` flag and `<noscript>` override (§3.2).
- **Acceptance:** `?debug=1&t=2&freeze=1` loads; capture script outputs a contact sheet of black frames at both viewports; no CLS; Reader still works; `pnpm check` green.
- **Verification:** capture packet + overlay screenshot.

### X2 — Stardust engine (lab page `/lab/stardust`, not linked)

- **Goal:** the soft, premium particle field.
- **Deliverables:** `StardustPoints` with soft-sprite shader (HDR core), additive blending, perspective-correct sizing, tiers; layouts `dust`, `text`, `burst`; text sampler (§5.3) with debug overlay; assemble and disperse animations driven by `fx.textMix` / `fx.disperse`; cursor repel + pulse uniforms; Bloom + grain/vignette wired; lab sliders (Leva ⚠️ or simple DOM controls) for counts/size/turbulence.
- **Acceptance:** at 1440×900 a frame of dust looks like soft, varied stars (no squares, no uniform grid, no visible tiling); assemble produces a **legible, crisp** "VISHAL GASTU" (alignment test §14.4 passes); disperse looks organic, not radial-fireworks; High tier p95 ≤ 18 ms at 60 k particles on the real GPU.
- **🚦 RG2:** Vishal reviews captures + a screen recording of the lab page.

### X3 — Warp (lab page `/lab/warp`)

- **Goal:** the hyperspace.
- **Deliverables:** `WarpStreaks` per §6 (instanced, screen-space quads), `fx.travel/warp/fov` tweens, centre glow (`DotGlow` first version), vignette ramp, tiers.
- **Acceptance:** §6.5 passes; `seek()` produces identical frames (determinism check: same `t` + same `seed` ⇒ pixel-identical within tolerance).
- **Verification:** frames at t = 2.4, 3.0, 3.6, 3.9; FPS numbers.

### X4 — White-out, collapse, dot hand-off

- **Goal:** the emotional hinge.
- **Deliverables:** `FlashOverlay` (§7.1), bloom/exposure sync, collapse, dot reveal, background cross-fade `#000 → #05060A`, grain overlay (§13.5).
- **Acceptance:** §7.4 passes; **no banding** at 100 % zoom; one flash only; reduced-motion path replaces it with a crossfade.
- **🚦 RG4:** Vishal watches the warp → white-out → collapse as a recording.

### X5 — Full intro assembly

- **Goal:** B0–B9 end to end, plus short/skip modes.
- **Deliverables:** `IntroOverlay` (INITIALIZING with real loading + **shader warm-up** and 1.3 s minimum), greeting/tagline/question DOM, DOM↔particle crossfade, `Show me` button, **No button trajectory** (§8.3, all three trajectories selectable via `content/intro.yml`), Skip control (§4.1), returning-visitor logic (§2.3), reduced-motion/None path, `inert` Reader behind the intro, state machine up to `choice`.
- **Acceptance:** whole §4.1 table verified by frames; first interactive moment ≈ 8.0 s (full) / ≈ 2.8 s (short); no hitch at B3 start (first 10 frames of the warp ≤ 25 ms each); "No" always clickable; keyboard path; screen reader announces the greeting and question; `pnpm check` green.
- **🚦 RG5 (big gate):** Vishal watches the full sequence on desktop and phone.

### X6 — Cursor FX (can run before X3–X5 in a lab page `/lab/cursor`)

- **Goal:** §9 in full.
- **Deliverables:** engine, sprites, config tiers, modes, API, hold-charge, magnetic hover, touch behaviour, HUD toggle, click-through test, idle loop shutdown.
- **Acceptance:** §9.7 passes; recording shows trail continuity at fast movement; CPU numbers recorded.
- **🚦 RG6:** Vishal reviews a screen recording.

### X7 — Yes → dispersal → Story engine (first 3 chapters)

- **Goal:** the path world with real content for chapters 1–3.
- **Deliverables:** `story/path.ts` (waypoints → rounded polyline → arc-length table + dwell), camera rig, `PathRibbon`, `DotGlow` as narrator (sparks, trail), station nodes, `ChapterPanel` lifecycle (§11.5), `ChapterNav`, Lenis/ScrollTrigger progress, dispersal transition (§10.1), parallax layers, `content/story.yml` loader with Zod validation.
- **Acceptance:** §11.9 for the first three chapters; reversible scroll; both directions of travel (right + one drop) implemented and visually smooth; panels readable at dwell.
- **🚦 RG7:** Vishal scrolls through it on desktop and phone.

### X8 — Story complete (all chapters + finale)

- **Deliverables:** remaining chapters, project drops using `assets/images/projects`, transmission stations (static data), hackathons/achievements, the **zoom-out finale** with GitHub stars, CTA panel, mobile polish.
- **Acceptance:** §11.9 and §11.7; total scroll length within 900–1,200 vh; no empty stretches.
- **🚦 RG8.**

### X9 — No → Explore + switching

- **Deliverables:** `galaxy` layout, hubs, picking, fly-to, panels (Work & Education timeline, Projects, Achievements, GitHub), HUD, List view, seamless Story ⇄ Explore ⇄ Reader switching with URL state; shared final-camera handoff.
- **Acceptance:** §12.7; state machine transitions are interruptible; deep links restore states.
- **🚦 RG9.**

### X10 — Polish, sound (optional), accessibility, performance

- **Deliverables:** grain/dither pass, CA at peak (optional), micro-interactions, optional sound, a11y audit (axe + manual keyboard + screen-reader smoke), Lighthouse, real-device matrix, memory/leak check, `docs/perf-baseline.md` updated.
- **Acceptance:** budgets in §13.2 met; no console errors; axe 0 serious/critical.

### X11 — Release readiness

- **Deliverables:** replay-intro link, analytics events (cookieless), OG image, privacy/credits update, final capture archive, changelog.
- **Acceptance:** release checklist in `docs/MASTER_PLAN.md` §15.3 passes.

---

## 16. Prompts to give Antigravity (copy-paste)

### 16.1 Kickoff (once)

```text
Read docs/EXPERIENCE_SPEC.md completely, then AGENTS.md and docs/MASTER_PLAN.md §1–§4.
This spec supersedes the cinematic scene definitions of the master plan.
We are rebuilding the cinematic layer from scratch as a vertical slice. The previous implementation failed.
Rules: follow §0 exactly. Work on one task at a time. Stop after each task and post the review packet.
Start with task X0 only (audit & quarantine). Do not write any new visual code yet.
```

### 16.2 Per task

```text
Execute task X<n> from docs/EXPERIENCE_SPEC.md §15 and nothing else.
Before coding: list the files you'll create/change and the acceptance criteria you will verify.
Implement. Run `pnpm check`. Run the capture script (§14.2) at 1440x900 and 390x844 and open every frame.
Apply the freeze-frame test (§1.3). Measure p95 frame time on a real-GPU browser run.
If any frame looks empty, clipped, cheap, polygonal, off-centre or banded, fix it before reporting.
Post the review packet from §0.3 and STOP. Do not start the next task.
```

### 16.3 When something looks wrong

```text
Do not patch blindly. Capture frames at the failing times (list them), write down what you see vs what §<section> specifies,
find the root cause, fix it, re-capture, and show before/after.
```

### 16.4 Guard prompt (paste if the agent drifts)

```text
Stop. Re-read docs/EXPERIENCE_SPEC.md §0 and §1.2. List which hard rule you are about to break (if any) and how you will avoid it.
Then continue only with the current task.
```

---

## 17. Content files (data, not code)

### 17.1 `content/intro.yml`

```yaml
introVersion: 1
copy:
  line1: "You made it. I'm"
  name: "Vishal Gastu"
  nameDisplay: upper
  tagline: "I create what doesn't exist yet."
  question: "Want to see how I got here?"
  yes: "Show me"
  no: "Nope"
  noAriaLabel: "No thanks — let me explore on my own"
  skip: "Skip"
  readerLink: "Reader view"
trajectory: lissajous
timing:
  minInitializingSeconds: 1.3
  fullIntroSeconds: 8.0
  shortIntroSeconds: 2.8
```

### 17.2 `content/story.yml` (placeholder values — Vishal supplies the real chapters)

```yaml
schemaVersion: 1
maxDrops: 4
chapters:
  - id: spark
    kind: station
    direction: right
    weight: 1.0
    number: "01"
    title: "The spark"
    body: "Replace with one to three sentences about what pulled you in."
    media: []
  - id: first-code
    kind: station
    direction: right
    weight: 1.0
    number: "02"
    title: "First lines of code"
    body: "Replace with your real beat."
  - id: college
    kind: station
    direction: right
    weight: 1.2
    number: "03"
    title: "College"
    body: "Replace with your real beat."
  - id: ml-dive
    kind: drop
    direction: down
    weight: 1.4
    number: "04"
    title: "Going deep: ML and LLMs"
    body: "Replace with your real beat."
    projectId: null
  - id: internship
    kind: station
    direction: right
    weight: 1.2
    number: "05"
    title: "First internship"
    body: "Replace with your real beat."
    transmissionId: null
  - id: build-1
    kind: drop
    direction: down
    weight: 1.5
    number: "06"
    projectId: example-project
  - id: finale
    kind: finale
    weight: 1.6
    number: "∞"
    title: "The whole map"
```

The loader validates every field (Zod); `projectId` must exist in `content/projects/`; `weight` drives scroll length; unknown `kind` fails the build.

---

## 18. Decisions Vishal must make (agents: do not decide these)

1. **Greeting line** (§8.1): "You made it. I'm" / "Hi. I'm" / "Hello, traveller. I'm" / your own.
2. **Question + button labels:** "Want to see how I got here?" · "Show me" · "Nope" / "Not now" / "I'll explore myself" / your own.
3. **No-button trajectory:** `lissajous` (default), `orbit`, or `bounce` — watch all three in the lab and choose.
4. **Chapters:** the real beats of your story (spark, first code, college, turning points…), which 3–4 projects get deep-dive drops, which stay in the "more builds" station.
5. **Sound:** include optional sound or not.
6. **Clash Display licence:** confirm self-hosting is permitted for your use (or choose an alternative display face).
7. **Intro length:** accept ≈ 8 s to the question, or shorten the warp.

---

## 19. Definition of Done (whole experience)

- All of §4.1 verified by captured frames on desktop and mobile; one flash; no banding; no polygon look anywhere.
- Cursor FX matches §9.7; native cursor untouched; zero particles under reduced motion; never blocks clicks.
- "No" button follows its trajectory, is always catchable, never overlaps content, stops on focus/hover.
- Story: smooth right/down travel with dwell, reversible, readable panels, finale zoom-out into the galaxy; Explore reachable and seamless; Reader always available.
- Budgets (§13.2) met; accessibility (§13.4) verified; `pnpm check` green; no console errors; assets and licences recorded.
- Vishal has watched the full flow on his own laptop and phone and signed off at every 🚦 gate.

---

*End of spec. Next step: give Antigravity the kickoff prompt in §16.1, then answer the open decisions in §18 as they come up.*
