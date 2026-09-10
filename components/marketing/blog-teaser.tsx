"use client";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { usePosts } from "@/lib/blog/hooks";

/** Homepage "From the blog" grid — shows up to 3 published posts. */
export function BlogTeaser() {
  const q = usePosts();
  const posts = (q.data ?? []).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Reveal key={post.id}>
          <BlogPostCard post={post} />
        </Reveal>
      ))}
    </RevealGroup>
  );
}
