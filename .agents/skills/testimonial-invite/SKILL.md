# Skill: testimonial-invite

Run the full testimonial lifecycle: invite → submission → moderation → snapshot export.

## Creating an invite (owner in /studio)
1. Sign in to `/studio` with GitHub.
2. Click **New invite** → fill:
   - Label (e.g. "Prof. Sharma — ML course")
   - Relationship type: `Mentor | Manager | Teammate | Professor | Client`
   - Optional project link (an `id` from `content/projects/`)
   - Expiry (default 14 days)
3. Copy the one-time URL `/t/<token>` — shown **once only**.
4. Send the link to the person.

## What the submitter sees
- A static form at `/t/<token>` (no login required)
- Fields: name, role/designation, company, relationship, message (≤ 2000 chars)
- A Turnstile challenge
- An explicit consent checkbox (🔒 required — cannot be removed)

## Moderating a submission (owner in /studio)
1. Open `/studio` → Testimonials → Pending.
2. Review the submission.
3. You may correct typos only — do not change the meaning without notifying the person.
4. Click **Approve** → the testimonial becomes public via `GET /api/testimonials`.
5. The site shows a new transmission and the counter increments.

## Snapshot export (after every approval)
Run locally:
```bash
pnpm tsx scripts/export-testimonials.ts
```
Or trigger the CI action manually. This writes `content/testimonials.snapshot.json`.
Commit the updated snapshot: `chore: update testimonials snapshot`

## Removing a testimonial (on request)
1. `/studio` → Testimonials → Approved → **Reject/Delete**
2. Re-run snapshot export and commit
3. The person is removed from the site on next deployment
4. Honour removal requests within 24 hours (🔒)

## Consent rule (🔒)
Every approved testimonial MUST have:
- A consent timestamp stored in D1
- The submitter's explicit checkbox confirmation
These are non-negotiable and cannot be removed from the form.
