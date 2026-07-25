import { supabaseAdmin } from "@/lib/supabase/server";
import type { Block } from "@/lib/blocks/types";

export async function getPageBlocks(slug: string): Promise<Block[] | null> {
  const { data, error } = await supabaseAdmin
    .from("page_blocks")
    .select("blocks")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data?.blocks as Block[] | undefined) ?? null;
}

export async function savePageBlocks(slug: string, blocks: Block[]): Promise<void> {
  const { error } = await supabaseAdmin
    .from("page_blocks")
    .upsert({ slug, blocks, updated_at: new Date().toISOString() }, { onConflict: "slug" });

  if (error) throw error;
}

export async function deletePageBlocks(slug: string): Promise<void> {
  const { error } = await supabaseAdmin.from("page_blocks").delete().eq("slug", slug);
  if (error) throw error;
}
