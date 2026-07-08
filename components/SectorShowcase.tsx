"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SECTOR_SLIDES } from "@/lib/images";
import { useMotion } from "@/components/kinetic/MotionProvider";

const HOLD_MS = 5000;

/**
 * Cinematic cross-fade slideshow across the energy value chain. Each slide
 * holds ~5s, then the next fades in (opacity only — GPU). Industrial scrim
 * keeps the label legible. Respects the motion preference (static first
 * slide when motion is off).
 *
 * Drop 8K per-sector renders into public/brand/sectors/{key}.jpg and point
 * each slide's src at them (see lib/images.ts) — no other change needed.
 */
export default function SectorShowcase({ locale }: { locale: string }) {
  const { shouldAnimate } = useMotion();
  const [i, setI] = useState(0);
  const isAr = locale === "ar";
  const total = SECTOR_SLIDES.length;

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = setInterval(() => setI((v) => (v + 1) % total), HOLD_MS);
    return () => clearInterval(id);
  }, [shouldAnimate, total]);

  const active = SECTOR_SLIDES[i];

  return (
    <section
      className="relative h-[70vh] min-h-[440px] w-full overflow-hidden border-y border-line bg-primary-900"
      aria-label={isAr ? "قطاعات الطاقة" : "Energy sectors"}
    >
      {/* Slides */}
      {SECTOR_SLIDES.map((s, idx) => (
        <div
          key={s.key}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: idx === i ? 1 : 0 }}
          aria-hidden={idx !== i}
        >
          <Image
            src={s.src}
            alt={isAr ? s.ar : s.en}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
          {/* Legibility scrim — single warm-black wash, not decorative */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(11,13,15,0.94) 0%, rgba(11,13,15,0.70) 45%, rgba(11,13,15,0.55) 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-12 sm:px-8">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
          <span aria-hidden className="inline-block h-px w-6 bg-secondary" />
          {isAr ? "قطاع واحد. منصة واحدة." : "One platform. Every energy asset."}
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {isAr ? active.ar : active.en}
        </h2>
        <p className="mt-3 max-w-xl text-ink-muted">
          {isAr
            ? "من النفط والغاز إلى الشبكات والهيدروجين — محرّك قرار اقتصادي واحد عبر سلسلة قيمة الطاقة بأكملها."
            : "From oil & gas to grids and hydrogen — one economic decision engine across the entire energy value chain."}
        </p>

        {/* Slide indicators — thin hairline ticks, active one in signal */}
        <div className="mt-6 flex items-center gap-2">
          {SECTOR_SLIDES.map((s, idx) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setI(idx)}
              aria-label={isAr ? s.ar : s.en}
              aria-current={idx === i}
              className="h-0.5 w-8 transition-colors"
              style={{
                background: idx === i ? "var(--color-secondary)" : "var(--color-line)",
              }}
            />
          ))}
          <span className="ms-3 font-mono text-[10px] text-ink-muted">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
