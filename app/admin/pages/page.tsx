"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

const pages = [
  { slug: "support", label: "Support" },
  { slug: "privacy-policy", label: "Privacy policy" },
  { slug: "terms-and-conditions", label: "Terms and conditions" },
  { slug: "cancellation-refund-policy", label: "Cancellation & refund policy" },
  { slug: "shipping-policy", label: "Shipping policy" },
  { slug: "disclaimer", label: "Disclaimer" },
  { slug: "delete-account", label: "Delete account" },
  { slug: "services-frcpath-exam-preparation", label: "Service: FRCPath exam preparation" },
  { slug: "services-neet-ss-and-ini-ss-pathology-prep", label: "Service: NEET-SS and INI-SS pathology prep" },
  { slug: "services-pathology-mcq-practice-banks", label: "Service: Pathology MCQ practice banks" },
  { slug: "services-hard-copy-pathology-notes", label: "Service: Hard-copy pathology notes" },
  { slug: "services-full-length-pathology-mock-tests", label: "Service: Full-length pathology mock tests" },
];

export default function AdminPagesIndex() {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-royal-500">
        Editable pages
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-plum-900">
        Legal, support, and service pages
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-700">
        Choose a page to edit its title, intro, and content sections.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className="flex items-center gap-3 rounded-panel border border-iris-300/40 bg-white p-4 text-sm font-semibold text-plum-900 shadow-soft transition hover:border-royal-500/50 hover:bg-mist-100/50"
          >
            <FileText className="h-4 w-4 text-royal-500" />
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
