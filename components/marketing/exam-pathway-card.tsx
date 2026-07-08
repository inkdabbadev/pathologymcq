import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ExamPathway } from "@/lib/mock/exam-pathways";

export function ExamPathwayCard({ pathway }: { pathway: ExamPathway }) {
  return (
    <Link
      href={`/courses?exam=${pathway.category}`}
      className="group flex flex-col justify-between gap-6 rounded-card border border-iris-300/30 bg-gradient-to-br from-white to-mist-100 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
    >
      <div>
        <h3 className="font-display text-lg font-semibold text-plum-900">{pathway.label}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{pathway.description}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-700">
        Explore courses
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
