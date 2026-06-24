import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, PageHeader } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return buildMetadata({ locale, path: "/privacy-policy", title: t("title"), description: t("lead") });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const isAr = locale === "ar";

  const sections = isAr
    ? [
        ["مراقب البيانات", `PREDAIOT، مسقط، سلطنة عُمان. للتواصل: ${COMPANY.email}.`],
        ["البيانات التي نجمعها", "الاسم، البريد الإلكتروني، الهاتف، اسم الشركة، نوع الأصل والسعة، وملفات القياس الاختيارية التي ترفعها."],
        ["أساس المعالجة", "نعالج بياناتك بموافقتك ولتقديم خدمة التشخيص والتدقيق التي تطلبها، وفقًا للمرسوم السلطاني 6/2022."],
        ["حقوقك", "لك الحق في الوصول إلى بياناتك وتصحيحها وحذفها وسحب الموافقة في أي وقت بمراسلتنا."],
        ["الاحتفاظ والأمان", "تُخزَّن القياسات مشفّرة وبوصول مقيّد. نحتفظ بالبيانات فقط للمدة اللازمة لتقديم الخدمة."],
        ["النقل", "قد نستخدم معالجين موثوقين (مثل خدمات الاستضافة والبريد) ضمن ضمانات تعاقدية مناسبة."],
      ]
    : [
        ["Data controller", `PREDAIOT, Muscat, Sultanate of Oman. Contact: ${COMPANY.email}.`],
        ["Data we collect", "Name, email, phone, company name, asset type and capacity, and any optional telemetry files you upload."],
        ["Lawful basis", "We process your data with your consent and to deliver the diagnostic and audit service you request, in line with Oman Royal Decree 6/2022 (PDPL)."],
        ["Your rights", "You may access, correct, delete your data and withdraw consent at any time by contacting us."],
        ["Retention & security", "Telemetry is stored encrypted with restricted access. We retain data only as long as needed to deliver the service."],
        ["Transfers & processors", "We may use trusted processors (e.g. hosting and email providers) under appropriate contractual safeguards."],
      ];

  return (
    <>
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map(([h, body]) => (
            <div key={h}>
              <h2 className="font-display text-xl font-bold">{h}</h2>
              <p className="mt-2 text-[--color-ink-muted]">{body}</p>
            </div>
          ))}
          <p className="text-xs text-[--color-ink-muted]">
            {isAr ? "آخر تحديث: يونيو 2026" : "Last updated: June 2026"}
          </p>
        </div>
      </Section>
    </>
  );
}
