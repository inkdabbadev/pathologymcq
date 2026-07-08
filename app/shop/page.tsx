import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, ClipboardCheck, Layers, Package } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse mock tests, courses, hard copy books and bundles — everything Pathology MCQ offers in one place.",
};

const CATEGORIES = [
  {
    href: "/mock-tests",
    icon: ClipboardCheck,
    title: "Mock",
    description: "Full-length and mini-mock tests across every subspecialty and exam pattern.",
  },
  {
    href: "/courses",
    icon: BookOpenCheck,
    title: "Courses",
    description: "Structured, subspecialty-first curricula mapped to your target exam.",
  },
  {
    href: "/shop/hard-copy-books",
    icon: Layers,
    title: "Hard Copy Books",
    description: "Printed revision notes shipped to your door for offline study.",
  },
  {
    href: "/shop/bundles",
    icon: Package,
    title: "Bundles",
    description: "Course and hard copy notes bundled together at a discounted price.",
  },
];

export default function ShopPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">Shop</h1>
          <p className="mt-4 text-slate-700">
            Everything Pathology MCQ offers, in one place — mock tests, courses, printed notes
            and bundles.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group flex flex-col gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-panel bg-cyto-100 text-rose-700 transition-transform duration-300 group-hover:scale-110">
                <category.icon className="h-6 w-6" />
              </span>
              <h2 className="font-display text-lg font-semibold text-plum-900">
                {category.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-700">{category.description}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-rose-700">
                Browse
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
