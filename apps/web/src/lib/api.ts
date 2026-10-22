/**
 * apps/web/src/lib/api.ts
 * Typed API client helper for calling the Hono Worker from the Next.js web app.
 * Reads NEXT_PUBLIC_API_URL from env (set to http://localhost:8787 in .env.local).
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`;
  return fetch(url, {
    credentials: "include", // send session cookie
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error((err as { error: string }).error ?? "API error"), {
      status: res.status,
    });
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error((err as { error: string }).error ?? "API error"), {
      status: res.status,
    });
  }
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error((err as { error: string }).error ?? "API error"), {
      status: res.status,
    });
  }
  return res.json() as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await apiFetch(path, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error((err as { error: string }).error ?? "API error"), {
      status: res.status,
    });
  }
}
