"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const target = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: target })}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-[--color-ink] transition-colors hover:bg-white/10"
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      {locale === "ar" ? "EN" : "العربية"}
    </button>
  );
}
