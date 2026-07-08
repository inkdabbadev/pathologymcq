import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, PenLine } from "lucide-react";

const ITEMS = [
  {
    href: "/practice",
    icon: PenLine,
    title: "Free practice questions",
    description:
      "Real-time feedback with detailed explanations on every question — no account required to start.",
    cta: "Start practicing",
  },
  {
    href: "/mock-tests",
    icon: ClipboardCheck,
    title: "Full-length mock tests",
    description:
      "Exam-timed mock papers with percentile benchmarking, scored server-side just like the real exam.",
    cta: "View mock tests",
  },
];

export function PracticeTeaser() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-4 rounded-card border border-iris-300/30 bg-gradient-to-br from-white to-cyto-100 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glow sm:p-8"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-panel bg-white text-rose-700 shadow-soft">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-semibold text-plum-900">{item.title}</h3>
          <p className="text-sm leading-relaxed text-slate-700">{item.description}</p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-rose-700">
            {item.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
