import Link from "next/link";
import { Globe, Mail, Link2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/components/marketing/whatsapp-button";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "Courses" },
      { href: "/practice", label: "Question Bank" },
      { href: "/mock-tests", label: "Mock Tests" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/my-courses", label: "My Courses" },
      { href: "/account", label: "Account Settings" },
      { href: "/login", label: "Log in" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About / Faculty" },
      { href: "/#testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQ" },
      { href: getWhatsAppLink(), label: "Contact / WhatsApp" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-iris-300/30 bg-twilight-900 text-mist-100">
      <Container className="py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-hero bg-gradient-to-br from-hema-700 to-plum-900 p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to master pathology?
            </h2>
            <p className="mt-2 max-w-lg text-sm text-iris-300">
              Join thousands of trainees preparing for FRCPath, NEET-SS, INI-SS and
              MD/DNB with image-rich MCQs and mock tests built by faculty.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/register">Start practicing free</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-iris-300">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
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
            &copy; {new Date().getFullYear()} Pathology MCQ. All rights reserved.
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
