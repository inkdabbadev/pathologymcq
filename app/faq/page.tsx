import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BookText,
  CreditCard,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  Package,
  PlayCircle,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { FaqSection } from "@/components/marketing/faq-section";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { FAQ_CATEGORIES } from "@/lib/mock/faq-categories";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Pathology MCQ courses, enrollment, account management, hard copy notes, shipping, payments and more.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((category) =>
    category.items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    }))
  ),
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  general: HelpCircle,
  "courses-and-content": BookOpenCheck,
  "account-management": UserCog,
  "course-content-and-access": PlayCircle,
  "hard-copy-notes-and-shipping": Package,
  payments: CreditCard,
  "technical-support": LifeBuoy,
  "pdf-material": FileText,
  "amazon-kindle-ebooks": BookText,
  contact: Mail,
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold text-plum-900 sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-slate-700">
              Browse by topic, or message us directly if you can&apos;t find what you&apos;re
              looking for.
            </p>
            <div className="mt-4 flex justify-center">
              <WhatsAppButton message="Hi! I have a question about Pathology MCQ." />
            </div>
          </div>

          <RevealGroup className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FAQ_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.slug] ?? HelpCircle;
              return (
                <Reveal key={category.slug}>
                  <Link
                    href={`#${category.slug}`}
                    className="group flex items-center gap-4 rounded-card border border-iris-300/30 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel bg-cyto-100 text-rose-700 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-sm font-semibold text-plum-900">
                        {category.title}
                      </span>
                      <span className="block text-xs text-smoke-400">
                        {category.items.length} question{category.items.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-smoke-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-rose-700" />
                  </Link>
                </Reveal>
              );
            })}
          </RevealGroup>

          <div className="mx-auto mt-16 flex max-w-3xl flex-col gap-14">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.slug} id={category.slug}>
                <h2 className="font-display text-2xl font-bold text-plum-900">
                  {category.title}
                </h2>
                <div className="mt-5">
                  <FaqSection items={category.items} idPrefix={category.slug} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
