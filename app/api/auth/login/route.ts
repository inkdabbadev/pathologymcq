import { NextResponse } from "next/server";

import { setSessionCookies } from "@/lib/auth/session";
import { isWpConfigured, wpRestFetch } from "@/lib/auth/wp-rest";

interface LoginBody {
  email?: string;
  password?: string;
}

interface JwtTokenSuccess {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

interface JwtTokenError {
  code: string;
  message: string;
}

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as LoginBody;

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
  }

  if (!isWpConfigured()) {
    return NextResponse.json({ mock: true }, { status: 503 });
  }

  const result = await wpRestFetch<JwtTokenSuccess | JwtTokenError>("/jwt-auth/v1/token", {
    method: "POST",
    body: JSON.stringify({ username: email, password }),
  });

  if (!result.ok || !result.data || !("token" in result.data)) {
    const message =
      result.data && "message" in result.data
        ? result.data.message
        : result.message ?? "Login failed";
    return NextResponse.json({ message }, { status: result.status || 401 });
  }

  const { token, user_email, user_display_name } = result.data;
  await setSessionCookies(token, { email: user_email, name: user_display_name });

  return NextResponse.json({ user: { email: user_email, name: user_display_name } });
}
