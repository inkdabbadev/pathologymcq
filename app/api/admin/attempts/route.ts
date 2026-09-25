import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });
  const { data, error } = await db
    .from("practice_attempts")
    .select("id,email,topic_slug,topic_label,score,total,created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ attempts: data });
}
