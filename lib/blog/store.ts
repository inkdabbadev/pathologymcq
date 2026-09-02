"use client";

import type { BlogPost, Category, PostStatus, Block } from "@/lib/blog/types";
import { slugify } from "@/lib/blog/types";

/**
 * localStorage-backed blog store (temporary — swap for Supabase later).
 * Everything lives under one key as JSON. Images are stored inline as data URLs.
 *
 * To migrate to the cloud later, call `exportBlogData()` to get the full JSON
 * and push it up.
 */

const KEY = "pmcq_blog_v1";

interface StoreShape {
  categories: Category[];
  posts: BlogPost[];
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function nowIso(): string {
  return new Date().toISOString();
}

function seed(): StoreShape {
  const t = nowIso();
  return {
    categories: [
      { id: uid(), name: "Exam Prep Guides", slug: "exam-prep-guides", created_at: t },
      { id: uid(), name: "MCQ Strategies", slug: "mcq-strategies", created_at: t },
    ],
    posts: [],
  };
}

function read(): StoreShape {
  if (typeof window === "undefined") return { categories: [], posts: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as StoreShape;
    return {
      categories: parsed.categories ?? [],
      posts: parsed.posts ?? [],
    };
  } catch {
    return { categories: [], posts: [] };
  }
}

function write(state: StoreShape) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // Most likely quota exceeded (too many/large inline images).
    throw new Error(
      "Browser storage is full. Remove some images or posts. " + (e as Error).message
    );
  }
}

function withCategory(post: BlogPost, cats: Category[]): BlogPost {
  return { ...post, category: cats.find((c) => c.id === post.category_id) ?? null };
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base;
  let i = 2;
  while (taken.has(slug)) slug = `${base}-${i++}`;
  return slug;
}

// ── Categories ──────────────────────────────────────────────────────────────
export function listCategories(): Category[] {
  return read().categories.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategoryBySlug(slug: string): Category | null {
  return read().categories.find((c) => c.slug === slug) ?? null;
}

export function createCategory(name: string): Category {
  const s = read();
  const taken = new Set(s.categories.map((c) => c.slug));
  const cat: Category = {
    id: uid(),
    name: name.trim(),
    slug: uniqueSlug(slugify(name), taken),
    created_at: nowIso(),
  };
  s.categories.push(cat);
  write(s);
  return cat;
}

export function updateCategory(id: string, name: string): Category {
  const s = read();
  const taken = new Set(s.categories.filter((c) => c.id !== id).map((c) => c.slug));
  const cat = s.categories.find((c) => c.id === id);
  if (!cat) throw new Error("Category not found");
  cat.name = name.trim();
  cat.slug = uniqueSlug(slugify(name), taken);
  write(s);
  return cat;
}

export function deleteCategory(id: string): void {
  const s = read();
  s.categories = s.categories.filter((c) => c.id !== id);
  // Posts keep existing but become uncategorised.
  s.posts = s.posts.map((p) => (p.category_id === id ? { ...p, category_id: null } : p));
  write(s);
}

// ── Posts ────────────────────────────────────────────────────────────────────
export function listPosts(opts?: { categorySlug?: string; publishedOnly?: boolean }): BlogPost[] {
  const s = read();
  let rows = s.posts
    .slice()
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .map((p) => withCategory(p, s.categories));
  if (opts?.publishedOnly) rows = rows.filter((p) => p.status === "published");
  if (opts?.categorySlug) rows = rows.filter((p) => p.category?.slug === opts.categorySlug);
  return rows;
}

export function getPostBySlug(slug: string, publishedOnly = false): BlogPost | null {
  const s = read();
  const p = s.posts.find((x) => x.slug === slug);
  if (!p) return null;
  if (publishedOnly && p.status !== "published") return null;
  return withCategory(p, s.categories);
}

export function createPost(input: { title: string; categoryId?: string | null }): BlogPost {
  const s = read();
  const taken = new Set(s.posts.map((p) => p.slug));
  const t = input.title.trim() || "Untitled post";
  const post: BlogPost = {
    id: uid(),
    title: t,
    slug: uniqueSlug(slugify(t), taken),
    excerpt: "",
    cover_image: null,
    category_id: input.categoryId ?? null,
    status: "draft",
    content: [],
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  s.posts.push(post);
  write(s);
  return withCategory(post, s.categories);
}

export function updatePost(
  id: string,
  patch: Partial<{
    title: string;
    excerpt: string;
    cover_image: string | null;
    category_id: string | null;
    status: PostStatus;
    content: Block[];
  }>
): BlogPost {
  const s = read();
  const post = s.posts.find((p) => p.id === id);
  if (!post) throw new Error("Post not found");
  Object.assign(post, patch);
  post.updated_at = nowIso();
  write(s);
  return withCategory(post, s.categories);
}

export function deletePost(id: string): void {
  const s = read();
  s.posts = s.posts.filter((p) => p.id !== id);
  write(s);
}

// ── Migration helper (for later cloud push) ──────────────────────────────────
export function exportBlogData(): StoreShape {
  return read();
}
