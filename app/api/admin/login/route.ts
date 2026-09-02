import { NextResponse } from "next/server";

import { adminConfigured, checkCredentials, setAdminCookie } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const { username, password } = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  if (!adminConfigured()) {
    return NextResponse.json(
      { message: "Admin credentials are not configured on the server." },
      { status: 503 }
    );
  }
  if (!username || !password) {
    return NextResponse.json({ message: "Username and password are required." }, { status: 400 });
  }
  if (!checkCredentials(username, password)) {
    return NextResponse.json({ message: "Invalid username or password." }, { status: 401 });
  }

  await setAdminCookie(username.trim());
  return NextResponse.json({ admin: { username: username.trim() } });
}
