import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { NewBlogButton } from "@/components/editor/new-blog-button";
import { BlogPostCard } from "@/components/editor/blog-post-card";
import { BLOG_CATEGORIES } from "@/lib/mock/blog-categories";
import { listPosts } from "@/lib/blocks/posts-store";
import { isAdminSession } from "@/lib/auth/admin-session";

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return {};

  return { title: category.label };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const [posts, isAdmin] = await Promise.all([listPosts(slug), isAdminSession()]);

  return (
    <Section>
      <Container>
        <Link
          href="/category"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-plum-900"
        >
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>

        <div className="mx-auto mt-6 max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
            {category.label}
          </h1>
        </div>

        <NewBlogButton categorySlug={slug} isAdmin={isAdmin} />

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} categorySlug={slug} post={post} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white py-16 text-center shadow-soft">
            <p className="text-slate-700">No blogs in this category yet.</p>
          </div>
        )}
      </Container>
    </Section>
  );
}
