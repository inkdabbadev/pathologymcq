import { notFound, redirect } from "next/navigation";
import { getPost, postCanonical, postRedirect } from "@/lib/seo/content";
import { Article, articleMetadata } from "@/components/seo/article";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return articleMetadata(post, postCanonical(post));
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const path = `/blog/${slug}`;
  const target = postRedirect(post, path);
  // Editable destinations use a temporary redirect, so future admin changes work.
  if (target) redirect(target);
  return <Article post={post} path={path} />;
}
