import { cookies } from "next/headers";

export const SESSION_COOKIE = "pmcq_session";
export const USER_COOKIE = "pmcq_user";

export interface SessionUser {
  email: string;
  name?: string;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days — aligned to typical JWT expiry

export async function setSessionCookies(token: string, user: SessionUser) {
  const store = await cookies();
  const shared = {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
  store.set(SESSION_COOKIE, token, shared);
  store.set(USER_COOKIE, JSON.stringify(user), shared);
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(USER_COOKIE);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
