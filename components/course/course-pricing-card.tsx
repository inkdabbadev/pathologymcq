import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import type { Course } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

export function CoursePricingCard({ course }: { course: Course }) {
  return (
    <div
      id="pricing"
      className="sticky top-24 flex flex-col gap-5 rounded-hero border border-iris-300/30 bg-white p-6 shadow-lifted sm:p-8"
    >
      <div>
        <p className="text-sm text-smoke-400">One-time payment, lifetime course updates</p>
        <p className="mt-1 font-display text-4xl font-bold text-plum-900">
          {formatPrice(course.priceCents, course.currency)}
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {course.whatYouGet.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hema-700" />
            {item}
          </li>
        ))}
      </ul>

      <Button asChild size="lg" className="w-full">
        <Link href={`/register?redirect=/courses/${course.slug}`}>Enroll now</Link>
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-smoke-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secure checkout &middot; no login required to browse this page
      </p>

      <WhatsAppButton
        message={`Hi! I have a question about the ${course.title} course.`}
        label="Ask a question on WhatsApp"
        className="w-full"
      />
    </div>
  );
}
