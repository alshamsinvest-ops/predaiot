"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useMotion } from "./MotionProvider";

/**
 * Subtle scroll parallax for hero backgrounds. The child layer drifts
 * slower than the page (default 18% of scroll distance), which reads as
 * depth without motion sickness. Static markup when motion is off.
 */
export default function Parallax({
  children,
  className = "",
  amount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { shouldAnimate } = useMotion();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${amount * 100}%`]);

  if (!shouldAnimate || reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {/* Oversized layer so the drift never exposes an edge */}
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[12%] -bottom-[12%] will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
