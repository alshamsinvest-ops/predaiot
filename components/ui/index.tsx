import type { ReactNode, HTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost" | "accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-[--color-secondary] text-[#04101f] hover:brightness-110 glow-secondary",
  accent: "bg-[--color-accent] text-[#04101f] hover:brightness-110 glow-accent",
  secondary:
    "bg-white/5 text-[--color-ink] border border-white/15 hover:bg-white/10",
  ghost: "text-[--color-ink] hover:text-[--color-secondary]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-secondary]";

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
    <span className="inline-block rounded-full border border-[--color-secondary]/30 bg-[--color-secondary]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[--color-secondary]">
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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-accent]/30 bg-[--color-accent]/10 px-3 py-1 text-xs font-medium text-[--color-accent]">
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="surface rounded-2xl p-6">
      <div className="font-display text-3xl font-extrabold text-[--color-secondary] sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-sm text-[--color-ink-muted]">{label}</div>
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
      {lead ? <p className="mt-4 text-lg text-[--color-ink-muted]">{lead}</p> : null}
    </div>
  );
}
