import { NextResponse } from "next/server";

import { getSessionToken } from "@/lib/auth/session";
import { wpRestFetch } from "@/lib/auth/wp-rest";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getSessionToken();

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const result = await wpRestFetch(`/tutor/v1/course-contents/${id}`, { token });

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message ?? "Failed to load course content" },
      { status: result.status || 502 }
    );
  }

  return NextResponse.json(result.data);
}
