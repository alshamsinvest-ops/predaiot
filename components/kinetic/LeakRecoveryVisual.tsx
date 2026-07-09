"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useMotion } from "./MotionProvider";

/**
 * The "bleeding vs. optimization" story, told in one small chart + counter.
 * mode="leak"    → red declining curve, OMR counter draining downward.
 * mode="recover" → teal rising curve, OMR counter climbing.
 * Both derive from the published 862,903 OMR / 500 MW / year benchmark
 * (≈ 98.5 OMR per hour). Draws once on scroll into view, then ticks.
 */
const W = 220;
const H = 64;
const OMR_PER_HOUR = 862903 / 8760; // ≈ 98.5 — derived from published benchmark

function curvePath(mode: "leak" | "recover"): string {
  // Deterministic pseudo-random walk with a clear trend — no hydration flicker.
  const pts: number[] = [];
  let v = mode === "leak" ? 0.82 : 0.2;
  for (let i = 0; i < 22; i++) {
    const wobble = Math.sin(i * 1.7) * 0.05 + Math.sin(i * 0.61) * 0.04;
    const trend = mode === "leak" ? -0.028 : 0.028;
    v = Math.max(0.06, Math.min(0.94, v + trend + wobble * 0.5));
    pts.push(v);
  }
  return pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * W;
      const y = H - 6 - p * (H - 12);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function LeakRecoveryVisual({
  mode,
  labelLeak = "value leaking · derived from published benchmark",
  labelRecover = "value recovered · derived from published benchmark",
}: {
  mode: "leak" | "recover";
  labelLeak?: string;
  labelRecover?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const { shouldAnimate } = useMotion();
  const [elapsed, setElapsed] = useState(0);

  const color = mode === "leak" ? "var(--color-negative)" : "var(--color-secondary)";
  const path = useMemo(() => curvePath(mode), [mode]);

  // Tick a live-feeling hourly counter once visible.
  useEffect(() => {
    if (!inView || !shouldAnimate) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1200);
    return () => clearInterval(id);
  }, [inView, shouldAnimate]);

  const omr = ((elapsed * OMR_PER_HOUR) / 36).toFixed(1); // slow drip for display
  const sign = mode === "leak" ? "−" : "+";
  const label = mode === "leak" ? labelLeak : labelRecover;

  return (
    <div ref={ref} className="mt-5 border-t border-line pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className="font-mono text-xl font-semibold tabular-nums sm:text-2xl"
          style={{ color }}
        >
          {sign}
          {omr} OMR
        </span>
        <span className="font-mono text-[10px] tabular-nums text-ink-muted">
          {sign}98.5 OMR/h
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 h-16 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Thin line only — no fill, no glow (industrial spec). */}
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={shouldAnimate ? { pathLength: 0 } : false}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
    </div>
  );
}
