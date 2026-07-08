import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/api/types";

export function FaqSection({ items, idPrefix = "faq" }: { items: FaqItem[]; idPrefix?: string }) {
  return (
    <Accordion type="single" collapsible className="flex flex-col gap-3">
      {items.map((item, index) => (
        <AccordionItem key={`${idPrefix}-${index}`} value={`${idPrefix}-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
