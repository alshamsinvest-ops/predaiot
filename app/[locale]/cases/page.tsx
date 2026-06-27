import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  AlertTriangle,
  Calendar,
  Download,
  FileText,
  Quote,
  Sigma,
  Target,
} from "lucide-react";
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

/** Anatomy of a Decision Gap report — what the reader is actually looking at */
const REPORT_SECTIONS = [
  {
    num: "01",
    title: "Asset baseline",
    detail:
      "Your asset's actual dispatch over the analysis window — what it earned, when, against which market price. This is the ground truth, not a model.",
  },
  {
    num: "02",
    title: "Shadow run",
    detail:
      "The same hours replayed by the engine using the price-first decision logic. Same hardware. Same constraints. Different decisions.",
  },
  {
    num: "03",
    title: "Decision Gap",
    detail:
      "The OMR difference between actual and shadow runs, broken down by leak category — charge timing, discharge window, curtailment absorption.",
  },
  {
    num: "04",
    title: "Top 20 actions ranked by OMR",
    detail:
      "The specific hours where the biggest value was on the table. Each row carries date, hour, action taken, recommended action, and OMR delta.",
  },
  {
    num: "05",
    title: "Recovery roadmap",
    detail:
      "What changes — process, schedule, or software — would have captured each leak. Estimated lift per change. No software lock-in implied.",
  },
];

/** Sensitivity — does the number hold under stress */
const SENSITIVITY = [
  {
    lever: "SMP −10%",
    revenue: "8,929,136 OMR",
    gap: "776,613 OMR",
    note: "Lower market prices shrink the absolute gap but not the relative inefficiency.",
  },
  {
    lever: "SMP baseline (9.12 OMR/MWh)",
    revenue: "10,304,393 OMR",
    gap: "862,903 OMR",
    note: "Published methodology — Nama PWP 2022 hourly demand.",
  },
  {
    lever: "SMP +10%",
    revenue: "11,679,649 OMR",
    gap: "949,193 OMR",
    note: "Higher prices widen the gap. Cost of inaction grows.",
  },
  {
    lever: "Round-trip efficiency −5%",
    revenue: "10,047,648 OMR",
    gap: "819,758 OMR",
    note: "Conservative battery degradation assumption. Gap is durable.",
  },
  {
    lever: "Curtailment events −50%",
    revenue: "10,021,393 OMR",
    gap: "579,903 OMR",
    note: "Even halving curtailment capture, the engine still beats a fixed schedule materially.",
  },
];

/** Customer journey — day-by-day after they click */
const JOURNEY = [
  {
    when: "Day 0",
    headline: "5-minute form",
    detail:
      "Asset type, size, location. No financials, no NDA pre-conditions. Submit and you get an automatic confirmation.",
  },
  {
    when: "Within 24h",
    headline: "Founder call",
    detail:
      "Chams reaches out via WhatsApp or email. Confirms the asset profile and the data format that fits your control room.",
  },
  {
    when: "Day 1–2",
    headline: "Data handoff",
    detail:
      "You share one month of dispatch logs, energy invoices, or operational data. CSV/XLSX works. Macros are rejected. ≤10 MB.",
  },
  {
    when: "Day 3–6",
    headline: "Shadow run",
    detail:
      "The engine replays your month against published Oman market signals. Every leak is logged with its OMR weight and source row.",
  },
  {
    when: "Day 7",
    headline: "Report delivered",
    detail:
      "PDF + CSV decision log. Top 20 actions ranked by OMR. Recovery roadmap. Optional 30-minute walkthrough.",
  },
  {
    when: "After Day 7",
    headline: "You decide",
    detail:
      "No automatic enrollment. If the number is material, we talk pilot or deployment. If not, you keep the report.",
  },
];

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

      {/* Anatomy of a Decision Gap report */}
      <Section className="py-8">
        <Kicker>How to read the deliverable</Kicker>
        <h2 className="mt-3 font-display text-3xl font-extrabold">Anatomy of a Decision Gap report</h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          Every PREDAIOT report follows the same five-part structure. No buried charts. No
          consulting-deck filler. Every claim is traceable to a row in your data and an hour on
          the published price curve.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REPORT_SECTIONS.map((s) => (
            <Card key={s.num}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xl font-bold text-secondary">{s.num}</span>
                <span className="font-display text-lg font-extrabold">{s.title}</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{s.detail}</p>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Sample report available on request — anonymized, real format. Email{" "}
          <a href={`mailto:${COMPANY.email}`} className="underline text-secondary">
            {COMPANY.email}
          </a>
          .
        </p>
      </Section>

      {/* Sensitivity analysis */}
      <Section className="py-8">
        <Kicker>Does the number hold?</Kicker>
        <h2 className="mt-3 font-display text-3xl font-extrabold">Sensitivity — stress-testing the gap</h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          A number is only as good as its assumptions. Below: what happens to the published
          862,903 OMR / 500 MW figure when we move the dials on price, efficiency, and
          curtailment. The Decision Gap is robust under stress.
        </p>
        <div className="surface mt-6 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="p-4">Scenario lever</th>
                <th className="p-4">PREDAIOT revenue</th>
                <th className="p-4 text-secondary">Decision Gap</th>
                <th className="p-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {SENSITIVITY.map((row, i) => (
                <tr key={row.lever} className={i % 2 ? "bg-white/[0.02]" : ""}>
                  <td className="p-4 align-top font-medium">
                    <div className="flex items-start gap-2">
                      <Sigma className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{row.lever}</span>
                    </div>
                  </td>
                  <td className="p-4 align-top font-mono text-ink-muted">{row.revenue}</td>
                  <td className="p-4 align-top font-mono text-secondary">{row.gap}</td>
                  <td className="p-4 align-top text-ink-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Sensitivity ranges derived from APSR 2024 SMP variance and standard Li-ion BESS
          degradation curves. All input assumptions and source citations are listed in the
          published methodology on{" "}
          <a
            href={PRIMARY.citationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            opendata.gov.om
          </a>
          .
        </p>
      </Section>

      {/* Customer journey */}
      <Section className="py-8">
        <Kicker>From click to report</Kicker>
        <h2 className="mt-3 font-display text-3xl font-extrabold">What the seven days actually look like</h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          No sales funnel. No "discovery workshop." A defined process with a defined deliverable
          on a defined date.
        </p>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JOURNEY.map((j) => (
            <li key={j.when} className="surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-secondary">
                <Calendar className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">{j.when}</span>
              </div>
              <h3 className="mt-2 font-display text-lg font-extrabold">{j.headline}</h3>
              <p className="mt-2 text-sm text-ink-muted">{j.detail}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold">Guarantee</p>
            <p className="mt-1 text-sm text-ink-muted">
              If we don't identify at least 20,000 OMR in annual recoverable value — you pay
              nothing. In writing.
            </p>
          </div>
        </div>
      </Section>

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
