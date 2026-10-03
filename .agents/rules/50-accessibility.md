# Rule 50 — Accessibility

## Target
WCAG 2.2 Level AA — no exceptions.
axe-core: **0 serious or critical issues** on every page.

## Mandatory checklist for every UI task
- [ ] Semantic HTML structure: landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`), headings in document order, lists for lists
- [ ] Every image has alt text; empty string (`alt=""`) only if truly decorative
- [ ] Every interactive element is keyboard-reachable and operable with Enter/Space
- [ ] Focus is always visible: 2px solid `--signal` ring, never removed with `outline: none` without a visible replacement
- [ ] Hit area ≥ 44 × 44px for all interactive elements (WCAG 2.5.5)
- [ ] Colour contrast: `--text-0` on `--bg-0` must pass 4.5:1 (AA normal text), 3:1 (AA large text/UI)
- [ ] No information conveyed by colour alone
- [ ] Animated content: always respect `prefers-reduced-motion` (CSS `@media` AND JS guard before GSAP)
- [ ] No content flashes more than 3 times per second
- [ ] A skip link is visible on the first Tab press and targets `#main-content`
- [ ] `<html lang="en">` is set

## 3D / Canvas rules (🔒)
- Every 3D scene has a **DOM twin** with identical information — accessible even when JS is disabled or canvas fails
- The canvas element is `aria-hidden="true"` — screen readers never enter the canvas
- Users can **always** skip the cinematic layer: skip-intro button, Professional view toggle, keyboard shortcut
- Screen reader users should never get stuck; the entire site must be navigable without the canvas

## Forms
- Every `<input>` has a visible, associated `<label>` (not just a placeholder)
- Error messages are associated with the field via `aria-describedby`
- Required fields: marked with `aria-required="true"` AND a visible indicator (not colour alone)
- Consent checkbox is required for testimonial submission (🔒 — do not remove)

## Keyboard navigation
- Tab order must be logical (follows visual/reading order)
- Modals and dialogs: trap focus on open; return focus to trigger on close
- Command palette: opens with Ctrl/Cmd+K; fully keyboard-operable; traps focus; Escape closes it
- No keyboard traps (except intentional modal traps that have an escape path)

## Testing gates
- `pnpm check` includes axe-core via Playwright: **0 serious/critical findings required**
- Manual keyboard run-through before any visual task is marked done
- Screen reader smoke test (NVDA on Windows / VoiceOver on macOS) before each phase exit
