"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import BrandLogo from "@/components/BrandLogo";
import { LinkButton } from "@/components/ui";

const NAV = [
  { href: "/economic-audit", key: "audit" as const },
  { href: "/bess", key: "bess" as const },
  { href: "/solar", key: "solar" as const },
  { href: "/technology", key: "technology" as const },
  { href: "/industries", key: "industries" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/cases", key: "cases" as const },
  { href: "/about", key: "about" as const },
];

export default function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary-900/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="PREDAIOT home">
          <BrandLogo className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <Link href="/login" className="text-sm font-semibold text-ink-muted hover:text-ink">
            {t("login")}
          </Link>
          <LinkButton href="/economic-audit" variant="accent" className="px-4 py-2">
            {t("audit")}
          </LinkButton>
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-primary-900 px-5 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            {[...NAV, { href: "/contact", key: "contact" as const }, { href: "/portal", key: "portal" as const }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5"
                >
                  {t(item.key)}
                </Link>
              )
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <LanguageToggle />
            <LinkButton href="/economic-audit" variant="accent" className="px-4 py-2">
              {t("audit")}
            </LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
