import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Activity, Battery, LineChart, ShieldCheck, Zap, Building2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, Kicker, Card, LinkButton, Stat } from "@/components/ui";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import {
  PRIMARY,
  REAL_TRACTION,
  fmtOMR,
  COMPANY,
  GUARANTEE_TEXT,
} from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return buildMetadata({
    locale,
    path: "/",
    title: `${COMPANY.name} — ${t("headline")}`,
    description: t("subhead"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const th = await getTranslations("hero");
  const tc = await getTranslations("common");
  const tl = await getTranslations("leak");
  const isAr = locale === "ar";

  const modules = [
    { icon: Activity, title: th("dash.score"), body: t("solutionBody") },
    { icon: Battery, title: tc("startDiagnostic"), body: t("how1Body") },
    { icon: LineChart, title: th("dash.recovery"), body: t("how2Body") },
  ];

  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.solarField} locale={locale} variant="background" priority overlay="strong" />
        <Section className="relative pt-12">
          <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
          <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Kicker>{tc("vision2040")}</Kicker>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {th("headline")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[--color-ink-muted]">{th("subhead")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/economic-audit" variant="accent">
                {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/contact" variant="secondary">
                {tc("bookCall")}
              </LinkButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-[--color-ink-muted]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[--color-accent]" /> {fmtOMR(PRIMARY.annualRevenueOMR)} OMR / {PRIMARY.assetMW} MW
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[--color-secondary]" /> {PRIMARY.profitMin}%–{PRIMARY.profitMax}%, 0 CAPEX
              </span>
            </div>
          </div>
            <HeroDashboard />
          </div>
        </Section>
      </div>

      {/* FREE LEAK TEST TEASER (prominent) */}
      <Section className="py-10">
        <div className="surface relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[--color-accent]/10 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Kicker>{tl("kicker")}</Kicker>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{tl("headline")}</h2>
              <p className="mt-3 max-w-xl text-[--color-ink-muted]">{tl("sub")}</p>
              <LinkButton href="/economic-audit" variant="accent" className="mt-6">
                {tl("submit")} <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
            <div className="rounded-2xl border border-[--color-accent]/30 bg-[--color-accent]/5 p-6">
              <ShieldCheck className="h-6 w-6 text-[--color-accent]" />
              <p className="mt-3 text-sm font-semibold">{tl("guaranteeTitle")}</p>
              <p className="mt-1 text-sm text-[--color-ink-muted]">{GUARANTEE_TEXT}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* PROBLEM / SOLUTION SPLIT */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-2 border-l-red-400/40">
            <Kicker>{t("problemKicker")}</Kicker>
            <h3 className="mt-3 font-display text-2xl font-bold">{t("problemTitle")}</h3>
            <p className="mt-3 text-[--color-ink-muted]">{t("problemBody")}</p>
          </Card>
          <Card className="border-l-2 border-l-[--color-accent]/50">
            <Kicker>{COMPANY.name}</Kicker>
            <h3 className="mt-3 font-display text-2xl font-bold">{t("solutionTitle")}</h3>
            <p className="mt-3 text-[--color-ink-muted]">{t("solutionBody")}</p>
          </Card>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">{t("howTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: t("how1Title"), body: t("how1Body") },
            { title: t("how2Title"), body: t("how2Body") },
            { title: t("how3Title"), body: t("how3Body") },
          ].map((s) => (
            <Card key={s.title}>
              <h3 className="font-display text-lg font-bold text-[--color-secondary]">{s.title}</h3>
              <p className="mt-2 text-sm text-[--color-ink-muted]">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* PRODUCT MODULES */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">{t("modulesTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {modules.map((m) => (
            <Card key={m.title}>
              <m.icon className="h-6 w-6 text-[--color-accent]" />
              <h3 className="mt-3 font-display text-lg font-bold">{m.title}</h3>
              <p className="mt-2 text-sm text-[--color-ink-muted]">{m.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* TRUST SIGNALS — real traction only */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">{t("trustTitle")}</h2>
        <p className="mt-2 text-[--color-ink-muted]">{t("trustSub")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_TRACTION.map((item) => (
            <div key={item.key} className="surface flex items-center gap-3 rounded-2xl p-5">
              <Building2 className="h-5 w-5 shrink-0 text-[--color-secondary]" />
              <span className="text-sm">{isAr ? item.ar : item.en}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat value={`${fmtOMR(PRIMARY.annualRevenueOMR)}`} label={`OMR / ${PRIMARY.assetMW} MW · ${tc("perYear")}`} />
          <Stat value={`${PRIMARY.profitMin}%–${PRIMARY.profitMax}%`} label="Profitability uplift, 0 CAPEX" />
          <Stat value={`${PRIMARY.smpOMRPerMWh}`} label="SMP 2024 (OMR/MWh)" />
        </div>
        <p className="mt-4 text-xs text-[--color-ink-muted]">
          {PRIMARY.citation}.{" "}
          <a href={PRIMARY.citationLink} target="_blank" rel="noopener noreferrer" className="underline">
            opendata.gov.om
          </a>
        </p>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <div className="surface rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mt-3 text-[--color-ink-muted]">{t("ctaBody")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/economic-audit" variant="accent">
              {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/pricing" variant="secondary">
              {tc("learnMore")}
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
