import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle, Download, FileText, Quote } from "lucide-react";
import { Section, PageHeader, Card, Kicker } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import {
  PRIMARY,
  REAL_TRACTION,
  INDUSTRY_QUOTES,
  fmtOMR,
  COMPANY,
} from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/cases",
    title: `Case Studies & Validation · ${COMPANY.name}`,
    description:
      "Simulation case studies on official Oman data — Sinaw-class 500MW IPP and Manah-class arbitrage optimization — plus verified institutional traction.",
  });
}

const SIMULATION_CASES = [
  {
    id: "sinaw",
    tag: "Simulation Study",
    title: "Sinaw-class 500 MW Solar IPP — Economic Decision Gap analysis",
    subtitle: "Based on official Nama PWP 2022 data · three scenarios compared",
    results: [
      { label: "Scenario A — Solar only", value: "7,375,230 OMR / year", note: "No storage, standard export" },
      { label: "Scenario B — BESS, fixed schedule", value: "8,962,012 OMR / year", note: "Storage + fixed 02:00 / 17:00 schedule" },
      { label: "Scenario C — PREDAIOT intelligence", value: "9,921,262 OMR / year", note: "Full economic optimization" },
    ],
    gap: { label: "Total Economic Decision Gap", value: "2,546,032 OMR / year", note: "C vs A — zero hardware change" },
    intelligencePremium: "959,250 OMR / year above standard BESS",
    pdf: "/papers/predaiot-sinaw-case-study.pdf",
    pdfLabel: "Download the case study (PDF)",
    disclaimer:
      "Simulation study on official Oman government data. Asset is hypothetical with Sinaw-class specifications. All assumptions stated. All sources cited.",
  },
  {
    id: "manah",
    tag: "Simulation Study",
    title: "Manah-class 500 MW Solar + 200 MW BESS — arbitrage optimization",
    subtitle: "Modelled on MIS hourly demand patterns · APSR 2024 pricing",
    results: [
      { label: "Fixed-schedule arbitrage capture", value: "62.3%", note: "Of theoretical maximum" },
      { label: "PREDAIOT arbitrage capture", value: "100%", note: "Of theoretical maximum" },
      { label: "Intelligence premium", value: "959,250 OMR / year", note: "Same hardware, different decisions" },
    ],
    gap: { label: "Annual intelligence premium", value: "959,250 OMR / year", note: "Above standard fixed-schedule BESS" },
    disclaimer:
      "Simulation study. Manah-class specifications based on publicly announced project parameters.",
  },
] as const;

export default async function CasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const isAr = locale === "ar";

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.industrial} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader title={t("title")} />
        </Section>
      </div>

      {/* Published methodology summary */}
      <Section className="py-8">
        <div className="surface rounded-2xl border border-accent/20 p-8">
          <div className="flex items-center gap-2 text-accent">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{t("simLabel")}</span>
          </div>
          <Kicker>{t("simKicker")}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-secondary">
            {t("simTitle")}
          </h2>
          <p className="mt-3 max-w-3xl text-ink-muted">{t("simBody")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat
              big={`${fmtOMR(PRIMARY.annualRevenueOMR)} OMR`}
              small={`additional annual revenue / ${PRIMARY.assetMW} MW`}
            />
            <Stat
              big={`${PRIMARY.profitMin}%–${PRIMARY.profitMax}%`}
              small="profitability increase, zero CAPEX"
            />
            <Stat
              big={`${PRIMARY.subsidy2024OMR / 1_000_000}M OMR`}
              small="Government subsidy 2024 (context)"
            />
          </div>
          <p className="mt-4 text-xs text-ink-muted">
            {PRIMARY.citation}.{" "}
            <a
              href={PRIMARY.citationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              opendata.gov.om
            </a>
          </p>
        </div>
      </Section>

      {/* Simulation cases */}
      {SIMULATION_CASES.map((c) => (
        <Section key={c.id} className="py-8">
          <Card>
            <Kicker>{c.tag}</Kicker>
            <h2 className="mt-3 font-display text-2xl font-extrabold">{c.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{c.subtitle}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {c.results.map((r) => (
                <div key={r.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wide text-ink-muted">{r.label}</p>
                  <p className="mt-1 font-mono text-lg font-bold text-secondary">{r.value}</p>
                  <p className="mt-1 text-xs text-ink-muted">{r.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4">
              <p className="text-xs uppercase tracking-wide text-accent">{c.gap.label}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-accent">{c.gap.value}</p>
              <p className="mt-1 text-xs text-ink-muted">{c.gap.note}</p>
            </div>

            {"pdf" in c && c.pdf ? (
              <a
                href={c.pdf}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-[#04081A] hover:brightness-110"
              >
                <Download className="h-4 w-4" /> {c.pdfLabel}
              </a>
            ) : null}

            <p className="mt-4 text-xs text-ink-muted">{c.disclaimer}</p>
          </Card>
        </Section>
      ))}

      {/* Industry quotes */}
      <Section className="py-8">
        <h2 className="font-display text-3xl font-extrabold">
          {isAr ? "أصوات من القطاع" : "Voices from the industry"}
        </h2>
        <p className="mt-2 text-ink-muted">
          {isAr
            ? "تعليقات من محترفي الطاقة في عُمان والخليج — أسماء محجوبة احترامًا للخصوصية."
            : "Comments from energy professionals in Oman and the GCC — names withheld for privacy."}
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {INDUSTRY_QUOTES.map((q) => (
            <Card key={q.key}>
              <Quote className="h-5 w-5 text-secondary" />
              <p className="mt-3 text-sm">"{isAr ? q.ar : q.en}"</p>
              <p className="mt-4 text-xs font-semibold text-ink-muted">{isAr ? q.roleAr : q.role}</p>
              <p className="text-xs text-ink-muted">{q.date}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Real traction */}
      <Section className="py-8">
        <h2 className="font-display text-3xl font-extrabold">{t("tractionTitle")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_TRACTION.map((item) => (
            <Card key={item.key}>
              <div className="flex items-center gap-2 text-secondary">
                <span aria-hidden className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold">{isAr ? item.ar : item.en}</span>
              </div>
              <p className="mt-2 text-xs text-ink-muted">{isAr ? item.detailAr : item.detailEn}</p>
            </Card>
          ))}
        </div>
      </Section>

      <span hidden><FileText /></span>
    </>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="font-display text-2xl font-extrabold">{big}</p>
      <p className="text-xs text-ink-muted">{small}</p>
    </div>
  );
}
