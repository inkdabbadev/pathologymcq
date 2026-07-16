import { NextResponse } from "next/server";

import { clearSessionCookies, getSessionToken, getSessionUser } from "@/lib/auth/session";
import { isWpConfigured, wpRestFetch } from "@/lib/auth/wp-rest";

export async function GET() {
  const token = await getSessionToken();
  const user = await getSessionUser();

  if (!token || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!isWpConfigured()) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const result = await wpRestFetch("/jwt-auth/v1/token/validate", {
    method: "POST",
    token,
  });

  if (!result.ok) {
    await clearSessionCookies();
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
