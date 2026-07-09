"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Slide image that prefers a local 8K render at `src`
 * (e.g. /brand/sectors/oilgas.jpg) and transparently falls back to a
 * production-verified stock photo of the same subject until that file
 * exists. Drop the real image into public/brand/sectors/{key}.jpg and it
 * replaces the placeholder automatically — no code change needed.
 */
export default function SlideImage({
  src,
  fallback,
  alt,
  priority,
}: {
  src: string;
  fallback: string;
  alt: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <Image
      src={errored ? fallback : src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover"
      onError={() => setErrored(true)}
    />
  );
}
