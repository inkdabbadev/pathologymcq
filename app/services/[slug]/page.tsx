import { notFound } from "next/navigation";
import { ContentPage } from "@/components/pages/content-page";
import { getContentPage } from "@/lib/seo/content";
import { pageMetadata, pageGraph } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getContentPage(`services-${slug}`);
  if (!page) notFound();
  return pageMetadata(`/services/${slug}`, { title: page.title, description: page.intro });
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const page = await getContentPage(`services-${slug}`);
  if (!page) notFound();
  return <><JsonLd data={pageGraph(`/services/${slug}`, page.title, page.intro)} /><ContentPage slug={`services-${slug}`} /></>;
}
