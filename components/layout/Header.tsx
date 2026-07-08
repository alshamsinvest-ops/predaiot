"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import BrandLogo from "@/components/BrandLogo";
import { LinkButton } from "@/components/ui";
import Dropdown from "@/components/ui/Dropdown";
import MotionToggle from "@/components/kinetic/MotionToggle";

type NavKey =
  | "live"
  | "audit"
  | "bess"
  | "solar"
  | "technology"
  | "industries"
  | "pricing"
  | "cases"
  | "about"
  | "contact"
  | "portal"
  | "login"
  | "solutions"
  | "allSectors";

type NavItem =
  | { kind: "link"; href: string; key: NavKey }
  | { kind: "dropdown"; key: NavKey; children: { href: string; key: NavKey }[] };

const NAV: NavItem[] = [
  { kind: "link", href: "/live", key: "live" },
  {
    kind: "dropdown",
    key: "industries",
    children: [
      { href: "/industries", key: "allSectors" },
      { href: "/bess", key: "bess" },
      { href: "/solar", key: "solar" },
      { href: "/cases", key: "cases" },
    ],
  },
  { kind: "link", href: "/technology", key: "technology" },
  { kind: "link", href: "/pricing", key: "pricing" },
  { kind: "link", href: "/about", key: "about" },
];

const MOBILE_SOLUTIONS: { href: string; key: NavKey }[] = [
  { href: "/industries", key: "allSectors" },
  { href: "/bess", key: "bess" },
  { href: "/solar", key: "solar" },
  { href: "/cases", key: "cases" },
];

export default function Header({ locale = "en" }: { locale?: string }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/15 bg-primary-900/85 backdrop-blur-xl"
          : "border-white/5 bg-primary-900/55 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="PREDAIOT home">
          <BrandLogo imgClassName="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) =>
            item.kind === "link" ? (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {t(item.key)}
              </Link>
            ) : (
              <Dropdown key={item.key} label={t(item.key)}>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-2 text-sm text-ink-muted hover:bg-white/5 hover:text-ink"
                  >
                    {t(child.key)}
                  </Link>
                ))}
              </Dropdown>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <MotionToggle locale={locale} />
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
            <Link href="/live" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5">
              {t("live")}
            </Link>
            <Link href="/technology" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5">
              {t("technology")}
            </Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5">
              {t("pricing")}
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5">
              {t("about")}
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5">
              {t("contact")}
            </Link>
            <Link href="/portal" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5">
              {t("portal")}
            </Link>
          </div>
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {t("industries")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOBILE_SOLUTIONS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-white/5"
                >
                  {t(s.key)}
                </Link>
              ))}
            </div>
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
