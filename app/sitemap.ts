import type { MetadataRoute } from "next";
import { getSupabasePublic } from "@/lib/supabase/public";
import { postCanonical } from "@/lib/seo/content";
import { exportedSeo, isNoindex, normalizePath, SITE_URL, staticRoutes, validDate } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = getSupabasePublic();
  if (!db) throw new Error("Supabase is not configured");
  const urls = new Map<string, MetadataRoute.Sitemap[number]>();
  function add(path: string, modified?: string) {
    if (isNoindex(path)) return;
    const url = new URL(path, SITE_URL);
    if (url.origin !== SITE_URL || url.search) return;
    const canonical = `${SITE_URL}${normalizePath(url.pathname)}`;
    urls.set(canonical, { url: canonical, ...(validDate(modified) ? { lastModified: validDate(modified) } : {}) });
  }
  Object.keys(staticRoutes).forEach((path) => add(path));
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await db.from("posts").select("slug,external_url,updated_at")
      .eq("status", "published").order("id").range(offset, offset + 499);
    if (error) throw new Error(error.message);
    for (const post of data ?? []) {
      const path = postCanonical(post);
      add(path, exportedSeo(path)?.modified || post.updated_at);
    }
    if (!data || data.length < 500) break;
  }
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await db.from("catalog_items").select("kind,data,updated_at")
      .in("kind", ["courses", "practice_topics", "pages"]).order("kind").order("id").range(offset, offset + 499);
    if (error) throw new Error(error.message);
    for (const item of data ?? []) {
      const slug = item.data?.slug;
      if (!slug) continue;
      if (item.kind === "courses") add(`/courses/${slug}`, item.updated_at);
      else if (item.kind === "practice_topics") add(`/practice/${slug}`, item.updated_at);
      else if (slug.startsWith("services-")) add(`/services/${slug.slice(9)}`, item.updated_at);
    }
    if (!data || data.length < 500) break;
  }
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await db.from("categories").select("slug").order("id").range(offset, offset + 499);
    if (error) throw new Error(error.message);
    for (const category of data ?? []) add(`/blog/category/${category.slug}`);
    if (!data || data.length < 500) break;
  }
  return [...urls.values()];
}
