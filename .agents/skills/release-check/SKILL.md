# Skill: release-check

Full pre-release checklist. Run before every production deployment. No step may be skipped.

## Steps (in order — a failed step stops the release)

### 1. CI gates
- [ ] All CI gates are green on `main` (typecheck, lint, tests, build, budgets, e2e, axe, secret scan)

### 2. Lighthouse
- [ ] Lighthouse run recorded on the staging/preview URL:
  - Professional view: perf ≥ 90, a11y ≥ 95
  - Cinematic view: perf ≥ 80, a11y ≥ 95

### 3. Real-device pass
- [ ] At minimum: one low-end Android, one mid-range phone, one laptop
- [ ] Record make/model and results in `docs/perf-baseline.md`

### 4. Cross-browser
- [ ] Chrome ✓, Firefox ✓, Edge ✓
- [ ] Safari (if a device is available) ✓

### 5. Content freeze
- [ ] Every visible string proofread
- [ ] Every number verified (defensible in an interview)
- [ ] All links checked (no 404s)
- [ ] All alt text complete

### 6. verified-facts.md
- [ ] `docs/verified-facts.md` is < 30 days old (re-run `verify-free-tier` skill if not)

### 7. Git tag
```bash
git tag -a v<major>.<minor>.<patch> -m "Release vX.Y.Z: <one-line summary>"
git push origin v<major>.<minor>.<patch>
```

### 8. D1 backup
```bash
wrangler d1 export <database-name> --output backup-$(date +%Y%m%d).sql
```
Store the backup securely (private repo or encrypted artifact).

### 9. Secrets check
- [ ] No secrets committed (gitleaks clean)
- [ ] All secrets rotated if any were exposed since the last release

### 10. Deploy
```bash
git push origin main
```
CI/CD deploys automatically on push to main.

### 11. Production smoke tests
- [ ] Home page loads; LCP < 2.5s on throttled mobile
- [ ] A project page opens; case study is readable HTML
- [ ] A resume PDF downloads (test one preset)
- [ ] `GET /api/testimonials` returns JSON
- [ ] `/api/ask` responds or fails gracefully
- [ ] `/studio` returns 404 for an anonymous visitor

### 12. Post-release
- [ ] `CHANGELOG.md` updated
- [ ] GitHub profile README link updated
- [ ] LinkedIn and other profiles updated
