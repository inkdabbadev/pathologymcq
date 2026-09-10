"use client";

import * as React from "react";
import { ImageIcon, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ShopProductCard } from "@/components/marketing/shop-product-card";
import type { Product } from "@/lib/api/types";
import { uploadImage } from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";
import {
  useBundles,
  useCreateBundle,
  useDeleteBundle,
  useUpdateBundle,
} from "@/lib/catalog/hooks";

const linesToArr = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const field =
  "mt-1 w-full rounded-panel border border-iris-300/60 bg-white px-3 py-2 text-sm outline-none focus:border-royal-500";

function BundleEditPanel({ bundle, onDone }: { bundle: Product; onDone: () => void }) {
  const update = useUpdateBundle();
  const [name, setName] = React.useState(bundle.name);
  const [priceRupees, setPriceRupees] = React.useState(String(Math.round(bundle.priceCents / 100)));
  const [image, setImage] = React.useState(bundle.imageUrl);
  const [description, setDescription] = React.useState(bundle.description);
  const [includes, setIncludes] = React.useState((bundle.includes ?? []).join("\n"));
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
      id: bundle.id,
      patch: {
        name,
        priceCents: Math.max(0, Math.round(Number(priceRupees) || 0) * 100),
        imageUrl: image,
        description,
        includes: linesToArr(includes),
      },
    });
    onDone();
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-royal-500/50 bg-white p-4 shadow-soft">
      <div className="overflow-hidden rounded-panel">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-32 w-full object-cover" />
      </div>
      <label className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-full border border-iris-300/60 px-3 py-1 text-xs text-plum-900 hover:border-royal-500">
        <ImageIcon className="h-3.5 w-3.5" />
        {uploading ? "Uploading…" : "Image"}
        <input type="file" accept="image/*" className="hidden" onChange={onImage} />
      </label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={field} />
      <input
        type="number"
        min={0}
        value={priceRupees}
        onChange={(e) => setPriceRupees(e.target.value)}
        placeholder="Price ₹"
        className={field}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Description"
        className={field}
      />
      <textarea
        value={includes}
        onChange={(e) => setIncludes(e.target.value)}
        rows={3}
        placeholder="Includes (one per line)"
        className={field}
      />
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

export default function BundlesPage() {
  const { editMode } = useEdit();
  const bundles = useBundles();
  const createBundle = useCreateBundle();
  const deleteBundle = useDeleteBundle();
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const list = bundles.data ?? [];

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">Bundles</h1>
          <p className="mt-4 text-slate-700">
            Course and printed notes, bundled together at a discounted combined price. Message us
            on WhatsApp to order.
          </p>
        </div>

        {editMode && (
          <div className="mx-auto mt-8 flex max-w-xl items-end gap-2 rounded-card border border-dashed border-royal-500/50 bg-mist-100/60 p-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-plum-900">New bundle name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. FRCPath Complete Bundle"
                className={field}
              />
            </div>
            <Button
              disabled={!newName.trim() || createBundle.isPending}
              onClick={() =>
                createBundle.mutate(
                  { name: newName },
                  {
                    onSuccess: (b) => {
                      setNewName("");
                      setEditingId(b.id);
                    },
                  }
                )
              }
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.length === 0 && (
            <p className="text-slate-700">
              No bundles yet. {editMode ? "Add one above." : "Check back soon."}
            </p>
          )}
          {list.map((bundle) =>
            editMode && editingId === bundle.id ? (
              <BundleEditPanel key={bundle.id} bundle={bundle} onDone={() => setEditingId(null)} />
            ) : (
              <div key={bundle.id} className="group relative h-full">
                <ShopProductCard product={bundle} />
                {editMode && (
                  <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => setEditingId(bundle.id)}
                      className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-royal-500"
                      title="Edit bundle"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${bundle.name}"?`)) deleteBundle.mutate(bundle.id);
                      }}
                      className="rounded-full bg-white p-1.5 text-smoke-400 shadow-soft hover:text-rose-700"
                      title="Delete bundle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </Container>
    </Section>
  );
}
