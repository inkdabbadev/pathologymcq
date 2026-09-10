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
            Written by practising pathologists &middot; Latest updates &amp; guidelines
          </Badge>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] text-plum-900 sm:text-5xl md:text-6xl">
            We give you a plan.
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-700">
            Not another question dump. A week-by-week exam plan for FRCPath, NEET-SS,
            INI-SS, MD/DNB and the APCP boards &mdash; image-rich MCQs with virtual
            slides, structured notes, and full-length mocks that tell you exactly where
            you stand.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">
                Try free questions
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">
                <Microscope className="h-4 w-4" />
                Browse shop
              </Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Always updated", body: "Revised to the latest classifications and guidelines" },
              { label: "Slide-linked answers", body: "Explanations highlight the diagnostic region on the slide" },
              { label: "Doubts answered same day", body: "Every query goes to a practising pathologist" },
              { label: "4.9★ verified", body: "From pathologists in 25+ countries across five boards" },
            ].map((c) => (
              <div key={c.label} className="rounded-panel border border-iris-300/40 bg-white/70 p-3 text-left">
                <p className="text-sm font-semibold text-plum-900">{c.label}</p>
                <p className="mt-1 text-xs leading-snug text-slate-700">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
