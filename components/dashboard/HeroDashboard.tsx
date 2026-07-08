"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { OMAN_PRICE_PROFILE_24H } from "@/lib/price-model";
import { useMotion } from "@/components/kinetic/MotionProvider";

/**
 * PREDAIOT Economic Engine — one connected instrument panel (not a grid of
 * cards). Revenue Recovered dominates in mono/gold; the supporting metrics
 * read as a single hairline-divided instrument row beneath it. The only
 * motion is the number count-up and the live-dot opacity pulse.
 */
type Decision = "CHARGE" | "DISCHARGE" | "HOLD";

const OMR_START = 1847;
const SPARK_W = 320;
const SPARK_H = 46;
const SPARK_POINTS = 28;

function sparkPath(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * SPARK_W;
      const y = SPARK_H - 4 - ((v - min) / span) * (SPARK_H - 8);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function HeroDashboard() {
  const { shouldAnimate } = useMotion();
  const [omrSaved, setOmrSaved] = useState(0);
  const [decision, setDecision] = useState<Decision>("CHARGE");
  const [soc, setSoc] = useState(58);
  const [price, setPrice] = useState(0.068);
  const [decisions, setDecisions] = useState(203);
  const [prices, setPrices] = useState<number[]>(() => {
    const hour = new Date().getHours();
    return Array.from({ length: SPARK_POINTS }, (_, i) => {
      const h = (hour - (SPARK_POINTS - 1 - i) + 24) % 24;
      return OMAN_PRICE_PROFILE_24H[h];
    });
  });
  const countedUp = useRef(false);

  useEffect(() => {
    if (countedUp.current) return;
    countedUp.current = true;
    if (!shouldAnimate) {
      setOmrSaved(OMR_START);
      return;
    }
    const controls = animate(0, OMR_START, {
      duration: 1.4,
      ease: [0.16, 0.84, 0.28, 0.99],
      onUpdate: (v) => setOmrSaved(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const newPrice = 0.052 + Math.random() * 0.085;
      setPrice(newPrice);
      setPrices((prev) => [...prev.slice(1), newPrice * 140]);
      setSoc((s) => {
        const newSoc = Math.max(5, Math.min(98, s + (Math.random() > 0.5 ? 2 : -3)));
        const dec: Decision =
          newPrice < 0.07 && newSoc < 85
            ? "CHARGE"
            : newPrice > 0.1 && newSoc > 30
            ? "DISCHARGE"
            : "HOLD";
        setDecision(dec);
        return newSoc;
      });
      setOmrSaved((s) => (s >= OMR_START ? s + Math.round(Math.random() * 45 + 10) : s));
      setDecisions((d) => d + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const fils = Math.round(price * 1000);
  const path = useMemo(() => sparkPath(prices), [prices]);

  const metrics: { label: string; value: string; critical?: boolean }[] = [
    { label: "Engine decision", value: decision, critical: decision === "DISCHARGE" },
    { label: "Grid price", value: `${fils} fils/kWh` },
    { label: "Battery SoC", value: `${Math.round(soc)}%` },
    { label: "Decisions today", value: decisions.toLocaleString() },
  ];

  return (
    <div className="surface p-6 font-mono">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          PREDAIOT Economic Engine
        </span>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary">
          <span
            className="pulse inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--color-secondary)" }}
            aria-hidden="true"
          />
          Live · simulation
        </span>
      </div>

      {/* Dominant metric — Revenue Recovered */}
      <div className="pt-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Revenue recovered · session
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className="text-5xl font-semibold tabular-nums sm:text-6xl"
            style={{ color: "var(--color-gold)" }}
          >
            {omrSaved.toLocaleString()}
          </span>
          <span className="text-sm text-ink-muted">OMR</span>
        </div>
      </div>

      {/* Thin price line — no fill, no glow */}
      <svg
        viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
        className="mt-5 h-12 w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d={path}
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth={1.25}
          strokeLinecap="round"
          initial={shouldAnimate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </svg>

      {/* Supporting metrics — one hairline-divided instrument row */}
      <div className="mt-5 grid grid-cols-2 border-t border-line sm:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`px-3 py-3 ${i > 0 ? "border-line sm:border-s" : ""} ${
              i >= 2 ? "border-t border-line sm:border-t-0" : ""
            }`}
          >
            <div className="text-[9px] uppercase tracking-[0.15em] text-ink-muted">
              {m.label}
            </div>
            <div
              className="mt-1 text-sm font-semibold tabular-nums"
              style={{ color: m.critical ? "var(--color-negative)" : "var(--color-ink)" }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-ink-muted">
        Illustrative simulation · official Oman market data
      </p>
    </div>
  );
}
