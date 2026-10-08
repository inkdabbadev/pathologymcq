import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/cancellation-refund-policy");

export default function Page() {
  const config = staticRoutes["/cancellation-refund-policy"];
  return <><JsonLd data={pageGraph("/cancellation-refund-policy", config.title, config.description)} /><PageContent /></>;
}
