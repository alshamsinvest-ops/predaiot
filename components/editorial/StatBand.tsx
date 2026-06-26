"use client";

import { useEffect, useRef, useState } from "react";

export interface StatItem {
  value: string;
  numeric?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source?: string;
}

/**
 * Full-width editorial stat band — no cards, just huge numbers separated by
 * hairline dividers. Numeric stats count up when scrolled into view.
 */
export default function StatBand({ items }: { items: StatItem[] }) {
  return (
    <div className="border-y border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <StatCell key={s.label} item={s} />
        ))}
      </div>
    </div>
  );
}

function StatCell({ item }: { item: StatItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<string>(
    typeof item.numeric === "number" ? "0" : item.value
  );

  useEffect(() => {
    if (typeof item.numeric !== "number") return;
    const node = ref.current;
    if (!node) return;
    const target = item.numeric;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const start = performance.now();
          const dur = 1400;
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = Math.round(target * eased);
            setDisplay(new Intl.NumberFormat("en-US").format(v));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
          break;
        }
      },
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [item.numeric]);

  return (
    <div
      ref={ref}
      className="bg-[color:var(--color-primary-900)] px-6 py-10 sm:px-10 sm:py-14"
    >
      <p className="font-display text-4xl font-extrabold leading-none tracking-tight text-ink sm:text-5xl lg:text-6xl">
        {item.prefix}
        <span className="tabular-nums">{display}</span>
        {item.suffix ? <span className="text-secondary"> {item.suffix}</span> : null}
      </p>
      <p className="mt-3 max-w-xs text-sm leading-snug text-ink-muted">{item.label}</p>
      {item.source ? (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted/70">
          {item.source}
        </p>
      ) : null}
    </div>
  );
}
