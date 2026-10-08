import { notFound } from "next/navigation";
import PageContent from "./page-content";
import { getTopic } from "@/lib/seo/content";
import { pageMetadata, pageGraph } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ topic: string }> };
export async function generateMetadata({ params }: Props) {
  const { topic } = await params;
  const item = await getTopic(topic);
  if (!item) notFound();
  return pageMetadata(`/practice/${topic}`, { title: `${item.label} MCQ practice`, description: `Practise ${item.label} multiple-choice questions with explanations.` });
}
export default async function Page({ params }: Props) {
  const { topic } = await params;
  const item = await getTopic(topic);
  if (!item) notFound();
  return <><JsonLd data={pageGraph(`/practice/${topic}`, `${item.label} MCQ practice`)} /><PageContent initialTopic={item} /></>;
}
