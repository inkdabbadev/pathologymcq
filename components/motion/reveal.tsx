"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li";
}

/** Scroll-in-view fade/slide reveal used across marketing sections. Respects prefers-reduced-motion. */
export function Reveal({ children, className, delay = 0, y = 24, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

export interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

/** Wrap a list of Reveal children to stagger them by ~60ms per the motion spec. */
export function RevealGroup({ children, className, stagger = 0.06 }: RevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: shouldReduceMotion ? 0 : stagger }}
    >
      {children}
    </motion.div>
  );
}
