import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Section, PageHeader, Card, LinkButton } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/solar",
    title: `Solar + Storage Economic Intelligence · ${COMPANY.name}`,
    description:
      "Your solar plant generates on the sun's schedule. Revenue depends on the market's schedule. PREDAIOT bridges the gap with economic dispatch.",
  });
}

const SCENARIOS = [
  {
    label: "Solar only — no storage",
    revenue: "7,375,230 OMR / year",
    curtailment: "42,750 MWh wasted (5.0%)",
    note: "Baseline. No flexibility.",
    tone: "muted" as const,
  },
  {
    label: "Solar + BESS, fixed schedule",
    revenue: "8,962,012 OMR / year",
    curtailment: "27,360 MWh wasted (3.2%)",
    note: "Better — but still leaving 959,250 OMR on the table annually.",
    tone: "muted" as const,
  },
  {
    label: "Solar + BESS + PREDAIOT",
    revenue: "9,921,262 OMR / year",
    curtailment: "8,208 MWh wasted (0.96%)",
    note: "Full optimization. 34,542 MWh converted from waste to revenue.",
    tone: "accent" as const,
  },
];

export default async function SolarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          "Solar + Storage Optimization",
          "Economic dispatch for solar + storage assets in Oman & the GCC.",
          "/solar"
        )}
      />

      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.solarAerial} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader
            title="Your solar plant generates on the sun's schedule. Revenue depends on the market's schedule."
            lead="They are not the same schedule. Storage bridges the gap — but only if it dispatches on economics."
          />
        </Section>
      </div>

      {/* Insight */}
      <Section className="py-8">
        <Card>
          <p className="text-lg text-ink">
            When solar peaks at 12:00 — grid prices are often at their lowest. When grid prices
            peak at 19:00 — your panels are off. The battery is the only instrument that can bridge
            that timing gap.{" "}
            <span className="text-accent">
              But a battery on a fixed schedule doesn't bridge the gap — it just shifts it.
            </span>
          </p>
        </Card>
      </Section>

      {/* Scenarios */}
      <Section className="py-8">
        <h2 className="font-display text-2xl font-extrabold">Three scenarios — same asset, same data</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <Card
              key={s.label}
              className={s.tone === "accent" ? "border border-secondary/40" : ""}
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted">{s.label}</p>
              <p
                className={`mt-2 font-mono text-xl font-bold ${
                  s.tone === "accent" ? "text-secondary" : ""
                }`}
              >
                {s.revenue}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{s.curtailment}</p>
              <p className="mt-3 text-xs text-ink-muted">{s.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Curtailment */}
      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-extrabold">Curtailment is a decision problem</h2>
          <p className="mt-3 text-ink-muted">
            Curtailment is not a grid problem. It is a decision problem. Standard export schedules
            cannot respond to real-time saturation signals. PREDAIOT absorbs curtailment events
            dynamically — converting wasted generation into stored arbitrage value.
          </p>
        </Card>
        <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
          <AlertTriangle className="h-3.5 w-3.5 text-accent" />
          Simulation study on official Oman Nama PWP 2022 data and APSR 2024 pricing. All scenarios
          modelled on Sinaw-class 500 MW asset specifications.
        </p>
      </Section>

      {/* CTA */}
      <Section className="py-8">
        <div className="surface rounded-2xl p-8 text-center">
          <LinkButton href="/economic-audit" variant="accent">
            {t("startDiagnostic")} <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
