# Rule 60 — Security, Privacy & Secrets

## Secret management (🔒)
- **NEVER commit real secrets**, API keys, passwords, or tokens to Git
- `.env.example` is committed with placeholder values only
- `.env` and `.env.*` are in `.gitignore` — verify this before every PR
- Use platform secrets (Cloudflare dashboard / GitHub Actions secrets) for all runtime values
- `gitleaks` (or equivalent) runs in CI; any finding **blocks the merge**

## Required secrets (listed in .env.example)
```
SITE_URL                    = URL of the deployed site
GROQ_API_KEY                = gsk_...
GITHUB_OAUTH_CLIENT_ID      = GitHub OAuth app client ID
GITHUB_OAUTH_CLIENT_SECRET  = GitHub OAuth app client secret
AUTH_SECRET                 = random 32+ byte hex string
OWNER_GITHUB_ID             = numeric GitHub user ID (NOT username)
TURNSTILE_SECRET            = Cloudflare Turnstile secret key
# GITHUB_TOKEN set as Actions secret — not in .env.example
```

## HTTP security headers (must be set on every response)
```
Content-Security-Policy:     strict; tighten in Phase 3 when all sources are known
X-Frame-Options:             DENY
X-Content-Type-Options:      nosniff
Referrer-Policy:             strict-origin-when-cross-origin
Permissions-Policy:          camera=(), microphone=(), geolocation=()
Strict-Transport-Security:   max-age=63072000; includeSubDomains; preload
```
For static export: set via Cloudflare Pages `_headers` file.
For API routes: set in the Hono middleware.

## Auth rules (🔒)
- Only `OWNER_GITHUB_ID` can authenticate — no other users, no sign-ups
- Session tokens: `httpOnly`, `secure`, `sameSite=strict` cookies
- `/studio` returns **404** for unauthenticated requests (do not reveal its existence to crawlers)
- `noindex` on `/studio` in robots.txt and `<meta name="robots" content="noindex">`

## API input validation rules
- Validate ALL inputs with Zod before any processing
- Strip control characters from all text inputs
- Length limits: AI input ≤ 500 chars, testimonial ≤ 2000 chars, contact ≤ 5000 chars
- Rate limit every public endpoint (per-IP via CF headers or salted daily hash)
- Turnstile token required on: testimonial submission, contact form, `/api/ask`

## Privacy rules (🔒)
- No personal data beyond what is needed
- No IP addresses in logs (log only aggregate counts)
- No cookies; no third-party trackers; analytics is cookieless
- Testimonial consent: explicit checkbox required; consent timestamp stored; deletable on request
- `llm-context.json` contains ONLY published public content (visibility flags respected)
- Free-tier AI providers may have weaker privacy guarantees — check Groq's data-usage terms before launch

## Dependency security
- `pnpm audit` runs weekly in CI; no high/critical unpatched CVEs (or documented exception)
- No dependencies with GPL/AGPL licences unless carefully reviewed and documented in the task file
