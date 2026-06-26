import RevealOnScroll from "@/components/RevealOnScroll";

export interface TimelineStep {
  num: string;
  title: string;
  body: string;
}

/**
 * Editorial numbered timeline: large monospace step numbers, hairline ruled
 * rows, no card chrome. Replaces card grids for "how it works"-style sections.
 */
export default function NumberedTimeline({
  kicker,
  title,
  intro,
  steps,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  steps: TimelineStep[];
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="max-w-3xl">
        {kicker ? (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">{kicker}</p>
        ) : null}
        <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {intro ? <p className="mt-5 text-lg text-ink-muted">{intro}</p> : null}
      </div>

      <ol className="mt-14 divide-y divide-white/10 border-y border-white/10">
        {steps.map((s, i) => (
          <RevealOnScroll key={s.num} delay={i * 60} as="div">
            <li className="grid grid-cols-12 gap-6 py-8 sm:py-10">
              <div className="col-span-12 sm:col-span-2">
                <span className="font-mono text-3xl font-bold text-secondary sm:text-4xl">
                  {s.num}
                </span>
              </div>
              <div className="col-span-12 sm:col-span-4">
                <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">
                  {s.title}
                </h3>
              </div>
              <div className="col-span-12 text-base leading-relaxed text-ink-muted sm:col-span-6">
                {s.body}
              </div>
            </li>
          </RevealOnScroll>
        ))}
      </ol>
    </section>
  );
}
