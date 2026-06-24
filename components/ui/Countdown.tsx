"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PRICING } from "@/lib/constants";

/**
 * Live countdown to the promo window close + a founding-slot counter.
 * The deadline is a fixed 14-day window persisted in localStorage so it
 * counts down consistently per visitor (real timer, not just copy).
 */
const KEY = "predaiot_promo_deadline";

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now();
  const stored = window.localStorage.getItem(KEY);
  if (stored) return Number(stored);
  const deadline = Date.now() + PRICING.audit.promoWindowDays * 24 * 60 * 60 * 1000;
  window.localStorage.setItem(KEY, String(deadline));
  return deadline;
}

export default function Countdown({ claimed = 3 }: { claimed?: number }) {
  const t = useTranslations("leak");
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const total = PRICING.audit.promoFirstClients;
  if (remaining === null) {
    return <div className="h-20" aria-hidden="true" />;
  }

  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);

  const cell = (value: number, label: string) => (
    <div className="flex flex-col items-center rounded-xl border border-white/10 bg-black/30 px-3 py-2">
      <span className="font-display text-2xl font-extrabold tabular-nums">{String(value).padStart(2, "0")}</span>
      <span className="text-[10px] uppercase tracking-wide text-[--color-ink-muted]">{label}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-[--color-ink-muted]">{t("countdownEnds")}</p>
        <div className="mt-2 flex gap-2">
          {cell(d, t("days"))}
          {cell(h, t("hours"))}
          {cell(m, t("minutes"))}
          {cell(s, t("seconds"))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-xs text-[--color-ink-muted]">
          <span>
            {claimed} {t("clientsClaimed")}
          </span>
          <span>
            {claimed}/{total}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[--color-accent]"
            style={{ width: `${Math.min(100, (claimed / total) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
