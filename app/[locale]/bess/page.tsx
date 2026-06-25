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
    path: "/bess",
    title: `BESS Economic Optimization · ${COMPANY.name}`,
    description:
      "Your BESS is a financial instrument. Is it performing like one? PREDAIOT closes the BESS Economic Decision Gap on Oman market data.",
  });
}

const BESS_PROBLEMS = [
  {
    title: "Charging at the wrong hour",
    detail:
      "Fixed schedules charge at 02:00–06:00 regardless of price. On nights when the grid price spikes to 8+ OMR/MWh, the BESS charges anyway. Cost: ~208 OMR per decision · ~14 decisions per month · ~34,944 OMR per year.",
  },
  {
    title: "Discharging in the wrong window",
    detail:
      "Fixed discharge at 17:00–21:00 misses the true evening peak — often at 20:00–21:00 on high-demand days. Average discharge price: 13.2 OMR/MWh vs. 14.8 OMR/MWh optimal. Miss: ~358,400 OMR / year.",
  },
  {
    title: "Curtailment left on the table",
    detail:
      "When solar curtailment is called, the energy is wasted. The BESS could absorb it at zero cost and sell it at peak price. Standard systems don't do this. PREDAIOT converts ~70% of curtailment events into arbitrage revenue.",
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

      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.industrial} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader
            title="Your BESS is a financial instrument. Is it performing like one?"
            lead="Battery storage creates arbitrage opportunity. But only if it dispatches on economics — not on a schedule written before the market showed you its prices."
          />
        </Section>
      </div>

      {/* The gap */}
      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-extrabold">The BESS Economic Decision Gap</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted">Standard fixed schedule</p>
              <p className="mt-2 font-mono text-xl font-bold">8,962,012 OMR / year</p>
              <p className="mt-1 text-xs text-ink-muted">62.3% of theoretical arbitrage</p>
              <p className="mt-3 text-xs text-ink-muted">
                Charge 02:00–06:00 / Discharge 17:00–21:00 — every day, regardless of price.
              </p>
            </div>
            <div className="rounded-xl border border-secondary/40 bg-secondary/5 p-5">
              <p className="text-xs uppercase tracking-wide text-secondary">PREDAIOT economic intelligence</p>
              <p className="mt-2 font-mono text-xl font-bold text-secondary">9,921,262 OMR / year</p>
              <p className="mt-1 text-xs text-secondary">100% of theoretical arbitrage</p>
              <p className="mt-3 text-xs text-ink-muted">
                Charge at the cheapest hours / discharge at the highest-value hours — every day, on
                live signals.
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-4">
            <p className="font-mono text-lg font-extrabold text-accent">
              959,250 OMR / year — same hardware, different decisions
            </p>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" />
            Simulation on official Oman Nama PWP 2022 data. 500 MW / 200 MW / 800 MWh modelled asset.
          </p>
        </Card>
      </Section>

      {/* Three problems */}
      <Section className="py-8">
        <h2 className="font-display text-2xl font-extrabold">Where the value leaks</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {BESS_PROBLEMS.map((p, i) => (
            <Card key={p.title}>
              <span className="font-mono text-2xl font-bold text-secondary">0{i + 1}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{p.detail}</p>
            </Card>
          ))}
        </div>
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
