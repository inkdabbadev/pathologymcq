import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "category"
  );
}

async function guard() {
  const admin = await getAdmin();
  if (!admin) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  const db = getSupabaseAdmin();
  if (!db)
    return { error: NextResponse.json({ message: "Supabase not configured" }, { status: 503 }) };
  return { db };
}

export async function POST(request: Request) {
  const g = await guard();
  if (g.error) return g.error;
  const { name } = (await request.json().catch(() => ({}))) as { name?: string };
  if (!name?.trim()) return NextResponse.json({ message: "Name is required" }, { status: 400 });

  const { data, error } = await g.db
    .from("categories")
    .insert({ name: name.trim(), slug: slugify(name) })
    .select("id,name,slug,created_at")
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ category: data });
}

export async function PATCH(request: Request) {
  const g = await guard();
  if (g.error) return g.error;
  const { id, name } = (await request.json().catch(() => ({}))) as {
    id?: string;
    name?: string;
  };
  if (!id || !name?.trim())
    return NextResponse.json({ message: "id and name are required" }, { status: 400 });
  const { data, error } = await g.db
    .from("categories")
    .update({ name: name.trim(), slug: slugify(name) })
    .eq("id", id)
    .select("id,name,slug,created_at")
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ category: data });
}

export async function DELETE(request: Request) {
  const g = await guard();
  if (g.error) return g.error;
  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });
  const { error } = await g.db.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
