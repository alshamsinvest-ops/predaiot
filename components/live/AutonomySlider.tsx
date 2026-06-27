"use client";

import { useLiveStore } from "@/store/liveStore";

const STOPS = [
  { value: 0, label: "Advisory", threshold: null, note: "Operator decides" },
  { value: 25, label: "Supervised", threshold: 95, note: "Auto if ≥ 95% confidence" },
  { value: 50, label: "Assisted", threshold: 85, note: "Auto if ≥ 85% confidence" },
  { value: 75, label: "Semi-Auto", threshold: 70, note: "Auto if ≥ 70% confidence" },
  { value: 100, label: "Full Auto", threshold: 0, note: "Execute every non-HOLD" },
] as const;

export default function AutonomySlider() {
  const autonomyLevel = useLiveStore((s) => s.autonomyLevel);
  const setAutonomy = useLiveStore((s) => s.setAutonomy);
  const active = STOPS.reduce((best, s) =>
    Math.abs(s.value - autonomyLevel) < Math.abs(best.value - autonomyLevel)
      ? s
      : best,
  );

  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Autonomy
          </p>
          <p className="mt-1 font-display text-xl font-extrabold text-secondary">
            {active.label}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold">{autonomyLevel}%</p>
          <p className="text-xs text-ink-muted">{active.note}</p>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={25}
        value={autonomyLevel}
        onChange={(e) => setAutonomy(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--color-secondary)]"
        aria-label="Autonomy level"
      />
      <div className="mt-2 flex justify-between font-mono text-[10px] text-ink-muted">
        {STOPS.map((s) => (
          <span
            key={s.value}
            className={s.value === active.value ? "text-secondary" : ""}
          >
            {s.value}
          </span>
        ))}
      </div>
    </div>
  );
}
