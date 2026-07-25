import path from "node:path";

import { NextResponse } from "next/server";

import { isAdminSession } from "@/lib/auth/admin-session";
import { PAGE_IMAGES_BUCKET, supabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "file required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ message: "unsupported file type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "file too large" }, { status: 413 });
  }

  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${crypto.randomUUID()}${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from(PAGE_IMAGES_BUCKET)
    .upload(filename, bytes, { contentType: file.type });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(PAGE_IMAGES_BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
