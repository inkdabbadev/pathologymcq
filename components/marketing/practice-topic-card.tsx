import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import type { PracticeTopic } from "@/lib/api/types";

export function PracticeTopicCard({
  topic,
  icon: Icon,
}: {
  topic: PracticeTopic;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={`/practice/${topic.slug}`}
      className="group flex flex-col items-center gap-3 rounded-card border border-iris-300/30 bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/50 hover:shadow-glow"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hema-700 to-plum-900 text-white transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold leading-snug text-plum-900">{topic.label}</span>
    </Link>
  );
}
