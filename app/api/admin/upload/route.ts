import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await db.storage.from("blog").upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  const { data } = db.storage.from("blog").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
