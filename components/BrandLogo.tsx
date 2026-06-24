"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

/**
 * PREDAIOT wordmark: the colorful brand mark (public/brand/logo-mark.png,
 * transparent) + "PREDAIOT" in the display font. Falls back to an icon + text
 * if the image is missing so the build never breaks.
 */
export default function BrandLogo({ imgClassName = "h-8 w-auto" }: { imgClassName?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
      {failed ? (
        <Zap className="h-5 w-5 text-accent" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/brand/logo-mark.png" alt="" className={imgClassName} onError={() => setFailed(true)} />
      )}
      <span>PREDAIOT</span>
    </span>
  );
}
