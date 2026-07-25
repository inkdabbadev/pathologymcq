"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewBlogButton({
  categorySlug,
  isAdmin,
}: {
  categorySlug: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isAdmin) return null;

  const create = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/categories/${categorySlug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = (await res.json().catch(() => ({}))) as { post?: { slug: string } };
      if (res.ok && json.post) {
        router.push(`/category/${categorySlug}/${json.post.slug}`);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto mt-8 flex max-w-md flex-col gap-2 rounded-card border border-dashed border-iris-300/50 bg-mist-100/40 p-4 sm:flex-row">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New blog title"
        className="flex-1 rounded-full border border-iris-300/50 bg-white px-4 py-2 text-sm text-plum-900 outline-none focus:border-royal-500"
      />
      <button
        onClick={create}
        disabled={creating || !title.trim()}
        className="shrink-0 rounded-full bg-plum-900 px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
      >
        {creating ? "Creating…" : "+ New blog"}
      </button>
    </div>
  );
}
