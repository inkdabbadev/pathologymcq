import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/shop");

export default function Page() {
  const config = staticRoutes["/shop"];
  return <><JsonLd data={pageGraph("/shop", config.title, config.description)} /><PageContent /></>;
}
