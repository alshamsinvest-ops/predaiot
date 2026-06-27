"use client";

import { TrendingUp, AlertCircle } from "lucide-react";
import { useLiveStore } from "@/store/liveStore";
import { fmtOMR } from "@/lib/constants";

export default function GapMeter() {
  const omrRecoveredSession = useLiveStore((s) => s.omrRecoveredSession);
  const omrGapToday = useLiveStore((s) => s.omrGapToday);
  const eei = useLiveStore((s) => s.eei);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="surface rounded-2xl p-5">
        <div className="flex items-center gap-2 text-secondary">
          <TrendingUp className="h-4 w-4" />
          <p className="font-mono text-[11px] uppercase tracking-wider">
            Recovered this session
          </p>
        </div>
        <p className="mt-3 font-display text-3xl font-extrabold text-secondary">
          {fmtOMR(omrRecoveredSession)} OMR
        </p>
        <p className="mt-1 text-xs text-ink-muted">vs. fixed-schedule baseline</p>
      </div>

      <div className="surface rounded-2xl p-5">
        <div className="flex items-center gap-2 text-accent">
          <AlertCircle className="h-4 w-4" />
          <p className="font-mono text-[11px] uppercase tracking-wider">
            Gap accrued today
          </p>
        </div>
        <p className="mt-3 font-display text-3xl font-extrabold text-accent">
          {fmtOMR(omrGapToday)} OMR
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Cumulative EMS opportunity cost
        </p>
      </div>

      <div className="surface rounded-2xl p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          Economic Efficiency Index
        </p>
        <p className="mt-3 font-display text-3xl font-extrabold">
          {eei.toFixed(1)}%
        </p>
        <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-accent via-secondary to-positive"
            style={{ width: `${Math.min(100, eei)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          Baseline 74.3% · target 95%+
        </p>
      </div>
    </div>
  );
}
