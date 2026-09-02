"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, Plus, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useEdit } from "@/lib/edit/edit-context";
import { uploadImage } from "@/lib/blog/api";
import { useCategory, useCreatePost, useDeletePost, usePosts } from "@/lib/blog/hooks";

const PAGE_SIZE = 9;
const FALLBACK = "/mock/course-thumb-2.svg";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const router = useRouter();
  const { editMode } = useEdit();

  const category = useCategory(slug);
  const posts = usePosts(slug);
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  const [page, setPage] = React.useState(1);
  const [title, setTitle] = React.useState("");
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [creating, setCreating] = React.useState(false);

  // Reset to page 1 when the category changes (render-time pattern).
  const [prevSlug, setPrevSlug] = React.useState(slug);
  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setPage(1);
  }

  const all = posts.data ?? [];
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  async function handleCreate() {
    if (!category.data) return;
    setCreating(true);
    try {
      const post = await createPost.mutateAsync({
        title: title || "Untitled post",
        categoryId: category.data.id,
      });
      if (coverFile) {
        const url = await uploadImage(coverFile);
        // set cover before navigating
        await fetch(`/api/admin/posts/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cover_image: url }),
        });
      }
      router.push(`/blog/${post.slug}`);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Section>
      <Container>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-royal-500 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> All categories
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
              Category
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-plum-900 md:text-4xl">
              {category.data?.name ?? (category.isLoading ? "…" : "Not found")}
            </h1>
            <p className="mt-1 text-sm text-slate-700">
              {all.length} {all.length === 1 ? "post" : "posts"}
            </p>
          </div>
        </div>

        {/* Admin: new post with title + cover */}
        {editMode && category.data && (
          <div className="mt-6 flex flex-wrap items-end gap-3 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="min-w-[220px] flex-1">
              <label className="text-sm font-semibold text-plum-900">New post title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
              />
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm text-plum-900 hover:border-royal-500">
              <ImageIcon className="h-4 w-4" />
              {coverFile ? coverFile.name.slice(0, 18) : "Cover image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <Button disabled={creating} onClick={handleCreate}>
              <Plus className="h-4 w-4" /> {creating ? "Creating…" : "Create & edit"}
            </Button>
          </div>
        )}

        {/* Posts grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.isLoading && <p className="text-slate-700">Loading posts…</p>}
          {all.length === 0 && !posts.isLoading && (
            <p className="text-slate-700">
              No posts in this category yet.{" "}
              {editMode ? "Create one above." : "Check back soon."}
            </p>
          )}
          {pageItems.map((p) => (
            <div key={p.id} className="group relative">
              <Link
                href={`/blog/${p.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-mist-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover_image || FALLBACK}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {editMode && p.status === "draft" && (
                    <span className="absolute left-3 top-3 rounded-full bg-plum-900/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-base font-semibold leading-snug text-plum-900">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="line-clamp-2 text-sm text-slate-700">{p.excerpt}</p>
                  )}
                </div>
              </Link>
              {editMode && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${p.title}"?`)) deletePost.mutate(p.id);
                  }}
                  className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-smoke-400 opacity-0 shadow-soft transition hover:text-rose-700 group-hover:opacity-100"
                  title="Delete post"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              className="rounded-full border border-iris-300/60 bg-white px-4 py-1.5 text-sm font-medium text-plum-900 disabled:opacity-40 hover:border-royal-500"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                  n === current
                    ? "bg-plum-900 text-white"
                    : "border border-iris-300/60 bg-white text-plum-900 hover:border-royal-500"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current === totalPages}
              className="rounded-full border border-iris-300/60 bg-white px-4 py-1.5 text-sm font-medium text-plum-900 disabled:opacity-40 hover:border-royal-500"
            >
              Next
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
}
