"use client";

import { useLiveStore } from "@/store/liveStore";

const AXES = [
  "Price Signal",
  "SoC Headroom",
  "Confidence",
  "Arbitrage Spread",
  "Timing Quality",
  "Economic Value",
] as const;

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function EconomicRadar() {
  const decision = useLiveStore((s) => s.currentDecision);
  const telemetry = useLiveStore((s) => s.telemetry);

  // Six normalized axes (0..1)
  const values: number[] = decision && telemetry
    ? [
        // 1. Price signal — distance from neutral (9 OMR/MWh)
        clamp01(Math.abs(telemetry.grid_price_omr_mwh - 9) / 13),
        // 2. SoC headroom — how much capacity we have either way
        clamp01(1 - Math.abs(telemetry.soc_percent - 50) / 50),
        // 3. Decision confidence
        clamp01(decision.confidence_percent / 100),
        // 4. Arbitrage spread — max(V_charge, V_discharge) / 10
        clamp01(Math.max(decision.V_charge, decision.V_discharge, 0) / 10),
        // 5. Timing quality — how close to peak/trough
        clamp01(Math.abs(telemetry.grid_price_omr_mwh - 9) / 13),
        // 6. Economic value — OMR impact normalized
        clamp01(decision.omr_impact_per_decision / 3000),
      ]
    : [0.2, 0.2, 0.2, 0.2, 0.2, 0.2];

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;
  const n = AXES.length;

  const point = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * r * v,
      y: cy + Math.sin(angle) * r * v,
    };
  };

  const labelPoint = (i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * (r + 22),
      y: cy + Math.sin(angle) * (r + 22),
    };
  };

  const polygon = values
    .map((v, i) => {
      const { x, y } = point(i, v);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="surface rounded-2xl p-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        Economic Opportunity Radar
      </p>
      <div className="mt-3 flex justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Economic opportunity radar"
        >
          {/* Concentric rings */}
          {[0.25, 0.5, 0.75, 1].map((ring) => (
            <polygon
              key={ring}
              points={Array.from({ length: n })
                .map((_, i) => {
                  const { x, y } = point(i, ring);
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          ))}
          {/* Spokes */}
          {Array.from({ length: n }).map((_, i) => {
            const end = point(i, 1);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            );
          })}
          {/* Data polygon */}
          <polygon
            points={polygon}
            fill="rgba(0,207,255,0.18)"
            stroke="#00CFFF"
            strokeWidth={2}
            style={{ transition: "all 600ms ease-out" }}
          />
          {/* Vertex dots */}
          {values.map((v, i) => {
            const { x, y } = point(i, v);
            return (
              <circle key={i} cx={x} cy={y} r={3} fill="#00CFFF" />
            );
          })}
          {/* Labels */}
          {AXES.map((label, i) => {
            const { x, y } = labelPoint(i);
            return (
              <text
                key={label}
                x={x}
                y={y}
                fill="#6B7A99"
                fontSize="10"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-ink-muted">
        Six axes · normalized 0–100% · live tick every 2.6 s
      </p>
    </div>
  );
}
