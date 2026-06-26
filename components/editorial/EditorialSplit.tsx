import type { ReactNode } from "react";
import IndustrialImage from "@/components/IndustrialImage";
import type { Img } from "@/lib/images";
import RevealOnScroll from "@/components/RevealOnScroll";

/**
 * Asymmetric image + text block. Reverses on alternating rows for editorial
 * rhythm. Uses generous spacing, large display type, and a thin accent rule.
 */
export default function EditorialSplit({
  img,
  locale,
  kicker,
  title,
  children,
  reverse = false,
  accent = "secondary",
}: {
  img: Img;
  locale: string;
  kicker?: string;
  title: string;
  children: ReactNode;
  reverse?: boolean;
  accent?: "secondary" | "accent";
}) {
  const accentClass = accent === "accent" ? "text-accent" : "text-secondary";
  const ruleClass = accent === "accent" ? "bg-accent" : "bg-secondary";

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-16`}>
        <RevealOnScroll className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <IndustrialImage img={img} locale={locale} variant="background" overlay="soft" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120} className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
          {kicker ? (
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${accentClass}`}>{kicker}</p>
          ) : null}
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div className={`mt-5 h-px w-16 ${ruleClass}`} />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-muted">{children}</div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
