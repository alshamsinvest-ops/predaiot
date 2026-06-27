"use client";

import { useState } from "react";
import { useLiveStore } from "@/store/liveStore";
import type { DecisionAction } from "@/types/energy";
import { fmtOMR } from "@/lib/constants";

const ACTION_COLOR: Record<DecisionAction, string> = {
  CHARGE: "text-positive",
  DISCHARGE: "text-accent",
  HOLD: "text-ink-muted",
  ABSORB: "text-[var(--color-gold)]",
};

const FILTERS: { key: "ALL" | DecisionAction; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "CHARGE", label: "Charge" },
  { key: "DISCHARGE", label: "Discharge" },
  { key: "ABSORB", label: "Absorb" },
  { key: "HOLD", label: "Hold" },
];

function timeOf(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export default function DecisionLog() {
  const log = useLiveStore((s) => s.decisionLog);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("ALL");
  const filtered = filter === "ALL" ? log : log.filter((d) => d.action === filter);

  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          Decision Log · last {log.length}
        </p>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                filter === f.key
                  ? "bg-secondary text-[#04081A]"
                  : "border border-white/10 text-ink-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">
            Waiting for decisions…
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((d, idx) => (
              <li
                key={`${d.timestamp}-${idx}`}
                className="rounded-xl border border-white/5 bg-black/30 p-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-ink-muted">
                    {timeOf(d.timestamp)}
                  </span>
                  <span className={`font-mono font-bold ${ACTION_COLOR[d.action]}`}>
                    {d.action}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink">{d.reason}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                  <span className="font-mono">
                    {fmtOMR(d.omr_impact_per_decision)} OMR ·{" "}
                    {d.confidence_percent}% conf
                  </span>
                  {d.ems_divergence && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                      vs EMS {d.ems_action}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
