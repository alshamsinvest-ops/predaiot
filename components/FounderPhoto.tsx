"use client";

import { useState } from "react";

/**
 * Founder portrait. Uses /brand/founder.jpg if present, else falls back to the
 * "CM" monogram. Drop the real photo at public/brand/founder.jpg to activate.
 */
export default function FounderPhoto() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/15 font-display text-2xl font-extrabold text-secondary">
        CM
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/brand/founder.jpg"
      alt="Chams Eddine Madi, Founder & CEO of PREDAIOT"
      className="h-24 w-24 rounded-2xl object-cover grayscale"
      onError={() => setFailed(true)}
    />
  );
}
