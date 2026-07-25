import { supabaseAdmin } from "@/lib/supabase/server";

export interface BlogPostMeta {
  slug: string;
  title: string;
  createdAt: string;
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "post"
  );
}

export async function listPosts(categorySlug: string): Promise<BlogPostMeta[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, title, created_at")
    .eq("category_slug", categorySlug)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    slug: row.slug,
    title: row.title,
    createdAt: row.created_at,
  }));
}

export async function getPost(
  categorySlug: string,
  postSlug: string
): Promise<BlogPostMeta | null> {
  const posts = await listPosts(categorySlug);
  return posts.find((p) => p.slug === postSlug) ?? null;
}

export async function createPost(categorySlug: string, title: string): Promise<BlogPostMeta> {
  const posts = await listPosts(categorySlug);

  const base = slugify(title);
  let slug = base;
  let i = 2;
  while (posts.some((p) => p.slug === slug)) {
    slug = `${base}-${i++}`;
  }

  const createdAt = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .insert({ category_slug: categorySlug, slug, title, created_at: createdAt });

  if (error) throw error;
  return { slug, title, createdAt };
}

export async function deletePost(categorySlug: string, postSlug: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .delete()
    .eq("category_slug", categorySlug)
    .eq("slug", postSlug);

  if (error) throw error;
}
