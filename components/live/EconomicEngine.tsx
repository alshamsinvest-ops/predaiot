"use client";

import { useLiveStore } from "@/store/liveStore";
import { fmtOMR } from "@/lib/constants";

const ACTION_TONE: Record<string, { tile: string; text: string; bg: string }> = {
  CHARGE: { tile: "border-positive/40", text: "text-positive", bg: "bg-positive/10" },
  DISCHARGE: { tile: "border-accent/40", text: "text-accent", bg: "bg-accent/10" },
  ABSORB: {
    tile: "border-[var(--color-gold)]/40",
    text: "text-[var(--color-gold)]",
    bg: "bg-[var(--color-gold)]/10",
  },
  HOLD: { tile: "border-white/10", text: "text-ink-muted", bg: "bg-white/5" },
};

function VBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, ((value + max) / (2 * max)) * 100));
  const positive = value >= 0;
  return (
    <div>
      <div className="flex justify-between font-mono text-[11px] text-ink-muted">
        <span>{label}</span>
        <span className={positive ? "text-positive" : "text-accent"}>
          {value >= 0 ? "+" : ""}
          {value.toFixed(2)}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-1.5 ${positive ? "bg-positive" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function EconomicEngine() {
  const decision = useLiveStore((s) => s.currentDecision);
  if (!decision) {
    return (
      <div className="surface rounded-2xl p-6">
        <div className="pulse h-3 w-40 rounded bg-white/10" />
        <div className="pulse mt-4 h-14 w-48 rounded bg-secondary/20" />
        <div className="pulse mt-3 h-3 w-3/4 rounded bg-white/10" />
        <div className="mt-6 space-y-3">
          <div className="pulse h-2 w-full rounded-full bg-white/10" />
          <div className="pulse h-2 w-full rounded-full bg-white/10" />
          <div className="pulse h-2 w-full rounded-full bg-white/10" />
        </div>
      </div>
    );
  }
  const tone = ACTION_TONE[decision.action];

  return (
    <div className={`surface rounded-2xl border ${tone.tile} p-6`}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          Economic Engine — recommended action
        </p>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tone.bg} ${tone.text}`}
        >
          {decision.confidence_level} · {decision.confidence_percent}%
        </span>
      </div>

      <div className={`mt-4 inline-flex items-baseline gap-3 rounded-2xl px-5 py-3 ${tone.bg}`}>
        <span className={`font-display text-5xl font-extrabold ${tone.text}`}>
          {decision.action}
        </span>
        <span className="font-mono text-xs text-ink-muted">
          {decision.executed ? "EXECUTED" : "ADVISORY"}
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-sm text-ink">
        {decision.reason}
      </p>

      <div className="mt-6 grid gap-3">
        <VBar label="V_charge   (OMR/MWh)" value={decision.V_charge} max={10} />
        <VBar label="V_discharge (OMR/MWh)" value={decision.V_discharge} max={10} />
        <VBar label="V_absorb    (OMR/MWh)" value={decision.V_absorb} max={20} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            OMR impact / decision
          </p>
          <p className="mt-1 font-display text-xl font-extrabold text-secondary">
            {fmtOMR(decision.omr_impact_per_decision)} OMR
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            EMS would have done
          </p>
          <p className="mt-1 font-display text-xl font-extrabold">
            {decision.ems_action}
            {decision.ems_divergence && (
              <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                DIVERGENCE
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Opportunity cost
          </p>
          <p className="mt-1 font-display text-xl font-extrabold text-accent">
            {fmtOMR(decision.ems_opportunity_cost_omr)} OMR
          </p>
        </div>
      </div>
    </div>
  );
}
