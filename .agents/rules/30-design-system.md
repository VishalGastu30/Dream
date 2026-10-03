# Rule 30 — Design System, Tokens, Typography, Motion

## CSS tokens (from packages/ui-tokens — source of truth for DOM and 3D)
```css
--bg-0: #05060A;                            /* deepest background */
--bg-1: #0B0D14;                            /* elevated background */
--surface: rgba(255, 255, 255, 0.04);       /* glass surface */
--surface-strong: rgba(255, 255, 255, 0.08);
--border: rgba(255, 255, 255, 0.10);
--text-0: #F2F4F8;                          /* primary text */
--text-1: #B4BBCB;                          /* secondary text */
--text-2: #8B93A7;                          /* tertiary text */
--signal: #F2F4F8;    /* ghost light — near-white. ONLY interaction accent — use sparingly. Glow: spread < 20px, opacity < 0.6 */
--ember: #FFB86B;     /* rare: warnings / highlights only */
--danger: #FF6B6B;
--radius-s: 8px;
--radius-m: 14px;
--radius-l: 24px;
--ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* entrances */
--ease-in:  cubic-bezier(0.64, 0, 0.78, 0); /* exits */
```

The **light (professional) theme is a SEPARATE token set** — not an inversion of the dark set.
3D shaders must read these same values via the bridge in `packages/ui-tokens/src/index.ts`.

## Typography rules
- **Display:** Space Grotesk (SIL OFL) or Clash Display / Satoshi (verify Fontshare licence)
- **Body:** high-legibility sans — avoid Inter if possible (too common); consider Plus Jakarta Sans, Outfit
- **Mono:** JetBrains Mono — HUD labels, code snippets
- Self-host WOFF2 only; **no third-party font requests at runtime**
- Subset to characters actually used; use variable fonts where available
- `font-display: swap` with metric-matched fallback (prevents CLS)
- Fluid scale via `clamp()`; body minimum 16px; line-height 1.5–1.7

## Layout rules
- 12-column grid, 8-pt spacing scale
- Max reading width 68–72 ch for case studies and long-form text
- Generous negative space — do not fill every pixel

## Interactive element rules (🔒)
- Visible focus ring: `2px solid var(--signal)`, `2px offset` — never `outline: none` without a replacement
- Hit area ≥ 44 × 44px (WCAG 2.5.5)
- Hover AND focus styles must be identical (not different effects for each)

## Motion rules
- Entrance: `--ease-out`; Exit: `--ease-in`
- Durations: micro 150–200ms · UI 300–450ms · scene 800–1400ms
- **Nothing > 1.6s that blocks user input**
- One hero motion per screen; everything else is quiet
- Stagger: 30–60ms per word/line; no parallax on text
- **ALWAYS provide a reduced-motion equivalent** (fade/instant) with identical information
- Respect `prefers-reduced-motion` in both CSS (`@media`) and JS (check before GSAP plays)

## HUD voice (cinematic view only)
ALL-CAPS system-voice copy (`INITIALIZING`, `TRANSMISSION RECEIVED`) is allowed ONLY
in the cinematic view. The professional view uses normal sentence-case language.

## Component library (build on accessible primitives)
Use Radix UI / shadcn/ui — verify licences at implementation time.
Required components: Button, IconButton, Toggle, Tabs, Dialog/Sheet, Tooltip,
CommandPalette, Chip, Card, Timeline, Stat, ProgressThread, TransmissionPanel, CollectionGrid.
