import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { MockTestCard } from "@/components/marketing/mock-test-card";
import { MOCK_TEST_TYPES } from "@/lib/mock/mock-test-types";
import { MOCK_TEST_PRODUCTS } from "@/lib/mock/mock-test-products";

export const metadata: Metadata = {
  title: "Mock Tests",
  description:
    "Access your purchased mock tests, or browse full-length and mini-mock tests across FRCPath, NEET-SS, INI-SS and hematopathology.",
};

export default function MockTestsPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Mock Tests
          </h1>
          <p className="mt-4 text-slate-700">
            Already purchased one of our mock tests? Select it below to log in and access your
            quiz.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/courses?exam=mock-tests">
              Haven&apos;t purchased yet? Browse mock test courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 flex flex-col gap-16">
          {MOCK_TEST_TYPES.map((type) => {
            const products = MOCK_TEST_PRODUCTS.filter(
              (product) => product.category === type.category
            );
            if (products.length === 0) return null;

            return (
              <div key={type.category} id={type.category}>
                <h2 className="font-display text-2xl font-bold text-plum-900">{type.label}</h2>
                <p className="mt-1 text-sm text-slate-700">{type.description}</p>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <MockTestCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
