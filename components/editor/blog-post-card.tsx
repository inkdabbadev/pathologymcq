"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import type { BlogPostMeta } from "@/lib/blocks/posts-store";

export function BlogPostCard({
  categorySlug,
  post,
  isAdmin,
}: {
  categorySlug: string;
  post: BlogPostMeta;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${post.title}"?`)) return;

    setDeleting(true);
    try {
      await fetch(`/api/categories/${categorySlug}/posts/${post.slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Link
      href={`/category/${categorySlug}/${post.slug}`}
      className="group relative rounded-card border border-iris-300/30 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
    >
      <h2 className="pr-8 font-semibold text-plum-900">{post.title}</h2>
      {isAdmin && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${post.title}`}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-700/10 hover:text-rose-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </Link>
  );
}
