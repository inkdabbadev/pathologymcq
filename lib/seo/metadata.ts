import type { Metadata } from "next";
import imported from "./imported.json";
import routes from "./routes.json";
import migration from "./migration.json";

export const SITE_URL = "https://pathologymcq.com";
export const SITE_NAME = "Pathology MCQ";
export type ExportedSeo = {
  title: string; description: string; image: string; imageAlt: string;
  robots: string; googlebot: string; published: string; modified: string;
};
const pages: Record<string, ExportedSeo> = imported.pages;
export const staticRoutes: Record<string, { title: string; description: string; sources: string[] }> = routes;
const sources: Record<string, string> = migration.sources;

export function normalizePath(value: string): string {
  try { return decodeURI(new URL(value, SITE_URL).pathname).replace(/\/+$/, "") || "/"; }
  catch { return value; }
}
export function exportedSeo(path: string) {
  const normalized = normalizePath(path);
  return pages[sources[normalized] ?? normalized];
}
export function safeUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, SITE_URL);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}
export function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
export function validDate(value?: string | null) {
  return value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString() : undefined;
}
export function isNoindex(path: string) {
  return /\bnoindex\b|\bnone\b/i.test(exportedSeo(path)?.robots ?? "");
}
export function pageMetadata(path: string, fallback?: { title: string; description?: string; image?: string | null }, article = false): Metadata {
  const seo = exportedSeo(path);
  const defaults: { title: string; description?: string; image?: string | null } = fallback ?? staticRoutes[path] ?? { title: SITE_NAME, description: "Pathology education and exam preparation." };
  const title = seo?.title || `${defaults.title}${defaults.title.includes(SITE_NAME) ? "" : ` | ${SITE_NAME}`}`;
  const description = plainText(seo?.description || defaults.description || "");
  const image = safeUrl(seo?.image || defaults.image);
  const canonical = new URL(path, SITE_URL).href;
  return {
    title: { absolute: title }, description,
    alternates: { canonical },
    robots: seo?.robots || "index, follow",
    ...(seo?.googlebot ? { other: { googlebot: seo.googlebot } } : {}),
    openGraph: {
      type: article ? "article" : "website", title, description, url: canonical, siteName: SITE_NAME,
      images: image ? [{ url: image, alt: seo?.imageAlt || defaults.title }] : [],
      ...(article ? { publishedTime: validDate(seo?.published), modifiedTime: validDate(seo?.modified) } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : [] },
  };
}

export function pageGraph(path: string, name: string, description?: string, extra?: Record<string, unknown>) {
  const url = new URL(path, SITE_URL).href;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name, description: plainText(description ?? ""),
      isPartOf: { "@id": `${SITE_URL}/#website` }, ...extra },
    ...(path === "/" ? [] : [{ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name, item: url },
    ] }]),
  ] };
}

export const organizationGraph = {
  "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL,
      sameAs: imported.sameAs.filter((url) => safeUrl(url)) },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` } },
  ],
};
