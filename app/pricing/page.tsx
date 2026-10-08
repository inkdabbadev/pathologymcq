import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/pricing");

export default function Page() {
  const config = staticRoutes["/pricing"];
  return <><JsonLd data={pageGraph("/pricing", config.title, config.description)} /><PageContent /></>;
}
