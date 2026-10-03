# Verified Facts Log

> Re-verify date: **2027-04-03** (or sooner if something breaks).
> Many sources below were third-party summaries. Confirm on official pages before relying on them.

| Topic | What was found | Status | Where to confirm | Verified on |
|---|---|---|---|---|
| Groq free plan | Free tier with no card; rate-limited per model and per organisation; exact limits in Console → Limits | ✅ | console.groq.com → Limits | 2026-10-03 |
| Groq API compatibility / model names | OpenAI-compatible API; model names change frequently | ⚠️ verify at implementation | Groq docs | 2026-10-03 |
| Antigravity customisation | `AGENTS.md` read since IDE 1.20.5; `GEMINI.md` takes precedence; rules in `.agents/rules/`; max 12,000 chars per file; skills in `.agents/skills/<name>/SKILL.md`; workflows in `.agents/workflows/` | ✅ | antigravity.google/docs | 2026-10-03 |
| Vercel Hobby | Non-commercial use only; hard caps; not used in this project (ADR-002) | ✅ | vercel.com/pricing | 2026-10-03 |
| Cloudflare Workers free | 100,000 requests/day; resets 00:00 UTC | ✅ | developers.cloudflare.com/workers/platform/limits | 2026-10-03 |
| Cloudflare D1 free | 5 GB storage; 5 M rows read/day; 100 k rows written/day; "will always include D1" | ✅ | developers.cloudflare.com/d1/platform/pricing | 2026-10-03 |
| Cloudflare Access free | Up to 50 users; may require domain/IdP setup | ✅/⚠️ | developers.cloudflare.com/cloudflare-one | 2026-10-03 |
| Workers static assets vs Pages direction | ⚠️ Verify at project start which Cloudflare recommends for new projects | ⚠️ | Cloudflare docs | — |
| Turnstile / Web Analytics free | Believed free — not verified from official page | ⚠️ | Cloudflare docs | — |
| GitHub Actions minutes — public repos | Believed free — not verified from official page | ⚠️ | github.com/pricing | — |
| Auth.js / Better Auth | Auth.js is now maintained by Better Auth team; new projects recommended to start with Better Auth | ✅ | github.com/nextauthjs/next-auth; better-auth.com | 2026-10-03 |
| Better Auth + D1/Workers | Adapter/runtime details not verified | ⚠️ | Better Auth docs | — |
| GSAP | Entire toolset free including commercial use | ✅ | gsap.com/standard-license | 2026-10-03 |
| R3F v9 / React 19 / Three.js | R3F v9 pairs with React 19; WebGPU zero-config from three.js r171+ | ✅ | r3f.docs.pmnd.rs; three.js release notes | 2026-10-03 |
| Next.js static export | Supported; server features unavailable; Server Components run at build | ✅ | nextjs.org/docs/app/building-your-application/deploying/static-exports | 2026-10-03 |
| Cloudflare Pages + GitHub integration | ⚠️ Verify current recommended setup (Pages vs Workers static assets) | ⚠️ | Cloudflare docs | — |
| Awwwards scoring | Design 40 / Usability 30 / Creativity 20 / Content 10; ≥18 jurors; 6.5+ = Honorable Mention; submission fee ≈US$75 | ✅/⚠️ (fee) | awwwards.com | 2026-10-03 |
| GitHub Student Developer Pack — free domain | Free `.me` for one year; renewal is paid | ✅ | education.github.com/pack | 2026-10-03 |

## Account setup log

| Service | Account created? | Payment method added? | Notes |
|---|---|---|---|
| Cloudflare | ☐ TODO | MUST BE: No | Create at cloudflare.com — no card required |
| Groq | ☐ TODO | MUST BE: No | Create at console.groq.com |
| GitHub | ✅ Assumed existing | — | — |
