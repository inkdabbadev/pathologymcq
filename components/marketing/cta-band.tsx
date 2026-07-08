import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function CtaBand() {
  return (
    <Container>
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-hero bg-gradient-to-br from-hema-700 via-plum-900 to-twilight-900 px-8 py-16 text-center shadow-lifted sm:px-16">
          <h2 className="max-w-2xl text-balance font-display text-3xl font-bold text-white sm:text-4xl">
            Your next exam attempt deserves better prep
          </h2>
          <p className="max-w-xl text-balance text-iris-300">
            Create a free account and get instant access to a sample question bank
            &mdash; no card required.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Create free account</Link>
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
