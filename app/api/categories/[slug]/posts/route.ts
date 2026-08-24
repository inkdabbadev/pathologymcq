import { NextResponse } from "next/server";

import { listPosts, createPost } from "@/lib/blocks/posts-store";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await listPosts(slug);
  return NextResponse.json({ posts });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await req.json().catch(() => null)) as { title?: string } | null;
  if (!body?.title?.trim()) {
    return NextResponse.json({ message: "title required" }, { status: 400 });
  }

  const post = await createPost(slug, body.title.trim());
  return NextResponse.json({ post });
}
