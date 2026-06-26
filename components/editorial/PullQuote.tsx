import { Quote } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function PullQuote({
  text,
  attribution,
  date,
}: {
  text: string;
  attribution: string;
  date?: string;
}) {
  return (
    <RevealOnScroll as="article" className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
      <Quote className="mx-auto h-8 w-8 text-secondary" aria-hidden="true" />
      <blockquote className="mt-6 font-display text-2xl font-bold leading-snug text-ink sm:text-3xl lg:text-4xl">
        “{text}”
      </blockquote>
      <footer className="mt-8">
        <p className="text-sm font-semibold text-ink">{attribution}</p>
        {date ? (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">{date}</p>
        ) : null}
      </footer>
    </RevealOnScroll>
  );
}
