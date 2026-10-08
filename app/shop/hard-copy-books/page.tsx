import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/shop/hard-copy-books");

export default function Page() {
  const config = staticRoutes["/shop/hard-copy-books"];
  return <><JsonLd data={pageGraph("/shop/hard-copy-books", config.title, config.description)} /><PageContent /></>;
}
