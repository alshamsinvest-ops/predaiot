"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/kinetic/MotionProvider";

const HERO_VIDEO = "/brand/hf_20260709_214655_bed1ff47-58d7-4ada-b4fb-201861053a62.mp4";
const HERO_POSTER = "/brand/industrial.jpg";

/**
 * Cinematic background for the homepage hero — the economic-decision engine
 * sweeping across the energy value chain.
 *
 * The <video> is ALWAYS rendered and autoplays muted/looped, so the footage is
 * visible from first paint. Visibility must NEVER depend on the motion context:
 * `shouldAnimate` is false during SSR/first-paint and under reduced-motion, so
 * gating the element behind it left every visitor staring at the still poster
 * ("same as before"). The motion preference only controls play vs. pause —
 * reduced-motion / "off" pauses on the poster frame instead of hiding the clip.
 */
export default function HeroVideo() {
  const { shouldAnimate } = useMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldAnimate) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldAnimate]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-primary-900" aria-hidden="true">
      <video
        ref={ref}
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
