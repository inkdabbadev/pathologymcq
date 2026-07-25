import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageBlockEditor } from "@/components/editor/page-block-editor";
import { BLOG_CATEGORIES } from "@/lib/mock/blog-categories";
import { getPost } from "@/lib/blocks/posts-store";
import { getPageBlocks } from "@/lib/blocks/store";
import type { Block } from "@/lib/blocks/types";
import { isAdminSession } from "@/lib/auth/admin-session";

function defaultBlocks(title: string): Block[] {
  return [
    { id: "heading", type: "heading", text: title, url: "" },
    { id: "body", type: "body", text: "Start writing your content here.", url: "" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}): Promise<Metadata> {
  const { slug, post: postSlug } = await params;
  const post = await getPost(slug, postSlug);
  if (!post) return {};

  return { title: post.title };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}) {
  const { slug, post: postSlug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const post = await getPost(slug, postSlug);
  if (!post) notFound();

  const pageKey = `${slug}/${postSlug}`;
  const [savedBlocks, isAdmin] = await Promise.all([getPageBlocks(pageKey), isAdminSession()]);

  return (
    <Section>
      <Container>
        <Link
          href={`/category/${slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-plum-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {category.label}
        </Link>
      </Container>

      <div className="mt-10">
        <PageBlockEditor
          slug={pageKey}
          initialBlocks={savedBlocks ?? defaultBlocks(post.title)}
          isAdmin={isAdmin}
        />
      </div>
    </Section>
  );
}
