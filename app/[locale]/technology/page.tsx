import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Cpu, Database, GitBranch, ShieldCheck, AlertTriangle } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { SECONDARY, fmtOMR } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "technology" });
  return buildMetadata({
    locale,
    path: "/technology",
    title: t("title"),
    description: "The Shadow Economic Engine — economic dispatch Oman methodology turning public market data into recoverable value.",
  });
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");

  const steps = [
    { icon: Database, label: "Ingest telemetry" },
    { icon: GitBranch, label: "Align market signals" },
    { icon: Cpu, label: "Replay dispatch" },
    { icon: ShieldCheck, label: "Quantify gap" },
  ];

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.controlRoom} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader title={t("title")} lead={t("lead")} />
        </Section>
      </div>

      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-bold">{t("pipelineTitle")}</h2>
          <p className="mt-3 text-[--color-ink-muted]">{t("pipelineBody")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                <s.icon className="mx-auto h-6 w-6 text-[--color-secondary]" />
                <p className="mt-2 text-sm">{i + 1}. {s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* SECONDARY figures — technical page only, explicitly labeled */}
      <Section className="py-8">
        <div className="surface rounded-2xl border border-yellow-400/20 p-6">
          <div className="flex items-center gap-2 text-yellow-300/90">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{SECONDARY.label}</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold">{t("secondaryTitle")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold text-[--color-secondary]">up to {SECONDARY.upliftMaxPct}%</p>
              <p className="text-xs text-[--color-ink-muted]">≈ ${fmtOMR(SECONDARY.upliftUSD)} / year</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{SECONDARY.solarMW} MW / {SECONDARY.batteryMWh} MWh</p>
              <p className="text-xs text-[--color-ink-muted]">Solar / battery (simulation)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{SECONDARY.hours.toLocaleString()}</p>
              <p className="text-xs text-[--color-ink-muted]">hours of real Oman data</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
