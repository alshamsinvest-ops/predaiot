"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useMotion } from "./MotionProvider";

/**
 * Scroll-reveal wrappers. `Reveal` fades a single block up into place the
 * first time it enters the viewport; `RevealGroup` staggers its children.
 * Both collapse to plain static markup when motion is off.
 */

const EASE = [0.21, 0.68, 0.19, 0.99] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const { shouldAnimate } = useMotion();
  const reduced = useReducedMotion();
  if (!shouldAnimate || reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className = "",
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { shouldAnimate } = useMotion();
  const reduced = useReducedMotion();
  if (!shouldAnimate || reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const { shouldAnimate } = useMotion();
  const reduced = useReducedMotion();
  if (!shouldAnimate || reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
