import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/api/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-iris-300/30 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge variant="default" className="w-fit normal-case">
          {post.category}
        </Badge>
        <h3 className="font-display text-base font-semibold leading-snug text-plum-900">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-700">{post.excerpt}</p>
      </div>
    </Link>
  );
}
