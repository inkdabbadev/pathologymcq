"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Image as ImageIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { BlockEditor } from "@/components/blog/block-editor";
import type { Block, BlogPost } from "@/lib/blog/types";
import { useCategories, useDeletePost, useUpdatePost } from "@/lib/blog/hooks";
import { uploadImage } from "@/lib/blog/api";

export function PostEditor({ post }: { post: BlogPost }) {
  const router = useRouter();
  const categories = useCategories();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [title, setTitle] = React.useState(post.title);
  const [excerpt, setExcerpt] = React.useState(post.excerpt);
  const [categoryId, setCategoryId] = React.useState(post.category_id ?? "");
  const [cover, setCover] = React.useState(post.cover_image);
  const [blocks, setBlocks] = React.useState<Block[]>(post.content ?? []);
  const [dirty, setDirty] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = React.useState(false);

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setDirty(true);
    };
  }

  async function save(status?: "draft" | "published") {
    const res = await updatePost.mutateAsync({
      id: post.id,
      patch: {
        title,
        excerpt,
        category_id: categoryId || null,
        cover_image: cover,
        content: blocks,
        ...(status ? { status } : {}),
      },
    });
    setDirty(false);
    setSavedAt(new Date().toLocaleTimeString());
    if (res.slug !== post.slug) router.replace(`/blog/${res.slug}`);
  }

  async function onCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setCover(url);
      setDirty(true);
    } catch (err) {
      alert(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploadingCover(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this post permanently?")) return;
    await deletePost.mutateAsync(post.id);
    router.push("/blog");
  }

  const isPublished = post.status === "published";

  return (
    <Section>
      <Container className="max-w-3xl">
        {/* Toolbar */}
        <div className="sticky top-[5.5rem] z-40 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-iris-300/50 bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-royal-500 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Blog
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-smoke-400">
              {dirty ? "Unsaved changes" : savedAt ? `Saved ${savedAt}` : isPublished ? "Published" : "Draft"}
            </span>
            <Button size="sm" variant="ghost" onClick={onDelete} title="Delete post">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" disabled={updatePost.isPending} onClick={() => save()}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button
              size="sm"
              disabled={updatePost.isPending}
              onClick={() => save(isPublished ? "draft" : "published")}
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </div>

        {/* Meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <select
            value={categoryId}
            onChange={(e) => markDirty(setCategoryId)(e.target.value)}
            className="rounded-full border border-iris-300/60 bg-white px-3 py-1.5 text-sm text-plum-900 outline-none focus:border-royal-500"
          >
            <option value="">No category</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-1.5 text-sm text-plum-900 hover:border-royal-500">
            <ImageIcon className="h-4 w-4" />
            {uploadingCover ? "Uploading…" : cover ? "Change cover" : "Add cover"}
            <input type="file" accept="image/*" className="hidden" onChange={onCover} />
          </label>
          {cover && (
            <button
              onClick={() => {
                setCover(null);
                setDirty(true);
              }}
              className="text-xs text-smoke-400 hover:text-rose-700"
            >
              Remove cover
            </button>
          )}
        </div>

        {cover && (
          <div className="mb-6 overflow-hidden rounded-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="h-auto w-full object-cover" />
          </div>
        )}

        {/* Title + excerpt */}
        <input
          value={title}
          onChange={(e) => markDirty(setTitle)(e.target.value)}
          placeholder="Post title"
          className="w-full border-none bg-transparent font-display text-3xl font-bold leading-tight text-plum-900 outline-none placeholder:text-smoke-400 md:text-4xl"
        />
        <textarea
          value={excerpt}
          onChange={(e) => markDirty(setExcerpt)(e.target.value)}
          placeholder="Short excerpt (shown on cards and at the top of the post)…"
          rows={2}
          className="mt-3 w-full resize-none border-none bg-transparent text-lg leading-relaxed text-slate-700 outline-none placeholder:text-smoke-400"
        />

        <hr className="my-6 border-iris-300/40" />

        {/* Block editor */}
        <BlockEditor
          blocks={blocks}
          onChange={(b) => {
            setBlocks(b);
            setDirty(true);
          }}
        />
      </Container>
    </Section>
  );
}
