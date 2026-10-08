import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/terms-and-conditions");

export default function Page() {
  const config = staticRoutes["/terms-and-conditions"];
  return <><JsonLd data={pageGraph("/terms-and-conditions", config.title, config.description)} /><PageContent /></>;
}
