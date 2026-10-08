import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/delete-account");

export default function Page() {
  const config = staticRoutes["/delete-account"];
  return <><JsonLd data={pageGraph("/delete-account", config.title, config.description)} /><PageContent /></>;
}
