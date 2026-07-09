import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ShieldCheck, Zap, ScrollText, Atom, Boxes } from "lucide-react";
import { Section, Kicker, Card, LinkButton, Stat } from "@/components/ui";
import HeroDashboard from "@/components/dashboard/HeroDashboard";
import SectorGrid from "@/components/SectorGrid";
import SectorShowcase from "@/components/SectorShowcase";
import CursorSurface from "@/components/kinetic/CursorSurface";
import LeakRecoveryVisual from "@/components/kinetic/LeakRecoveryVisual";
import { Reveal, RevealGroup, RevealItem } from "@/components/kinetic/Reveal";
import { buildMetadata } from "@/lib/seo";
import {
  PRIMARY,
  REAL_TRACTION,
  fmtOMR,
  COMPANY,
  GUARANTEE_TEXT,
  POSITIONING,
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
      {/* HERO — industrial restraint: calm ground, sharp data, one accent */}
      <div className="relative overflow-hidden border-b border-line bg-primary-900">
        <div className="grid-bg pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <Section className="relative pt-16 pb-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Kicker>
                {isAr ? "ذكاء اقتصادي للقرار · قطاع الطاقة" : "Economic Decision Intelligence"}
              </Kicker>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                {th("headline")}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                {th("subhead")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/economic-audit" variant="accent">
                  {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
                </LinkButton>
                <LinkButton href="/contact" variant="secondary">
                  {tc("bookCall")}
                </LinkButton>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-muted">
                <span>
                  <span className="text-[color:var(--color-gold)]">
                    {fmtOMR(PRIMARY.annualRevenueOMR)}
                  </span>{" "}
                  OMR / {PRIMARY.assetMW} MW
                </span>
                <span aria-hidden className="h-3 w-px bg-line" />
                <span>{PRIMARY.profitMin}%–{PRIMARY.profitMax}% · 0 CAPEX</span>
                <span aria-hidden className="h-3 w-px bg-line" />
                <span>{isAr ? "15 قطاعًا" : "15 sectors"}</span>
              </div>
            </div>
            <HeroDashboard />
          </div>
        </Section>
      </div>

      {/* SECTOR SHOWCASE — cinematic slideshow across the energy value chain */}
      <SectorShowcase locale={locale} />

      {/* INDUSTRIES WE SERVE — the whole energy value chain */}
      <Section className="py-12">
        <Reveal>
          <Kicker>{isAr ? "قطاع الطاقة بأكمله" : "Across the entire energy sector"}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            {isAr
              ? "محرّك قرار اقتصادي واحد. خمسة عشر قطاعًا."
              : "One economic decision engine. Fifteen sectors."}
          </h2>
          <p className="mt-3 max-w-3xl text-ink-muted">
            {isAr ? POSITIONING.crossSector : POSITIONING.crossSector}
          </p>
        </Reveal>
        <div className="mt-8">
          <SectorGrid locale={locale} variant="compact" />
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 text-sm text-ink-muted">
            {isAr
              ? "البطاريات والطاقة الشمسية مثالان من خمسة عشر — لا هوية الشركة."
              : "Battery storage and solar are two examples of fifteen — not the company's identity."}{" "}
            <LinkButton href="/industries" variant="ghost" className="mt-3 inline-flex">
              {isAr ? "استكشف كل القطاعات" : "Explore every sector"} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </p>
        </Reveal>
      </Section>

      {/* FREE LEAK TEST TEASER (prominent) */}
      <Section className="py-10">
        <Reveal>
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
        </Reveal>
      </Section>

      {/* PROBLEM / SOLUTION SPLIT — the bleeding vs. the recovery */}
      <Section>
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          <RevealItem className="h-full">
            <Card className="h-full border-l-2 border-l-red-400/40">
              <Kicker>{t("problemKicker")}</Kicker>
              <h3 className="mt-3 font-display text-2xl font-bold">{t("problemTitle")}</h3>
              <p className="mt-3 text-ink-muted">{t("problemBody")}</p>
              <LeakRecoveryVisual
                mode="leak"
                labelLeak={
                  isAr
                    ? "قيمة تتسرّب · مشتقة من المعيار المنشور"
                    : "value leaking · derived from published benchmark"
                }
              />
            </Card>
          </RevealItem>
          <RevealItem className="h-full">
            <Card className="h-full border-l-2 border-l-positive/50">
              <Kicker>{COMPANY.name}</Kicker>
              <h3 className="mt-3 font-display text-2xl font-bold">{t("solutionTitle")}</h3>
              <p className="mt-3 text-ink-muted">{t("solutionBody")}</p>
              <LeakRecoveryVisual
                mode="recover"
                labelRecover={
                  isAr
                    ? "قيمة مستردّة · مشتقة من المعيار المنشور"
                    : "value recovered · derived from published benchmark"
                }
              />
            </Card>
          </RevealItem>
        </RevealGroup>
      </Section>

      {/* ENTERPRISE PILLARS — why a mature energy operator trusts this */}
      <Section>
        <Reveal>
          <Kicker>{isAr ? "لماذا المؤسسات" : "Built for the enterprise"}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {isAr ? "قرارات يمكن للمنظّم أن يوقّعها" : "Decisions a regulator can sign off on"}
          </h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ScrollText,
              title: isAr ? "شفّاف وقابل للتدقيق" : "Transparent & auditable",
              body: isAr
                ? "كل قرار يحمل السعر والإشارة والمعادلة التي بررته. قابل للتكرار — في مجلس الإدارة أو أمام الجهة التنظيمية."
                : "Every decision carries the price, the signal and the calculation that justified it. Replayable — in a boardroom or in front of a regulator.",
            },
            {
              icon: Atom,
              title: isAr ? "أساس علمي" : "Scientific foundation",
              body: isAr
                ? "منهجية منشورة ومُتحقّق منها على بيانات سوق رسمية. لا صندوق أسود، ولا نتائج ملفّقة."
                : "A published methodology, validated on official market data. No black box, no fabricated results.",
            },
            {
              icon: Boxes,
              title: isAr ? "عبر القطاعات" : "Cross-sector by design",
              body: isAr
                ? "محرّك واحد يمتد من النفط والغاز إلى الشبكات والهيدروجين — لا أداة نقطية لتقنية واحدة."
                : "One engine spanning oil & gas to grids and hydrogen — not a point tool for a single technology.",
            },
          ].map((p) => (
            <RevealItem key={p.title} className="h-full">
              <CursorSurface className="surface h-full rounded-2xl p-6">
                <p.icon className="h-7 w-7 text-secondary" />
                <h3 className="mt-3 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.body}</p>
              </CursorSurface>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold">{t("howTitle")}</h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: t("how1Title"), body: t("how1Body") },
            { title: t("how2Title"), body: t("how2Body") },
            { title: t("how3Title"), body: t("how3Body") },
          ].map((s) => (
            <RevealItem key={s.title} className="h-full">
              <CursorSurface className="surface h-full rounded-2xl p-6">
                <h3 className="font-display text-lg font-bold text-secondary">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.body}</p>
              </CursorSurface>
            </RevealItem>
          ))}
        </RevealGroup>
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
        <RevealGroup className="mt-8 grid gap-4 md:grid-cols-5" stagger={0.08}>
          {(
            isAr
              ? [
                  ["نموذج من 5 دقائق", "أخبرنا بنوع الأصل والحجم التقريبي والموقع."],
                  ["نتواصل خلال 24 ساعة", "شمس أو أحد أعضاء الفريق يتواصل عبر واتساب أو البريد لتأكيد التفاصيل."],
                  ["شارك بيانات شهر", "شهر من سجلات التوزيع أو فواتير الطاقة أو البيانات التشغيلية. نتولّى التحليل."],
                  ["تستلم النتيجة خلال 7 أيام", "تقرير واضح يُظهر فجوة القرار الاقتصادي بالريال — مع توصيات توقيت محددة."],
                  ["أنت تقرّر", "بدون ضغط. بدون تسجيل تلقائي. إذا كانت النتيجة مهمة، نتحدّث عن الخطوات التالية."],
                ]
              : [
                  ["5-minute form", "Tell us your asset type, approximate size, and location."],
                  ["We reach out in 24 hours", "Chams or a team member contacts you via WhatsApp or email to confirm details."],
                  ["Share one month of data", "One month of dispatch logs, energy invoices, or operational data. We handle the analysis."],
                  ["Result in 7 days", "A clear report showing your Economic Decision Gap in OMR — with specific dispatch timing recommendations."],
                  ["You decide", "No pressure. No automatic enrollment. If the number is interesting, we talk next steps."],
                ]
          ).map(([title, body], i) => (
            <RevealItem key={title} className="h-full">
              <CursorSurface className="surface h-full rounded-2xl p-5">
                <span className="font-mono text-xs font-bold text-secondary">
                  {isAr ? `الخطوة ${i + 1}` : `Step ${i + 1}`}
                </span>
                <h3 className="mt-2 font-display text-base font-bold">{title}</h3>
                <p className="mt-2 text-xs text-ink-muted">{body}</p>
              </CursorSurface>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-6 text-sm text-ink-muted">
          {isAr ? "الضمان:" : "Guarantee:"}{" "}
          <span className="text-ink">{GUARANTEE_TEXT}</span>
        </p>
      </Section>

      {/* TRUST SIGNALS — real traction only */}
      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold">{t("trustTitle")}</h2>
          <p className="mt-2 text-ink-muted">{t("trustSub")}</p>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_TRACTION.map((item, i) => (
            <RevealItem key={item.key} className="h-full">
              <CursorSurface className="surface h-full rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="font-mono text-xs text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-secondary">{isAr ? item.ar : item.en}</span>
                </div>
                <p className="mt-2 text-xs text-ink-muted">{isAr ? item.detailAr : item.detailEn}</p>
              </CursorSurface>
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            value={`${fmtOMR(PRIMARY.annualRevenueOMR)}`}
            label={`OMR / ${PRIMARY.assetMW} MW · ${tc("perYear")}`}
            numeric={{ to: PRIMARY.annualRevenueOMR }}
          />
          <Stat
            value={`${PRIMARY.profitMin}%–${PRIMARY.profitMax}%`}
            label="Profitability uplift, 0 CAPEX"
          />
          <Stat
            value={`${PRIMARY.smpOMRPerMWh}`}
            label="SMP 2024 (OMR/MWh)"
            numeric={{ to: PRIMARY.smpOMRPerMWh, decimals: 2 }}
          />
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
        <Reveal>
          <div className="glass glass-teal relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="aurora -z-10 opacity-60" />
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{t("ctaTitle")}</h2>
            <p className="mt-3 text-ink-muted">{t("ctaBody")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <LinkButton href="/economic-audit" variant="accent" className="cta-shine">
                {tc("startDiagnostic")} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/pricing" variant="secondary">
                {tc("learnMore")}
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
