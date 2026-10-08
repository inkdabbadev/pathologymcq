import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/support");

export default function Page() {
  const config = staticRoutes["/support"];
  return <><JsonLd data={pageGraph("/support", config.title, config.description)} /><PageContent /></>;
}
