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
  const isAr = locale === "ar";

  const papers = [
    {
      label: isAr ? "الورقة البيضاء" : "White Paper",
      title: t("paper1Title"),
      desc: t("paper1Desc"),
      url: "/papers/predaiot-whitepaper-oman-2026.pdf",
    },
    {
      label: isAr ? "الملخص التنفيذي" : "Executive Summary",
      title: isAr
        ? "الملخص التنفيذي: الفرصة الاقتصادية الخفية"
        : "Executive Summary: The Hidden Economic Opportunity",
      desc: isAr
        ? "نظرة موجزة على القيمة الاقتصادية القابلة للاسترجاع في قطاع الطاقة العُماني."
        : "A concise overview of recoverable economic value in Oman's energy sector.",
      url: "/papers/predaiot-executive-summary.pdf",
    },
    {
      label: isAr ? "المقال العلمي" : "Scientific Article",
      title: isAr
        ? "مقال علمي متخصص — منهجية القرار الاقتصادي"
        : "Specialized Scientific Article — Economic Decision Methodology",
      desc: isAr
        ? "الأساس المنهجي: الخسارة المالية = Σ (الأداء المتوقع − الفعلي) × سعر السوق."
        : "The methodological basis: Financial Loss = Σ (expected − actual performance) × market price.",
      url: "/papers/predaiot-scientific-article.pdf",
    },
  ];

  return (
    <>
      <JsonLd data={articleJsonLd(t("paper1Title"), t("paper1Desc"), "/papers")} />
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {papers.map((p) => (
              <Card key={p.url}>
                <FileText className="h-7 w-7 text-[--color-secondary]" />
                <h2 className="mt-3 font-display text-xl font-bold">{p.title}</h2>
                <p className="mt-2 text-sm text-[--color-ink-muted]">{p.desc}</p>
              </Card>
            ))}
          </div>
          <GatedForm type="paper" ctaLabel={t("download")} gateLabel={t("gate")} files={papers} />
        </div>
      </Section>
    </>
  );
}
