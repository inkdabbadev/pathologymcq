import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase/public";
import type { BlogPost, Category } from "@/lib/blog/types";
import type { Course, PracticeTopic } from "@/lib/api/types";
import type { ContentPageDoc } from "@/lib/mock/pages";
import { SITE_URL, normalizePath, safeUrl } from "./metadata";
import migration from "./migration.json";

function database() {
  const db = getSupabasePublic();
  if (!db) throw new Error("Supabase is not configured");
  return db;
}

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await database().from("posts")
    .select("*,category:categories(id,name,slug)").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw new Error(error.message);
  return data as BlogPost | null;
});
export const getCategory = cache(async (slug: string): Promise<Category | null> => {
  const { data, error } = await database().from("categories").select("id,name,slug").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});
export const getCatalogItem = cache(async (kind: string, slug: string) => {
  // JSON slug is authoritative: older catalog rows may not lift it to the column.
  const { data, error } = await database().from("catalog_items").select("data")
    .eq("kind", kind).eq("data->>slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.data ?? null;
});
export const getCourse = (slug: string): Promise<Course | null> => getCatalogItem("courses", slug);
export const getTopic = (slug: string): Promise<PracticeTopic | null> => getCatalogItem("practice_topics", slug);
export const getContentPage = (slug: string): Promise<ContentPageDoc | null> => getCatalogItem("pages", slug);

export function postCanonical(post: Pick<BlogPost, "slug" | "external_url">): string {
  const target = safeUrl(post.external_url);
  if (!target) return `${SITE_URL}/blog/${post.slug}`;
  const url = new URL(target);
  return ["pathologymcq.com", "www.pathologymcq.com"].includes(url.hostname)
    ? `${SITE_URL}${normalizePath(url.pathname)}${url.search}` : target;
}
export function postRedirect(post: BlogPost, currentPath: string): string | null {
  const target = postCanonical(post);
  const destination = new URL(target);
  if (["pathologymcq.com", "www.pathologymcq.com"].includes(destination.hostname)
      && normalizePath(destination.pathname) === normalizePath(currentPath)) return null;
  return target;
}
export const getLegacyPost = cache(async (path: string): Promise<BlogPost | null> => {
  const slug = (migration.posts as Record<string, string>)[path];
  if (slug) {
    const post = await getPost(slug);
    if (post) return post;
  }
  // Also support newly added published posts that retain an original site URL.
  if (path.split("/").filter(Boolean).length !== 1) return null;
  const variants = [SITE_URL, "https://www.pathologymcq.com"].flatMap((origin) => [origin + path, origin + path + "/"]);
  const { data, error } = await database().from("posts").select("*,category:categories(id,name,slug)")
    .eq("status", "published").in("external_url", variants).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data as BlogPost | null;
});
