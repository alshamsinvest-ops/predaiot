"use client";

import { useMotion } from "@/components/kinetic/MotionProvider";

const HERO_VIDEO = "/brand/hf_20260709_214655_bed1ff47-58d7-4ada-b4fb-201861053a62.mp4";
const HERO_POSTER = "/brand/industrial.jpg";

/**
 * Cinematic background for the homepage hero — the economic-decision engine
 * sweeping across the energy value chain. Autoplays muted/looped so browsers
 * allow it; degrades to a still poster under reduced-motion (and never
 * downloads the 6 MB clip in that case). The scrim is deliberately light and
 * directional — dark enough behind the left-hand copy to stay legible, but
 * clear on the right so the footage is obviously *moving*.
 */
export default function HeroVideo() {
  const { shouldAnimate } = useMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-primary-900" aria-hidden="true">
      {shouldAnimate ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={HERO_POSTER} alt="" className="h-full w-full object-cover" />
      )}
      {/* Directional scrim: readable behind the copy (left), clear on the right. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,13,15,0.82) 0%, rgba(11,13,15,0.55) 42%, rgba(11,13,15,0.18) 100%)",
        }}
      />
      {/* Slight top/bottom vignette so the header and the fold edge stay crisp. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,13,15,0.55) 0%, rgba(11,13,15,0) 22%, rgba(11,13,15,0) 70%, rgba(11,13,15,0.65) 100%)",
        }}
      />
    </div>
  );
}
