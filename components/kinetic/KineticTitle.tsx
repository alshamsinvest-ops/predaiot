"use client";

import { motion } from "motion/react";
import { useMotion } from "./MotionProvider";

/**
 * Split-word headline reveal. Each word arrives on its own vector with a
 * ~60 ms stagger. Direction alternates deterministically so it feels
 * choreographed rather than random. Falls back to static render when the
 * user has opted out of motion.
 */
export default function KineticTitle({
  text,
  as: Tag = "h1",
  className = "",
  locale = "en",
  once = true,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  locale?: string;
  once?: boolean;
}) {
  const { shouldAnimate } = useMotion();
  const words = text.split(/(\s+)/); // preserve whitespace tokens
  const isRTL = locale === "ar";

  if (!shouldAnimate) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag] as typeof motion.h1;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return word;
        // Alternate vertical and horizontal entry vectors so it feels intentional.
        const yFrom = i % 3 === 0 ? 24 : i % 3 === 1 ? 16 : 20;
        const xFrom = (i % 2 === 0 ? 1 : -1) * (isRTL ? -8 : 8);
        const rotFrom = (i % 2 === 0 ? -1 : 1) * 4;
        return (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: yFrom, x: xFrom, rotate: rotFrom },
              visible: {
                opacity: 1,
                y: 0,
                x: 0,
                rotate: 0,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              },
            }}
            viewport={once ? { once: true } : undefined}
          >
            {word}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
