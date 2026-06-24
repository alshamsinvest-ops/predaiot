import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { COMPANY } from "@/lib/constants";

export default function Footer() {
  const t = useTranslations();

  const product = [
    { href: "/economic-audit", key: "nav.audit" },
    { href: "/bess", key: "nav.bess" },
    { href: "/solar", key: "nav.solar" },
    { href: "/technology", key: "nav.technology" },
    { href: "/pricing", key: "nav.pricing" },
  ];
  const company = [
    { href: "/about", key: "nav.about" },
    { href: "/industries", key: "nav.industries" },
    { href: "/cases", key: "nav.cases" },
    { href: "/papers", key: "nav.papers" },
    { href: "/investors", key: "nav.investors" },
  ];
  const legal = [
    { href: "/security", key: "nav.security" },
    { href: "/privacy-policy", key: "nav.privacy" },
    { href: "/contact", key: "nav.contact" },
  ];

  return (
    <footer className="border-t border-white/10 bg-primary-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center" aria-label="PREDAIOT home">
            <BrandLogo className="h-9 w-auto" />
          </Link>
          <p className="mt-3 text-sm text-ink-muted">{t("footer.tagline")}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-ink">{COMPANY.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${COMPANY.phoneE164}`} className="hover:text-ink">{COMPANY.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {COMPANY.location}
            </li>
          </ul>
          <a
            href={COMPANY.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PREDAIOT on LinkedIn"
            className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-ink-muted transition-colors hover:border-secondary hover:text-secondary"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>

        <FooterCol title={t("footer.product")} links={product} t={t} />
        <FooterCol title={t("footer.company")} links={company} t={t} />
        <FooterCol title={t("footer.legal")} links={legal} t={t} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-ink-muted sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} {COMPANY.name}. {t("footer.rights")}</span>
          <span>{t("footer.preSeed")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  t,
}: {
  title: string;
  links: { href: string; key: string }[];
  t: (k: string) => string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-muted hover:text-ink">
              {t(l.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
