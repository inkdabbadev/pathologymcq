import { notFound } from "next/navigation";
import PageContent from "./page-content";
import { getCourse } from "@/lib/seo/content";
import { pageMetadata, pageGraph, SITE_URL } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();
  return pageMetadata(`/courses/${slug}`, { title: course.title, description: course.tagline, image: course.imageUrl });
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();
  return <><JsonLd data={pageGraph(`/courses/${slug}`, course.title, course.tagline, {
    "@type": "Course", provider: { "@id": `${SITE_URL}/#organization` },
  })} /><PageContent initialCourse={course} /></>;
}
