import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Static-credential admin auth.
 * Credentials live in env (ADMIN_USERNAME / ADMIN_PASSWORD). A successful login
 * sets a signed, httpOnly session cookie (HMAC-SHA256 with ADMIN_SESSION_SECRET).
 * No password or secret is ever exposed to the browser.
 */

export const ADMIN_COOKIE = "pmcq_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

/** Constant-time-ish credential check. */
export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || !p) return false;
  const okU = safeEqual(username.trim(), u);
  const okP = safeEqual(password, p);
  return okU && okP;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** token = base64url(json).signature */
function makeToken(username: string): string {
  const body = JSON.stringify({ u: username, exp: Date.now() + MAX_AGE * 1000 });
  const b64 = Buffer.from(body).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

export function verifyToken(token: string | undefined | null): { username: string } | null {
  if (!token || !token.includes(".")) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = sign(b64);
  if (!safeEqual(sig, expected)) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(b64, "base64url").toString()) as {
      u: string;
      exp: number;
    };
    if (!u || typeof exp !== "number" || Date.now() > exp) return null;
    return { username: u };
  } catch {
    return null;
  }
}

export async function setAdminCookie(username: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, makeToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

/** Read the current admin from the request cookies (server only). */
export async function getAdmin(): Promise<{ username: string } | null> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

/** Throwing guard for API routes. Returns the admin or null. */
export async function requireAdmin(): Promise<{ username: string } | null> {
  return getAdmin();
}
