"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

/**
 * Renders the PREDAIOT wordmark. If a brand image exists at /brand/logo.png it
 * is used; otherwise it falls back to the icon + text so the build never breaks.
 * Drop the real logo at public/brand/logo.png to activate it (no code change).
 */
export default function BrandLogo({ className = "h-8 w-auto" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src="/brand/logo.png"
        alt="PREDAIOT"
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="flex items-center gap-2 font-display text-lg font-extrabold">
      <Zap className="h-5 w-5 text-accent" />
      PREDAIOT
    </span>
  );
}
