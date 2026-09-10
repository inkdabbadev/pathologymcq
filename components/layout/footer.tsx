"use client";

import Link from "next/link";
import { Globe, Mail, Link2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buildWaLink } from "@/components/marketing/whatsapp-button";
import { useSiteSettings } from "@/lib/catalog/hooks";

export function Footer() {
  const s = useSiteSettings();
  const resolve = (href: string) =>
    href === "whatsapp"
      ? buildWaLink(s.whatsappNumber, "Hi! I have a question about Pathology MCQ.")
      : href;

  return (
    <footer className="mt-24 border-t border-iris-300/30 bg-plum-900 text-mist-100">
      <Container className="py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-hero bg-gradient-to-br from-royal-500 to-hema-700 p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {s.footerCta.heading}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-iris-300">{s.footerCta.subtext}</p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href={s.footerCta.buttonHref}>{s.footerCta.buttonLabel}</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {s.footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-iris-300">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={resolve(link.href)}
                      className="text-sm text-mist-100/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-mist-100/60">
            &copy; {new Date().getFullYear()} {s.copyright}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Globe, Mail, Link2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="text-mist-100/60 transition-colors hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
