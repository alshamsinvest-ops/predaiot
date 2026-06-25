"use client";

import { useEffect, useState } from "react";

/**
 * PREDAIOT Economic Engine — live simulation widget for the hero.
 * Shows running CHARGE/DISCHARGE/HOLD decisions driven by simulated grid prices
 * and battery SOC, with a session OMR-recovered counter. Clearly labeled
 * "live simulation · official Oman market data" — never live operations.
 */
type Decision = "CHARGE" | "DISCHARGE" | "HOLD";

const decisionColor: Record<Decision, string> = {
  CHARGE: "#00CC66",
  DISCHARGE: "#FF6630",
  HOLD: "#6B7A99",
};

export default function HeroDashboard() {
  const [omrSaved, setOmrSaved] = useState(1847);
  const [decision, setDecision] = useState<Decision>("CHARGE");
  const [soc, setSoc] = useState(58);
  const [price, setPrice] = useState(0.068);
  const [decisions, setDecisions] = useState(203);

  useEffect(() => {
    const id = setInterval(() => {
      const newPrice = 0.052 + Math.random() * 0.085;
      setPrice(newPrice);
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
      setOmrSaved((s) => s + Math.round(Math.random() * 45 + 10));
      setDecisions((d) => d + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const fils = Math.round(price * 1000);
  const priceColor = price > 0.1 ? "#FF6630" : "#00CC66";

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
        <div className="mb-4">
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
