"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  Layers,
  Package,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useSiteSettings } from "@/lib/catalog/hooks";

const ICONS: Record<string, LucideIcon> = {
  ClipboardCheck,
  BookOpenCheck,
  Layers,
  Package,
};

export default function ShopPage() {
  const s = useSiteSettings();
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">{s.shopHeading}</h1>
          <p className="mt-4 text-slate-700">{s.shopSubtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {s.shopCards.map((category) => {
            const Icon = ICONS[category.icon] ?? HelpCircle;
            return (
              <Link
                key={category.href + category.title}
                href={category.href}
                className="group flex flex-col gap-4 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-panel bg-cyto-100 text-rose-700 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="font-display text-lg font-semibold text-plum-900">{category.title}</h2>
                <p className="text-sm leading-relaxed text-slate-700">{category.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-rose-700">
                  Browse
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
