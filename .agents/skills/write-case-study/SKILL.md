# Skill: write-case-study

Turn rough notes into a structured MDX case study following the §5.5 format
from `docs/PORTFOLIO_MASTER_PLAN.md`.

## Structure (must follow exactly — every section is required)

### 1. Problem (2–3 sentences)
What was broken or missing in the world? Why did this need to exist?
Not "I built X" — "X was a problem because Y."

### 2. Constraints
Time, team size, tech limits, budget, anything that shaped the decisions.
Be honest — constraints make the decisions interesting.

### 3. Key decisions
For each major decision: what you chose AND why. Include alternatives considered and rejected.
This is the most technically credible section — spend time here.

### 4. Architecture
One diagram (Mermaid in MDX or a PNG/SVG in `assets/images/<id>/`).
Include the diagram file in the assets folder and log it in `assets/manifest.yml`.

### 5. Result
Numbers where honest. If you cannot cite a number, describe the qualitative outcome.
Never invent or round up metrics — these must be defensible in an interview.

### 6. What I'd do differently
Honest reflection. This is what makes the case study credible and shows growth.
Omitting this section makes the project look unexamined. It is mandatory.

### 7. Links
- Repo (GitHub)
- Demo (URL, if live)
- Video (YouTube unlisted embed — use a click-to-load facade, not autoplay)

### 8. Media
- Cover image: 1600×900 WebP (required)
- 1–3 screenshots (WebP, ≤ 300 KB each)
- Optional: ≤ 5 MB demo clip (lazy-loaded with poster image)
- All media added to `assets/images/<id>/` and logged in `assets/manifest.yml`

## Rules
- First person, plain language. Outcomes before technology.
- No buzzword soup ("leveraged cutting-edge AI to synergize...")
- Every number must be defensible in an interview
- Run `pnpm validate:content` after saving the MDX file
