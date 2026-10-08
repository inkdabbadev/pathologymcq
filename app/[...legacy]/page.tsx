import { notFound, redirect } from "next/navigation";
import { getLegacyPost, postRedirect } from "@/lib/seo/content";
import { Article, articleMetadata } from "@/components/seo/article";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ legacy: string[] }> };
export async function generateMetadata({ params }: Props) {
  const path = `/${(await params).legacy.join("/")}`;
  const post = await getLegacyPost(path);
  if (!post) notFound();
  return articleMetadata(post, path);
}
export default async function Page({ params }: Props) {
  const path = `/${(await params).legacy.join("/")}`;
  const post = await getLegacyPost(path);
  if (!post) notFound();
  const target = postRedirect(post, path);
  if (target) redirect(target);
  return <Article post={post} path={path} />;
}
