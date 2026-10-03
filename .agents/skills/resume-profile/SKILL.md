# Skill: resume-profile

Create or tune a role-specific resume preset and verify it produces a correct PDF.

## Steps
1. Create or edit `content/resume-profiles/<role-id>.yml`.

2. Follow the schema (from MASTER_PLAN.md §6.3):
   ```yaml
   id: <role-id>                   # kebab-case, matches the file name
   label: <Human Readable Label>
   targetPages: 1                  # 1 for early-career
   tagWeights:
     ai: 3                         # role-relevant tags: 2–3
     ml: 3
     python: 2
     fullstack: 0.5                # unrelated tags: 0–0.5
   sectionLimits:
     projects: 4
     experience: 3
     certifications: 3
     achievements: 3
     skills: 12
   pin: []                         # always-include item IDs
   exclude: []                     # never-include item IDs
   summaryVariant: general         # which summary from profile.yml
   ```

3. Run `pnpm validate:content` — must pass.

4. Run `pnpm build:resumes` — PDF must be generated without errors.

5. **Open the PDF** and verify ALL of:
   - [ ] Page count ≤ `targetPages`
   - [ ] All standard headings present (Education, Experience, Projects, Skills)
   - [ ] Dates in `Mon YYYY – Mon YYYY` format
   - [ ] No icons-as-text, no tables for layout, no text in images
   - [ ] All bullet text comes from `content/` (not invented)
   - [ ] Selected bullets use the correct variant for this role

6. Run `pnpm test` — resume-engine snapshot test must pass.

7. If PDF overflows: lower `sectionLimits` or lower `resumeWeight` on lower-priority items.

## Planned presets (all created in Phase 4)
- `ai-engineer`
- `ml-research`
- `backend-engineer`
- `fullstack-developer`
- `mobile-developer`
- `general`
