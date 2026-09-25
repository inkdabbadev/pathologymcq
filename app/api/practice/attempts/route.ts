import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { practiceEmailSchema } from "@/lib/validation/practice";

// Public: record a completed practice attempt.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    topicSlug?: string;
    topicLabel?: string;
    score?: number;
    total?: number;
  };
  const email = practiceEmailSchema.safeParse({ email: body.email });
  const { topicSlug, topicLabel, score, total } = body;
  if (
    !email.success ||
    !topicSlug ||
    !topicLabel ||
    !Number.isInteger(score) ||
    !Number.isInteger(total) ||
    score! < 0 ||
    total! <= 0 ||
    score! > total!
  ) {
    return NextResponse.json({ message: "Invalid attempt" }, { status: 400 });
  }
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });
  const { error } = await db.from("practice_attempts").insert({
    email: email.data.email.trim().toLowerCase(),
    topic_slug: topicSlug.slice(0, 200),
    topic_label: topicLabel.slice(0, 200),
    score,
    total,
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
