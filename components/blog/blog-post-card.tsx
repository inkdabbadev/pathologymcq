import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog/types";

const FALLBACK = "/mock/course-thumb-2.svg";

export function BlogPostCard({
  post,
  showDraft,
}: {
  post: BlogPost;
  showDraft?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-mist-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover_image || FALLBACK}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {showDraft && post.status === "draft" && (
          <span className="absolute left-3 top-3 rounded-full bg-plum-900/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Draft
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {post.category && (
          <Badge variant="default" className="w-fit normal-case">
            {post.category.name}
          </Badge>
        )}
        <h3 className="font-display text-base font-semibold leading-snug text-plum-900">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-700">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
