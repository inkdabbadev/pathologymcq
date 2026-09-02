import { NextResponse } from "next/server";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { CATALOG_KINDS, type CatalogKind } from "@/lib/catalog/seed";

async function guard() {
  const admin = await getAdmin();
  if (!admin) return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  const db = getSupabaseAdmin();
  if (!db)
    return { error: NextResponse.json({ message: "Supabase not configured" }, { status: 503 }) };
  return { db };
}

interface Item {
  id: string;
  slug?: string | null;
  category?: string | null;
  position?: number;
  data: unknown;
}

// Upsert a catalog item (create or update).
export async function POST(request: Request) {
  const g = await guard();
  if (g.error) return g.error;
  const { kind, item } = (await request.json().catch(() => ({}))) as {
    kind?: CatalogKind;
    item?: Item;
  };
  if (!kind || !CATALOG_KINDS.includes(kind) || !item?.id) {
    return NextResponse.json({ message: "kind and item.id are required" }, { status: 400 });
  }
  const row = {
    kind,
    id: item.id,
    slug: item.slug ?? null,
    category: item.category ?? null,
    position: typeof item.position === "number" ? item.position : Date.now(),
    data: item.data,
    updated_at: new Date().toISOString(),
  };
  const { error } = await g.db.from("catalog_items").upsert(row, { onConflict: "kind,id" });
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, item: item.data });
}

export async function DELETE(request: Request) {
  const g = await guard();
  if (g.error) return g.error;
  const { kind, id } = (await request.json().catch(() => ({}))) as {
    kind?: CatalogKind;
    id?: string;
  };
  if (!kind || !id) return NextResponse.json({ message: "kind and id required" }, { status: 400 });
  const { error } = await g.db.from("catalog_items").delete().eq("kind", kind).eq("id", id);
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
