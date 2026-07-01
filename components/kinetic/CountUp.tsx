"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useMotion } from "./MotionProvider";

/**
 * Animate a number from 0 → target once the element scrolls into view.
 * Uses only primitive props so it can safely be embedded inside RSC-rendered
 * components. Respects the site-wide motion preference.
 */
export default function CountUp({
  to,
  duration = 0.9,
  decimals = 0,
  grouping = true,
  className = "",
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  decimals?: number;
  grouping?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const { shouldAnimate } = useMotion();

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        useGrouping: grouping,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [grouping, decimals],
  );

  const [display, setDisplay] = useState<string>(
    shouldAnimate ? formatter.format(0) : formatter.format(to),
  );

  useEffect(() => {
    if (!inView) return;
    if (!shouldAnimate) {
      setDisplay(formatter.format(to));
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(formatter.format(v)),
    });
    return () => controls.stop();
  }, [inView, shouldAnimate, to, duration, formatter]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
