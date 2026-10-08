import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { BlockRenderer } from "@/components/blog/block-renderer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { JsonLd } from "./json-ld";
import { exportedSeo, pageGraph, pageMetadata, safeUrl, SITE_URL, validDate } from "@/lib/seo/metadata";

export function articleMetadata(post: BlogPost, path: string) {
  const metadata = pageMetadata(path, { title: post.title, description: post.excerpt, image: post.cover_image }, true);
  const exported = exportedSeo(path);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const,
    publishedTime: validDate(exported?.published || post.created_at),
    modifiedTime: validDate(exported?.modified || post.updated_at) } };
}

export function Article({ post, path }: { post: BlogPost; path: string }) {
  const seo = exportedSeo(path);
  const graph = pageGraph(path, post.title, post.excerpt, {
    "@type": "Article", headline: post.title,
    datePublished: validDate(seo?.published || post.created_at),
    dateModified: validDate(seo?.modified || post.updated_at),
    image: safeUrl(post.cover_image || seo?.image),
    publisher: { "@id": `${SITE_URL}/#organization` },
  });
  return <Section><Container className="max-w-3xl">
    <JsonLd data={graph} />
    <Link href="/blog" className="text-sm text-royal-500 hover:underline">← Back to blog</Link>
    {post.category && <p className="mt-6 text-sm text-royal-500">{post.category.name}</p>}
    <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-plum-900 md:text-4xl">{post.title}</h1>
    {post.excerpt && <p className="mt-3 text-lg text-slate-700">{post.excerpt}</p>}
    {post.cover_image && <div className="mt-8 overflow-hidden rounded-hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.cover_image} alt="" className="h-auto w-full" />
    </div>}
    <div className="mt-10"><BlockRenderer blocks={post.content} /></div>
  </Container></Section>;
}
