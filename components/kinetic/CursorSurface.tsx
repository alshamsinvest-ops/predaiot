"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "./MotionProvider";

/**
 * Attaches a cursor-tracked radial highlight to any block via CSS custom
 * properties. The `.cursor-surface` class in globals.css does the paint;
 * this component only writes `--cursor-x` and `--cursor-y` on move.
 * Zero React re-renders.
 */
export default function CursorSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { shouldAnimate } = useMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!shouldAnimate) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--cursor-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--cursor-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`cursor-surface ${className}`}
    >
      {children}
    </div>
  );
}
