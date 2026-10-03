# Skill: verify-free-tier

Re-check every free-tier limit in MASTER_PLAN.md §3.1 against official pages.
Run every 6 months, or immediately when something breaks or a service announces changes.

## Steps
For each service in `docs/verified-facts.md`:
1. Open the official pricing/limits page (URL in the table).
2. Confirm the limit hasn't changed.
3. If changed: update `docs/verified-facts.md`, write a one-line ADR entry, check if the adapter layer or Plan B needs activating.

## Services to check (in order)
1. **Cloudflare Workers** free limits → developers.cloudflare.com/workers/platform/limits
2. **Cloudflare D1** free limits → developers.cloudflare.com/d1/platform/pricing
3. **Cloudflare Pages/static assets** direction — which does Cloudflare recommend? → developers.cloudflare.com
4. **Cloudflare Turnstile** — is it free? → developers.cloudflare.com/turnstile/
5. **Cloudflare Web Analytics** — is it free? → developers.cloudflare.com/analytics/web-analytics/
6. **Groq** free plan limits → console.groq.com → Limits
7. **Groq model names** (they change!) → console.groq.com → Models
8. **GSAP licence** → gsap.com/standard-license/
9. **Better Auth** licence + D1 adapter support → better-auth.com
10. **R3F v9** + React version pairing → r3f.docs.pmnd.rs v9 migration guide
11. **GitHub Actions** free minutes for public repos → github.com/pricing
12. **GitHub Student Developer Pack** domain offer → education.github.com/pack

## Output
Update `docs/verified-facts.md`:
- Change ⚠️ to ✅ if verified correct, or to ❌ if the limit has changed unfavourably
- Record the date verified in the table
- Update the "Re-verify date" at the top to 6 months from today
- Add a new row for any service that wasn't previously tracked

If a limit has changed unfavourably:
- Activate the Plan B (adapter layer or fallback host)
- Write an ADR entry: one sentence describing what changed and what was done
- Update the `docs/runbooks/` with the new procedure if applicable
