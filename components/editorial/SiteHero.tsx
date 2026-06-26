import { ArrowRight, ArrowDownRight } from "lucide-react";
import IndustrialImage from "@/components/IndustrialImage";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import { LinkButton } from "@/components/ui";
import type { Img } from "@/lib/images";

interface SiteHeroProps {
  locale: string;
  bgImage: Img;
  kicker: string;
  headlineLines: string[];
  /** Word(s) in the headline to highlight (last line is auto-highlighted; this is extra). */
  accent?: string;
  subhead: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  anchorStat: { value: string; label: string; source?: string };
}

/**
 * Cinematic, full-bleed hero. No card, no rounded chrome — image to the edge,
 * heavy navy gradient, oversized editorial headline, single anchor stat below,
 * and the live engine widget docked on the right.
 */
export default function SiteHero({
  locale,
  bgImage,
  kicker,
  headlineLines,
  subhead,
  primaryCta,
  secondaryCta,
  anchorStat,
}: SiteHeroProps) {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      {/* Cinematic image */}
      <IndustrialImage img={bgImage} locale={locale} variant="background" priority overlay="strong" />
      {/* Extra side gradient for legibility */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,11,24,0.92) 0%, rgba(6,11,24,0.75) 45%, rgba(6,11,24,0.4) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:pb-20 lg:pt-40">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary">{kicker}</p>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {i === headlineLines.length - 1 ? (
                    <span className="text-secondary">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              {subhead}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href={primaryCta.href} variant="accent">
                {primaryCta.label} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              {secondaryCta ? (
                <LinkButton href={secondaryCta.href} variant="secondary">
                  {secondaryCta.label}
                </LinkButton>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroDashboard />
          </div>
        </div>

        {/* Anchor stat — single big number on a hairline rule */}
        <div className="mt-16 border-t border-white/15 pt-8 lg:mt-24">
          <div className="grid items-end gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-accent">{anchorStat.value}</span>
              </p>
              <p className="mt-3 max-w-xl text-base text-ink-muted sm:text-lg">
                {anchorStat.label}
              </p>
              {anchorStat.source ? (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-muted/80">
                  {anchorStat.source}
                </p>
              ) : null}
            </div>
            <div className="hidden text-ink-muted sm:flex sm:items-center sm:gap-2 sm:font-mono sm:text-xs sm:uppercase sm:tracking-[0.2em]">
              <span>Scroll</span> <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
