"use client";

import * as React from "react";
import Link from "next/link";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useEdit } from "@/lib/edit/edit-context";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  usePosts,
  useUpdateCategory,
} from "@/lib/blog/hooks";

export default function BlogIndexPage() {
  const { editMode } = useEdit();
  const categories = useCategories();
  const posts = usePosts(); // all (published, or incl. drafts for admin) — for counts
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [newCat, setNewCat] = React.useState("");

  const countFor = (categoryId: string) =>
    posts.data?.filter((p) => p.category_id === categoryId).length ?? 0;

  return (
    <Section>
      <Container>
        <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
          Insights
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-plum-900 md:text-4xl">
          Pathology MCQ Blog
        </h1>
        <p className="mt-2 max-w-2xl text-slate-700">
          Browse articles by category.
        </p>

        {/* Admin: add category */}
        {editMode && (
          <div className="mt-6 flex max-w-xl items-end gap-2 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-plum-900">Add a category</label>
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="e.g. Case Studies"
                className="mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newCat.trim())
                    createCategory.mutate(newCat, { onSuccess: () => setNewCat("") });
                }}
              />
            </div>
            <Button
              size="md"
              disabled={!newCat.trim() || createCategory.isPending}
              onClick={() => createCategory.mutate(newCat, { onSuccess: () => setNewCat("") })}
            >
              <Plus className="h-4 w-4" /> {createCategory.isPending ? "Adding…" : "Add"}
            </Button>
          </div>
        )}

        {editMode && createCategory.isError && (
          <p className="mt-2 max-w-xl rounded-panel bg-cyto-100 p-3 text-sm text-rose-700">
            Couldn&apos;t add category: {(createCategory.error as Error).message}
          </p>
        )}

        {/* Category cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.isLoading && <p className="text-slate-700">Loading…</p>}
          {categories.data?.length === 0 &&
            (editMode ? (
              <p className="text-slate-700">No categories yet. Add one above to get started.</p>
            ) : (
              <p className="text-slate-700">No blog found.</p>
            ))}
          {categories.data?.map((c) => (
            <div key={c.id} className="group relative">
              <Link
                href={`/blog/category/${c.slug}`}
                className="flex h-full flex-col gap-3 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-hema-700 to-eosin-500 text-white">
                  <FolderOpen className="h-5 w-5" />
                </span>
                <h2 className="font-display text-xl font-bold text-plum-900">{c.name}</h2>
                <p className="text-sm text-slate-700">
                  {countFor(c.id)} {countFor(c.id) === 1 ? "post" : "posts"}
                </p>
              </Link>

              {editMode && (
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => {
                      const name = window.prompt("Rename category", c.name);
                      if (name && name.trim() && name !== c.name)
                        updateCategory.mutate({ id: c.id, name });
                    }}
                    className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                    title="Rename category"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete category "${c.name}"? Its posts stay but become uncategorised.`
                        )
                      )
                        deleteCategory.mutate(c.id);
                    }}
                    className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </Container>
    </Section>
  );
}
