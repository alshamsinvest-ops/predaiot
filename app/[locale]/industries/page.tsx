import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Building2, Sun, Battery, Factory, Fuel, Network } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
  return buildMetadata({
    locale,
    path: "/industries",
    title: t("title"),
    description: "Economic dispatch optimization across utilities, solar, BESS, industrial, oil & gas and infrastructure in Oman & GCC.",
  });
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");

  const verticals = [
    { icon: Building2, name: t("utilities"), desc: t("utilitiesDesc") },
    { icon: Sun, name: t("solar"), desc: t("solarDesc") },
    { icon: Battery, name: t("bess"), desc: t("bessDesc") },
    { icon: Factory, name: t("industrial"), desc: t("industrialDesc") },
    { icon: Fuel, name: t("oilgas"), desc: t("oilgasDesc") },
    { icon: Network, name: t("infrastructure"), desc: t("infrastructureDesc") },
  ];

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.grid} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader title={t("title")} lead={t("lead")} />
        </Section>
      </div>
      <Section className="py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <Card key={v.name}>
              <v.icon className="h-7 w-7 text-secondary" />
              <h3 className="mt-3 font-display text-lg font-bold">{v.name}</h3>
              <p className="mt-2 text-sm text-ink-muted">{v.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
