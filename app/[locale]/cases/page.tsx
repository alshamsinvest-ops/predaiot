import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle, Building2 } from "lucide-react";
import { Section, PageHeader, Card, Kicker } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { PRIMARY, REAL_TRACTION, fmtOMR } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return buildMetadata({
    locale,
    path: "/cases",
    title: t("title"),
    description: "Published methodology case study: 862,903 OMR recovered per 500 MW asset, and PREDAIOT's real pre-seed traction.",
  });
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const isAr = locale === "ar";

  return (
    <>
      <Section className="pt-12">
        <PageHeader title={t("title")} />
      </Section>

      {/* Simulation case study — clearly labeled */}
      <Section className="py-8">
        <div className="surface rounded-2xl border border-yellow-400/20 p-8">
          <div className="flex items-center gap-2 text-yellow-300/90">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{t("simLabel")}</span>
          </div>
          <Kicker>{t("simKicker")}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[--color-accent]">{t("simTitle")}</h2>
          <p className="mt-3 max-w-2xl text-[--color-ink-muted]">{t("simBody")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{fmtOMR(PRIMARY.annualRevenueOMR)} OMR</p>
              <p className="text-xs text-[--color-ink-muted]">additional annual revenue / {PRIMARY.assetMW} MW</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{PRIMARY.profitMin}%–{PRIMARY.profitMax}%</p>
              <p className="text-xs text-[--color-ink-muted]">profitability increase, zero CAPEX</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{PRIMARY.subsidy2024OMR / 1_000_000}M OMR</p>
              <p className="text-xs text-[--color-ink-muted]">Government subsidy 2024 (context)</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[--color-ink-muted]">
            {PRIMARY.citation}.{" "}
            <a href={PRIMARY.citationLink} target="_blank" rel="noopener noreferrer" className="underline">
              opendata.gov.om
            </a>
          </p>
        </div>
      </Section>

      {/* Real traction */}
      <Section className="py-8">
        <h2 className="font-display text-2xl font-extrabold">{t("tractionTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_TRACTION.map((item) => (
            <Card key={item.key} className="flex items-center gap-3">
              <Building2 className="h-5 w-5 shrink-0 text-[--color-secondary]" />
              <span className="text-sm">{isAr ? item.ar : item.en}</span>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
