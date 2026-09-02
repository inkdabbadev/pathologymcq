import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { CATALOG_KINDS, ensureSeeded, type CatalogKind } from "@/lib/catalog/seed";

// Public read of a catalog kind. Auto-seeds from mock data on first access.
export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind") as CatalogKind | null;
  if (!kind || !CATALOG_KINDS.includes(kind)) {
    return NextResponse.json({ message: "Unknown catalog kind" }, { status: 400 });
  }
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

  try {
    await ensureSeeded(db, kind);
  } catch {
    // Seeding is best-effort; still try to return whatever exists.
  }

  const { data, error } = await db
    .from("catalog_items")
    .select("data,position")
    .eq("kind", kind)
    .order("position", { ascending: true });
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ items: (data ?? []).map((r) => r.data) });
}
