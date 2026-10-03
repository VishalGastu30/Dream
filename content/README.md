# Content directory — Phase 0 stub

All career content lives here as YAML and MDX files.
This is the single source of truth for all portfolio data.

See MASTER_PLAN.md §5 for the full content schema and requirements.
See .agents/rules/20-content-schema.md for rules.
See .agents/skills/add-content/SKILL.md for how to add content correctly.

## Directory structure (to be created in Phase 1)
- `profile.yml`                   — Personal info, social links, summary variants
- `story/`                        — StoryChapter files for the cinematic intro
- `experience/`                   — Work experience (YAML per employer)
- `projects/`                     — Projects (YAML + MDX case study per project)
- `education/`                    — Education entries
- `certifications/`               — Certifications and licences
- `hackathons/`                   — Hackathon participations
- `publications/`                 — Publications and talks
- `achievements/`                 — Awards, recognition
- `skills/`                       — Skill entries with proficiency levels
- `tags.yml`                      — Controlled tag vocabulary (all tags must be here)
- `github-exclude.yml`            — Repos to exclude from GitHub Galaxy scene
- `resume-profiles/`              — Role-specific resume presets
- `testimonials.snapshot.yml`     — Committed snapshot of approved testimonials
- `generated/`                    — Build artefacts (gitignored) — DO NOT edit by hand
