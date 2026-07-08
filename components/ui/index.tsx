import type { ReactNode, HTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import CountUp from "@/components/kinetic/CountUp";

type Variant = "primary" | "secondary" | "ghost" | "accent";

const variants: Record<Variant, string> = {
  primary: "bg-secondary text-[#0B0D0F] hover:brightness-105",
  accent: "bg-secondary text-[#0B0D0F] hover:brightness-105",
  secondary:
    "bg-transparent text-ink border border-line hover:border-secondary/60",
  ghost: "text-ink hover:text-secondary",
};

// Sharp, engineered edge (2px) — an economic-decision tool, not a consumer app.
const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] px-6 py-3 text-sm font-semibold tracking-tight transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Section({
  children,
  className = "",
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24 ${className}`} {...rest}>
      {children}
    </section>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-secondary">
      <span aria-hidden className="inline-block h-px w-6 bg-secondary" />
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface rounded-2xl p-6 ${className}`}>{children}</div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-secondary/40 px-3 py-1 font-mono text-xs font-medium text-secondary">
      {children}
    </span>
  );
}

export function Stat({
  value,
  label,
  numeric,
}: {
  value: string;
  label: string;
  /** Opt-in: animate a numeric counter (0 → to) once scrolled into view. */
  numeric?: {
    to: number;
    decimals?: number;
    grouping?: boolean;
    prefix?: string;
    suffix?: string;
  };
}) {
  return (
    <div className="surface p-6">
      <div className="font-mono text-3xl font-semibold text-secondary tabular-nums sm:text-4xl">
        {numeric ? (
          <CountUp
            to={numeric.to}
            decimals={numeric.decimals}
            grouping={numeric.grouping}
            prefix={numeric.prefix}
            suffix={numeric.suffix}
          />
        ) : (
          value
        )}
      </div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {kicker ? <Kicker>{kicker}</Kicker> : null}
      <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{title}</h1>
      {lead ? <p className="mt-4 text-lg text-ink-muted">{lead}</p> : null}
    </div>
  );
}
