import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Clock,
  PauseCircle,
  EyeOff,
  Database,
  GitCompareArrows,
  Sigma,
  ScrollText,
  Fuel,
  Zap,
  Building2,
  Leaf,
  Sun,
  Wind,
  BatteryCharging,
  Cable,
  Waypoints,
  Factory,
  Droplets,
  Atom,
  Server,
  Grid3x3,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { Section, PageHeader, Card, Kicker, LinkButton } from "@/components/ui";
import EnergyNetwork from "@/components/kinetic/EnergyNetwork";
import { Reveal, RevealGroup, RevealItem } from "@/components/kinetic/Reveal";
import CursorSurface from "@/components/kinetic/CursorSurface";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { SECTORS, COMPANY, POSITIONING } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Fuel,
  Zap,
  Building2,
  Leaf,
  Sun,
  Wind,
  BatteryCharging,
  Cable,
  Waypoints,
  Factory,
  Droplets,
  Atom,
  Server,
  Grid3x3,
  Boxes,
};

/** Example sectors (bess, solar) keep their dedicated deep-dive pages. */
const DEDICATED = new Set(["bess", "solar"]);
const LANDING_SECTORS = SECTORS.filter((s) => !DEDICATED.has(s.key));

export function generateStaticParams() {
  return LANDING_SECTORS.map((s) => ({ sector: s.key }));
}

function getSector(key: string) {
  return LANDING_SECTORS.find((s) => s.key === key);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}): Promise<Metadata> {
  const { locale, sector } = await params;
  const s = getSector(sector);
  if (!s) return {};
  const name = locale === "ar" ? s.ar : s.en;
  return buildMetadata({
    locale,
    path: `/industries/${sector}`,
    title: `${name} — Economic Decision Intelligence · ${COMPANY.name}`,
    description: `${s.detailEn} PREDAIOT quantifies the economic decision gap for ${s.en.toLowerCase()} against published market prices — transparent, auditable, cross-sector.`,
  });
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}) {
  const { locale, sector } = await params;
  const s = getSector(sector);
  if (!s) notFound();
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const name = isAr ? s.ar : s.en;
  const detail = isAr ? s.detailAr : s.detailEn;
  const Icon = ICONS[s.icon] ?? Boxes;

  // Universal decision archetypes — honest and applicable to any sector.
  const leaks = [
    {
      icon: Clock,
      title: isAr ? "قرارات موقوتة بالساعة لا بالسعر" : "Decisions timed by the clock, not the price",
      body: isAr
        ? `تُتّخذ قرارات التوزيع والشراء في ${name} على جداول ثابتة بينما تتحرّك أسعار السوق كل ساعة. الفجوة بينهما قيمة قابلة للاسترجاع.`
        : `Dispatch and procurement decisions in ${name.toLowerCase()} run on fixed schedules while market prices move every hour. The gap between them is recoverable value.`,
    },
    {
      icon: PauseCircle,
      title: isAr ? "مرونة معطّلة" : "Flexibility left idle",
      body: isAr
        ? "الأصول المرنة تقف ساكنة في لحظات كان بإمكانها أن تكسب فيها — لأن لا أحد يقيس تكلفة الفرصة الاقتصادية لحظةً بلحظة."
        : "Flexible assets sit still in the exact hours they could earn — because no one is measuring the hour-by-hour economic opportunity cost.",
    },
    {
      icon: EyeOff,
      title: isAr ? "قرارات بلا حلقة تغذية اقتصادية" : "Decisions with no economic feedback loop",
      body: isAr
        ? "الأنظمة الحالية تقيس الأداء التقني — التوافر ووقت التشغيل — لا الجودة الاقتصادية للقرار. ما لا يُقاس لا يُحسّن."
        : "Existing systems measure technical performance — availability, uptime — not the economic quality of the decision. What isn't measured can't be improved.",
    },
  ];

  const method = [
    {
      icon: Database,
      title: isAr ? "استيعاب" : "Ingest",
      body: isAr
        ? "قياسات الأصل الحالية عبر SCADA/EMS أو رفع ملف — دون استبدال أي جهاز."
        : "Existing asset telemetry via SCADA/EMS or a file upload — no hardware to replace.",
    },
    {
      icon: GitCompareArrows,
      title: isAr ? "مواءمة" : "Align",
      body: isAr
        ? "مقابل إشارات السوق المنشورة — السعر الحدّي والندرة والطلب."
        : "Against published market signals — marginal price, scarcity, demand.",
    },
    {
      icon: ScrollText,
      title: isAr ? "إعادة تشغيل" : "Replay",
      body: isAr
        ? "يُعاد تشغيل كل قرار مقابل ما كان القرار الأمثل اقتصاديًا في تلك الساعة."
        : "Every decision is replayed against what the economically optimal one would have been that hour.",
    },
    {
      icon: Sigma,
      title: isAr ? "قياس" : "Quantify",
      body: isAr
        ? "الفجوة الاقتصادية بعملتك — مُستشهَدة بمصادر رسمية وقابلة للتحقق باستقلالية."
        : "The economic decision gap in your currency — cited to official sources, independently verifiable.",
    },
  ];

  // Provocative but honest one-liners — no fabricated per-sector figures.
  const hooks: { k: string; v: string }[] = isAr
    ? [
        { k: "8,760", v: "قرار توزيع أو شراء في السنة — كل ساعة فرصة أو خسارة." },
        { k: "0 CAPEX", v: "لا استبدال أجهزة. الطبقة الاقتصادية هي ما ينقص." },
        { k: "بالريال", v: "الفجوة تُقاس بعملتك، لا بمؤشر تقني مجرّد." },
        { k: "قابل للتدقيق", v: "كل قرار يحمل السعر والمعادلة التي بررته." },
      ]
    : [
        { k: "8,760", v: "dispatch or procurement decisions a year — every hour is an opportunity or a loss." },
        { k: "0 CAPEX", v: "no hardware to replace. The economic layer is what's missing." },
        { k: "In OMR", v: "the gap is measured in your currency, not an abstract technical index." },
        { k: "Auditable", v: "every decision carries the price and the calculation that justified it." },
      ];

  // What the diagnostic delivers — honest, sector-agnostic.
  const deliverables = isAr
    ? [
        "خط الأساس: ما كسبه أصلك فعليًا مقابل أي سعر سوق، ساعةً بساعة.",
        "التشغيل الظلّي: القرارات نفسها مُعاد تشغيلها بمنطق السعر أولًا.",
        "فجوة القرار: الفرق بالريال، مُفصّلًا حسب نوع التسرّب.",
        "أفضل 20 إجراءً مرتّبة بالريال — التاريخ والساعة والقرار البديل.",
        "خارطة استرجاع: ما الذي يلتقط كل تسرّب، دون ربط ببرنامج معيّن.",
      ]
    : [
        "Baseline — what your asset actually earned against real market prices, hour by hour.",
        "Shadow run — the same decisions replayed with price-first logic.",
        "Decision gap — the difference in OMR, broken down by leak type.",
        "Top 20 actions ranked by OMR — date, hour, action taken vs. recommended.",
        "Recovery roadmap — what captures each leak, with no software lock-in implied.",
      ];

  const faqs = isAr
    ? [
        {
          q: `هل ينطبق هذا فعلًا على ${name}؟`,
          a: "إذا كان أصلك يتّخذ قرار توزيع أو شراء طاقة مقابل سعر متغيّر، فالمنهجية تنطبق. المحرّك محايد للقطاع — يقرأ القرار والسعر، لا نوع الأصل.",
        },
        {
          q: "هل نحتاج لاستبدال أنظمتنا؟",
          a: "لا. نقرأ القياسات الموجودة عبر SCADA/EMS أو رفع ملف. لا أجهزة جديدة، ولا حلقة تحكم إجبارية.",
        },
        {
          q: "من أين تأتي الأرقام؟",
          a: "من إشارات السوق المنشورة رسميًا. كل رقم قابل للتحقق باستقلالية — لا صندوق أسود ولا نتائج ملفّقة.",
        },
        {
          q: "ماذا لو لم نجد قيمة؟",
          a: "التشخيص مجاني لمدة 7 أيام مع ضمان مكتوب. إن لم نجد قيمة قابلة للاسترجاع، لا تدفع شيئًا.",
        },
        {
          q: "هل بياناتنا آمنة؟",
          a: "القراءة فقط بشكل افتراضي، ومحصورة بنطاق العقد. لا نبيع بياناتك ولا الرؤى المشتقّة منها.",
        },
      ]
    : [
        {
          q: `Does this really apply to ${name.toLowerCase()}?`,
          a: "If your asset makes a dispatch or energy-procurement decision against a variable price, the methodology applies. The engine is sector-agnostic — it reads the decision and the price, not the asset type.",
        },
        {
          q: "Do we have to replace our systems?",
          a: "No. We read existing telemetry via SCADA/EMS or a file upload. No new hardware, no forced closed-loop control.",
        },
        {
          q: "Where do the numbers come from?",
          a: "Officially published market signals. Every figure is independently verifiable — no black box, no fabricated results.",
        },
        {
          q: "What if you don't find value?",
          a: "The diagnostic is free for 7 days with a written guarantee. If we don't find recoverable value, you pay nothing.",
        },
        {
          q: "Is our data safe?",
          a: "Read-only by default and scoped by contract. We don't sell your data or the insights derived from it.",
        },
      ];

  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          `Economic Decision Intelligence for ${s.en}`,
          s.detailEn,
          `/${locale}/industries/${sector}`,
        )}
      />

      {/* HERO */}
      <div className="relative overflow-hidden bg-primary-900">
        <div className="aurora -z-10" />
        <EnergyNetwork className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(120%_100%_at_50%_0%,#000_30%,transparent_75%)]" />
        <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-15" aria-hidden="true" />
        <Section className="relative pt-16">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1">
            <Icon className="h-4 w-4 text-secondary" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-secondary">
              {isAr ? "قطاع" : "Sector"}
            </span>
          </div>
          <PageHeader
            title={`${name}`}
            lead={detail}
          />
          <p className="mt-4 max-w-3xl text-ink-muted">
            {isAr ? POSITIONING.crossSector : POSITIONING.crossSector}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/economic-audit" variant="accent" className="cta-shine">
              {isAr ? "ابدأ التشخيص المجاني" : "Start a free diagnostic"} <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/technology" variant="secondary">
              {isAr ? "كيف يعمل المحرّك" : "How the engine works"}
            </LinkButton>
          </div>
        </Section>
      </div>

      {/* HOOK STRIP */}
      <Section className="py-8">
        <RevealGroup className="grid gap-px overflow-hidden border border-line sm:grid-cols-2 lg:grid-cols-4">
          {hooks.map((h) => (
            <RevealItem key={h.k}>
              <div className="h-full bg-primary-50 p-5">
                <div className="font-mono text-2xl font-semibold text-secondary">{h.k}</div>
                <p className="mt-2 text-sm text-ink-muted">{h.v}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* WHERE VALUE LEAKS */}
      <Section className="py-10">
        <Reveal>
          <Kicker>{isAr ? "أين تتسرّب القيمة" : "Where value leaks"}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {isAr
              ? `ثلاثة أنماط من فجوة القرار في ${name}`
              : `Three decision-gap patterns in ${name.toLowerCase()}`}
          </h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-3">
          {leaks.map((l) => (
            <RevealItem key={l.title} className="h-full">
              <CursorSurface className="surface h-full rounded-2xl p-6">
                <l.icon className="h-7 w-7 text-accent" />
                <h3 className="mt-3 font-display text-lg font-bold">{l.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{l.body}</p>
              </CursorSurface>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* HOW PREDAIOT APPLIES */}
      <Section className="py-10">
        <Reveal>
          <Kicker>{isAr ? "كيف تنطبق PREDAIOT" : "How PREDAIOT applies"}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {isAr ? "المحرّك نفسه. قطاعك." : "The same engine. Your sector."}
          </h2>
          <p className="mt-3 max-w-3xl text-ink-muted">
            {isAr ? POSITIONING.scientific : POSITIONING.scientific}
          </p>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {method.map((m, i) => (
            <RevealItem key={m.title} className="h-full">
              <CursorSurface className="surface h-full rounded-2xl p-5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-secondary">
                    0{i + 1}
                  </span>
                  <m.icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold">{m.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{m.body}</p>
              </CursorSurface>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* WHAT THE DIAGNOSTIC DELIVERS */}
      <Section className="py-10">
        <Reveal>
          <Kicker>{isAr ? "ماذا تستلم" : "What you get"}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {isAr ? "تقرير فجوة القرار — لأصلك" : "A Decision Gap report — for your asset"}
          </h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-px overflow-hidden border border-line md:grid-cols-1">
          {deliverables.map((d, i) => (
            <RevealItem key={d}>
              <div className="flex items-start gap-4 bg-primary-50 p-5">
                <span className="font-mono text-sm text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-sm text-ink">{d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* FAQ */}
      <Section className="py-10">
        <Reveal>
          <Kicker>{isAr ? "أسئلة قبل البدء" : "Before you start"}</Kicker>
          <h2 className="mt-3 font-display text-3xl font-extrabold">
            {isAr ? "أسئلة متكرّرة" : "Frequently asked"}
          </h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-4 lg:grid-cols-2">
          {faqs.map((f) => (
            <RevealItem key={f.q} className="h-full">
              <div className="surface h-full p-6">
                <h3 className="font-display text-base font-bold">{f.q}</h3>
                <p className="mt-2 text-sm text-ink-muted">{f.a}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* CTA */}
      <Section className="py-10">
        <Reveal>
          <div className="glass glass-teal relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="aurora -z-10 opacity-60" />
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
              {isAr
                ? `كم تترك أصول ${name} على الطاولة؟`
                : `How much is your ${name.toLowerCase()} leaving on the table?`}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
              {isAr
                ? "تشخيص مجاني لمدة 7 أيام، مع ضمان مكتوب. لا يتطلّب استبدال أي جهاز."
                : "A free 7-day diagnostic, with a written guarantee. No hardware to replace."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <LinkButton href="/economic-audit" variant="accent" className="cta-shine">
                {isAr ? "ابدأ التشخيص المجاني" : "Start a free diagnostic"} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/industries" variant="secondary">
                {isAr ? "كل القطاعات" : "All sectors"}
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
