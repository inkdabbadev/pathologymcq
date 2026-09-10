import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand() {
  return (
    <Container>
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-hero bg-gradient-to-br from-royal-500 via-hema-700 to-plum-900 px-8 py-16 text-center shadow-lifted sm:px-16">
          <h2 className="max-w-2xl text-balance font-display text-3xl font-bold text-white sm:text-4xl">
            The exam will show you a slide. Have a plan for it.
          </h2>
          <p className="max-w-xl text-balance text-iris-300">
            Join pathologists in 25+ countries preparing with Pathology MCQ.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Try free questions</Link>
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
