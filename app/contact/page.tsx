import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/contact");

export default function Page() {
  const config = staticRoutes["/contact"];
  return <><JsonLd data={pageGraph("/contact", config.title, config.description)} /><PageContent /></>;
}
