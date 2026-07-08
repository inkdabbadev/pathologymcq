import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ShopProductCard } from "@/components/marketing/shop-product-card";
import { HARD_COPY_BOOKS } from "@/lib/mock/hard-copy-books";

export const metadata: Metadata = {
  title: "Hard Copy Books",
  description:
    "Printed pathology revision notes — histopathology, hematopathology and histotechniques — shipped to your door.",
};

export default function HardCopyBooksPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Hard Copy Books
          </h1>
          <p className="mt-4 text-slate-700">
            Printed revision notes for offline study, shipped directly to you. Message us on
            WhatsApp to order — we&apos;ll confirm pricing and shipping for your location.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HARD_COPY_BOOKS.map((book) => (
            <ShopProductCard key={book.id} product={book} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
