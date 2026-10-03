# Workflow: plan-task

Turn a roadmap item (e.g. P5-04) into a structured task file at `docs/tasks/T-xxxx.md`.

## Steps
1. Read the roadmap item from `docs/PORTFOLIO_MASTER_PLAN.md §14`.
2. Read the relevant plan sections referenced by that item.
3. Read the relevant `.agents/rules/` files for the feature area.
4. Identify **ALL** files that will be created or modified.
5. Write concrete, testable acceptance criteria (each verifiable with a command or screenshot).
6. Identify the allowed paths (which folders the agent may touch).
7. List explicit out-of-scope items.
8. Assign a task number: T-xxxx — next unused number in `docs/tasks/`.
9. Write the task file using the template below.
10. **Present the task file to the owner for review before any implementation begins.**

## Task file template
```markdown
# T-xxxx — <short title>

Roadmap ref: P<phase>-<item>
Branch: feat/t-xxxx-<slug>

## Goal
<one sentence outcome>

## Context (read first)
- docs/PORTFOLIO_MASTER_PLAN.md §<sections>
- .agents/rules/<files>
- Relevant ADRs: ADR-0xx

## Acceptance criteria (testable)
- [ ] ...
- [ ] DOM twin with identical information
- [ ] Reduced-motion + keyboard paths
- [ ] Budgets respected (list the numbers)
- [ ] Tests added/updated
- [ ] Assets recorded in assets/manifest.yml (if any)

## Allowed paths
apps/web/src/scenes/journey/**, packages/schema/**

## Out of scope
<explicit non-goals>

## Verification
pnpm check
pnpm test:e2e -g "<scene>"
Screenshots: desktop + mobile (attach)

## Open questions (agent writes here instead of guessing)
-

## Result (agent fills in after implementation)
- Summary:
- Files changed:
- Follow-ups:
```

## Task file location
`docs/tasks/T-xxxx.md` (where xxxx is zero-padded, e.g. T-0001.md)

## Critical rule
Do **NOT** begin implementation until the owner reviews and approves the task file.
