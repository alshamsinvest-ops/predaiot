import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
  Clock,
  Wallet,
  Sparkles,
  Battery,
  Activity,
  GitBranch,
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
    path: "/bess",
    title: `BESS Economic Optimization · ${COMPANY.name}`,
    description:
      "Your BESS is a financial instrument. Is it performing like one? PREDAIOT closes the BESS Economic Decision Gap on official Oman market data.",
  });
}

/** Provocative one-liner facts — the "hook strip" */
const HOOK_FACTS = [
  {
    icon: Clock,
    headline: "62%",
    text: "of theoretical arbitrage is the ceiling for fixed-schedule BESS. The other 38% leaks every day.",
  },
  {
    icon: Wallet,
    headline: "208 OMR",
    text: "lost on a single wrong-hour charge decision. A typical month has 14 of them.",
  },
  {
    icon: TrendingDown,
    headline: "70%",
    text: "of solar curtailment events could be absorbed and resold by your BESS — they aren't.",
  },
  {
    icon: Sparkles,
    headline: "0 CAPEX",
    text: "to recover the gap. The hardware is already paid for. The decision layer isn't there yet.",
  },
];

/** Where the OMR actually leaks — with math */
const LEAK_PROBLEMS = [
  {
    code: "01",
    icon: Clock,
    title: "Charging at the wrong hour",
    setup:
      "Fixed schedules charge 02:00–06:00 regardless of price. On nights when the grid spikes to 8+ OMR/MWh, the BESS charges anyway.",
    math: [
      ["~208 OMR", "cost per wrong-hour decision"],
      ["~14 / month", "frequency on a 500 MW asset"],
      ["~34,944 OMR", "annual leak from this one mistake"],
    ],
  },
  {
    code: "02",
    icon: Activity,
    title: "Discharging in the wrong window",
    setup:
      "Fixed discharge 17:00–21:00 misses the true evening peak — often at 20:00–21:00 on high-demand days. Average realized 13.2 OMR/MWh vs. 14.8 OMR/MWh optimal.",
    math: [
      ["1.6 OMR/MWh", "per-unit price miss"],
      ["~224,000 MWh", "annual discharge volume"],
      ["~358,400 OMR", "annual leak from missed peak"],
    ],
  },
  {
    code: "03",
    icon: GitBranch,
    title: "Curtailment left on the table",
    setup:
      "When solar curtailment is called, the energy is wasted. The BESS could absorb it at zero cost and sell it at peak price. Standard systems don't do this.",
    math: [
      ["≈ 0 OMR/MWh", "cost of curtailed energy"],
      ["~14.8 OMR/MWh", "evening peak resale price"],
      ["~566,000 OMR", "annual capture if 70% of events caught"],
    ],
  },
];

/** Capital-T Truths the spec sheet doesn't tell you */
const TRUTHS = [
  {
    head: "Round-trip efficiency ≠ profit",
    body: "A 95% efficient battery cycling at the wrong hours earns less than a 90% efficient battery cycling at the right ones. The PCS spec sheet doesn't measure decisions.",
  },
  {
    head: "Your SCADA can't see prices",
    body: "Operational monitoring measures uptime, faults, generation. Economic monitoring measures dispatched-vs-optimal in OMR. They live in different systems — usually only one of them exists.",
  },
  {
    head: "Degradation is an economic variable",
    body: "Every cycle ages the cells. A cycle that captures 2,400 OMR pays for itself ten times over. A cycle that captures 200 OMR is technically fine and economically a slow leak.",
  },
  {
    head: "Ancillary vs energy is a price problem",
    body: "Holding capacity for frequency response pays a known floor. Discharging into the peak pays a variable ceiling. Choosing wrong on any given hour leaves OMR on the table — silently.",
  },
];

/** Optimization levers — what economic dispatch actually does */
const LEVERS = [
  { icon: TrendingUp, name: "Price-aware dispatch", body: "Charge at the cheapest hours, discharge at the highest-value hours — every day, on live SMP." },
  { icon: AlertTriangle, name: "Scarcity capture", body: "Identify scarcity-pricing windows and shape discharge to land inside them, not adjacent to them." },
  { icon: Battery, name: "Degradation-aware cycling", body: "Skip low-margin cycles. Cycle only when the OMR captured exceeds the cycle's economic cost." },
  { icon: GitBranch, name: "Ancillary vs energy arbitrage", body: "Reserve capacity for ancillary services only when the energy-arbitrage value is lower." },
  { icon: Zap, name: "Curtailment absorption", body: "Treat curtailment as free energy: absorb dynamically, resell at evening peak." },
  { icon: Activity, name: "Forecast-driven hold", body: "When a peak is approaching, hold SOC instead of selling early — even if the current price looks acceptable." },
];

/** FAQ — the questions that actually come up in pre-sales */
const FAQS = [
  {
    q: "Does PREDAIOT replace my EMS / SCADA?",
    a: "No. We sit alongside. We ingest your telemetry via API or CSV, never touch your control loops in shadow mode, and only execute when you authorize live deployment.",
  },
  {
    q: "What data do you need to get started?",
    a: "One month of hourly dispatch logs (SOC, charge/discharge, grid import/export). If you also share metering data and asset specs, the result tightens. No personal data, no PII.",
  },
  {
    q: "How is this different from a market-bidding tool?",
    a: "Market bidding decides what price to offer. Economic dispatch decides whether to charge, discharge, or hold given the prices the market already showed. The two are complementary; we focus on the second.",
  },
  {
    q: "What about degradation cost? Will you over-cycle my battery?",
    a: "We model degradation as an explicit cost per cycle. A cycle is only authorized when expected revenue exceeds cycle cost. In practice we cycle less, not more — but each cycle is worth more.",
  },
  {
    q: "Why Oman first?",
    a: "Because Oman's SMP, scarcity pricing, and demand patterns are published — we can validate every claim against an independent source. That makes the methodology transparent and replicable across the GCC.",
  },
];

export default async function BessPage({
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
          "BESS Economic Optimization",
          "Battery storage economic dispatch built on Oman market data.",
          "/bess"
        )}
      />

      {/* HERO */}
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.industrial} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader
            kicker="BESS · Economic Decision Intelligence"
            title="Your BESS is a financial instrument. Is it performing like one?"
            lead="Battery storage creates arbitrage opportunity. But only if it dispatches on economics — not on a schedule written before the market showed you its prices."
          />
        </Section>
      </div>

      {/* HOOK STRIP — provocative facts */}
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

      {/* THE GAP */}
      <Section className="py-8">
        <Card>
          <Kicker>The BESS Economic Decision Gap</Kicker>
          <h2 className="mt-3 font-display text-2xl font-extrabold">
            Same battery. Same MWh. Same wear-and-tear. <span className="text-secondary">Different decisions.</span>
          </h2>
          <p className="mt-3 max-w-3xl text-ink-muted">
            Two systems on the same 500&nbsp;MW asset on the same day, against the same official Oman market data.
            The hardware is identical. The only difference is which hour gets charged and which hour gets discharged.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted">Standard fixed schedule</p>
              <p className="mt-2 font-mono text-2xl font-bold">8,962,012 OMR / year</p>
              <p className="mt-1 text-xs text-ink-muted">62.3% of theoretical arbitrage captured</p>
              <p className="mt-3 text-xs text-ink-muted">
                Charge 02:00–06:00 · discharge 17:00–21:00 — every day, regardless of price.
              </p>
            </div>
            <div className="rounded-xl border border-secondary/40 bg-secondary/5 p-5">
              <p className="text-xs uppercase tracking-wide text-secondary">PREDAIOT economic intelligence</p>
              <p className="mt-2 font-mono text-2xl font-bold text-secondary">9,921,262 OMR / year</p>
              <p className="mt-1 text-xs text-secondary">100% of theoretical arbitrage captured</p>
              <p className="mt-3 text-xs text-ink-muted">
                Charge at the cheapest hours · discharge at the highest-value hours — every day, on live signals.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-5">
            <p className="font-mono text-2xl font-extrabold text-accent">
              959,250 OMR / year
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Same hardware, different decisions. That's the BESS Economic Decision Gap on a single 500&nbsp;MW asset.
            </p>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" />
            Simulation on official Oman Nama PWP 2022 data. 500&nbsp;MW / 200&nbsp;MW / 800&nbsp;MWh modelled asset.
          </p>
        </Card>
      </Section>

      {/* WHERE THE VALUE LEAKS — with OMR math */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>Where the value leaks</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            Three silent leaks. Specific OMR per leak. No alarm in your SCADA.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {LEAK_PROBLEMS.map((p) => (
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

      {/* WHAT NOBODY TELLS YOU — capital-T truths */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>What nobody tells you about BESS economics</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            The spec sheet is silent on the four numbers that determine your ROI.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {TRUTHS.map((t) => (
            <Card key={t.head} className="border-l-2 border-l-accent/40">
              <h3 className="font-display text-lg font-bold">{t.head}</h3>
              <p className="mt-2 text-sm text-ink-muted">{t.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* OPTIMIZATION LEVERS */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>The six levers we pull</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            Economic dispatch isn't one decision. It's six decisions, every hour.
          </h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEVERS.map((l) => (
            <Card key={l.name}>
              <l.icon className="h-6 w-6 text-secondary" />
              <h3 className="mt-3 font-display text-base font-bold">{l.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{l.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-8">
        <div className="max-w-3xl">
          <Kicker>Pre-sales FAQ</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            The five questions every operator asks first.
          </h2>
        </div>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h3 className="font-display text-base font-bold text-ink">{f.q}</h3>
                <span className="font-mono text-secondary group-open:rotate-45 transition-transform">+</span>
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
            Find your BESS Decision Gap in OMR. <span className="text-accent">Free. Seven days.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-muted">
            We analyze one month of your dispatch logs against published Oman market data and return your Economic Efficiency Score with the top three timing fixes.
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
