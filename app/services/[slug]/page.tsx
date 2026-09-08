import { ContentPage } from "@/components/pages/content-page";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ContentPage slug={`services-${slug}`} />;
}
