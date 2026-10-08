import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/privacy-policy");

export default function Page() {
  const config = staticRoutes["/privacy-policy"];
  return <><JsonLd data={pageGraph("/privacy-policy", config.title, config.description)} /><PageContent /></>;
}
