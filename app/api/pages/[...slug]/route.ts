import { NextResponse } from "next/server";

import { getPageBlocks, savePageBlocks } from "@/lib/blocks/store";
import type { Block } from "@/lib/blocks/types";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const blocks = await getPageBlocks(slug.join("/"));
  return NextResponse.json({ blocks });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await req.json().catch(() => null)) as { blocks?: Block[] } | null;
  if (!body || !Array.isArray(body.blocks)) {
    return NextResponse.json({ message: "blocks array required" }, { status: 400 });
  }

  await savePageBlocks(slug.join("/"), body.blocks);
  return NextResponse.json({ ok: true });
}
