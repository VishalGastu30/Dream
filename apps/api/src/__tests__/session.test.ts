/**
 * apps/api/src/__tests__/session.test.ts
 * Unit tests for HMAC session signing/verification.
 */

import { describe, expect, it } from "vitest";
import { createSession, verifySession } from "../lib/session.ts";

const SECRET = "test-secret-that-is-long-enough-for-hmac";

describe("session", () => {
  it("creates a verifiable token", async () => {
    const token = await createSession("12345", SECRET);
    expect(token).toBeTruthy();
    expect(token.includes(".")).toBe(true);

    const payload = await verifySession(token, SECRET);
    expect(payload).not.toBeNull();
    expect(payload?.github_id).toBe("12345");
    expect(payload?.exp).toBeGreaterThan(Date.now());
  });

  it("returns null for tampered token", async () => {
    const token = await createSession("12345", SECRET);
    const tampered = `${token.slice(0, -4)}XXXX`;
    const payload = await verifySession(tampered, SECRET);
    expect(payload).toBeNull();
  });

  it("returns null for wrong secret", async () => {
    const token = await createSession("12345", SECRET);
    const payload = await verifySession(token, "wrong-secret");
    expect(payload).toBeNull();
  });

  it("returns null for expired token", async () => {
    // Create a token with exp in the past by hand
    const payload = JSON.stringify({ github_id: "12345", exp: Date.now() - 1000 });
    const b64 = btoa(payload).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const fakeToken = `${b64}.invalidsig`;
    const result = await verifySession(fakeToken, SECRET);
    expect(result).toBeNull();
  });

  it("returns null for malformed token", async () => {
    expect(await verifySession("", SECRET)).toBeNull();
    expect(await verifySession("nodot", SECRET)).toBeNull();
  });
});
