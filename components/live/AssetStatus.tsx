"use client";

import { Battery, Sun, Zap } from "lucide-react";
import { useLiveStore } from "@/store/liveStore";
import { classifyPrice } from "@/lib/price-model";

const PRICE_TONE: Record<string, string> = {
  VERY_CHEAP: "text-positive",
  CHEAP: "text-positive",
  MODERATE: "text-ink",
  EXPENSIVE: "text-accent",
  PEAK: "text-accent",
};

export default function AssetStatus() {
  const telemetry = useLiveStore((s) => s.telemetry);
  if (!telemetry) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {["Battery", "Solar", "Grid SMP"].map((label) => (
          <div key={label} className="surface rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {label}
            </p>
            <div className="pulse mt-3 h-9 w-24 rounded bg-secondary/20" />
            <div className="pulse mt-4 h-2 w-full rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    );
  }
  const priceLevel = classifyPrice(telemetry.grid_price_omr_mwh);
  const priceTone = PRICE_TONE[priceLevel] ?? "text-ink";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Battery */}
      <div className="surface rounded-2xl p-5">
        <div className="flex items-center gap-2 text-secondary">
          <Battery className="h-4 w-4" />
          <p className="font-mono text-[11px] uppercase tracking-wider">
            Battery
          </p>
        </div>
        <p className="mt-3 font-display text-3xl font-extrabold">
          {telemetry.soc_percent.toFixed(0)}%
        </p>
        <div className="mt-3 h-2 w-full rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-secondary to-positive"
            style={{ width: `${Math.min(100, telemetry.soc_percent)}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-xs text-ink-muted">
          {telemetry.soc_mwh.toFixed(0)} MWh stored · 800 MWh capacity
        </p>
      </div>

      {/* Solar */}
      <div className="surface rounded-2xl p-5">
        <div className="flex items-center gap-2 text-accent">
          <Sun className="h-4 w-4" />
          <p className="font-mono text-[11px] uppercase tracking-wider">
            Solar
          </p>
        </div>
        <p className="mt-3 font-display text-3xl font-extrabold text-accent">
          {telemetry.solar_mw.toFixed(0)} MW
        </p>
        <p className="mt-3 font-mono text-xs text-ink-muted">
          {telemetry.curtailment_signal
            ? "⚠ Curtailment active — engine absorbing"
            : "Output within grid envelope"}
        </p>
        <p className="mt-1 font-mono text-[10px] text-ink-muted">
          625 MWp DC · 1.25 DC/AC · SAT bifacial
        </p>
      </div>

      {/* Grid */}
      <div className="surface rounded-2xl p-5">
        <div className="flex items-center gap-2 text-secondary">
          <Zap className="h-4 w-4" />
          <p className="font-mono text-[11px] uppercase tracking-wider">
            Grid SMP
          </p>
        </div>
        <p className={`mt-3 font-display text-3xl font-extrabold ${priceTone}`}>
          {telemetry.grid_price_omr_mwh.toFixed(2)}
        </p>
        <p className="font-mono text-xs text-ink-muted">OMR/MWh — {priceLevel}</p>
        <p className="mt-3 font-mono text-[10px] text-ink-muted">
          50.00 Hz nominal · MIS zone
        </p>
      </div>
    </div>
  );
}
