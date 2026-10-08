import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/practice");

export default function Page() {
  const config = staticRoutes["/practice"];
  return <><JsonLd data={pageGraph("/practice", config.title, config.description)} /><PageContent /></>;
}
