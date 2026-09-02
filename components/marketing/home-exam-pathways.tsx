"use client";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { ExamPathwayCard } from "@/components/marketing/exam-pathway-card";
import { useSiteSettings } from "@/lib/catalog/hooks";
import type { ExamPathway } from "@/lib/mock/exam-pathways";

export function HomeExamPathways() {
  const s = useSiteSettings();
  return (
    <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {s.examPathways.map((pathway) => (
        <Reveal key={pathway.category}>
          <ExamPathwayCard pathway={pathway as ExamPathway} />
        </Reveal>
      ))}
    </RevealGroup>
  );
}
