import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Cpu, Database, GitBranch, ShieldCheck, AlertTriangle } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { SECONDARY, fmtOMR } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "technology" });
  return buildMetadata({
    locale,
    path: "/technology",
    title: t("title"),
    description: "The Shadow Economic Engine — economic dispatch Oman methodology turning public market data into recoverable value.",
  });
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");
  const isAr = locale === "ar";

  const steps = [
    { icon: Database, label: "Ingest telemetry" },
    { icon: GitBranch, label: "Align market signals" },
    { icon: Cpu, label: "Replay dispatch" },
    { icon: ShieldCheck, label: "Quantify gap" },
  ];

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.controlRoom} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader title={t("title")} lead={t("lead")} />
        </Section>
      </div>

      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-bold">{t("pipelineTitle")}</h2>
          <p className="mt-3 text-ink-muted">{t("pipelineBody")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                <s.icon className="mx-auto h-6 w-6 text-secondary" />
                <p className="mt-2 text-sm">{i + 1}. {s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* The patented decision logic */}
      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl font-bold">
              {isAr ? "منطق القرار" : "The decision logic"}
            </h2>
            <p className="mt-3 text-ink-muted">
              {isAr
                ? "في كل فترة زمنية، نقيس فجوة الأداء ونحوّلها إلى قيمة اقتصادية بسعر السوق الفعلي، ثم نوصي بالإجراء فقط عندما يكون مربحًا."
                : "For every time period we measure the performance gap, value it at the live market price, and recommend an action only when it is economically profitable."}
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-ink">
{`for each period t:
  gap        = P_expected[t] − P_actual[t]
  loss[t]    = max(0, gap) × Market_Price[t]   # OMR
  cumulative = cumulative + loss[t]

  # Patented Economic Decision rule
  if cumulative ≥ Intervention_Cost:
    recommend(action)        # dispatch / maintenance
    cumulative = 0

Recoverable value = Σ loss[t]   over 8,760 hours`}
            </pre>
            <p className="mt-3 font-mono text-[11px] text-ink-muted">
              Financial_Loss = Σ (P_expected − P_actual) × Market_Price
            </p>
          </Card>

          <Card>
            <h2 className="font-display text-2xl font-bold">
              {isAr ? "مسار البيانات" : "Data flow"}
            </h2>
            <div className="mt-5 space-y-3">
              {[
                { k: "SCADA / IoT", en: "Asset telemetry (power, SOC, status)", ar: "قياسات الأصل (الطاقة، الشحن، الحالة)" },
                { k: "FastAPI ingest", en: "Validation, schema mapping, encryption", ar: "تحقق، مطابقة المخطط، تشفير" },
                { k: "Economic Engine", en: "Align with Oman SMP / scarcity → replay dispatch", ar: "المواءمة مع السعر الحدّي/الندرة ← إعادة تشغيل التوزيع" },
                { k: "Decision Manager", en: "Quantify gap → recommend profitable action", ar: "قياس الفجوة ← التوصية بإجراء مربح" },
              ].map((row, i, a) => (
                <div key={row.k}>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <span className="font-mono text-xs text-secondary">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold">{row.k}</p>
                      <p className="text-xs text-ink-muted">{isAr ? row.ar : row.en}</p>
                    </div>
                  </div>
                  {i < a.length - 1 ? <div className="ml-5 h-3 w-px bg-white/15" /> : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* Fixed schedule vs economic intelligence */}
      <Section className="py-8">
        <h2 className="font-display text-2xl font-extrabold">
          {isAr ? "الجدولة الثابتة مقابل الذكاء الاقتصادي" : "Fixed schedule vs. economic intelligence"}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="border border-white/10">
            <p className="text-sm font-semibold text-ink-muted">{isAr ? "الجدولة الثابتة" : "Fixed schedule"}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              {[
                isAr ? "تشحن وتفرّغ في أوقات ثابتة" : "Charges/discharges at fixed hours",
                isAr ? "تتجاهل أسعار السوق الحية" : "Ignores live market prices",
                isAr ? "تترك القيمة على الطاولة" : "Leaves value on the table",
              ].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-red-400">✕</span>{x}</li>
              ))}
            </ul>
          </Card>
          <Card className="border border-accent/30">
            <p className="text-sm font-semibold text-accent">{isAr ? "الذكاء الاقتصادي PREDAIOT" : "PREDAIOT economic intelligence"}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                isAr ? "توزيع واعٍ بالسعر مقابل السعر الحدّي والندرة" : "Price-aware dispatch vs. SMP & scarcity",
                isAr ? "قرار مربح فقط عند تجاوز تكلفة التدخل" : "Acts only when profit exceeds intervention cost",
                isAr ? "يسترجع القيمة دون إنفاق رأسمالي" : "Recovers value with zero CAPEX",
              ].map((x) => (
                <li key={x} className="flex gap-2"><span className="text-accent">✓</span>{x}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* SECONDARY figures — technical page only, explicitly labeled */}
      <Section className="py-8">
        <div className="surface rounded-2xl border border-yellow-400/20 p-6">
          <div className="flex items-center gap-2 text-yellow-300/90">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{SECONDARY.label}</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold">{t("secondaryTitle")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold text-secondary">up to {SECONDARY.upliftMaxPct}%</p>
              <p className="text-xs text-ink-muted">≈ ${fmtOMR(SECONDARY.upliftUSD)} / year</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{SECONDARY.solarMW} MW / {SECONDARY.batteryMWh} MWh</p>
              <p className="text-xs text-ink-muted">Solar / battery (simulation)</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="font-display text-2xl font-extrabold">{SECONDARY.hours.toLocaleString()}</p>
              <p className="text-xs text-ink-muted">hours of real Oman data</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
