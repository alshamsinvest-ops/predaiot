"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Line,
  Area,
  ReferenceDot,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { OMAN_PRICE_PROFILE_24H, getPriceForecast } from "@/lib/price-model";
import { useLiveStore } from "@/store/liveStore";

export default function PriceRadar() {
  const telemetry = useLiveStore((s) => s.telemetry);
  const nowHour = telemetry ? new Date(telemetry.timestamp).getHours() : new Date().getHours();
  const nowPrice = telemetry?.grid_price_omr_mwh ?? OMAN_PRICE_PROFILE_24H[nowHour];

  const data = useMemo(() => {
    const { upperBand, lowerBand } = getPriceForecast(0);
    return OMAN_PRICE_PROFILE_24H.map((price, h) => {
      const isFuture = h > nowHour;
      const forecastIdx = h - nowHour;
      const upper = isFuture && forecastIdx < 8 ? upperBand[forecastIdx] : null;
      const lower = isFuture && forecastIdx < 8 ? lowerBand[forecastIdx] : null;
      return {
        hour: `${String(h).padStart(2, "0")}:00`,
        history: !isFuture ? price : null,
        forecast: isFuture ? price : null,
        band: upper !== null && lower !== null ? [lower, upper] : null,
      };
    });
  }, [nowHour]);

  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          24h Price Profile · OMR/MWh
        </p>
        <p className="font-mono text-[11px] text-secondary">
          Now {nowPrice.toFixed(2)} OMR/MWh
        </p>
      </div>
      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#6B7A99", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fill: "#6B7A99", fontSize: 10, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(6,11,24,0.95)",
                border: "1px solid rgba(0,207,255,0.3)",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 12,
              }}
              labelStyle={{ color: "#F0F4FF" }}
            />
            <Area
              dataKey="band"
              fill="#8B5CF6"
              fillOpacity={0.12}
              stroke="none"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="history"
              stroke="#00CFFF"
              strokeWidth={2.4}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#8B5CF6"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={`${String(nowHour).padStart(2, "0")}:00`}
              y={nowPrice}
              r={5}
              fill="#FF6630"
              stroke="#fff"
              strokeWidth={1.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10px] text-ink-muted">
        <span>
          <span className="mr-1 inline-block h-2 w-3 align-middle bg-secondary" />
          History
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-3 align-middle bg-[var(--color-forecast)]" />
          8h forecast
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-3 align-middle bg-[var(--color-forecast)]/30" />
          Uncertainty band
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-full align-middle bg-accent" />
          Now
        </span>
      </div>
    </div>
  );
}
