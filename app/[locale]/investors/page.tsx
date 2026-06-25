import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Building2 } from "lucide-react";
import { Section, PageHeader, Card, Badge } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import GatedForm from "@/components/forms/GatedForm";
import { REAL_TRACTION } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "investors" });
  return buildMetadata({ locale, path: "/investors", title: t("title"), description: t("lead") });
}

export default async function InvestorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("investors");
  const isAr = locale === "ar";

  return (
    <>
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
        <div className="mt-6 flex justify-center">
          <Badge>{t("stage")}</Badge>
        </div>
      </Section>
      <Section className="py-8">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="grid gap-4">
            {REAL_TRACTION.map((item) => (
              <Card key={item.key}>
                <div className="flex items-center gap-2 text-secondary">
                  <span aria-hidden className="text-xl">{item.icon}</span>
                  <span className="text-sm font-semibold">{isAr ? item.ar : item.en}</span>
                </div>
                <p className="mt-2 text-xs text-ink-muted">{isAr ? item.detailAr : item.detailEn}</p>
              </Card>
            ))}
          </div>
          <GatedForm type="investor" ctaLabel={t("contact")} gateLabel={t("gate")} />
        </div>
      </Section>
    </>
  );
}
