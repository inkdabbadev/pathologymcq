"use client";

import * as React from "react";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/marketing/faq-section";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import type { FaqItem } from "@/lib/api/types";
import type { FaqCategory } from "@/lib/mock/faq-categories";
import { useEdit } from "@/lib/edit/edit-context";
import {
  useFaqCategories,
  useCreateFaqCategory,
  useUpdateFaqCategory,
  useDeleteFaqCategory,
  useSiteSettings,
} from "@/lib/catalog/hooks";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

function CategoryItemsEditor({ category }: { category: FaqCategory }) {
  const update = useUpdateFaqCategory();
  const del = useDeleteFaqCategory();
  const [items, setItems] = React.useState<FaqItem[]>(category.items.map((i) => ({ ...i })));
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  async function save() {
    await update.mutateAsync({
      slug: category.slug,
      patch: { items: items.filter((i) => i.question.trim() || i.answer.trim()) },
    });
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-panel border border-iris-300/40 bg-white p-3">
          <div className="flex items-start gap-2">
            <input
              value={it.question}
              onChange={(e) => setItems((a) => a.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)))}
              placeholder="Question"
              className="flex-1 rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-royal-500"
            />
            <button
              onClick={() => setItems((a) => a.filter((_, j) => j !== i))}
              className="rounded-md p-1.5 text-smoke-400 hover:text-rose-700"
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            value={it.answer}
            onChange={(e) => setItems((a) => a.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)))}
            rows={2}
            placeholder="Answer"
            className={field}
          />
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setItems((a) => [...a, { question: "", answer: "" }])}>
          <Plus className="h-4 w-4" /> Add Q&amp;A
        </Button>
        <Button size="sm" disabled={update.isPending} onClick={save}>
          <Save className="h-4 w-4" /> Save
        </Button>
        {savedAt && <span className="text-xs text-smoke-400">Saved {savedAt}</span>}
        <button
          onClick={() => {
            if (window.confirm(`Delete category "${category.title}"?`)) del.mutate(category.slug);
          }}
          className="ml-auto text-xs text-smoke-400 hover:text-rose-700"
        >
          Delete category
        </button>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const { editMode } = useEdit();
  const settings = useSiteSettings();
  const cats = useFaqCategories();
  const createCat = useCreateFaqCategory();
  const updateCat = useUpdateFaqCategory();
  const [newTitle, setNewTitle] = React.useState("");

  const categories = cats.data ?? [];

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-slate-700">{settings.faqSubtitle}</p>
          <div className="mt-4 flex justify-center">
            <WhatsAppButton message="Hi! I have a question about Pathology MCQ." />
          </div>
        </div>

        {editMode && (
          <div className="mx-auto mt-8 flex max-w-xl items-end gap-2 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-plum-900">New FAQ category</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Refunds"
                className={field}
              />
            </div>
            <Button
              disabled={!newTitle.trim() || createCat.isPending}
              onClick={() => createCat.mutate({ title: newTitle }, { onSuccess: () => setNewTitle("") })}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        )}

        <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-14">
          {cats.isLoading && <p className="text-slate-700">Loading…</p>}
          {categories.map((category) => (
            <div key={category.slug} id={category.slug}>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-plum-900">{category.title}</h2>
                {editMode && (
                  <button
                    onClick={() => {
                      const title = window.prompt("Rename category", category.title);
                      if (title && title.trim() && title !== category.title)
                        updateCat.mutate({ slug: category.slug, patch: { title } });
                    }}
                    className="text-smoke-400 hover:text-royal-500"
                    title="Rename category"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
              {editMode ? (
                <CategoryItemsEditor category={category} />
              ) : (
                <div className="mt-5">
                  <FaqSection items={category.items} idPrefix={category.slug} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
