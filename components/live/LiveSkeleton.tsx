export default function LiveSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <div className="surface mt-8 flex flex-wrap gap-1 rounded-full p-1">
        {["Overview", "Engine", "Economics", "API"].map((label) => (
          <span
            key={label}
            className="rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-muted"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {["Recovered", "Gap accrued", "EEI"].map((label) => (
          <div key={label} className="surface rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {label}
            </p>
            <div className="pulse mt-3 h-8 w-32 rounded bg-secondary/20" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Battery", "Solar", "Grid SMP"].map((label) => (
          <div key={label} className="surface rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {label}
            </p>
            <div className="pulse mt-3 h-9 w-24 rounded bg-secondary/20" />
            <div className="pulse mt-4 h-2 w-full rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface rounded-2xl p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Economic Engine
          </p>
          <div className="pulse mt-4 h-14 w-40 rounded bg-secondary/20" />
          <div className="pulse mt-3 h-3 w-3/4 rounded bg-white/10" />
          <div className="mt-6 space-y-3">
            <div className="pulse h-2 w-full rounded-full bg-white/10" />
            <div className="pulse h-2 w-full rounded-full bg-white/10" />
            <div className="pulse h-2 w-full rounded-full bg-white/10" />
          </div>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Economic Opportunity Radar
          </p>
          <div className="pulse mx-auto mt-6 h-64 w-64 rounded-full bg-secondary/10" />
        </div>
      </div>

      <div className="surface mt-6 rounded-2xl p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          Decision Log
        </p>
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="pulse h-16 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] text-ink-muted">
        Loading demo signal…
      </p>
    </div>
  );
}
