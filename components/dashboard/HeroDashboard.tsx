"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { OMAN_PRICE_PROFILE_24H } from "@/lib/price-model";
import { useMotion } from "@/components/kinetic/MotionProvider";

/**
 * PREDAIOT Economic Engine — live simulation widget for the hero.
 * On load the OMR counter counts up from zero and the price sparkline
 * draws itself; both then keep ticking with simulated grid prices and
 * battery SOC. Clearly labeled "live simulation · official Oman market
 * data" — never live operations.
 */
type Decision = "CHARGE" | "DISCHARGE" | "HOLD";

const decisionColor: Record<Decision, string> = {
  CHARGE: "#00CC66",
  DISCHARGE: "#FF6630",
  HOLD: "#6B7A99",
};

const OMR_START = 1847;
const SPARK_W = 260;
const SPARK_H = 56;
const SPARK_POINTS = 24;

function sparkPath(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * SPARK_W;
      const y = SPARK_H - 6 - ((v - min) / span) * (SPARK_H - 12);
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
    // Seed the sparkline from the real Oman 24h profile, scaled to fils range.
    const hour = new Date().getHours();
    return Array.from({ length: SPARK_POINTS }, (_, i) => {
      const h = (hour - (SPARK_POINTS - 1 - i) + 24) % 24;
      return OMAN_PRICE_PROFILE_24H[h];
    });
  });
  const countedUp = useRef(false);

  // Count-up from 0 on first mount, then hand over to the tick loop.
  useEffect(() => {
    if (countedUp.current) return;
    countedUp.current = true;
    if (!shouldAnimate) {
      setOmrSaved(OMR_START);
      return;
    }
    const controls = animate(0, OMR_START, {
      duration: 1.6,
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
  const priceColor = price > 0.1 ? "#FF6630" : "#00CC66";
  const path = useMemo(() => sparkPath(prices), [prices]);

  return (
    <div className="surface relative overflow-hidden rounded-3xl p-5 font-mono">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="pulse h-2 w-2 rounded-full"
            style={{ background: "#00CC66" }}
            aria-hidden="true"
          />
          <span className="text-[10px] uppercase tracking-[0.15em] text-ink-muted">
            PREDAIOT Economic Engine · Live simulation
          </span>
        </div>

        {/* Headline OMR counter */}
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-ink-muted">
            Revenue recovered (session)
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-extrabold text-secondary sm:text-4xl">
              {omrSaved.toLocaleString()}
            </span>
            <span className="text-sm text-ink-muted">OMR</span>
          </div>
        </div>

        {/* Self-drawing price sparkline */}
        <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-wider text-ink-muted">
              Grid price · 24h
            </span>
            <span className="text-[9px] tabular-nums" style={{ color: priceColor }}>
              {fils} fils/kWh
            </span>
          </div>
          <svg
            viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
            className="mt-1 h-14 w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#00CFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`${path} L${SPARK_W},${SPARK_H} L0,${SPARK_H} Z`}
              fill="url(#spark-fade)"
              stroke="none"
              initial={shouldAnimate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            />
            <motion.path
              d={path}
              fill="none"
              stroke="#00CFFF"
              strokeWidth={1.75}
              strokeLinecap="round"
              initial={shouldAnimate ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Stat label="Engine decision" value={decision} valueColor={decisionColor[decision]} />
          <Stat label="Grid price" value={`${fils} fils/kWh`} valueColor={priceColor} />
          <Stat label="Battery SOC" value={`${Math.round(soc)}%`} valueColor="#00CFFF" />
          <Stat label="Decisions today" value={decisions.toLocaleString()} valueColor="#F0F4FF" />
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-muted">
          Illustrative simulation · Based on official Oman market data
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="mt-1 text-sm font-bold tabular-nums" style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
}
