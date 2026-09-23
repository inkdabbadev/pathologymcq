"use client";

import { useParams } from "next/navigation";

import { ContentPage } from "@/components/pages/content-page";

export default function AdminContentPage() {
  const params = useParams<{ slug: string }>();
  return <ContentPage slug={params?.slug ?? ""} />;
}
