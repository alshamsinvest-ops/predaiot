import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section, PageHeader, Kicker } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";
import LivePlatform from "@/components/live/LivePlatform";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/live",
    title: `Live Economic Intelligence Platform · ${COMPANY.name}`,
    description:
      "Real-time economic decision intelligence for energy assets. Live OMR gap counter, 8-hour price forecast, curtailment absorption, and 0–100% autonomy.",
  });
}

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage
          img={IMAGES.controlRoom}
          locale={locale}
          variant="background"
          priority
          overlay="strong"
        />
        <Section className="relative pt-16">
          <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
          <Kicker>
            {isAr ? "منصة قرار اقتصادي مباشرة" : "Live decision intelligence"}
          </Kicker>
          <PageHeader
            title={
              isAr
                ? "المنصة الحية للذكاء الاقتصادي"
                : "Live Economic Intelligence Platform"
            }
            lead={
              isAr
                ? "كل ثانية يأخذ أصلك قرارًا. هل هو القرار الأمثل اقتصاديًا الآن؟ المحرّك يجيب بالأرقام — مباشرةً."
                : "Every second your asset makes a decision. Is it the economically optimal one right now? The engine answers in OMR — live."
            }
          />
          <p className="mt-4 max-w-3xl font-mono text-xs text-ink-muted">
            BESS-01 · 200 MW / 800 MWh · MIS zone · demo signal · tick 2.6 s
          </p>
        </Section>
      </div>
      <LivePlatform locale={locale} />
    </>
  );
}
