import { NextResponse } from "next/server";

import { deletePost } from "@/lib/blocks/posts-store";
import { deletePageBlocks } from "@/lib/blocks/store";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string; post: string }> }
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug, post } = await params;
  await deletePost(slug, post);
  await deletePageBlocks(`${slug}/${post}`);
  return NextResponse.json({ ok: true });
}
