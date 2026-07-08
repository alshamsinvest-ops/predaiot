import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Section, PageHeader, LinkButton } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import SectorGrid from "@/components/SectorGrid";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { SECTORS, POSITIONING, COMPANY } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
  return buildMetadata({
    locale,
    path: "/industries",
    title: `${t("title")} · ${COMPANY.name}`,
    description:
      "Economic decision intelligence across the entire energy value chain — oil & gas, power generation, utilities, renewables, wind, storage, transmission, smart grid, industrial energy, water, hydrogen, data centers, microgrids and virtual power plants.",
  });
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");
  const isAr = locale === "ar";

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.grid} locale={locale} variant="background" priority overlay="strong" />
        <Section className="pt-16">
          <PageHeader title={t("title")} lead={t("lead")} />
          <p className="mt-4 max-w-3xl text-ink-muted">
            {isAr ? POSITIONING.crossSector : POSITIONING.crossSector}
          </p>
        </Section>
      </div>

      <Section className="py-8">
        <SectorGrid locale={locale} variant="detail" />
        <p className="mt-6 text-sm text-ink-muted">
          {isAr
            ? `${SECTORS.length} قطاعًا، محرّك قرار اقتصادي واحد. البطاريات والطاقة الشمسية مُعلَّمتان كأمثلة — لا حدودًا.`
            : `${SECTORS.length} sectors, one economic decision engine. Battery storage and solar are marked as examples — not the boundary.`}
        </p>
      </Section>

      <Section className="py-8">
        <div className="surface rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-extrabold">
            {isAr ? "لا ترى قطاعك؟" : "Don't see your sector?"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
            {isAr
              ? "إذا كان أصلك يتّخذ قرار توزيع أو شراء طاقة مقابل سعر متغيّر، فالمحرّك ينطبق عليه. تحدّث إلينا."
              : "If your asset makes a dispatch or energy-procurement decision against a variable price, the engine applies. Let's talk."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/economic-audit" variant="accent" className="cta-shine">
              {isAr ? "ابدأ التشخيص المجاني" : "Start a free diagnostic"} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/contact" variant="secondary">
              {isAr ? "تحدّث إلى خبير" : "Talk to an expert"}
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
