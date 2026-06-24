import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, ArrowRight } from "lucide-react";
import { Section, PageHeader, Card, LinkButton } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { PRICING, PROMO_HOOK_TEXT, GUARANTEE_TEXT, fmtOMR, omrToUsd } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return buildMetadata({
    locale,
    path: "/pricing",
    title: t("title"),
    description: "Transparent pricing in OMR for PREDAIOT economic audits, pilots and revenue-share deployment.",
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const tc = await getTranslations("common");

  const usd = (omr: number) => `≈ $${fmtOMR(omrToUsd(omr))} USD`;

  const plans = [
    {
      name: t("freeName"),
      omr: t("freeLine"),
      usd: null,
      features: [GUARANTEE_TEXT],
      cta: { href: "/economic-audit", label: tc("startDiagnostic") },
      highlight: true,
    },
    {
      name: t("auditName"),
      omr: `${fmtOMR(PRICING.audit.minOMR)}–${fmtOMR(PRICING.audit.maxOMR)} OMR`,
      usd: usd(PRICING.audit.minOMR),
      promo: `${fmtOMR(PRICING.audit.promoMinOMR)}–${fmtOMR(PRICING.audit.promoMaxOMR)} OMR`,
      features: [t("auditLine"), PROMO_HOOK_TEXT],
      cta: { href: "/economic-audit", label: tc("getStarted") },
    },
    {
      name: t("pilotName"),
      omr: `${t("from")} ${fmtOMR(PRICING.pilot.fromOMR)} OMR`,
      usd: usd(PRICING.pilot.fromOMR),
      features: [t("pilotLine")],
      cta: { href: "/contact", label: tc("bookCall") },
    },
    {
      name: t("deployName"),
      omr: `${PRICING.deployment.predaiotPct}% / ${PRICING.deployment.clientPct}%`,
      usd: null,
      features: [t("deployLine")],
      cta: { href: "/contact", label: tc("contactSales") },
    },
    {
      name: t("enterpriseName"),
      omr: tc("contactSales"),
      usd: null,
      features: [t("enterpriseLine")],
      cta: { href: "/contact", label: tc("contactSales") },
    },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd("PREDAIOT Economic Intelligence", t("lead"), "/pricing")} />
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.highlight ? "border border-[--color-accent]/40" : ""}>
              <h3 className="font-display text-lg font-bold">{p.name}</h3>
              <div className="mt-2">
                {p.promo ? (
                  <div>
                    <span className="font-display text-2xl font-extrabold text-[--color-accent]">{p.promo}</span>
                    <span className="ml-2 text-sm text-[--color-ink-muted] line-through">{p.omr}</span>
                  </div>
                ) : (
                  <span className="font-display text-2xl font-extrabold text-[--color-secondary]">{p.omr}</span>
                )}
                {p.usd ? <p className="text-xs text-[--color-ink-muted]">{p.usd}</p> : null}
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[--color-ink-muted]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[--color-accent]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <LinkButton href={p.cta.href} variant={p.highlight ? "accent" : "secondary"} className="mt-5 w-full">
                {p.cta.label} <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
