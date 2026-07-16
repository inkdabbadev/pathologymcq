import { NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth/session";
import { wpRestFetch } from "@/lib/auth/wp-rest";

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const result = await wpRestFetch("/custom-tutor/v1/courses", { token });

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message ?? "Failed to load enrolled courses" },
      { status: result.status || 502 }
    );
  }

  return NextResponse.json(result.data);
}
