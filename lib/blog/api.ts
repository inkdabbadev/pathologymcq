"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Block, BlogPost, Category, PostStatus } from "@/lib/blog/types";

/**
 * Blog data layer — Supabase backed.
 * Public reads use the anon key (RLS: published only). Admin reads + all writes
 * go through /api/admin/* routes (admin cookie + service role).
 */

const POST_SELECT =
  "id,title,slug,excerpt,external_url,additional_category_ids,cover_image,category_id,status,content,created_at,updated_at,category:categories(id,name,slug)";

function anon() {
  const c = getSupabaseBrowser();
  if (!c) throw new Error("Supabase is not configured");
  return c;
}

async function apiJson<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error((json as { message?: string }).message ?? `Request failed (${res.status})`);
  return json as T;
}

// ---- Public reads (anon key) ----------------------------------------------
export async function listCategories(): Promise<Category[]> {
  const { data, error } = await anon()
    .from("categories")
    .select("id,name,slug,created_at")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await anon()
    .from("categories")
    .select("id,name,slug,created_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Category) ?? null;
}

export async function listPublishedPosts(categorySlug?: string): Promise<BlogPost[]> {
  const { data, error } = await anon()
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  let rows = (data ?? []) as unknown as BlogPost[];
  const categoryId = categorySlug ? (await getCategoryBySlug(categorySlug))?.id : null;
  if (categorySlug) rows = rows.filter((p) => p.category?.slug === categorySlug || p.additional_category_ids?.includes(categoryId ?? ""));
  return rows;
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await anon()
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as BlogPost) ?? null;
}

// ---- Admin reads (via API, includes drafts) -------------------------------
export async function listAdminPosts(categorySlug?: string): Promise<BlogPost[]> {
  const res = await fetch("/api/admin/posts", { cache: "no-store" });
  const { posts } = await apiJson<{ posts: BlogPost[] }>(res);
  const categoryId = categorySlug ? (await getCategoryBySlug(categorySlug))?.id : null;
  return categorySlug ? posts.filter((p) => p.category?.slug === categorySlug || p.additional_category_ids?.includes(categoryId ?? "")) : posts;
}

export async function getAdminPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await listAdminPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// ---- Admin writes (via API, service-role backed) --------------------------
export async function createCategory(name: string): Promise<Category> {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const { category } = await apiJson<{ category: Category }>(res);
  return category;
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const res = await fetch("/api/admin/categories", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });
  const { category } = await apiJson<{ category: Category }>(res);
  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch("/api/admin/categories", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  await apiJson(res);
}

export async function createPost(input: {
  title: string;
  categoryId?: string | null;
}): Promise<BlogPost> {
  const res = await fetch("/api/admin/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.title, categoryId: input.categoryId ?? null }),
  });
  const { post } = await apiJson<{ post: BlogPost }>(res);
  return post;
}

export async function updatePost(
  id: string,
  patch: Partial<{
    title: string;
    excerpt: string;
    external_url: string | null;
    additional_category_ids: string[];
    cover_image: string | null;
    category_id: string | null;
    status: PostStatus;
    content: Block[];
  }>
): Promise<BlogPost> {
  const res = await fetch(`/api/admin/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const { post } = await apiJson<{ post: BlogPost }>(res);
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
  await apiJson(res);
}

// Files -> Supabase storage via the admin upload route.
async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const { url } = await apiJson<{ url: string }>(res);
  return url;
}

export async function uploadImage(file: File): Promise<string> {
  return uploadFile(file);
}

export async function uploadDziFile(file: File): Promise<string> {
  if (!/\.dzi$/i.test(file.name)) throw new Error("Choose a .dzi file.");
  return uploadFile(file);
}

type RelFile = File & { webkitRelativePath?: string };

/**
 * Upload a DZI folder (the .dzi file plus its *_files tile folder) in small batches
 * so folders with thousands of tiles stay under request-size limits.
 * Returns the public URL of the .dzi file.
 */
export async function uploadDziPackage(
  files: FileList | File[],
  onProgress?: (done: number, total: number) => void
): Promise<string> {
  const all = (Array.from(files) as RelFile[]).map((file) => ({
    file,
    path: (file.webkitRelativePath || file.name).replace(/\\/g, "/"),
  }));
  const dzi = all.find((f) => /\.dzi$/i.test(f.path));
  if (!dzi) throw new Error("The selected folder must contain a .dzi file.");

  const slash = dzi.path.lastIndexOf("/");
  const dziDir = slash >= 0 ? dzi.path.slice(0, slash + 1) : "";
  const dziName = dzi.path.slice(dziDir.length);
  const expected = dziName.replace(/\.dzi$/i, "") + "_files";

  const inDir = all
    .filter((f) => f !== dzi && f.path.startsWith(dziDir))
    .map((f) => ({ file: f.file, rel: f.path.slice(dziDir.length) }));
  const tileFolder =
    inDir.find((f) => f.rel.startsWith(expected + "/"))?.rel.split("/")[0] ??
    inDir.find((f) => /_files\//i.test(f.rel))?.rel.split("/")[0];
  if (!tileFolder) throw new Error("The folder must include the *_files tile folder next to the .dzi file.");
  const tiles = inDir.filter((f) => f.rel.startsWith(tileFolder + "/"));

  const packageId = `dzi/${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const total = tiles.length + 1;
  let done = 0;

  async function send(batch: { file: File; rel: string }[]): Promise<string | null> {
    const form = new FormData();
    form.append("mode", "dzi-batch");
    form.append("packageId", packageId);
    form.append("tileFolder", tileFolder!);
    for (const b of batch) {
      form.append("files", b.file);
      form.append("paths", b.rel);
    }
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const { url } = await apiJson<{ url: string | null }>(res);
    done += batch.length;
    onProgress?.(done, total);
    return url;
  }

  const url = await send([{ file: dzi.file, rel: dziName }]);
  if (!url) throw new Error("Upload did not return a .dzi URL.");

  const BATCH = 60;
  const CONCURRENCY = 4;
  const batches: { file: File; rel: string }[][] = [];
  for (let i = 0; i < tiles.length; i += BATCH) batches.push(tiles.slice(i, i + BATCH));
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, batches.length) }, async () => {
      while (next < batches.length) await send(batches[next++]);
    })
  );
  return url;
}
