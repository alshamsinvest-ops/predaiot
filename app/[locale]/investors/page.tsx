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
              <Card key={item.key} className="flex items-center gap-3">
                <Building2 className="h-5 w-5 shrink-0 text-secondary" />
                <span className="text-sm">{isAr ? item.ar : item.en}</span>
              </Card>
            ))}
          </div>
          <GatedForm type="investor" ctaLabel={t("contact")} gateLabel={t("gate")} />
        </div>
      </Section>
    </>
  );
}
