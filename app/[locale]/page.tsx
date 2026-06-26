import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import {
  PRIMARY,
  REAL_TRACTION,
  INDUSTRY_QUOTES,
  GUARANTEE_TEXT,
  COMPANY,
} from "@/lib/constants";

import SiteHero from "@/components/editorial/SiteHero";
import StatBand from "@/components/editorial/StatBand";
import EditorialSplit from "@/components/editorial/EditorialSplit";
import NumberedTimeline from "@/components/editorial/NumberedTimeline";
import PullQuote from "@/components/editorial/PullQuote";
import RevealOnScroll from "@/components/RevealOnScroll";

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
  const isAr = locale === "ar";

  // Headline split into two lines for the editorial scale jump
  const fullHeadline = th("headline");
  const halfIdx = Math.floor(fullHeadline.length / 2);
  const breakIdx = fullHeadline.indexOf(". ", halfIdx - 10);
  const headlineLines =
    breakIdx > 0
      ? [fullHeadline.slice(0, breakIdx + 1), fullHeadline.slice(breakIdx + 2).trim()]
      : [fullHeadline];

  return (
    <>
      <SiteHero
        locale={locale}
        bgImage={IMAGES.solarField}
        kicker={isAr ? "ذكاء القرار الاقتصادي · عُمان والخليج" : "Economic Decision Intelligence · Oman / GCC"}
        headlineLines={headlineLines}
        subhead={th("subhead")}
        primaryCta={{ href: "/economic-audit", label: tc("startDiagnostic") }}
        secondaryCta={{ href: "/contact", label: tc("bookCall") }}
        anchorStat={{
          value: `${new Intl.NumberFormat("en-US").format(PRIMARY.annualRevenueOMR)} OMR`,
          label: isAr
            ? `إيرادات سنوية إضافية لكل أصل بسعة ${PRIMARY.assetMW} ميجاوات — زيادة ربحية ${PRIMARY.profitMin}%–${PRIMARY.profitMax}% بدون أي إنفاق رأسمالي.`
            : `Additional annual revenue per ${PRIMARY.assetMW} MW asset — a ${PRIMARY.profitMin}%–${PRIMARY.profitMax}% profitability lift with zero CAPEX.`,
          source: PRIMARY.citation,
        }}
      />

      {/* Stat band */}
      <StatBand
        items={[
          {
            value: "862,903",
            numeric: PRIMARY.annualRevenueOMR,
            suffix: "OMR",
            label: isAr
              ? `إيرادات سنوية إضافية / ${PRIMARY.assetMW} ميجاوات`
              : `Additional annual revenue / ${PRIMARY.assetMW} MW`,
            source: "Nama PWP · APSR · simulation",
          },
          {
            value: `${PRIMARY.profitMin}–${PRIMARY.profitMax}%`,
            label: isAr ? "زيادة الربحية، بدون إنفاق رأسمالي" : "Profitability uplift, zero CAPEX",
          },
          {
            value: `${PRIMARY.smpOMRPerMWh}`,
            suffix: "OMR/MWh",
            label: isAr ? "متوسط سعر السوق الحدّي (APSR 2024)" : "Average SMP, APSR 2024",
          },
          {
            value: "8,760",
            numeric: 8760,
            suffix: "hrs",
            label: isAr ? "ساعات تحليل لكل أصل سنويًا" : "Hours analysed per asset, per year",
          },
        ]}
      />

      {/* Problem */}
      <EditorialSplit
        locale={locale}
        img={IMAGES.controlRoom}
        kicker={isAr ? "الفجوة" : "The gap"}
        title={
          isAr
            ? "محسّن تقنيًا. يتسرّب اقتصاديًا."
            : "Technically optimized. Economically leaking."
        }
      >
        <p>
          {isAr
            ? "أصول الطاقة في عُمان والخليج مهندَسة للأداء التقني. SCADA يقيس وقت التشغيل والأعطال وأهداف التوليد بدقة."
            : "Energy assets across Oman and the GCC are engineered for technical performance. SCADA measures uptime, fault counts, and generation targets with precision."}
        </p>
        <p>
          {isAr
            ? "لكن لا أحد يقيس الجودة الاقتصادية لقرارات التوزيع. بطارية تشحن في الساعة الخطأ لا تُولّد إنذارًا — تُولّد خسارة. الخسارة غير مرئية. نسمّيها فجوة القرار الاقتصادي."
            : "But nobody measures the economic quality of dispatch decisions. A battery charging at the wrong hour doesn't raise an alarm — it raises a loss. Silently. We call it the Economic Decision Gap."}
        </p>
      </EditorialSplit>

      {/* Solution */}
      <EditorialSplit
        locale={locale}
        img={IMAGES.industrial}
        reverse
        accent="accent"
        kicker={isAr ? "الحل" : "The solution"}
        title={
          isAr
            ? "محرّك اقتصادي ظلّي يعيد كل قرار توزيع — ويحوّله إلى ريالات."
            : "A shadow economic engine that replays every dispatch decision — in OMR."
        }
      >
        <p>
          {isAr
            ? "يقارن PREDAIOT كل ساعة تشغيل بإشارات السوق الرسمية في عُمان — SMP، تسعير الندرة، وأنماط الطلب — ويحدّد الفجوة بدقة."
            : "PREDAIOT replays every operational hour against Oman's official market signals — System Marginal Price, scarcity pricing, demand patterns — and quantifies the gap."}
        </p>
        <p>
          {isAr
            ? "في النشر الحي، يتّخذ المحرّك القرار المربح اقتصاديًا بشكل مستقل — بدون تغيير أجهزة، وبدون إنفاق رأسمالي."
            : "In live deployment, the engine autonomously makes the economically profitable decision — no hardware change, no CAPEX."}
        </p>
      </EditorialSplit>

      {/* Timeline */}
      <NumberedTimeline
        kicker={isAr ? "ماذا يحدث بعد أن تنقر" : "After you click"}
        title={
          isAr
            ? "لا مكالمات مبيعات. لا نماذج طويلة. خمس خطوات — وانتهيت."
            : "No sales calls. No long forms. Five steps — and you're done."
        }
        intro={
          isAr
            ? "اختبار التسرّب المجاني خلال 7 أيام، مع ضمان مكتوب."
            : "The free Leak Test runs in 7 days, with a written guarantee."
        }
        steps={
          isAr
            ? [
                { num: "01", title: "نموذج من 5 دقائق", body: "نوع الأصل، السعة التقريبية، الموقع." },
                { num: "02", title: "نتواصل خلال 24 ساعة", body: "شمس أو أحد أعضاء الفريق عبر واتساب أو البريد لتأكيد التفاصيل." },
                { num: "03", title: "شارك بيانات شهر", body: "سجلات التوزيع أو فواتير الطاقة أو البيانات التشغيلية. نحن نحلل." },
                { num: "04", title: "نتيجتك خلال 7 أيام", body: "تقرير واضح يُظهر فجوة القرار الاقتصادي بالريال، مع توصيات توقيت محددة." },
                { num: "05", title: "أنت تقرّر", body: "بدون ضغط. بدون تسجيل تلقائي. إذا كانت النتيجة مهمة، نتحدث عن الخطوات التالية." },
              ]
            : [
                { num: "01", title: "5-minute form", body: "Asset type, approximate capacity, location." },
                { num: "02", title: "We reach out in 24 hours", body: "Chams or a team member contacts you via WhatsApp or email to confirm details." },
                { num: "03", title: "Share one month of data", body: "Dispatch logs, energy invoices, or operational data. We handle the analysis." },
                { num: "04", title: "Result in 7 days", body: "A clear report showing your Economic Decision Gap in OMR — with specific dispatch timing recommendations." },
                { num: "05", title: "You decide", body: "No pressure. No automatic enrollment. If the number is interesting, we talk next steps." },
              ]
        }
      />

      {/* Pull quote — first industry voice */}
      <PullQuote
        text={isAr ? INDUSTRY_QUOTES[0].ar : INDUSTRY_QUOTES[0].en}
        attribution={isAr ? INDUSTRY_QUOTES[0].roleAr : INDUSTRY_QUOTES[0].role}
        date={INDUSTRY_QUOTES[0].date}
      />

      {/* Traction strip — hairline rows, not card grid */}
      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            {isAr ? "إنجازات موثّقة" : "Verified milestones"}
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {isAr
              ? "نعرض ما هو حقيقي فقط — لا شعارات مزيّفة، ولا توصيات مفبركة."
              : "We only show what's real — no fake logos, no manufactured testimonials."}
          </h2>
        </div>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {REAL_TRACTION.map((item, i) => (
            <RevealOnScroll key={item.key} delay={i * 50}>
              <div className="grid grid-cols-12 items-center gap-4 py-7">
                <span aria-hidden className="col-span-2 text-3xl sm:col-span-1">
                  {item.icon}
                </span>
                <h3 className="col-span-10 font-display text-base font-bold sm:col-span-4">
                  {isAr ? item.ar : item.en}
                </h3>
                <p className="col-span-12 text-sm leading-relaxed text-ink-muted sm:col-span-7">
                  {isAr ? item.detailAr : item.detailEn}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Final CTA — full-bleed */}
      <section className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, rgba(0,207,255,0.18) 0%, rgba(6,11,24,0) 70%)",
          }}
          aria-hidden="true"
        />
        <RevealOnScroll className="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {isAr ? "اختبار التسرّب المجاني" : "Free Leak Test"}
          </p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {isAr
              ? "اكتشف ما يتركه أصلك على الطاولة. سبعة أيام. بدون مقابل."
              : "Find out what your asset is leaving on the table. Seven days. No cost."}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-muted">{GUARANTEE_TEXT}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <LinkButton href="/economic-audit" variant="accent">
              {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/pricing" variant="secondary">
              {tc("learnMore")}
            </LinkButton>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-muted">
            <ShieldCheck className="h-4 w-4 text-accent" />
            {PRIMARY.citation}
          </p>
        </RevealOnScroll>
      </section>

      {/* unused-var suppression for next-intl scope discovery */}
      <span hidden>{t("trustTitle")}</span>
    </>
  );
}
