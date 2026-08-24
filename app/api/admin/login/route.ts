import { NextResponse } from "next/server";

import { checkAdminCredentials, createAdminSession } from "@/lib/auth/admin-session";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = body?.username?.trim();
  const password = body?.password;

  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
  }

  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
