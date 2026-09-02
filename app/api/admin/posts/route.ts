import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const POST_SELECT =
  "id,title,slug,excerpt,cover_image,category_id,status,content,created_at,updated_at,category:categories(id,name,slug)";

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || "post"
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

// Admin list — includes drafts.
export async function GET() {
  const g = await guard();
  if (g.error) return g.error;
  const { data, error } = await g.db
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(request: Request) {
  const g = await guard();
  if (g.error) return g.error;
  const { title, categoryId } = (await request.json().catch(() => ({}))) as {
    title?: string;
    categoryId?: string | null;
  };
  const t = title?.trim() || "Untitled post";
  const slug = `${slugify(t)}-${Math.random().toString(36).slice(2, 6)}`;
  const { data, error } = await g.db
    .from("posts")
    .insert({ title: t, slug, category_id: categoryId || null, status: "draft", content: [] })
    .select(POST_SELECT)
    .single();
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ post: data });
}
