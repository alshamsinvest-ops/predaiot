import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, ArrowRight } from "lucide-react";
import { Section, PageHeader, Card, LinkButton } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { COMPANY, GUARANTEE_TEXT } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/pricing",
    title: `Pricing · ${COMPANY.name}`,
    description: "Transparent pricing in OMR. Free Leak Test → Economic Audit → Pilot → Deployment.",
  });
}

const TIERS = [
  {
    name: "Free 7-Day Leak Test",
    price: "0 OMR",
    priceUSD: null,
    guarantee: "Written guarantee — no risk, no commitment",
    description:
      "We benchmark your asset against published Oman market signals and return your Economic Efficiency Score. If we find nothing meaningful, we tell you that in writing. No audit, no cost, ever.",
    whatYouGet: [
      "Economic Efficiency Score (0–100)",
      "Estimated annual gap in OMR",
      "Top 3 dispatch timing issues identified",
      "Written summary report",
    ],
    cta: { href: "/economic-audit", label: "Start My Free Leak Test" },
    highlight: true,
  },
  {
    name: "Economic Audit",
    price: "2,500 – 3,000 OMR",
    priceUSD: "≈ $6,500 USD",
    guarantee: "Find 20,000+ OMR annual gap or full refund — in writing",
    description:
      "A complete 8,760-hour economic model of your asset — every hour of the year, every dispatch decision evaluated against what the market was actually offering. Delivered in 7 days.",
    whatYouGet: [
      "Full 8,760-hour dispatch analysis",
      "Economic Decision Gap in OMR (precise)",
      "Hour-by-hour timing recommendations",
      "Ranked opportunity list by OMR impact",
      "Methodology report citing all data sources",
      "Written money-back guarantee",
    ],
    cta: { href: "/economic-audit", label: "Get Started" },
    highlight: false,
  },
  {
    name: "Pilot Program",
    price: "from 20,000 OMR",
    priceUSD: "≈ $52,000 USD",
    guarantee: null,
    description:
      "90 days running in parallel with your existing system. No disruption. No hardware change. Our engine runs in shadow mode — showing you exactly what it would have decided, and what it would have earned, compared to your actual results. At the end: you see the gap in OMR. Then you decide.",
    whatYouGet: [
      "90-day shadow-mode deployment",
      "Real-time decision comparison vs your system",
      "Daily economic performance log",
      "End-of-pilot gap report in OMR",
      "Zero disruption to existing operations",
      "Option to convert to revenue-share deployment",
    ],
    cta: { href: "/contact", label: "Book Strategy Call" },
    highlight: false,
  },
  {
    name: "Deployment",
    price: "40% / 60% Revenue Share",
    priceUSD: null,
    guarantee: null,
    description:
      "Zero upfront. Zero CAPEX. PREDAIOT takes 40% of the additional revenue generated above your verified baseline. You keep 60% — plus your entire original revenue. We only earn when you earn more. Revenue is measured against audited baseline using the same official market data sources.",
    whatYouGet: [
      "Full autonomous economic dispatch",
      "Zero upfront cost",
      "Revenue measured against verified baseline",
      "Monthly reporting in OMR",
      "Ongoing methodology updates",
      "Dedicated account contact",
    ],
    cta: { href: "/contact", label: "Contact Sales" },
    highlight: false,
  },
] as const;

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          "PREDAIOT Economic Intelligence",
          "Pricing for energy asset economic decision intelligence.",
          "/pricing"
        )}
      />

      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.grid} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader title={t("title")} lead={t("lead")} />
        </Section>
      </div>

      <Section className="py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={tier.highlight ? "border border-accent/40" : ""}
            >
              <h3 className="font-display text-xl font-extrabold">{tier.name}</h3>
              <div className="mt-2">
                <span
                  className={`font-display text-2xl font-extrabold ${
                    tier.highlight ? "text-accent" : "text-secondary"
                  }`}
                >
                  {tier.price}
                </span>
                {tier.priceUSD ? (
                  <p className="text-xs text-ink-muted">{tier.priceUSD}</p>
                ) : null}
              </div>

              {tier.guarantee ? (
                <p className="mt-2 text-xs font-semibold text-accent">{tier.guarantee}</p>
              ) : null}

              <p className="mt-3 text-sm text-ink-muted">{tier.description}</p>

              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                {tier.whatYouGet.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <LinkButton
                href={tier.cta.href}
                variant={tier.highlight ? "accent" : "secondary"}
                className="mt-6 w-full"
              >
                {tier.cta.label} <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </Card>
          ))}
        </div>

        {/* Guarantee restated */}
        <div className="surface mt-8 rounded-2xl border border-accent/30 p-6 text-center">
          <p className="text-sm font-semibold text-accent">Our guarantee</p>
          <p className="mt-2 text-lg">{GUARANTEE_TEXT}</p>
        </div>
      </Section>
    </>
  );
}
