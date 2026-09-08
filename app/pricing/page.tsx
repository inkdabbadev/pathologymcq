import Link from "next/link";
import { Check } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Pricing",
  description:
    "Choose your access to Pathology MCQ — flexible 3, 6 and 12-month plans for the NEET-SS · DM Oncopathology pathway and every board track.",
};

const ACCESS_FEATURES = [
  "Full oncopathology question bank with virtual slides",
  "Concise notes for every subspecialty",
  "Full-length NEET-SS mocks with performance breakdowns",
  "Doubts answered same day by practising pathologists",
];

const TRACKS = [
  {
    title: "FRCPath",
    body: "Part 1 & Part 2 courses plus RCPath dataset discussion and macro.",
  },
  {
    title: "NEET-SS · DM Oncopathology",
    body: "Subspecialty-weighted bank with dedicated NEET-SS mock tests.",
  },
  {
    title: "DM Hematopathology",
    body: "Flow cytometry, MRD, cytogenetics and molecular in one pathway.",
  },
  {
    title: "MD / DNB",
    body: "The approach-based course: from grossing to sign-out for routine practice.",
  },
  {
    title: "INI-SS & APCP",
    body: "Complete INI-SS histo/hemat mocks and APCP-aligned preparation.",
  },
];

export default function PricingPage() {
  return (
    <>
      <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-16">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-royal-500">Pricing</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-plum-900 sm:text-5xl">
            Choose your access
          </h1>
          <p className="mt-6 text-balance text-lg leading-relaxed text-slate-700">
            One platform, five board pathways. Pick the plan that fits your exam date —
            every track follows the same Read · Practise · Mock loop, with doubts answered
            the same day by practising pathologists.
          </p>
        </Container>
      </div>

      <Section>
        <Container className="max-w-2xl">
          <div className="rounded-card border border-iris-300/30 bg-white p-8 shadow-soft">
            <Badge variant="cyto">Flagship · NEET-SS · DM Oncopathology</Badge>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-plum-900">₹6k–10k</span>
              <span className="text-slate-700">/ 3 · 6 · 12 months</span>
            </div>
            <p className="mt-3 text-slate-700">
              The subspecialty-weighted pathway to a DM seat — tumour pathology the way
              NEET-SS actually tests it, with IHC and molecular built into every topic.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {ACCESS_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 w-full">
              <Link href="/shop/neet-ss-dm-oncopathology-course">Enrol now</Link>
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-slate-700">
            Looking for a different subject? Every course, bundle, mock and hard-copy price
            is listed in the <Link href="/shop" className="font-semibold text-rose-700">shop</Link>.
          </p>
        </Container>
      </Section>

      <Section ambient>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-plum-900 sm:text-4xl">
              Exam tracks
            </h2>
            <p className="mt-3 text-slate-700">One platform. Five board pathways.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((t) => (
              <div
                key={t.title}
                className="flex flex-col gap-2 rounded-card border border-iris-300/30 bg-white p-6 shadow-soft"
              >
                <h3 className="font-display text-lg font-semibold text-plum-900">{t.title}</h3>
                <p className="text-sm leading-relaxed text-slate-700">{t.body}</p>
                <Link href="/courses" className="mt-2 text-sm font-semibold text-rose-700">
                  View track
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
