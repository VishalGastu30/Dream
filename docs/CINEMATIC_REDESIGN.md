# Dream Portfolio — Cinematic Redesign

> **Version:** 2.0 — Complete visual architecture overhaul  
> **Date:** 2026-10-23  
> **Status:** Implementation in progress

---

## 1. What Was Wrong (Root Cause Summary)

| Bug | Root Cause |
|-----|-----------|
| Giant "VISHAL GASTU" text overlays everything | `ParticleResolve.tsx` renders `<Text fontSize={2}>` in 3D — no view-mode guard |
| No fullscreen boot screen | `CinematicLoader` only shows while drei assets load (50ms), disappears instantly |
| Cinematic mode toggle does nothing | `page.tsx` / `layout.tsx` never read `view` state — layout never changes |
| The ball is a useless 20px dot | `Dot.tsx` radius `0.2` at camera z=10 ≈ 20px, no animation pipeline |
| Entry buttons float mid-page | R3F `<Html position={[0,-3,0]}>` maps to wrong screen position |

---

## 2. The Architecture Decision

### Two modes. One canvas. Zero bleed.

```
┌─────────────────────────────────────────────────────────┐
│                    FIRST VISIT ONLY                     │
│  ┌───────────────── BOOT SCREEN ───────────────────┐   │
│  │  CSS orb pulse → typewriter → keyword drift     │   │
│  │  [ENTER CINEMATIC]        [SKIP → PROFESSIONAL] │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
          ↙                              ↘
┌─────────────────┐              ┌──────────────────────┐
│  PROFESSIONAL   │              │     CINEMATIC        │
│                 │              │                      │
│  Normal HTML    │              │  Fullscreen canvas   │
│  layout with    │              │  Header hidden       │
│  sticky nav     │              │  HTML hidden         │
│                 │              │  Scroll drives 3D    │
│  Three.js is    │              │  camera along path   │
│  PASSIVE BG:    │              │                      │
│  • KeywordDrift │              │  Chapters:           │
│  • Orb follows  │              │  0 → Boot / Name     │
│    the cursor   │              │  1 → Journey spline  │
│    like a       │              │  2 → Projects solar  │
│    custom cursor│              │  3 → Outro / Contact │
└─────────────────┘              └──────────────────────┘
```

---

## 3. The Boot Screen

**What it is:** A pure HTML/CSS `fixed inset-0 z-[999]` overlay. Zero Three.js dependency. Loads instantly.

**Session gating:** `sessionStorage.getItem("dream-booted")`. Shows on every tab/reload. Dismissed permanently for the session when user clicks either button.

### Animation sequence (1800ms total)

```
t=0ms    Dark void. Body has cursor:none.
t=200ms  CSS orb scales from 0 → 1 with radial glow.
t=600ms  First letter of "VISHAL GASTU" appears (typewriter effect, 80ms/char).
t=1200ms Sub-title fades in: "AI ENGINEER · SRM '27 · DIGITAL UNIVERSE"
t=1400ms Keyword drift starts: skills words float upward at various speeds/opacities.
t=1600ms Progress bar fills as Three.js loads in the background.
t=1800ms Entry buttons fade in: [ENTER CINEMATIC] [SKIP → PROFESSIONAL]
```

### CSS Orb

```css
.boot-orb {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff 0%, #6EE7F9 40%, transparent 70%);
  box-shadow:
    0 0 40px 20px rgba(110, 231, 249, 0.6),
    0 0 120px 60px rgba(110, 231, 249, 0.3),
    0 0 300px 150px rgba(110, 231, 249, 0.1);
  animation: orbPulse 2s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { transform: scale(1);   opacity: 1;   }
  50%       { transform: scale(1.08); opacity: 0.9; }
}
```

---

## 4. The Dot — Three Lives

The orb/dot has different roles depending on mode:

### Life 1: Boot Screen (CSS)
Pure CSS radial gradient div. Shown during boot sequence before Three.js loads.

### Life 2: Professional Mode (Three.js custom cursor)
The physical cursor is hidden (`cursor: none` on `html`). The Three.js `Dot` follows the actual mouse position projected into 3D space.

- **Default:** Small glowing orb (radius `0.35`) trailing the cursor with spring physics (`lerp 0.12`)
- **On hover interactive element:** Orb expands to radius `0.6`, changes color to accent
- **On click:** Brief scale flash `1.4→1.0` over 300ms
- **Blend with KeywordDrift:** Keywords react to proximity (mild repulsion force)

Implementation: `useThree().viewport` to map mouse NDC → 3D world coords at z=2. No allocations in `useFrame`.

### Life 3: Cinematic Mode (scene protagonist)
The Dot is the camera's co-pilot. It leads the camera through all four chapters.

- **Chapter 0:** Radius `0.6`, centered, breathing pulse, bloom enabled
- **Chapter 1:** Moves along the CatmullRomCurve3 journey spline
- **Chapter 2:** Transforms into the solar system's central sun (radius `0.8`)
- **Chapter 3:** Descends and shrinks back to `0.2` as contact panel opens

---

## 5. Cinematic Mode — Scroll Architecture

### How scroll drives the camera

```
┌──────────────────────────────────────┐
│  DOM: 500vh tall transparent page   │  ← gives scroll height
│  (invisible, just provides scroll)  │
└──────────────────────────────────────┘
             ↓ scroll progress (0→1)
┌──────────────────────────────────────┐
│  Lenis smooth scroll                 │  ← already installed
│  → progress → sceneStore.dotProgress │
└──────────────────────────────────────┘
             ↓
┌──────────────────────────────────────┐
│  useCameraPath (inside Canvas)       │
│  CatmullRomCurve3 control points:   │
│    [0, 0, 8]  → Chapter 0 (boot)   │
│    [3, 1, -5] → Chapter 1 (journey) │
│    [0, -2, -15]→ Chapter 2 (solar) │
│    [0, 0, -25] → Chapter 3 (outro) │
│  camera.lerp(path[progress], 0.08)  │
└──────────────────────────────────────┘
```

### Chapter breakdown

| Progress | Chapter | 3D Scene | DOM Overlay |
|----------|---------|----------|-------------|
| 0.00–0.20 | **0: BOOT** | Orb pulses. Keywords drift. Name resolves with Sparkles. | None |
| 0.20–0.50 | **1: JOURNEY** | Spline lights up. Dot travels along it. Job nodes appear sequentially. | Glassmorphism cards for each role slide in from alternating sides |
| 0.50–0.80 | **2: COSMOS** | Solar system with orbiting project planets | Project info appears on planet hover |
| 0.80–1.00 | **3: OUTRO** | Stars fade in. Dot descends to rest. | "SYSTEM STANDBY" + CTA |

---

## 6. Professional Mode — What Changes

### Custom cursor (the Dot follows mouse)
```tsx
// In Dot.tsx — professional mode behaviour:
const mouse = useRef({ x: 0, y: 0 });
useEffect(() => {
  const handle = (e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', handle, { passive: true });
  return () => window.removeEventListener('mousemove', handle);
}, []);

useFrame(({ camera, viewport }) => {
  // Project NDC mouse to world space at z=2
  const target = new THREE.Vector3(
    mouse.current.x * viewport.width / 2,
    mouse.current.y * viewport.height / 2,
    2
  );
  meshRef.current.position.lerp(target, 0.12);
});
```

### GitHub stats badge
Added to the hero section above the name:
```
[ ⭐ 12 stars  ·  🍴 3 forks  ·  GitHub: VishalGastu30 ]
```
Fetched via GitHub API at build time, rendered as static HTML. No runtime fetch.

### No more overlapping 3D on professional page
- `ParticleResolve` (the VISHAL GASTU text): returns null in professional mode
- `BootGenesis` scene: only renders in cinematic mode OR during boot
- `EntryButtons`: replaced with a proper DOM component (not R3F Html)
- Canvas `pointer-events`: `none` in professional, `auto` in cinematic

---

## 7. Layout Architecture

```tsx
// layout.tsx — after redesign
<ViewProvider>
  <ScrollProvider>
    <BootScreen />            {/* z-[999] — shown once per session */}
    <CanvasWrapper />         {/* z-0 — always behind */}
    <CinematicNav />          {/* z-50 — chapter dots, only in cinematic */}
    
    {/* Professional layout — hidden in cinematic */}
    <div data-view="professional" className={view === 'cinematic' ? 'hidden' : 'contents'}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>

    {/* Cinematic scroll spacer — only when cinematic */}
    {view === 'cinematic' && <div style={{ height: '500vh' }} aria-hidden="true" />}

    <QualityControl />
    <CommandPalette />
  </ScrollProvider>
</ViewProvider>
```

---

## 8. Files Changed / Created

### New files
| Path | Purpose |
|------|---------|
| `components/BootScreen.tsx` | CSS boot overlay with orb, typewriter, progress |
| `components/CinematicNav.tsx` | Chapter dot navigation (replaces ChapterIndex with proper design) |
| `canvas/hooks/useCursorDot.ts` | Mouse → 3D world position for cursor orb |
| `canvas/scenes/A_BootGenesis/NameResolve.tsx` | Name typewriter + sparkle particle burst |

### Modified files
| Path | What changes |
|------|-------------|
| `app/layout.tsx` | View-conditional layout. Boot screen. Cinematic scroll spacer. |
| `contexts/ViewContext.tsx` | Add `isBooted` state driven by sessionStorage |
| `canvas/CanvasRoot.tsx` | Remove CinematicLoader, add cursor mode, fix pointer-events |
| `canvas/scenes/A_BootGenesis/BootGenesis.tsx` | View guard (cinematic only) |
| `canvas/scenes/A_BootGenesis/ParticleResolve.tsx` | View guard + proper sizing |
| `canvas/scenes/A_BootGenesis/Dot.tsx` | Three modes: cursor / cinematic / none |
| `canvas/scenes/A_BootGenesis/EntryButtons.tsx` | Removed — replaced by BootScreen |
| `canvas/SceneRouter.tsx` | View-mode gates on all scenes |
| `app/page.tsx` | GitHub stats badge in hero |
| `app/globals.css` | Boot screen CSS keyframes, cursor:none on cinematic |

---

## 9. Performance Contracts (from AGENTS.md rules)

- Initial 3D payload ≤ 3 MB ✓ (no new assets added)
- No allocations in `useFrame` ✓ (pre-allocated Vector3 refs)
- Reduced-motion path ✓ (boot screen skipped, canvas disabled)
- DOM twin for all 3D content ✓ (aria-hidden on canvas)
- Mobile: cinematic auto-falls back to professional on mobile viewports

---

## 10. GitHub Stats Implementation

Fetched at **build time** using Next.js fetch with `cache: 'force-cache'`:

```ts
// In page.tsx (server component) — fetched once at build
const githubStats = await fetch('https://api.github.com/users/VishalGastu30', {
  headers: { Accept: 'application/vnd.github.v3+json' },
  next: { revalidate: 86400 } // 24h cache
}).then(r => r.json());
```

Displayed as a subtle badge row:
```
GitHub · 14 repos · Open source
```
