import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const POST_SELECT =
  "id,title,slug,excerpt,cover_image,category_id,status,content,created_at,updated_at,category:categories(id,name,slug)";

async function guard() {
  const admin = await getAdmin();
  if (!admin) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  const db = getSupabaseAdmin();
  if (!db)
    return { error: NextResponse.json({ message: "Supabase not configured" }, { status: 503 }) };
  return { db };
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g.error) return g.error;
  const { id } = await ctx.params;
  const patch = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Whitelist updatable fields.
  const allowed = ["title", "excerpt", "cover_image", "category_id", "status", "content"];
  const clean: Record<string, unknown> = {};
  for (const k of allowed) if (k in patch) clean[k] = patch[k];

  const { data, error } = await g.db
    .from("posts")
    .update(clean)
    .eq("id", id)
    .select(POST_SELECT)
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ post: data });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g.error) return g.error;
  const { id } = await ctx.params;
  const { error } = await g.db.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
