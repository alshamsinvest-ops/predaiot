"use client";

import { useMotion } from "./MotionProvider";

const LABEL: Record<string, { en: string; ar: string }> = {
  auto: { en: "Auto", ar: "تلقائي" },
  on: { en: "On", ar: "تشغيل" },
  off: { en: "Off", ar: "إيقاف" },
};

export default function MotionToggle({ locale = "en" }: { locale?: string }) {
  const { pref, shouldAnimate, cycle } = useMotion();
  const isAr = locale === "ar";

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted transition-colors hover:border-secondary/40 hover:text-ink"
      title={isAr ? "الحركة" : "Motion"}
      aria-label={`${isAr ? "الحركة" : "Motion"}: ${LABEL[pref][isAr ? "ar" : "en"]}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          shouldAnimate ? "bg-secondary shadow-[0_0_6px_var(--color-secondary)]" : "bg-ink-muted"
        }`}
      />
      {LABEL[pref][isAr ? "ar" : "en"]}
    </button>
  );
}
