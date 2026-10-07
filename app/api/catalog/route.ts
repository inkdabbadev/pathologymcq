import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabasePublic } from "@/lib/supabase/public";
import { CATALOG_KINDS, ensureSeeded, type CatalogKind } from "@/lib/catalog/seed";

// Public read of a catalog kind. Auto-seeds from mock data on first access.
export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind") as CatalogKind | null;
  if (!kind || !CATALOG_KINDS.includes(kind)) {
    return NextResponse.json({ message: "Unknown catalog kind" }, { status: 400 });
  }
  const db = getSupabasePublic();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

  const read = () => db
    .from("catalog_items")
    .select("data,position")
    .eq("kind", kind)
    .order("position", { ascending: true });
  let { data, error } = await read();
  if (!error && data?.length === 0) {
    // Preserve first-run setup, without making public reads depend on admin keys.
    // Only seed the same project that the public client is reading.
    const adminUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      if (adminUrl === process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const adminDb = getSupabaseAdmin();
        if (adminDb) {
          await ensureSeeded(adminDb, kind);
          ({ data, error } = await read());
        }
      }
    } catch {
      // Missing/invalid admin credentials must not prevent public catalog reads.
    }
  }
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ items: (data ?? []).map((r) => r.data) });
}
