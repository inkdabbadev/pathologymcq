"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ImageIcon, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { MockTestCard } from "@/components/marketing/mock-test-card";
import type { MockTestProduct } from "@/lib/mock/mock-test-products";
import { uploadImage } from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";
import {
  useCreateMockTest,
  useDeleteMockTest,
  useMockTests,
  useUpdateMockTest,
  useMockCategories,
  useCreateMockCategory,
  useUpdateMockCategory,
  useDeleteMockCategory,
} from "@/lib/catalog/hooks";

const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

function MockEditPanel({ mt, onDone }: { mt: MockTestProduct; onDone: () => void }) {
  const update = useUpdateMockTest();
  const categories = useMockCategories();
  const [title, setTitle] = React.useState(mt.title);
  const [shortLabel, setShortLabel] = React.useState(mt.shortLabel);
  const [category, setCategory] = React.useState(mt.category);
  const [examPattern, setExamPattern] = React.useState(mt.examPattern);
  const [questionCount, setQuestionCount] = React.useState(String(mt.questionCount));
  const [image, setImage] = React.useState(mt.imageUrl);
  const [uploading, setUploading] = React.useState(false);

  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      setImage(await uploadImage(f));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    await update.mutateAsync({
      id: mt.id,
      patch: {
        title,
        shortLabel,
        category,
        examPattern,
        questionCount: Math.max(0, Math.round(Number(questionCount) || 0)),
        imageUrl: image,
      },
    });
    onDone();
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-royal-500/50 bg-white p-4 shadow-soft">
      <div className="overflow-hidden rounded-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-28 w-full object-cover" />
      </div>
      <label className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-full border border-iris-300/60 px-3 py-1 text-xs text-plum-900 hover:border-royal-500">
        <ImageIcon className="h-3.5 w-3.5" />
        {uploading ? "Uploading…" : "Image"}
        <input type="file" accept="image/*" className="hidden" onChange={onImage} />
      </label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={field} />
      <input value={shortLabel} onChange={(e) => setShortLabel(e.target.value)} placeholder="Short label (button text)" className={field} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
        {(categories.data ?? []).map((t) => (
          <option key={t.category} value={t.category}>
            {t.label}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <select
          value={examPattern}
          onChange={(e) => setExamPattern(e.target.value as MockTestProduct["examPattern"])}
          className={field}
        >
          <option value="Mock Test">Mock Test</option>
          <option value="Mini-Mock Test">Mini-Mock Test</option>
        </select>
        <input
          type="number"
          min={0}
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          placeholder="Questions"
          className={field}
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={update.isPending} onClick={save}>
          <Save className="h-4 w-4" /> Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onDone}>
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </div>
  );
}

export default function MockTestsPage() {
  const { editMode } = useEdit();
  const mockTests = useMockTests();
  const categories = useMockCategories();
  const createMock = useCreateMockTest();
  const deleteMock = useDeleteMockTest();
  const createCat = useCreateMockCategory();
  const updateCat = useUpdateMockCategory();
  const deleteCat = useDeleteMockCategory();

  const [newTitle, setNewTitle] = React.useState("");
  const [newCat, setNewCat] = React.useState("");
  const [newCatLabel, setNewCatLabel] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const all = mockTests.data ?? [];
  const cats = categories.data ?? [];
  const selectedNewCat = newCat || cats[0]?.category || "";

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">Mock Tests</h1>
          <p className="mt-4 text-slate-700">
            Already purchased one of our mock tests? Select it below to log in and access your quiz.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/courses?exam=mock-tests">
              Haven&apos;t purchased yet? Browse mock test courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {editMode && (
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-plum-900">New mock test</p>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                className={field}
              />
              <div className="mt-2 flex gap-2">
                <select value={selectedNewCat} onChange={(e) => setNewCat(e.target.value)} className={field}>
                  {cats.map((t) => (
                    <option key={t.category} value={t.category}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <Button
                  disabled={!newTitle.trim() || createMock.isPending}
                  onClick={() =>
                    createMock.mutate(
                      { title: newTitle, category: selectedNewCat },
                      { onSuccess: (m) => { setNewTitle(""); setEditingId(m.id); } }
                    )
                  }
                >
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-plum-900">New category</p>
              <input
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="e.g. Cytopathology Mocks"
                className={field}
              />
              <Button
                className="mt-2"
                disabled={!newCatLabel.trim() || createCat.isPending}
                onClick={() => createCat.mutate({ label: newCatLabel }, { onSuccess: () => setNewCatLabel("") })}
              >
                <Plus className="h-4 w-4" /> Add category
              </Button>
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-col gap-16">
          {cats.map((type) => {
            const products = all.filter((p) => p.category === type.category);
            if (products.length === 0 && !editMode) return null;

            return (
              <div key={type.category} id={type.category}>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-bold text-plum-900">{type.label}</h2>
                  {editMode && (
                    <>
                      <button
                        onClick={() => {
                          const label = window.prompt("Rename category", type.label);
                          if (label && label.trim() && label !== type.label)
                            updateCat.mutate({ slugId: type.category, patch: { label } });
                        }}
                        className="text-smoke-400 hover:text-royal-500"
                        title="Rename category"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${type.label}" and its mock tests?`))
                            deleteCat.mutate(type.category);
                        }}
                        className="text-smoke-400 hover:text-rose-700"
                        title="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                {type.description && <p className="mt-1 text-sm text-slate-700">{type.description}</p>}
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.length === 0 && editMode && (
                    <p className="text-sm text-smoke-400">No mock tests here yet.</p>
                  )}
                  {products.map((product) =>
                    editMode && editingId === product.id ? (
                      <MockEditPanel key={product.id} mt={product} onDone={() => setEditingId(null)} />
                    ) : (
                      <div key={product.id} className="group relative">
                        <MockTestCard product={product} />
                        {editMode && (
                          <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                              onClick={() => setEditingId(product.id)}
                              className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${product.title}"?`)) deleteMock.mutate(product.id);
                              }}
                              className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
