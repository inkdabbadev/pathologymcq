const WP_API_BASE = process.env.WP_API_BASE;

export interface WpRestResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Set when the request never reached WordPress (network error, unset base, bad JSON). */
  message?: string;
}

/** True when WP_API_BASE is configured — callers use this to short-circuit into mock mode. */
export function isWpConfigured(): boolean {
  return Boolean(WP_API_BASE);
}

/**
 * Server-only fetch against the WordPress REST API. Never throws — returns a typed
 * result so route handlers can branch on WP's real status codes (401 vs 200 vs
 * network failure) instead of catching exceptions.
 */
export async function wpRestFetch<T>(
  path: string,
  init?: RequestInit & { token?: string }
): Promise<WpRestResult<T>> {
  if (!WP_API_BASE) {
    return { ok: false, status: 503, data: null, message: "WP_API_BASE is not configured" };
  }

  const { token, headers, ...rest } = init ?? {};
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${WP_API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      cache: "no-store",
    });

    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }

    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      data: null,
      message: error instanceof Error ? error.message : "WordPress request failed",
    };
  }
}
