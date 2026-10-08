import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/blog");

export default function Page() {
  const config = staticRoutes["/blog"];
  return <><JsonLd data={pageGraph("/blog", config.title, config.description)} /><PageContent /></>;
}
