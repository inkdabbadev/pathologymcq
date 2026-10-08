import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/shipping-policy");

export default function Page() {
  const config = staticRoutes["/shipping-policy"];
  return <><JsonLd data={pageGraph("/shipping-policy", config.title, config.description)} /><PageContent /></>;
}
