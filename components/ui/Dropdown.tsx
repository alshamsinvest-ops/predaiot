"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Small hover/tap-tolerant dropdown used by the header nav. Opens on hover
 * for pointer devices, taps toggle on touch. Closes on outside click and
 * on Escape. RTL-safe (uses logical positioning).
 */
export default function Dropdown({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-ink"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open ? (
        <div
          role="menu"
          className="surface absolute top-full z-50 mt-2 min-w-[180px] rounded-xl border border-white/10 py-2 shadow-2xl"
          style={{ insetInlineStart: 0 }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
