import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  AlertTriangle,
  Sun,
  TrendingDown,
  Clock,
  Sparkles,
  Activity,
  GitBranch,
  Battery,
  CloudOff,
} from "lucide-react";
import { Section, PageHeader, Card, LinkButton, Kicker } from "@/components/ui";
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
      "Your solar plant generates on the sun's schedule. Revenue depends on the market's schedule. PREDAIOT bridges the gap with economic dispatch on official Oman market data.",
  });
}

/** The hook strip — provocative numbers about solar economics */
const HOOK_FACTS = [
  {
    icon: Sun,
    headline: "12:00",
    text: "is when your solar peaks. It's also when grid prices are often near their daily low.",
  },
  {
    icon: TrendingDown,
    headline: "19:00",
    text: "is when grid prices peak. Your panels are off. Storage is the only bridge.",
  },
  {
    icon: CloudOff,
    headline: "5.0%",
    text: "of solar generation is curtailed under standard schedules. That's wasted MWh — and wasted OMR.",
  },
  {
    icon: Sparkles,
    headline: "959,250 OMR",
    text: "/ year — the gap between fixed BESS schedule and economic dispatch on a Sinaw-class 500 MW asset.",
  },
];

/** A simplified day-in-the-life: when sun is up vs when value is up */
const SOLAR_DAY = [
  { time: "06:00", solar: "low", grid: "low", verdict: "Hold — start charging if cheap" },
  { time: "09:00", solar: "rising", grid: "rising", verdict: "Discharge selectively" },
  { time: "12:00", solar: "peak", grid: "trough", verdict: "Absorb generation, charge BESS" },
  { time: "15:00", solar: "high", grid: "rising", verdict: "Top up arbitrage capacity" },
  { time: "19:00", solar: "off", grid: "peak", verdict: "Maximum discharge from BESS" },
  { time: "22:00", solar: "off", grid: "declining", verdict: "Cycle for tomorrow if profitable" },
];

/** The three biggest revenue leaks on a solar + storage asset */
const SOLAR_LEAKS = [
  {
    code: "01",
    icon: Clock,
    title: "Timing mismatch (the core problem)",
    setup:
      "Solar peaks at the wrong time of day for grid value. Standard schedules export whatever's generated at the moment it's generated.",
    math: [
      ["~5.0%", "of solar generation curtailed or sold at trough"],
      ["~2 OMR/MWh", "trough price gap vs peak"],
      ["~610,000 OMR", "annual leak from selling at the wrong hour"],
    ],
  },
  {
    code: "02",
    icon: CloudOff,
    title: "Curtailment treated as loss, not opportunity",
    setup:
      "When the grid is saturated, curtailment is called. Generation is wasted. A BESS could absorb it for free and resell at peak — most don't.",
    math: [
      ["42,750 MWh", "wasted under no-storage baseline (Sinaw-class)"],
      ["8,208 MWh", "wasted with PREDAIOT (80% capture rate)"],
      ["~510,000 OMR", "annual value created from former waste"],
    ],
  },
  {
    code: "03",
    icon: GitBranch,
    title: "DC-side oversize ignored",
    setup:
      "Most Oman utility solar is built with DC/AC ratio ~1.25 (single-axis tracker + bifacial). The clipped DC headroom is a hidden generation reserve — rarely modelled in dispatch.",
    math: [
      ["+8–12%", "additional generation potential (tracker + bifacial)"],
      ["~OMR 14.8/MWh", "evening peak resale price"],
      ["six-figure OMR", "annual gain when modelled correctly"],
    ],
  },
];

/** Truths editorial — capital-T insights about solar economics */
const TRUTHS = [
  {
    head: "Capacity factor is not the right number",
    body: "A 28% capacity factor doesn't tell you whether your MWh landed at 4 OMR/MWh or 14.8 OMR/MWh. Revenue per MWh is the number that matters — and it varies by 4× across a single day.",
  },
  {
    head: "Solar peaks against the market",
    body: "The Oman demand curve peaks late afternoon to evening. Solar peaks at noon. Without storage, you're selling into the trough. With fixed-schedule storage, you're shifting into the wrong window.",
  },
  {
    head: "Curtailment is a decision, not a defect",
    body: "Curtailment isn't a hardware failure — it's the grid telling you it can't absorb your output. The right response is to store it, not protest it.",
  },
  {
    head: "DC/AC ratio is an arbitrage tool",
    body: "Clipped DC headroom is an idle asset. Combined with a storage layer, it becomes free generation for evening arbitrage. Standard EMS doesn't see this.",
  },
];

/** Scenario stack — A, B, C */
const SCENARIOS = [
  {
    label: "A · Solar only — no storage",
    revenue: "7,375,230",
    curtailment: "42,750 MWh wasted (5.0%)",
    note: "Baseline. No flexibility. Sells when the sun sells, not when the market buys.",
    tone: "muted" as const,
  },
  {
    label: "B · Solar + BESS, fixed schedule",
    revenue: "8,962,012",
    curtailment: "27,360 MWh wasted (3.2%)",
    note: "Better — but still leaving 959,250 OMR on the table annually.",
    tone: "muted" as const,
  },
  {
    label: "C · Solar + BESS + PREDAIOT",
    revenue: "9,921,262",
    curtailment: "8,208 MWh wasted (0.96%)",
    note: "Full optimization. 34,542 MWh converted from waste to revenue. Same hardware.",
    tone: "accent" as const,
  },
];

/** FAQ */
const FAQS = [
  {
    q: "We're a pure-solar IPP. Does this still apply?",
    a: "Partially. Without storage, your levers are: export curve shaping where the PPA allows it, curtailment forecasting, and DC-side analytics. Most of the value comes when you add a storage layer — even a small one.",
  },
  {
    q: "We have a fixed-price PPA. Why would we care about market signals?",
    a: "If your PPA is fixed-price across all hours, the value of optimization accrues to the off-taker, not to you. But many newer Oman/GCC PPAs have time-of-day tariff structures, scarcity adders, or merchant exposure for capacity above contracted. Those are where economic dispatch matters.",
  },
  {
    q: "How does curtailment capture actually work?",
    a: "When a curtailment signal arrives, we shift available BESS capacity into absorb mode for the duration of the saturation event, then schedule the stored MWh for resale during the next evening peak. Net: most of the curtailed energy becomes peak-priced energy.",
  },
  {
    q: "What about bifacial / tracker yield uplift?",
    a: "We model DC/AC ratio explicitly. If your plant is single-axis tracker + bifacial with a 1.25 ratio, our forecast accounts for the additional clipped headroom and treats it as available generation that's now economically dispatchable through storage.",
  },
  {
    q: "Can you run on partial data?",
    a: "Yes. Hourly inverter output + invoice data is enough to start. Better data tightens the result; we never block on a missing column.",
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

      {/* HERO */}
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.solarAerial} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader
            kicker="Solar + Storage · Economic Decision Intelligence"
            title="Your solar plant generates on the sun's schedule. Revenue depends on the market's schedule."
            lead="They are not the same schedule. Storage bridges the gap — but only if it dispatches on economics."
          />
        </Section>
      </div>

      {/* HOOK STRIP */}
      <Section className="py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOOK_FACTS.map((f) => (
            <div
              key={f.headline}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <f.icon className="h-5 w-5 text-secondary" />
              <p className="mt-3 font-display text-3xl font-extrabold leading-none text-secondary">
                {f.headline}
              </p>
              <p className="mt-3 text-sm text-ink-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* THE INSIGHT */}
      <Section className="py-8">
        <Card>
          <Kicker>The solar paradox</Kicker>
          <h2 className="mt-3 font-display text-2xl font-extrabold">
            When your solar peaks, the market is cheap. When the market peaks, your panels are off.
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-ink-muted">
            <span className="text-ink">The battery is the only instrument that can bridge that timing gap.</span>{" "}
            But a battery on a fixed schedule doesn't bridge the gap — it just shifts it by a couple of hours and calls it done.
            Real bridging requires the battery to charge when the market is cheap (often midday, when your solar is exporting),
            hold through the trough, and discharge into the evening peak — every day, on live signals.
          </p>
        </Card>
      </Section>

      {/* DAY IN THE LIFE TIMELINE */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>One day on an Oman solar + storage asset</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            Six moments where the engine has to choose.
          </h2>
        </div>
        <div className="surface mt-8 overflow-x-auto rounded-2xl">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="p-4">Time</th>
                <th className="p-4">Solar</th>
                <th className="p-4">Grid price</th>
                <th className="p-4 text-secondary">Optimal action</th>
              </tr>
            </thead>
            <tbody>
              {SOLAR_DAY.map((r, i) => (
                <tr key={r.time} className={i % 2 ? "bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono font-bold text-secondary">{r.time}</td>
                  <td className="p-4 text-ink">{r.solar}</td>
                  <td className="p-4 text-ink-muted">{r.grid}</td>
                  <td className="p-4 font-medium text-ink">{r.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* WHERE THE VALUE LEAKS */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>Where the value leaks</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            Three structural leaks — none of them show up as a fault in your monitoring system.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {SOLAR_LEAKS.map((p) => (
            <Card key={p.code}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-secondary">{p.code}</span>
                <p.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{p.setup}</p>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                {p.math.map(([n, l]) => (
                  <div key={l} className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-bold text-ink">{n}</span>
                    <span className="text-xs text-ink-muted">{l}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SCENARIO STACK */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>The same asset, three configurations</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            Solar only → Solar + fixed BESS → Solar + economic BESS. Same data. Different OMR.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <Card
              key={s.label}
              className={s.tone === "accent" ? "border border-secondary/40" : ""}
            >
              <p className="text-xs uppercase tracking-wide text-ink-muted">{s.label}</p>
              <p
                className={`mt-2 font-mono text-2xl font-bold ${
                  s.tone === "accent" ? "text-secondary" : ""
                }`}
              >
                {s.revenue} <span className="text-sm font-normal text-ink-muted">OMR / yr</span>
              </p>
              <p className="mt-1 text-xs text-ink-muted">{s.curtailment}</p>
              <p className="mt-3 text-xs text-ink-muted">{s.note}</p>
            </Card>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-ink-muted">
          <AlertTriangle className="h-3.5 w-3.5 text-accent" />
          Simulation on official Oman Nama PWP 2022 data and APSR 2024 pricing. All scenarios modelled on Sinaw-class 500 MW asset specifications.
        </p>
      </Section>

      {/* CAPITAL-T TRUTHS */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>What nobody tells you about solar economics</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            The four insights that separate a generation asset from a financial asset.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {TRUTHS.map((tr) => (
            <Card key={tr.head} className="border-l-2 border-l-accent/40">
              <h3 className="font-display text-lg font-bold">{tr.head}</h3>
              <p className="mt-2 text-sm text-ink-muted">{tr.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CURTAILMENT FOCUS */}
      <Section className="py-8">
        <Card>
          <div className="grid items-center gap-6 md:grid-cols-[1fr_2fr]">
            <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-8">
              <CloudOff className="h-16 w-16 text-secondary" />
              <Battery className="ml-3 h-12 w-12 text-accent" />
            </div>
            <div>
              <Kicker>Curtailment economics</Kicker>
              <h3 className="mt-3 font-display text-2xl font-extrabold">
                Curtailment is not a grid problem. It is a decision problem.
              </h3>
              <p className="mt-3 text-ink-muted">
                Standard export schedules cannot respond to real-time saturation signals — they keep trying to push energy
                that the grid cannot absorb, and the inverter clips it. PREDAIOT treats the curtailment signal as an
                opportunity: absorb the otherwise-wasted MWh into the BESS at zero cost, then resell into the evening peak.
              </p>
              <p className="mt-3 font-mono text-sm text-accent">
                ~34,542 MWh / year converted from waste to revenue on a Sinaw-class asset.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      {/* FAQ */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>Pre-sales FAQ</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            The five questions every solar operator asks first.
          </h2>
        </div>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h3 className="font-display text-base font-bold text-ink">{f.q}</h3>
                <span className="font-mono text-secondary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-8">
        <div className="surface rounded-2xl p-10 text-center">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Quantify your solar-plus-storage gap in OMR. <span className="text-accent">Free. Seven days.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            We analyze one month of generation + dispatch data against published Oman market signals and return your Economic Efficiency Score.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/economic-audit" variant="accent">
              {t("startDiagnostic")} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/contact" variant="secondary">
              {t("bookCall")}
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
