"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useMotion } from "./MotionProvider";
import { OMAN_PRICE_PROFILE_24H } from "@/lib/price-model";

/**
 * The signature — full-width SVG waveform of the 24 h Oman MIS price profile.
 * A single "now" pulse travels the curve; ticks flash across the evening peak
 * window (18:00–21:00) where the Decision Gap concentrates. Uses viewBox so
 * it stretches responsively; pointer-events off — it's atmosphere, not UI.
 */
export default function EconomicWaveform({
  height = 320,
  opacity = 1,
  className = "",
}: {
  height?: number;
  opacity?: number;
  className?: string;
}) {
  const { shouldAnimate } = useMotion();

  // Normalize the profile into an SVG path. viewBox is 24 wide, 10 tall.
  const path = useMemo(() => {
    const max = Math.max(...OMAN_PRICE_PROFILE_24H);
    const min = Math.min(...OMAN_PRICE_PROFILE_24H);
    const range = max - min || 1;
    const points = OMAN_PRICE_PROFILE_24H.map((p, i) => {
      const x = i;
      const y = 10 - ((p - min) / range) * 8 - 1; // margin top+bottom
      return [x, y] as const;
    });
    // Smooth catmull-rom-ish path via cubic bezier segments
    const d: string[] = [`M ${points[0][0]} ${points[0][1]}`];
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      const cx1 = x0 + 0.5;
      const cx2 = x1 - 0.5;
      d.push(`C ${cx1} ${y0} ${cx2} ${y1} ${x1} ${y1}`);
    }
    return d.join(" ");
  }, []);

  // Peak window vertical ticks (18–21 h)
  const peakHours = [18, 19, 20, 21];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox={`0 0 24 10`}
        preserveAspectRatio="none"
        width="100%"
        height={height}
        className="absolute inset-x-0 bottom-0"
      >
        <defs>
          <linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#00CFFF" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#00CFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#00CFFF" stopOpacity="0.9" />
            <stop offset="90%" stopColor="#FF6630" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF6630" stopOpacity="0.4" />
          </linearGradient>
          <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.06" />
          </filter>
        </defs>

        {/* Area under the curve */}
        <path
          d={`${path} L 24 10 L 0 10 Z`}
          fill="url(#wave-fill)"
        />

        {/* Peak-window vertical ticks (18–21h) */}
        {peakHours.map((h) => (
          <motion.line
            key={h}
            x1={h}
            y1={1}
            x2={h}
            y2={9}
            stroke="#FF6630"
            strokeWidth="0.02"
            strokeDasharray="0.1 0.2"
            initial={{ opacity: 0.08 }}
            animate={
              shouldAnimate
                ? { opacity: [0.08, 0.32, 0.08] }
                : { opacity: 0.12 }
            }
            transition={{
              duration: 2.4,
              repeat: shouldAnimate ? Infinity : 0,
              delay: (h - 18) * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* The wave line itself */}
        <path
          d={path}
          fill="none"
          stroke="url(#wave-stroke)"
          strokeWidth="0.06"
          strokeLinecap="round"
          filter="url(#wave-glow)"
        />

        {/* Travelling "now" pulse — animates x from 0 to 24 over 40 s */}
        <TravelPulse path={path} shouldAnimate={shouldAnimate} />

        {/* 24h axis labels */}
        <g fontFamily="var(--font-mono)" fontSize="0.28" fill="#6B7A99" opacity="0.5">
          {[0, 6, 12, 18].map((h) => (
            <text key={h} x={h + 0.15} y="9.85">
              {String(h).padStart(2, "0")}:00
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * A small dot that travels along the price curve, ~40 s per cycle.
 * Uses SVG motion path — no per-frame React state.
 */
function TravelPulse({
  path,
  shouldAnimate,
}: {
  path: string;
  shouldAnimate: boolean;
}) {
  if (!shouldAnimate) {
    return null;
  }
  return (
    <>
      <path id="wave-travel" d={path} fill="none" stroke="none" />
      <circle r="0.18" fill="#FF6630">
        <animateMotion dur="40s" repeatCount="indefinite" rotate="auto">
          <mpath href="#wave-travel" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle r="0.4" fill="#FF6630" opacity="0.25">
        <animateMotion dur="40s" repeatCount="indefinite">
          <mpath href="#wave-travel" />
        </animateMotion>
        <animate
          attributeName="r"
          values="0.3;0.6;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </>
  );
}
