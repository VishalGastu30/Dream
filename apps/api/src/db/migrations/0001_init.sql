-- 0001_init.sql — Dream API initial schema
-- Run locally: pnpm -F api db:migrate
-- Run on Cloudflare: wrangler d1 execute dream-db --file=src/db/migrations/0001_init.sql

-- ─────────────────────────────────────────────────────────────────────────────
-- Testimonials
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id           TEXT    PRIMARY KEY,
  invite_id    TEXT    NOT NULL,
  name         TEXT    NOT NULL,
  designation  TEXT    NOT NULL,
  company      TEXT    NOT NULL,
  relationship TEXT    NOT NULL CHECK(relationship IN ('mentor','manager','teammate','professor','client')),
  message      TEXT    NOT NULL CHECK(length(message) BETWEEN 10 AND 1200),
  project_id   TEXT,
  consent      INTEGER NOT NULL DEFAULT 0,  -- 1 = consent given
  status       TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  created_at   TEXT    NOT NULL,
  approved_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_invite ON testimonials(invite_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Invite tokens
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invites (
  id           TEXT    PRIMARY KEY,
  token_hash   TEXT    NOT NULL UNIQUE,  -- SHA-256 of the one-time token
  label        TEXT    NOT NULL,
  relationship TEXT    NOT NULL,
  project_id   TEXT,
  expires_at   TEXT    NOT NULL,
  used         INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invites_hash ON invites(token_hash);

-- ─────────────────────────────────────────────────────────────────────────────
-- Contact inbox
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  message    TEXT    NOT NULL CHECK(length(message) BETWEEN 10 AND 2000),
  read       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_read ON contact_messages(read);

-- ─────────────────────────────────────────────────────────────────────────────
-- AI usage counter (Phase 7)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_usage (
  date  TEXT    PRIMARY KEY,  -- YYYY-MM-DD
  count INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Rate limits (daily rolling buckets)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  key      TEXT    PRIMARY KEY,  -- SHA-256(route + date + salted-ip)
  count    INTEGER NOT NULL DEFAULT 0,
  reset_at TEXT    NOT NULL
);
