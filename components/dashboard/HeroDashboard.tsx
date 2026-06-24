"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fmtOMR } from "@/lib/constants";
import { BENCHMARK_ESTIMATE } from "@/lib/value";

/**
 * Illustrative animated dashboard for the hero. All values are clearly labeled
 * "illustrative interface" and the revenue figure traces to the published
 * 862,903 OMR / 500 MW benchmark.
 */
export default function HeroDashboard() {
  const t = useTranslations();
  const [soc, setSoc] = useState(48);
  const [score, setScore] = useState(72);
  const [recovered, setRecovered] = useState(0);
  const target = BENCHMARK_ESTIMATE.annualRecoveryOMR;

  useEffect(() => {
    const id = setInterval(() => {
      setSoc((s) => 40 + Math.round(40 * (0.5 + 0.5 * Math.sin(Date.now() / 2500))));
      setScore((v) => 70 + Math.round(18 * (0.5 + 0.5 * Math.sin(Date.now() / 3200))));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1800);
      setRecovered(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="surface relative overflow-hidden rounded-3xl p-5">
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
            PREDAIOT
          </span>
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-ink-muted">
            {t("common.illustrative")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Battery SOC gauge */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] text-ink-muted">{t("hero.dash.soc")}</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display text-3xl font-extrabold">{soc}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent transition-all duration-1000"
                style={{ width: `${soc}%` }}
              />
            </div>
          </div>

          {/* Economic Efficiency Score */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-[11px] text-ink-muted">{t("hero.dash.score")}</p>
            <div className="mt-3">
              <span className="font-display text-3xl font-extrabold text-secondary">
                {score}
              </span>
              <span className="text-sm text-ink-muted">/100</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-secondary transition-all duration-1000"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Revenue Recovery */}
          <div className="col-span-2 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-[11px] text-ink-muted">{t("hero.dash.recovery")}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-accent">
                {fmtOMR(recovered)}
              </span>
              <span className="text-sm text-ink-muted">OMR / {t("common.perYear")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
