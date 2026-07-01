"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotion } from "./MotionProvider";

/**
 * Wraps a child (typically a LinkButton) with a spring-magnetic hover: the
 * child drifts up to ~6 px toward the cursor while the pointer is within
 * ~90 px of centre. Uses transform only — no layout thrash — and keeps
 * focus behavior of the inner element unchanged.
 */
export default function MagneticButton({
  children,
  strength = 0.28,
  radius = 90,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.6 });
  const { shouldAnimate } = useMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!shouldAnimate) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
