import { Quote } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import type { Testimonial } from "@/lib/api/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-card border border-iris-300/30 bg-white p-6 shadow-soft sm:p-8">
      <Quote className="h-8 w-8 text-iris-300" aria-hidden />
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-slate-700">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar name={testimonial.name} size={44} />
        <div>
          <p className="font-semibold text-plum-900">{testimonial.name}</p>
          <p className="text-sm text-smoke-400">{testimonial.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
