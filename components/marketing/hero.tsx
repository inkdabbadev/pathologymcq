import Link from "next/link";
import { ArrowRight, Microscope, ShieldCheck } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

export function Hero() {
  return (
    <div className="bg-ambient relative -mt-[var(--nav-offset)] overflow-hidden pt-[calc(var(--nav-offset)+4rem)] pb-24 md:pt-[calc(var(--nav-offset)+6rem)]">
      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <Badge variant="cyto" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by 8,500+ pathology trainees
          </Badge>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] text-plum-900 sm:text-5xl md:text-6xl">
            Master pathology with image-rich MCQs built by exam faculty
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-700">
            Practice questions, subspecialty courses, and full-length mock tests for
            FRCPath, NEET-SS, INI-SS, MD/DNB and APCP &mdash; with a microscopy slide
            library you can zoom into like the real exam.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">
                Start practicing free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/courses">
                <Microscope className="h-4 w-4" />
                Browse courses
              </Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
