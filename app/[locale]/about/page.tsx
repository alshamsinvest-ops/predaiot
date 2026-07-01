import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import FounderPhoto from "@/components/FounderPhoto";
import EconomicWaveform from "@/components/kinetic/EconomicWaveform";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { COMPANY, REAL_TRACTION } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/about",
    title: `About ${COMPANY.name} — Economic Decision Intelligence · Muscat, Oman`,
    description:
      "How and why we built PREDAIOT. The Economic Decision Gap, the founder, our team, and our institutional validation.",
  });
}

export default async function AboutPage({
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
        <IndustrialImage img={IMAGES.windSolar} locale={locale} variant="background" priority />
        <EconomicWaveform height={260} opacity={0.4} />
        <Section className="pt-16">
          <PageHeader
            title={isAr ? "عن PREDAIOT" : "About PREDAIOT"}
            lead={
              isAr
                ? "نُغلق الفجوة بين الأداء التقني والأداء الاقتصادي في تشغيل أصول الطاقة."
                : "We close the gap between technical performance and economic performance in energy asset operations."
            }
          />
        </Section>
      </div>

      {/* Problem */}
      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-extrabold">
            {isAr ? "المشكلة التي وجدناها" : "The problem we found"}
          </h2>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              {isAr
                ? "أصول الطاقة في عُمان والخليج مهندسة للأداء. أنظمة SCADA تقيس وقت التشغيل، وعدد الأعطال، وأهداف التوليد بدقة."
                : "Energy assets in Oman and the GCC are engineered to perform. SCADA systems measure uptime, fault counts, and generation targets with precision."}
            </p>
            <p>
              {isAr
                ? "لكن لا أحد يقيس الجودة الاقتصادية لقرارات التوزيع."
                : "But nobody measures the economic quality of dispatch decisions."}
            </p>
            <p>
              {isAr
                ? "بطارية تشحن في الساعة الخطأ تكلّف المشغّل آلاف الريالات العُمانية. لا تُولّد أي أعطال. ولا أي إنذارات. وتظهر في كل تقرير على أنها نجاح."
                : "A battery that charges at the wrong hour costs the operator thousands of OMR. It generates zero faults. Zero alarms. It appears in every report as a success."}
            </p>
            <p>
              {isAr
                ? "الخسارة غير مرئية. نسمّيها فجوة القرار الاقتصادي."
                : "The loss is invisible. We call it the Economic Decision Gap."}
            </p>
            <p>
              {isAr
                ? "دعمت حكومة عُمان قطاع الكهرباء بمبلغ 602.3 مليون ر.ع. في 2024. جزء معتبر من هذه الفجوة لا ينشأ من ضعف الأجهزة — بل من قرارات توزيع مبنية على جداول لم تشاهد أبدًا إشارة سعر."
                : "Oman's government subsidised its electricity sector by 602.3 million OMR in 2024. A meaningful portion of that gap originates not from inefficient hardware — but from dispatch decisions made on schedules that have never seen a price signal."}
            </p>
          </div>
        </Card>
      </Section>

      {/* Why */}
      <Section className="py-8">
        <Card>
          <h2 className="font-display text-2xl font-extrabold">
            {isAr ? "لماذا بنينا PREDAIOT" : "Why we built PREDAIOT"}
          </h2>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              {isAr
                ? "بُنيت PREDAIOT لإغلاق الفجوة بين الأداء التقني والأداء الاقتصادي في تشغيل أصول الطاقة."
                : "PREDAIOT was built to close the gap between technical performance and economic performance in energy asset operations."}
            </p>
            <p>
              {isAr
                ? "محرّكنا الاقتصادي الظلّي يعيد تشغيل كل قرار توزيع يتّخذه الأصل — ويُخبر المشغّل، بالريال العُماني، بما كان سيكون عليه القرار الاقتصادي الأمثل. ثم في التشغيل الحي، يتّخذ ذلك القرار بشكل مستقل."
                : "Our Shadow Economic Engine replays every dispatch decision an asset makes — and tells the operator, in OMR, what the economically optimal decision would have been. Then, in live deployment, it makes that decision autonomously."}
            </p>
            <p className="text-accent">
              {isAr
                ? "النتيجة أصل لا يكتفي بالتشغيل — بل يتنافس. اقتصاديًا. كل ساعة."
                : "The result is an asset that doesn't just operate — it competes. Economically. Every hour."}
            </p>
          </div>
        </Card>
      </Section>

      {/* Founder + Team */}
      <Section className="py-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.6fr]">
          <Card>
            <FounderPhoto />
            <h3 className="mt-4 font-display text-xl font-extrabold">Chams Eddine Madi</h3>
            <p className="text-sm text-secondary">{isAr ? "المؤسّس والرئيس التنفيذي" : "Founder & CEO"}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {COMPANY.email}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {COMPANY.phoneDisplay}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {COMPANY.location}</li>
              <li>
                <a
                  href={COMPANY.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-secondary"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
            </ul>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                {isAr ? "الإنجازات" : "Achievements"}
              </p>
              <ul className="mt-3 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-secondary">01</span>
                  <span className="text-ink-muted">
                    {isAr
                      ? "طلب براءة اختراع مودَع — طريقة محرّك القرار الاقتصادي"
                      : "Patent application filed — economic decision engine method"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-secondary">02</span>
                  <span className="text-ink-muted">
                    {isAr
                      ? "المنهجية منشورة — البوابة الوطنية للبيانات المفتوحة، يونيو 2026"
                      : "Methodology published — Oman National Open Data Portal, June 2026"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-secondary">03</span>
                  <span className="text-ink-muted">
                    {isAr
                      ? "اجتماع مع المدير العام لمركز التحكم في الأحمال — OETC، يونيو 2026"
                      : "Meeting with GM Load Dispatch Centre — OETC, June 2026"}
                  </span>
                </li>
              </ul>
            </div>
          </Card>

          <div>
            <h2 className="font-display text-2xl font-extrabold">
              {isAr ? "المؤسّس" : "The founder"}
            </h2>
            <div className="mt-3 space-y-3 text-ink-muted">
              <p className="text-ink">
                {isAr
                  ? "قضيت سنوات أشاهد أصولًا ممتازة تقنيًا تخسر المال كل ساعة — بدون أن يلاحظ أحد. بنيتُ PREDAIOT لأن الطبقة التي تصنع الفرق لم تكن موجودة."
                  : "I spent years watching technically excellent assets lose money every hour — with nobody noticing. I built PREDAIOT because the layer that makes the difference simply did not exist."}
              </p>
              <p>
                {isAr
                  ? "أسّس شمس الدين ماضي PREDAIOT لحل مشكلة لاحظها على تقاطع تشغيل الطاقة والأداء المالي في دول الخليج: أصول ممتازة تقنيًا تنتج نتائج مالية دون المستوى الأمثل — ليس بسبب ضعف الهندسة، بل لأن طبقة القرار الاقتصادي بين الأجهزة والسوق لم تكن موجودة."
                  : "Chams Eddine Madi founded PREDAIOT to solve a problem he observed at the intersection of energy operations and financial performance across the GCC: technically excellent assets generating financially sub-optimal outcomes — not because of poor engineering, but because the economic decision layer between hardware and market simply did not exist."}
              </p>
              <p>
                {isAr
                  ? "طوّر منهجية محرّك القرار الاقتصادي (طلب براءة اختراع)، وتحقّق منها على بيانات حكومة عُمان الرسمية، وبنى الشركة في مسقط، عُمان — السوق الذي صُمّمت المنصة لخدمته أولًا."
                  : "He developed the patent-pending Economic Decision Engine methodology, validated it on official Oman government data, and built the company in Muscat, Oman — the market the platform is designed to serve first."}
              </p>
              <p className="text-sm">
                {isAr ? "حامل إقامة مستثمر، سلطنة عُمان." : "Investor residency holder, Sultanate of Oman."}
              </p>
            </div>

            <h2 className="mt-10 font-display text-2xl font-extrabold">
              {isAr ? "الفريق" : "The team"}
            </h2>
            <div className="mt-3 space-y-3 text-ink-muted">
              <p>
                {isAr
                  ? "تعمل PREDAIOT بفريق مُركَّز من اقتصاديي الطاقة، ومهندسي البرمجيات، والمتخصصين في المجال. يجمع فريقنا الخبرة في هندسة أنظمة الطاقة، ونمذجة التوزيع الاقتصادي، وتطوير البرمجيات، وعمليات سوق الخليج."
                  : "PREDAIOT operates with a focused team of energy economists, software engineers, and domain specialists. Our team brings combined expertise in energy systems engineering, economic dispatch modelling, software development, and GCC market operations."}
              </p>
              <p>
                {isAr
                  ? "مقرنا في مسقط، سلطنة عُمان — حيث المشكلة التي نحلّها قابلة للقياس بشكل مباشر، وحيث بنينا علاقات مباشرة مع مشغّلي الشبكة، والمنتجين المستقلين، والجهات التنظيمية للطاقة."
                  : "We are headquartered in Muscat, Sultanate of Oman — where the problem we solve is most directly measurable, and where we have built direct relationships with grid operators, IPPs, and energy regulators."}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Institutional validation */}
      <Section className="py-8">
        <h2 className="font-display text-3xl font-extrabold">
          {isAr ? "التحقّق المؤسّسي" : "Institutional validation"}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </Section>

      {/* GCC scaling vision */}
      <Section className="py-6">
        <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-6 text-center">
          <p className="font-display text-lg text-secondary sm:text-xl">
            {isAr
              ? "نبدأ من عُمان. فجوة القرار الاقتصادي موجودة في كل سوق طاقة خليجي — وهناك حيث نتوسّع."
              : "We start in Oman. The Economic Decision Gap exists in every GCC energy market — that is where we scale."}
          </p>
        </div>
      </Section>

      {/* Mission */}
      <Section className="py-8">
        <div className="surface rounded-2xl p-10 text-center">
          <h2 className="font-display text-3xl font-extrabold">
            {isAr ? "المهمّة" : "The mission"}
          </h2>
          <p className="mt-4 font-display text-xl text-accent sm:text-2xl">
            {isAr
              ? "كل أصل يُنتج طاقة. PREDAIOT تضمن أن يُنتج قيمة."
              : "Every asset produces energy. PREDAIOT makes sure it produces value."}
          </p>
        </div>
      </Section>
    </>
  );
}
