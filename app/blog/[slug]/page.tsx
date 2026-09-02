"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/blog/block-renderer";
import { PostEditor } from "@/components/blog/post-editor";
import { useEdit } from "@/lib/edit/edit-context";
import { usePost } from "@/lib/blog/hooks";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { editMode } = useEdit();
  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) {
    return (
      <Section>
        <Container>
          <p className="text-slate-700">Loading…</p>
        </Container>
      </Section>
    );
  }

  if (error || !post) {
    return (
      <Section>
        <Container>
          <h1 className="font-display text-2xl font-bold text-plum-900">
            Post not found
          </h1>
          <Link href="/blog" className="mt-4 inline-flex items-center gap-1 text-royal-500">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </Container>
      </Section>
    );
  }

  // Admins in edit mode get the full editor; everyone else (and preview) reads.
  if (editMode) {
    return <PostEditor post={post} />;
  }

  return (
    <Section>
      <Container className="max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-royal-500 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        {post.category && (
          <Badge variant="default" className="mt-6 w-fit normal-case">
            {post.category.name}
          </Badge>
        )}
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-plum-900 md:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-3 text-lg leading-relaxed text-slate-700">{post.excerpt}</p>
        )}

        {post.cover_image && (
          <div className="mt-8 overflow-hidden rounded-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt="" className="h-auto w-full object-cover" />
          </div>
        )}

        <div className="mt-10">
          <BlockRenderer blocks={post.content} />
        </div>
      </Container>
    </Section>
  );
}
