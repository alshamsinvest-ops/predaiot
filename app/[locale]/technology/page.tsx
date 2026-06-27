import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  AlertTriangle,
  Activity,
  Database,
  GitBranch,
  Lock,
  Plug,
  ShieldAlert,
  Timer,
  XCircle,
} from "lucide-react";
import { Section, PageHeader, Card, Kicker } from "@/components/ui";
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

/** Engine runtime performance — measured on internal benchmarks */
const ENGINE_SLA = [
  {
    icon: Timer,
    headline: "< 800 ms",
    label: "Decision latency",
    detail:
      "From signal ingest to recommended action — end-to-end. Plenty of headroom for the 15-minute dispatch cadence used in real systems.",
  },
  {
    icon: Activity,
    headline: "8,760 / yr",
    label: "Hourly evaluations",
    detail:
      "Every hour of the year is replayed against the actual market price. No sampling. No shortcuts. Full-resolution audit.",
  },
  {
    icon: Database,
    headline: "100% traceable",
    label: "Audit trail",
    detail:
      "Every action carries the price, SoC, and signal that justified it. Replayable in court — or in a board meeting.",
  },
  {
    icon: Lock,
    headline: "Read-only by default",
    label: "Operator safety",
    detail:
      "PREDAIOT recommends; the operator commits. Closed-loop control is opt-in and gated by configurable guardrails.",
  },
];

/** Integration touchpoints — what we plug into */
const INTEGRATIONS = [
  {
    title: "SCADA / DCS",
    detail:
      "OPC UA, Modbus TCP, IEC 60870-5-104. Read-only telemetry pull on a 1–15 min cadence — no PLC code changes.",
  },
  {
    title: "EMS / BMS",
    detail:
      "Tesla Megapack, Wärtsilä GEMS, Fluence Mosaic, Sungrow PowerTitan. REST/MQTT bridges or CSV exports both work.",
  },
  {
    title: "Market data",
    detail:
      "APSR SMP, scarcity price, Nama PWP demand. Public sources only — no licensed feed required to start.",
  },
  {
    title: "Reporting",
    detail:
      "PDF audit, CSV decision log, Webhook to your data lake. JSON-LD schema on every line for downstream tooling.",
  },
];

/** Failure modes — what happens when reality breaks */
const FAILURE_MODES = [
  {
    when: "Market price feed drops",
    then: "Engine falls back to the last 24-hour price curve plus seasonality offset. Confidence flag drops from HIGH to MEDIUM. Decisions continue.",
  },
  {
    when: "Asset telemetry stalls",
    then: "Engine flags STALE on any signal older than 15 min and pauses dispatch recommendations until fresh data returns. No silent guessing.",
  },
  {
    when: "Forecast disagrees with realized price",
    then: "Engine logs the variance per hour and auto-recalibrates the next-day forecast. Variance > 20% triggers an operator alert.",
  },
  {
    when: "Operator overrides the recommendation",
    then: "Override is logged with reason code. The opportunity cost is calculated and shown in the next report — no judgment, just numbers.",
  },
];

/** Anti-overpromise — what the engine does NOT do */
const NOT_THIS = [
  "We do not predict the future. We replay decisions against signals you could have seen.",
  "We do not control your hardware unless you explicitly enable closed-loop mode with guardrails.",
  "We do not require new sensors, new PLCs, or new SCADA. Existing data is enough.",
  "We do not store private operational data outside your tenant. Read-only by default, scoped by contract.",
  "We do not sell anonymized data, market signals, or insights derived from your asset.",
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

      {/* Engine performance — SLAs */}
      <Section className="py-8">
        <Kicker>Engine performance</Kicker>
        <h2 className="mt-3 font-display text-3xl font-extrabold">Built for the dispatch floor</h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          The engine sits next to your control room — not in place of it. Latency, traceability,
          and operator safety are non-negotiable. Numbers below are measured on internal
          benchmarks against the Nama PWP 2022 hourly dataset.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENGINE_SLA.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="surface rounded-2xl p-5">
                <Icon className="h-5 w-5 text-secondary" />
                <p className="mt-3 font-display text-2xl font-extrabold text-secondary">{s.headline}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {s.label}
                </p>
                <p className="mt-3 text-xs text-ink-muted">{s.detail}</p>
              </div>
            );
          })}
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

      {/* Integration touchpoints */}
      <Section className="py-8">
        <Kicker>Integration</Kicker>
        <h2 className="mt-3 font-display text-3xl font-extrabold">Plugs into what you already run</h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          No rip-and-replace. PREDAIOT reads existing telemetry and writes recommendations into
          the channels your operators already trust.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {INTEGRATIONS.map((i) => (
            <Card key={i.title}>
              <div className="flex items-center gap-2 text-secondary">
                <Plug className="h-4 w-4" />
                <span className="font-display text-lg font-bold">{i.title}</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{i.detail}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Failure modes */}
      <Section className="py-8">
        <Kicker>Graceful degradation</Kicker>
        <h2 className="mt-3 font-display text-3xl font-extrabold">What happens when reality breaks</h2>
        <p className="mt-2 max-w-3xl text-ink-muted">
          Energy systems fail in messy ways. Signals stall. Forecasts diverge. Operators override.
          The engine is designed to never lie about what it knows.
        </p>
        <div className="surface mt-6 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="p-4 w-1/3">When this happens</th>
                <th className="p-4">The engine does this</th>
              </tr>
            </thead>
            <tbody>
              {FAILURE_MODES.map((f, i) => (
                <tr key={f.when} className={i % 2 ? "bg-white/[0.02]" : ""}>
                  <td className="p-4 align-top font-medium">
                    <div className="flex items-start gap-2">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{f.when}</span>
                    </div>
                  </td>
                  <td className="p-4 text-ink-muted">{f.then}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* What we don't do */}
      <Section className="py-8">
        <div className="surface rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 text-accent">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              What the engine does not do
            </span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-extrabold">
            Honesty as a feature, not a footnote
          </h3>
          <ul className="mt-5 space-y-3">
            {NOT_THIS.map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm text-ink-muted">
                <GitBranch className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
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
