"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PREDAIOT_BENCHMARKS, fmtOMR } from "@/lib/constants";

const DATA = [
  {
    name: "A · Solar only",
    revenue: PREDAIOT_BENCHMARKS.SCENARIO_A_REVENUE,
    color: "#6B7A99",
    note: "No storage",
  },
  {
    name: "B · BESS + fixed schedule",
    revenue: PREDAIOT_BENCHMARKS.SCENARIO_B_REVENUE,
    color: "#00CFFF",
    note: "Standard EMS",
  },
  {
    name: "C · PREDAIOT",
    revenue: PREDAIOT_BENCHMARKS.SCENARIO_C_REVENUE,
    color: "#FF6630",
    note: "Economic intelligence",
  },
];

export default function RevenueComparison() {
  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          Annual revenue — Sinaw-class 500 MW (OMR/year)
        </p>
        <p className="font-mono text-[11px] text-accent">
          +{fmtOMR(PREDAIOT_BENCHMARKS.INTELLIGENCE_PREMIUM)} OMR over EMS
        </p>
      </div>
      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7A99", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7A99", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(6,11,24,0.95)",
                border: "1px solid rgba(0,207,255,0.3)",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 12,
              }}
              formatter={(value) => [`${fmtOMR(Number(value))} OMR`, "Revenue"]}
            />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              {DATA.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {DATA.map((d) => (
          <div key={d.name} className="rounded-lg border border-white/5 bg-black/30 p-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-3"
                style={{ background: d.color }}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                {d.name}
              </span>
            </div>
            <p className="mt-1 font-display text-lg font-extrabold">
              {fmtOMR(d.revenue)} OMR
            </p>
            <p className="font-mono text-[10px] text-ink-muted">{d.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
