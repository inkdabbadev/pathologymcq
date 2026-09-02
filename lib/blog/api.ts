"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Block, BlogPost, Category, PostStatus } from "@/lib/blog/types";

/**
 * Blog data layer — Supabase backed.
 * Public reads use the anon key (RLS: published only). Admin reads + all writes
 * go through /api/admin/* routes (admin cookie + service role).
 */

const POST_SELECT =
  "id,title,slug,excerpt,cover_image,category_id,status,content,created_at,updated_at,category:categories(id,name,slug)";

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
  if (categorySlug) rows = rows.filter((p) => p.category?.slug === categorySlug);
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
  return categorySlug ? posts.filter((p) => p.category?.slug === categorySlug) : posts;
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

// Images -> Supabase storage via the admin upload route.
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const { url } = await apiJson<{ url: string }>(res);
  return url;
}
