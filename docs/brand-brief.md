# Brand Brief — Vishal Gastu // Digital Universe

> ✅ **Owner decisions recorded — 2026-10-03**
> Moodboard is the only remaining open item before Phase 2 can begin.

---

## Name treatment

**Primary (hero / dominant presence):** `VISHAL GASTU`
All-caps. Used exactly once per page — at the top of the hero — to establish dominant presence.
Everywhere else (navigation, meta, resume header, OG tags): `Vishal Gastu` (title case).

> **Rule for agents:** Never render the name in all-caps more than once per page.
> Never truncate to initials unless in a very constrained space (e.g. mobile favicon badge).

---

## Three adjectives (what the site should feel like)

1. **Refined** — premium in every detail; nothing feels accidental or cheap
2. **Serene** — soothing to look at; reduces friction so people stay longer
3. **Luminous** — mesmerizing and beautiful; light behaves like something alive

### What these mean for design decisions
- **Refined:** tight spacing, deliberate typography, no visual noise, consistent micro-details
- **Serene:** low contrast aggression (no hard colour clashes), calm motion pacing, generous negative space, never blinking or pulsing excessively
- **Luminous:** glows and blooms are subtle and controlled — they attract, they don't assault

---

## Three anti-adjectives (what it must NOT feel like)

1. **Cluttered** — if in doubt, remove it
2. **Blinding** — no saturated colour at high area; glows that cause eye fatigue are forbidden
3. **Cheap** — inconsistent spacing, mismatched weights, default browser aesthetics, low-effort animation

### What these mean for design decisions
- Every element earns its place — question anything that doesn't add meaning
- Glows/blooms: `spread < 20px`, `opacity < 0.6`. Never use saturated colours at large area.
- The signal accent (`--signal`) must glow, not flash. Motion must decelerate smoothly.

---

## Accent colour decision

**Decision: `#F2F4F8`** (luminous near-white — "the ghost light")

This replaces the default cyan `#6EE7F9`. The signal dot, focus rings, and interactive highlights are all near-white — not bright colour. This creates a high-contrast-but-serene interaction language.

> **Glow note:** Near-white on a near-black background has no colour cast, which makes the bloom effect feel ethereal rather than technological. The dot should glow like a diffused light source, not like a neon sign.

**Contrast on `#05060A`:** `#F2F4F8` on `#05060A` → very high (> 18:1). ✅ Passes all WCAG levels.

**Updated token:** `--signal: #F2F4F8` (was `#6EE7F9`)

**For the ember highlight** (`--ember: #FFB86B`): kept as-is — the warm amber is used very sparingly and pairs well with the cold near-white/dark-background palette.

---

## Display typeface decision

**Decision: Clash Display**

- **Source:** Fontshare (fontshare.com/fonts/clash-display) — no manual download needed
- **Licence:** ITF Free Font Licence — free for personal and commercial use ✅
- **Usage:** hero name (`VISHAL GASTU`), section headings, pull quotes, large numerics
- **Self-hosting plan (Phase 3):** download WOFF2 variable font → serve from `/public/fonts/` → no third-party font requests at runtime

> Agent note: verify Fontshare's CDN ToS and the current ITF licence at implementation time.
> Download the variable font file at Phase 3 start and add to `assets/manifest.yml`.

---

## Body typeface decision

**Decision: DM Sans**

- **Source:** Google Fonts (open source) — self-host WOFF2 in Phase 3
- **Licence:** SIL OFL ✅
- **Usage:** paragraphs, case study body, UI labels, metadata text
- **Mono (unchanged):** JetBrains Mono — HUD labels, code snippets

---

## Tagline

> *"Creating what doesn't exist yet, and building it well enough to change what comes next."*

**Usage:**
- Below `VISHAL GASTU` in the hero (smaller, `--text-1` colour, `DM Sans`)
- OG/Twitter meta description (truncated if needed to 155 chars)
- Resume summary opening line (optional, role-dependent)

---

## Moodboard

**Stitch Design Sprint (Generated via MCP):** Completed ✅
All visual references have been generated and exported to `docs/storyboards/`.
This replaces the manual Figma moodboard requirement.

### Generated References
- Hero (`hero.png`)
- Professional Home (`professional_home.png`)
- Case Study (`case_study.png`)
- Resume Forge (`resume_forge.png`)
- Experience Timeline (`experience_timeline.png`)
- Transmissions (`transmissions.png`)
- Contact Form (`contact_form.png`)
- Command Palette (`command_palette.png`)
- 404 Page (`404_page.png`)
- Mobile Hero (`mobile_hero.png`)
- Projects Grid (`projects_grid.png`)
- Studio Dashboard (`studio_dashboard.png`)

---

## Open questions

- [x] Name treatment decided — `VISHAL GASTU` (hero) / `Vishal Gastu` (everywhere else)
- [x] Adjectives/anti-adjectives finalised
- [x] Display typeface — Clash Display (Fontshare, ITF Free)
- [x] Body typeface — DM Sans (Google Fonts, SIL OFL)
- [x] Accent colour — `#F2F4F8` near-white signal
- [x] Tagline written
- [x] Moodboard built (via Stitch MCP) — **All Blockers Cleared for Phase 1/2**
