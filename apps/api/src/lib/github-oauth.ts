/**
 * apps/api/src/lib/github-oauth.ts
 * GitHub OAuth 2.0 helpers (PKCE-free, server-side flow).
 *
 * Usage:
 *   1. Redirect user to getAuthorizationUrl(state)
 *   2. GitHub redirects back to /api/auth/callback?code=...&state=...
 *   3. Call exchangeCodeForToken(code) → access token
 *   4. Call getGithubUser(token) → { id, login }
 */

export function getAuthorizationUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user",
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeCodeForToken(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub token exchange failed: ${res.status}`);
  }

  const data = (await res.json()) as { access_token?: string; error?: string };
  if (data.error || !data.access_token) {
    throw new Error(`GitHub OAuth error: ${data.error ?? "no token"}`);
  }
  return data.access_token;
}

export async function getGithubUser(accessToken: string): Promise<{ id: number; login: string }> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "dream-portfolio/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub user fetch failed: ${res.status}`);
  }

  const user = (await res.json()) as { id: number; login: string };
  return { id: user.id, login: user.login };
}
