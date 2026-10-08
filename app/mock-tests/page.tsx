import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/mock-tests");

export default function Page() {
  const config = staticRoutes["/mock-tests"];
  return <><JsonLd data={pageGraph("/mock-tests", config.title, config.description)} /><PageContent /></>;
}
