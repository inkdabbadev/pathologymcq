import Image from "next/image";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SamplePreviewOption {
  label: string;
  state?: "correct" | "incorrect";
}

export interface SamplePreviewProps {
  imageUrl: string;
  question: string;
  options: SamplePreviewOption[];
  explanation: string;
}

/**
 * Static illustration of the quiz-taking experience (slide + MCQ options + explanation).
 * Not the real quiz engine — that's built in its own future phase — this is a
 * representative preview embedded inline on the homepage and course pages.
 */
export function SamplePreview({ imageUrl, question, options, explanation }: SamplePreviewProps) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-hero border border-iris-300/30 bg-white shadow-lifted lg:grid-cols-2">
      <div className="relative aspect-[4/3] lg:aspect-auto">
        <Image src={imageUrl} alt="" fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-4 p-6 sm:p-8">
        <p className="font-display text-lg font-semibold text-plum-900">{question}</p>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <div
              key={option.label}
              className={cn(
                "flex h-12 items-center justify-between rounded-panel border px-4 text-sm font-medium",
                option.state === "correct" && "border-hema-700 bg-mist-100 text-plum-900",
                option.state === "incorrect" && "border-rose-700/50 bg-cyto-100 text-rose-700",
                !option.state && "border-smoke-400/40 text-slate-700"
              )}
            >
              {option.label}
              {option.state === "correct" && <Check className="h-4 w-4 text-hema-700" />}
              {option.state === "incorrect" && <X className="h-4 w-4 text-rose-700" />}
            </div>
          ))}
        </div>
        <div className="rounded-panel bg-cyto-100 p-4 text-sm leading-relaxed text-slate-700">
          <span className="font-semibold text-rose-700">Explanation: </span>
          {explanation}
        </div>
      </div>
    </div>
  );
}
