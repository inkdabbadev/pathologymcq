import { CheckCircle2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CurriculumModule } from "@/lib/api/types";

export function CourseCurriculum({ modules }: { modules: CurriculumModule[] }) {
  return (
    <Accordion type="single" collapsible defaultValue="module-0" className="flex flex-col gap-3">
      {modules.map((module, index) => (
        <AccordionItem key={module.title} value={`module-${index}`}>
          <AccordionTrigger>
            <span>
              <span className="mr-2 text-smoke-400">{`0${index + 1}`}</span>
              {module.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2">
              {module.lessons.map((lesson) => (
                <li key={lesson} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hema-700" />
                  {lesson}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
