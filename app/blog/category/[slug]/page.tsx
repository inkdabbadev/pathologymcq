import { notFound } from "next/navigation";
import PageContent from "./page-content";
import { getCategory } from "@/lib/seo/content";
import { pageMetadata, pageGraph } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  return pageMetadata(`/blog/category/${slug}`, { title: category.name, description: `Pathology articles and revision resources about ${category.name}.` });
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  return <><JsonLd data={pageGraph(`/blog/category/${slug}`, category.name, undefined, { "@type": "CollectionPage" })} /><PageContent initialCategory={category} /></>;
}
