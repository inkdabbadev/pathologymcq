import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ShopProductCard } from "@/components/marketing/shop-product-card";
import { BUNDLES } from "@/lib/mock/bundles";

export const metadata: Metadata = {
  title: "Bundles",
  description:
    "Course and hard copy notes bundles at a discounted combined price — everything you need for one exam in a single package.",
};

export default function BundlesPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">Bundles</h1>
          <p className="mt-4 text-slate-700">
            Course and printed notes, bundled together at a discounted combined price. Message us
            on WhatsApp to order.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLES.map((bundle) => (
            <ShopProductCard key={bundle.id} product={bundle} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
