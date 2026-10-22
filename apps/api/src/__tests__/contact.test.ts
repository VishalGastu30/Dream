/**
 * apps/api/src/__tests__/contact.test.ts
 * Unit tests for POST /api/contact using the Hono test helper.
 */

import { describe, expect, it, vi } from "vitest";
import { createApp } from "../app.ts";

// Minimal D1 mock
function makeD1(firstResult: unknown = null) {
  const stmt = {
    bind: () => stmt,
    run: vi.fn().mockResolvedValue({ meta: { changes: 1 } }),
    first: vi.fn().mockResolvedValue(firstResult),
    all: vi.fn().mockResolvedValue({ results: [] }),
  };
  return { prepare: () => stmt };
}

function makeEnv(overrides: Record<string, unknown> = {}) {
  return {
    DB: makeD1(),
    SITE_URL: "http://localhost:3000",
    ENVIRONMENT: "development",
    AUTH_SECRET: "test-secret-long-enough-for-hmac-test",
    OWNER_GITHUB_ID: "99999",
    GITHUB_OAUTH_CLIENT_ID: "test",
    GITHUB_OAUTH_CLIENT_SECRET: "test",
    DEV_BYPASS_AUTH: "true",
    GROQ_API_KEY: "",
    GROQ_MODEL: "test",
    ENABLE_ASK_ME: "false",
    AI_DAILY_CAP: "200",
    ...overrides,
  };
}

describe("POST /api/contact", () => {
  const app = createApp();

  it("accepts a valid message", async () => {
    const res = await app.request(
      "/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "Hello this is a test message!",
        }),
      },
      makeEnv(),
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });

  it("rejects empty name", async () => {
    const res = await app.request(
      "/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", email: "x@x.com", message: "hello!" }),
      },
      makeEnv(),
    );
    expect(res.status).toBe(400);
  });

  it("rejects invalid email", async () => {
    const res = await app.request(
      "/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test", email: "not-an-email", message: "hello world!" }),
      },
      makeEnv(),
    );
    expect(res.status).toBe(400);
  });

  it("rejects message that is too short", async () => {
    const res = await app.request(
      "/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test", email: "x@x.com", message: "Hi" }),
      },
      makeEnv(),
    );
    expect(res.status).toBe(400);
  });

  it("silently ignores honeypot-filled submissions", async () => {
    const res = await app.request(
      "/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Bot",
          email: "bot@spam.com",
          message: "This is spam content here!",
          website: "http://spam.com",
        }),
      },
      makeEnv(),
    );
    // Should return 200 OK but silently drop it
    expect(res.status).toBe(200);
  });
});

describe("GET /api/health", () => {
  const app = createApp();

  it("returns healthy", async () => {
    const res = await app.request("/api/health", {}, makeEnv());
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });
});

describe("GET /api/auth/me", () => {
  const app = createApp();

  it("returns 401 without session cookie", async () => {
    const res = await app.request("/api/auth/me", {}, makeEnv());
    expect(res.status).toBe(401);
  });
});

describe("POST /api/auth/dev-login", () => {
  const app = createApp();

  it("creates session in dev mode", async () => {
    const res = await app.request("/api/auth/dev-login", { method: "POST" }, makeEnv());
    expect(res.status).toBe(200);
    // Should set Set-Cookie header
    const cookie = res.headers.get("Set-Cookie");
    expect(cookie).toBeTruthy();
    expect(cookie).toContain("dream_session=");
  });

  it("rejects in production mode", async () => {
    const res = await app.request(
      "/api/auth/dev-login",
      { method: "POST" },
      makeEnv({ ENVIRONMENT: "production", DEV_BYPASS_AUTH: undefined }),
    );
    expect(res.status).toBe(403);
  });
});
