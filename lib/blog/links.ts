/** Only absolute HTTP(S) destinations may be used for article redirects. */
export function articleUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function blogHref(
  post: { slug: string; external_url?: string | null },
  hrefBase = "/blog",
) {
  return hrefBase.startsWith("/admin")
    ? `${hrefBase}/${post.slug}`
    : articleUrl(post.external_url) ?? `${hrefBase}/${post.slug}`;
}
