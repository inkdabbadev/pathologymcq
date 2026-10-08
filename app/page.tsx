import PageContent from "./page-content";
import { pageMetadata, pageGraph, staticRoutes } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata = pageMetadata("/");
export const dynamic = "force-dynamic";

export default function Page() {
  const config = staticRoutes["/"];
  return <><JsonLd data={pageGraph("/", config.title, config.description)} /><PageContent /></>;
}
