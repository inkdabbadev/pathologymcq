import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { deleteDziBatch, dziStorage, listDziUploads, validDziId } from "@/lib/dzi/storage";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });
  try {
    return NextResponse.json({ uploads: await listDziUploads(dziStorage(db)) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not load uploads" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || !validDziId(body.id)) {
    return NextResponse.json({ message: "Invalid slide id" }, { status: 400 });
  }
  try {
    return NextResponse.json(await deleteDziBatch(dziStorage(db), body.id));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not delete slide" }, { status: 500 });
  }
}
