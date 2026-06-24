import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FileText } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import GatedForm from "@/components/forms/GatedForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "papers" });
  return buildMetadata({
    locale,
    path: "/papers",
    title: t("title"),
    description: "Gated white papers on economic dispatch Oman and recoverable value in the energy transition.",
  });
}

export default async function PapersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("papers");

  return (
    <>
      <JsonLd data={articleJsonLd(t("paper1Title"), t("paper1Desc"), "/papers")} />
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Card>
            <FileText className="h-7 w-7 text-[--color-secondary]" />
            <h2 className="mt-3 font-display text-xl font-bold">{t("paper1Title")}</h2>
            <p className="mt-2 text-sm text-[--color-ink-muted]">{t("paper1Desc")}</p>
          </Card>
          <GatedForm
            type="paper"
            ctaLabel={t("download")}
            gateLabel={t("gate")}
            fileUrl="/papers/predaiot-whitepaper-oman-2026.pdf"
          />
        </div>
      </Section>
    </>
  );
}
