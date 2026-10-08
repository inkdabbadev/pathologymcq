import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/courses");

export default function Page() {
  const config = staticRoutes["/courses"];
  return <><JsonLd data={pageGraph("/courses", config.title, config.description)} /><PageContent /></>;
}
