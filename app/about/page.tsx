import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/about");

export default function Page() {
  const config = staticRoutes["/about"];
  return <><JsonLd data={pageGraph("/about", config.title, config.description)} /><PageContent /></>;
}
