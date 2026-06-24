import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Sun, ArrowRight } from "lucide-react";
import { Section, PageHeader, Card, LinkButton } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "solar" });
  return buildMetadata({
    locale,
    path: "/solar",
    title: t("title"),
    description: "Solar asset economic audit and storage stacking for Oman renewable energy.",
  });
}

export default async function SolarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solar");
  const tc = await getTranslations("common");

  return (
    <>
      <JsonLd data={serviceJsonLd("Solar + Storage Optimization", t("lead"), "/solar")} />
      <Section className="pt-12">
        <PageHeader kicker={tc("vision2040")} title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <Card>
          <Sun className="h-7 w-7 text-[--color-accent]" />
          <p className="mt-4 text-lg text-[--color-ink-muted]">{t("body")}</p>
          <LinkButton href="/economic-audit" variant="accent" className="mt-6">
            {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </Card>
      </Section>
    </>
  );
}
