import Link from "next/link";
import { ArrowRight, CheckCircle2, Microscope } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand() {
  return (
    <Container>
      <Reveal>
        <div className="relative overflow-hidden rounded-hero bg-gradient-to-br from-royal-500 via-hema-700 to-plum-900 p-8 text-center shadow-lifted sm:p-12">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10 bg-white/5" />
          <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-eosin-500/10 blur-2xl" />
          <div className="relative mx-auto max-w-4xl">
            <div className="flex flex-col items-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-iris-300">
                <Microscope className="h-3.5 w-3.5" /> Start with a real slide
              </p>
              <h2 className="mt-5 max-w-2xl text-balance font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                The exam will show you a slide. Have a plan for it.
              </h2>
              <p className="mt-4 max-w-xl text-balance text-iris-300">
                Join pathologists in 25+ countries preparing with image-rich questions and clear explanations.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/practice">Try free questions <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  <Link href="/courses">Explore courses</Link>
                </Button>
              </div>
            </div>
            <div className="mt-9 grid overflow-hidden rounded-card border border-white/15 bg-white/10 text-left backdrop-blur-sm sm:grid-cols-3">
              {["Image-based pathology MCQs", "Instant answers and explanations", "Exam-focused topic pathways"].map((item, index) => (
                <div key={item} className={`flex items-center gap-3 px-5 py-4 text-sm font-medium text-iris-300 ${index ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-eosin-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
