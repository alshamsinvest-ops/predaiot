import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Section, Kicker, Card, LinkButton, Stat } from "@/components/ui";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import {
  PRIMARY,
  REAL_TRACTION,
  fmtOMR,
  COMPANY,
  GUARANTEE_TEXT,
} from "@/lib/constants";

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
  const tl = await getTranslations("leak");
  const isAr = locale === "ar";

  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.solarField} locale={locale} variant="background" priority overlay="strong" />
        <Section className="relative pt-12">
          <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
          <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Kicker>{tc("vision2040")}</Kicker>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {th("headline")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">{th("subhead")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/economic-audit" variant="accent">
                {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/contact" variant="secondary">
                {tc("bookCall")}
              </LinkButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-ink-muted">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> {fmtOMR(PRIMARY.annualRevenueOMR)} OMR / {PRIMARY.assetMW} MW
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" /> {PRIMARY.profitMin}%–{PRIMARY.profitMax}%, 0 CAPEX
              </span>
            </div>
          </div>
            <HeroDashboard />
          </div>
        </Section>
      </div>

      {/* FREE LEAK TEST TEASER (prominent) */}
      <Section className="py-10">
        <div className="surface relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Kicker>{tl("kicker")}</Kicker>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{tl("headline")}</h2>
              <p className="mt-3 max-w-xl text-ink-muted">{tl("sub")}</p>
              <LinkButton href="/economic-audit" variant="accent" className="mt-6">
                {tl("submit")} <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <p className="mt-3 text-sm font-semibold">{tl("guaranteeTitle")}</p>
              <p className="mt-1 text-sm text-ink-muted">{GUARANTEE_TEXT}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* PROBLEM / SOLUTION SPLIT */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-2 border-l-red-400/40">
            <Kicker>{t("problemKicker")}</Kicker>
            <h3 className="mt-3 font-display text-2xl font-bold">{t("problemTitle")}</h3>
            <p className="mt-3 text-ink-muted">{t("problemBody")}</p>
          </Card>
          <Card className="border-l-2 border-l-accent/50">
            <Kicker>{COMPANY.name}</Kicker>
            <h3 className="mt-3 font-display text-2xl font-bold">{t("solutionTitle")}</h3>
            <p className="mt-3 text-ink-muted">{t("solutionBody")}</p>
          </Card>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">{t("howTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: t("how1Title"), body: t("how1Body") },
            { title: t("how2Title"), body: t("how2Body") },
            { title: t("how3Title"), body: t("how3Body") },
          ].map((s) => (
            <Card key={s.title}>
              <h3 className="font-display text-lg font-bold text-secondary">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* WHAT HAPPENS AFTER YOU CLICK */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">
          {isAr ? "ماذا يحدث بعد أن تنقر" : "What happens after you click"}
        </h2>
        <p className="mt-2 text-ink-muted">
          {isAr
            ? "بدون مكالمات مبيعات. بدون نماذج طويلة. خمس خطوات — وانتهيت."
            : "No sales calls. No long forms. Five steps — and you're done."}
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {(
            isAr
              ? [
                  ["نموذج من 5 دقائق", "أخبرنا بنوع الأصل والحجم التقريبي والموقع."],
                  ["نتواصل خلال 24 ساعة", "شمس أو أحد أعضاء الفريق يتواصل عبر واتساب أو البريد لتأكيد التفاصيل."],
                  ["شارك بيانات شهر", "شهر من سجلات التوزيع أو فواتير الطاقة أو البيانات التشغيلية. نتولّى التحليل."],
                  ["تستلم النتيجة خلال 7 أيام", "تقرير واضح يُظهر فجوة القرار الاقتصادي بالريال — مع توصيات توقيت محددة."],
                  ["أنت تقرّر", "بدون ضغط. بدون تسجيل تلقائي. إذا كانت النتيجة مهمة، نتحدث عن الخطوات التالية."],
                ]
              : [
                  ["5-minute form", "Tell us your asset type, approximate size, and location."],
                  ["We reach out in 24 hours", "Chams or a team member contacts you via WhatsApp or email to confirm details."],
                  ["Share one month of data", "One month of dispatch logs, energy invoices, or operational data. We handle the analysis."],
                  ["Result in 7 days", "A clear report showing your Economic Decision Gap in OMR — with specific dispatch timing recommendations."],
                  ["You decide", "No pressure. No automatic enrollment. If the number is interesting, we talk next steps."],
                ]
          ).map(([title, body], i) => (
            <li key={title} className="surface rounded-2xl p-5">
              <span className="font-mono text-xs font-bold text-secondary">
                {isAr ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
              </span>
              <h3 className="mt-2 font-display text-base font-bold">{title}</h3>
              <p className="mt-2 text-xs text-ink-muted">{body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink-muted">
          {isAr ? "الضمان:" : "Guarantee:"}{" "}
          <span className="text-ink">{GUARANTEE_TEXT}</span>
        </p>
      </Section>

      {/* TRUST SIGNALS — real traction only */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">{t("trustTitle")}</h2>
        <p className="mt-2 text-ink-muted">{t("trustSub")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_TRACTION.map((item) => (
            <div key={item.key} className="surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-secondary">
                <span aria-hidden className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold">{isAr ? item.ar : item.en}</span>
              </div>
              <p className="mt-2 text-xs text-ink-muted">{isAr ? item.detailAr : item.detailEn}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat value={`${fmtOMR(PRIMARY.annualRevenueOMR)}`} label={`OMR / ${PRIMARY.assetMW} MW · ${tc("perYear")}`} />
          <Stat value={`${PRIMARY.profitMin}%–${PRIMARY.profitMax}%`} label="Profitability uplift, 0 CAPEX" />
          <Stat value={`${PRIMARY.smpOMRPerMWh}`} label="SMP 2024 (OMR/MWh)" />
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          {PRIMARY.citation}.{" "}
          <a href={PRIMARY.citationLink} target="_blank" rel="noopener noreferrer" className="underline">
            opendata.gov.om
          </a>
        </p>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <div className="surface rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{t("ctaTitle")}</h2>
          <p className="mt-3 text-ink-muted">{t("ctaBody")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/economic-audit" variant="accent">
              {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/pricing" variant="secondary">
              {tc("learnMore")}
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
