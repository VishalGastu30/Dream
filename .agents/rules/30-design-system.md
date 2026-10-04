# Design System & Visual Language Rules

## 1. Tokens and Palette
- The single source of truth for design tokens is `packages/ui-tokens/src/tokens.css`.
- Always use CSS variables (`var(--color-background)`, etc.).
- Never hardcode generic colors like `#FF0000` or standard Tailwind colors unless instructed.

## 2. Typography
- **Headings (H1-H6):** `Clash Display`. Use `font-heading` utility class.
- **Body:** `DM Sans`. Use `font-sans` utility class.
- **Monospace/HUD:** `JetBrains Mono`. Use `font-mono` utility class.

## 3. Motion Language & Easing
All transitions and animations must feel deliberate, smooth, and cinematic.

### Easing Curves
- **Standard (Hover, UI state):** `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind's `ease-out`)
- **Cinematic (Swoop, Page Load):** `cubic-bezier(0.16, 1, 0.3, 1)` (Use custom token `ease-cinematic` if available, or approximate)
- **Spring (Bouncy/Playful):** Avoid unless explicitly requested. Keep it elegant.

### Durations
- **Micro-interactions (Hover):** 150ms (`duration-150`) or 200ms (`duration-200`)
- **Layout shifts (Modals, Dropdowns):** 300ms (`duration-300`)
- **Cinematic reveals:** 800ms - 1200ms

## 4. Glassmorphism & Depth
- Use `backdrop-filter: blur(...)` combined with highly transparent backgrounds (e.g., `rgba(255, 255, 255, 0.05)`) for panel layers.
- Avoid heavy drop shadows. Use subtle glows or 1px semi-transparent borders to separate layers.

## 5. Reduced Motion
- Every animated element MUST have a `prefers-reduced-motion` fallback.
- In CSS/Tailwind, use `motion-reduce:transition-none` or `motion-reduce:opacity-100` to disable heavy animations for users who prefer reduced motion.

## 6. CSS Architecture
- Use Tailwind CSS for 90% of styling.
- Use raw CSS Modules or `style={}` only for highly dynamic values (like scroll positions) that cannot be precompiled by Tailwind.
