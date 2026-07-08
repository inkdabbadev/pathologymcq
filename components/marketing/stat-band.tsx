"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/container";
import type { Stat } from "@/lib/api/types";

function AnimatedStat({ stat }: { stat: Stat }) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    const controls = animate(0, stat.value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setDisplay(Math.round(value)),
    });
    return () => controls.stop();
  }, [inView, shouldReduceMotion, stat.value]);

  const shownValue = shouldReduceMotion ? stat.value : display;

  return (
    <div className="flex flex-col items-center text-center">
      <p ref={ref} className="font-display text-4xl font-bold text-white sm:text-5xl">
        {shownValue.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-iris-300">
        {stat.label}
      </p>
    </div>
  );
}

export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <div className="bg-gradient-to-br from-plum-900 to-twilight-900 py-16">
      <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedStat key={stat.id} stat={stat} />
        ))}
      </Container>
    </div>
  );
}
