import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/shop/bundles");

export default function Page() {
  const config = staticRoutes["/shop/bundles"];
  return <><JsonLd data={pageGraph("/shop/bundles", config.title, config.description)} /><PageContent /></>;
}
