# Rule 80 — Free-Tier Guardrails (₹0 Rule)

## The absolute rule (🔒)
**NEVER add a payment method to any service used in this project.**
**NEVER add a dependency or binding that requires a paid plan.**
If a service demands payment to continue: **STOP and tell the owner. Do not work around it.**

## Forbidden services (require payment or have non-commercial restrictions)
| Service | Reason forbidden |
|---|---|
| Vercel (any plan) | Hobby is non-commercial only (ADR-002); Pro requires payment |
| Any Cloudflare paid plan feature | Only free tier features are allowed |
| Supabase | Second vendor; free tier requires monitoring; Postgres is overkill here |
| Any vector database (Pinecone, Weaviate, Qdrant, etc.) | Unnecessary complexity + paid tiers |
| Any email service (SendGrid, Resend, Postmark, etc.) | Requires payment for meaningful volume |
| OpenAI API | Pay-per-token, requires card |
| Any LLM API requiring a card | Even if "free tier" exists with a card on file |
| Cloudflare R2 file uploads | Not in v1 scope (ADR-013) |
| Any CDN or image optimisation service | Static export + self-hosted assets is the approach |

## Allowed services (verify current free limits before each use)
| Service | Free limit | Verify at |
|---|---|---|
| Cloudflare Workers | 100k req/day | developers.cloudflare.com/workers/platform/limits |
| Cloudflare D1 | 5 GB; 5M reads/day; 100k writes/day | developers.cloudflare.com/d1/platform/pricing |
| Groq | Free plan, no card | console.groq.com → Limits |
| GitHub | Public repo, Actions (verify free minutes) | github.com/pricing |
| Cloudflare Turnstile | Believed free ⚠️ | Cloudflare docs |
| Cloudflare Web Analytics | Believed free ⚠️ | Cloudflare docs |

## Free-tier tripwire (check:budget script must fail if)
- Cloudflare Worker bundle size exceeds 3 MiB (gzip) — the free tier limit
- Any new Cloudflare binding added that is not on the approved list (currently: D1 only)
- A new service appears in `wrangler.toml` with no row in `docs/verified-facts.md`
- Any npm package is added with a known paid-service dependency

## Maintenance responsibility (owner, not agent)
Run the `verify-free-tier` skill every 6 months.
If a limit changes: write an ADR update, switch via the adapter layer, keep the site static-first.
Record the result in `docs/verified-facts.md` with the date and source URL.
