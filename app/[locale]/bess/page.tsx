import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Battery, TrendingUp, Activity, Layers, ArrowRight } from "lucide-react";
import { Section, PageHeader, Card, LinkButton } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bess" });
  return buildMetadata({
    locale,
    path: "/bess",
    title: t("title"),
    description: "BESS optimization GCC — economic dispatch for battery storage built on Oman market data.",
  });
}

export default async function BessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bess");
  const tc = await getTranslations("common");

  const levers = [
    { icon: TrendingUp, text: t("lever1") },
    { icon: Activity, text: t("lever2") },
    { icon: Battery, text: t("lever3") },
    { icon: Layers, text: t("lever4") },
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd("BESS Economic Optimization", t("lead"), "/bess")} />
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.industrial} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader kicker={tc("vision2040")} title={t("title")} lead={t("lead")} />
        </Section>
      </div>
      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-bold">{t("p1Title")}</h2>
          <p className="mt-3 text-[--color-ink-muted]">{t("p1Body")}</p>
        </Card>
      </Section>
      <Section>
        <h2 className="font-display text-2xl font-extrabold">{t("leversTitle")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {levers.map((l) => (
            <Card key={l.text}>
              <l.icon className="h-6 w-6 text-[--color-accent]" />
              <p className="mt-3">{l.text}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <LinkButton href="/economic-audit" variant="accent">
            {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
