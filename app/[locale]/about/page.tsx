import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import IndustrialImage from "@/components/IndustrialImage";
import FounderPhoto from "@/components/FounderPhoto";
import { IMAGES } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({ locale, path: "/about", title: t("title"), description: t("founderBio") });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const isAr = locale === "ar";

  const timeline = [
    {
      label: isAr ? "إيداع براءة الاختراع (تونس)" : "Patent filed (Tunisia)",
      desc: isAr ? "حماية منهجية القرار الاقتصادي القائمة على الخسارة المالية." : "Protecting the Financial-Loss Economic Decision method.",
    },
    {
      label: isAr ? "نشر المنهجية على بوابة البيانات المفتوحة العُمانية" : "Methodology published on Oman's Open Data Portal",
      desc: isAr ? "تحويل بيانات السوق العامة إلى قيمة اقتصادية قابلة للاسترجاع." : "Turning public market data into recoverable economic value.",
    },
    {
      label: isAr ? "المشاركة في أسبوع الطاقة العُماني" : "Oman Energy Week participation",
      desc: isAr ? "عرض نهج الذكاء الاقتصادي على قطاع الطاقة." : "Presenting the economic-intelligence approach to the energy sector.",
    },
    {
      label: isAr ? "حوار فني مع مركز التحكم في الأحمال OETC" : "Technical dialogue with OETC Load Dispatch Centre",
      desc: isAr ? "مواءمة المنهجية مع واقع تشغيل الشبكة العُمانية." : "Aligning the methodology with Oman grid operations.",
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden">
        <IndustrialImage img={IMAGES.windSolar} locale={locale} variant="background" priority />
        <Section className="pt-16">
          <PageHeader title={t("title")} lead={t("missionBody")} />
        </Section>
      </div>
      <Section className="py-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Card>
            <FounderPhoto />
            <h2 className="mt-4 font-display text-xl font-bold">{t("founderName")}</h2>
            <p className="text-sm text-secondary">{t("founderRole")}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {COMPANY.email}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {COMPANY.phoneDisplay}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {COMPANY.location}</li>
              <li>
                <a href={COMPANY.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-secondary">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
            </ul>
          </Card>
          <div>
            <h2 className="font-display text-2xl font-bold">{t("mission")}</h2>
            <p className="mt-3 text-ink-muted">{t("founderBio")}</p>
            <p className="mt-4 text-ink-muted">{t("story")}</p>
            <p className="mt-4 text-lg font-semibold text-accent">{t("missionBody")}</p>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section className="py-8">
        <h2 className="font-display text-2xl font-extrabold">{t("timelineTitle")}</h2>
        <div className="mt-6 space-y-4">
          {timeline.map((item, i) => (
            <div key={item.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 font-mono text-xs font-bold text-secondary">
                  {i + 1}
                </span>
                {i < timeline.length - 1 ? <span className="mt-1 h-full w-px bg-white/15" /> : null}
              </div>
              <div className="pb-4">
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm text-ink-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
