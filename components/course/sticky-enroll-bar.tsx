"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

export function StickyEnrollBar({ course }: { course: Course }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-iris-300/30 bg-white/95 px-4 py-3 shadow-lifted backdrop-blur-xl sm:px-6"
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-plum-900">{course.title}</p>
              <p className="text-sm text-smoke-400">
                {formatPrice(course.priceCents, course.currency)}
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href={`/register?redirect=/courses/${course.slug}`}>Enroll now</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
