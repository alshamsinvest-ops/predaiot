"use client";

import { useMotion } from "@/components/kinetic/MotionProvider";

const HERO_VIDEO = "/brand/hf_20260709_214655_bed1ff47-58d7-4ada-b4fb-201861053a62.mp4";
const HERO_POSTER = "/brand/industrial.jpg";

/**
 * Cinematic background for the homepage hero — the economic-decision engine
 * sweeping across the energy value chain. Autoplays muted/looped so browsers
 * allow it; degrades to a still poster under reduced-motion (and never
 * downloads the 6 MB clip in that case). A warm-black scrim keeps the hero
 * headline and dashboard legible on top.
 */
export default function HeroVideo() {
  const { shouldAnimate } = useMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-primary-900" aria-hidden="true">
      {shouldAnimate ? (
        <video
          className="h-full w-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={HERO_POSTER} alt="" className="h-full w-full object-cover opacity-70" />
      )}
      {/* Legibility scrim — warm-black wash, heavier on the text side. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,13,15,0.95) 0%, rgba(11,13,15,0.82) 42%, rgba(11,13,15,0.60) 100%)",
        }}
      />
    </div>
  );
}
