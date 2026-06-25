import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { SECONDARY, fmtOMR, COMPANY } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/technology",
    title: `Technology — Shadow Economic Engine · ${COMPANY.name}`,
    description:
      "The Shadow Economic Engine — how PREDAIOT turns public Oman market data into recoverable value, every hour, on every asset.",
  });
}

const PIPELINE = [
  {
    num: "01",
    title: "INGEST",
    detail:
      "Asset telemetry (SoC, generation, consumption) is ingested via API or CSV upload. PREDAIOT connects to your existing SCADA or EMS — no hardware replacement required.",
    inputs: [
      "Battery State of Charge",
      "Solar generation (MW)",
      "Grid import/export",
      "Asset operating mode",
    ],
  },
  {
    num: "02",
    title: "ALIGN",
    detail:
      "We align your asset data against official Oman market signals — System Marginal Price (SMP), scarcity pricing, and demand patterns — published by APSR and Nama PWP.",
    inputs: [
      "SMP (OMR/MWh) — APSR published",
      "Scarcity price signals",
      "Hourly demand profile — Nama PWP",
      "Grid saturation indicators",
    ],
  },
  {
    num: "03",
    title: "REPLAY",
    detail:
      "The Shadow Economic Engine replays every dispatch decision your asset made — and calculates what the economically optimal decision would have been at each hour, given actual market prices.",
    inputs: [
      "8,760 hourly evaluations per year",
      "Up to 287 decisions per day in live mode",
      "Price-signal-first decision logic",
      "Curtailment signal integration",
    ],
  },
  {
    num: "04",
    title: "QUANTIFY",
    detail:
      "We calculate the Economic Decision Gap — the difference between what your asset earned and what it could have earned. Expressed in OMR. Cited to official data. Independently verifiable.",
    inputs: [
      "Economic Decision Gap in OMR",
      "Economic Efficiency Index (0–100%)",
      "Top dispatch timing opportunities ranked by OMR",
      "Curtailment-to-revenue conversion estimate",
    ],
  },
];

const PSEUDOCODE = `FOR each hour in operational year:
  price_now    = get_market_SMP(hour)        // APSR published signal
  price_future = forecast_peak(hour, +8hrs)  // Forward price expectation
  soc          = battery.state_of_charge
  curtail_flag = grid.saturation_signal

  // Economic value of each action
  V_charge    = price_future × efficiency - price_now
  V_discharge = price_now - avg_charge_cost(soc)
  V_absorb    = price_future × efficiency     // Curtailment = free energy

  // Priority decision
  IF curtail_flag AND soc < 95%:
      action = ABSORB                         // Convert waste to arbitrage
  ELIF V_charge > threshold AND soc < 90%:
      action = CHARGE at optimal rate
  ELIF V_discharge > threshold AND soc > 10%:
      action = DISCHARGE at optimal rate
  ELSE:
      action = HOLD                           // Wait for better price window

  execute(action)
  log_economic_outcome(hour, action, price_now, revenue_delta)`;

const COMPARISON = [
  { metric: "Decision basis", standard: "Fixed schedule (time-based)", predaiot: "Real-time price signals" },
  { metric: "Charge timing", standard: "02:00–06:00 every night (fixed)", predaiot: "Cheapest available hours each day" },
  { metric: "Discharge timing", standard: "17:00–21:00 every evening (fixed)", predaiot: "Highest-value window each day" },
  { metric: "Curtailment response", standard: "None — energy is wasted", predaiot: "Absorbed and resold via arbitrage" },
  { metric: "Arbitrage capture", standard: "~62% of theoretical maximum", predaiot: "Up to 100% of theoretical maximum" },
  { metric: "Revenue on 500 MW (sim.)", standard: "9,441,490 OMR / year", predaiot: "10,304,393 OMR / year" },
  { metric: "Annual difference", standard: "—", predaiot: "862,903 OMR / year" },
];

const SOURCES = [
  {
    name: "Nama PWP MIS Demand Data",
    detail: "2022 hourly demand observations — 8,760 data points",
    url: "https://omanpwp.om",
  },
  {
    name: "APSR Annual Report 2024",
    detail: "SMP: 9.120 OMR/MWh · Subsidy: 602.3M OMR · Economic cost: 1,306.3M OMR",
    url: "https://opendata.gov.om",
  },
  {
    name: "Ministry of Energy & Minerals",
    detail: "Total renewable energy plants capacity data",
    url: "https://opendata.gov.om",
  },
  {
    name: "Published Methodology",
    detail: "PREDAIOT case study — Oman National Open Data Portal — June 2026",
    url: "https://opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f",
  },
];

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.controlRoom} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader
            title="The Shadow Economic Engine"
            lead="How we turn public market data into recoverable value — every hour, on every asset."
          />
        </Section>
      </div>

      {/* Pipeline */}
      <Section className="py-8">
        <h2 className="font-display text-3xl font-extrabold">Data pipeline</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {PIPELINE.map((step) => (
            <Card key={step.num}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-secondary">{step.num}</span>
                <span className="font-display text-xl font-extrabold">{step.title}</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{step.detail}</p>
              <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                {step.inputs.map((i) => (
                  <li key={i} className="font-mono text-[12px] text-ink-muted">
                    <span className="text-secondary">›</span> {i}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Decision logic */}
      <Section className="py-8">
        <Card>
          <h2 className="font-display text-3xl font-extrabold">How the engine decides</h2>
          <p className="mt-2 text-ink-muted">Patent-pending. The core logic, simplified:</p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-5 font-mono text-[12px] leading-relaxed text-ink">
            {PSEUDOCODE}
          </pre>
          <p className="mt-3 font-mono text-[11px] text-ink-muted">
            Financial_Loss = Σ (P_expected − P_actual) × Market_Price
          </p>
        </Card>
      </Section>

      {/* Comparison */}
      <Section className="py-8">
        <h2 className="font-display text-3xl font-extrabold">Economic intelligence vs. standard EMS</h2>
        <div className="surface mt-6 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="p-4">Metric</th>
                <th className="p-4">Standard EMS</th>
                <th className="p-4 text-secondary">PREDAIOT</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={row.metric} className={i % 2 ? "bg-white/[0.02]" : ""}>
                  <td className="p-4 font-medium">{row.metric}</td>
                  <td className="p-4 text-ink-muted">{row.standard}</td>
                  <td className="p-4 font-mono text-secondary">{row.predaiot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Validated on official data */}
      <Section className="py-8">
        <h2 className="font-display text-3xl font-extrabold">Validated on official Oman data</h2>
        <p className="mt-3 max-w-3xl text-ink-muted">
          All PREDAIOT simulations use official, publicly available Oman government data. Our
          methodology is published on the Oman National Open Data Portal. Every assumption is
          stated. Every source is cited. Every number is independently verifiable.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SOURCES.map((s) => (
            <Card key={s.name}>
              <p className="font-semibold">{s.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.detail}</p>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-mono text-xs text-secondary underline"
              >
                {s.url.replace(/^https?:\/\//, "")}
              </a>
            </Card>
          ))}
        </div>
      </Section>

      {/* Smaller asset class note */}
      <Section className="py-8">
        <div className="surface rounded-2xl border border-accent/30 p-6">
          <div className="flex items-center gap-2 text-accent">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Smaller asset class — peak-case internal simulation
            </span>
          </div>
          <p className="mt-3 text-ink-muted">
            On a {SECONDARY.solarMW} MW solar / {SECONDARY.batteryMWh} MWh battery system: up to
            <span className="text-secondary"> {SECONDARY.upliftMaxPct}% </span>
            uplift / ~${fmtOMR(SECONDARY.upliftUSD)} per year — peak-case scenario. Always labeled
            separately from the published 500 MW Nama PWP simulation.
          </p>
        </div>
      </Section>

      {/* Suppress unused warnings */}
      <span hidden>{t("title")}</span>
    </>
  );
}
