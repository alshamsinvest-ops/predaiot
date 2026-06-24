import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, MessageCircle, Mail, Phone } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "@/components/forms/ContactForm";
import { COMPANY } from "@/lib/constants";
import { whatsappLink } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ locale, path: "/contact", title: t("title"), description: t("lead") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const calendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL;
  const waRegister = whatsappLink(
    COMPANY.whatsappNumber,
    "Hello PREDAIOT — I'd like to register. Name: , Company: , Asset type: "
  );

  return (
    <>
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <ContactForm />
            <Card className="flex flex-wrap items-center gap-4">
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-sm hover:text-[--color-secondary]">
                <Mail className="h-4 w-4" /> {COMPANY.email}
              </a>
              <a href={`tel:${COMPANY.phoneE164}`} className="flex items-center gap-2 text-sm hover:text-[--color-secondary]">
                <Phone className="h-4 w-4" /> {COMPANY.phoneDisplay}
              </a>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Booking */}
            <Card>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Calendar className="h-5 w-5 text-[--color-secondary]" /> {t("book")}
              </h2>
              <p className="mt-2 text-sm text-[--color-ink-muted]">{t("bookHint")}</p>
              {calendarUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <iframe src={calendarUrl} title="Booking" className="h-[520px] w-full" loading="lazy" />
                </div>
              ) : (
                <a
                  href={`mailto:${COMPANY.email}?subject=Strategy%20Call`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[--color-secondary] px-5 py-3 text-sm font-semibold text-[#04101f]"
                >
                  <Calendar className="h-4 w-4" /> {t("book")}
                </a>
              )}
            </Card>

            {/* WhatsApp register flow */}
            <Card>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <MessageCircle className="h-5 w-5 text-[#25D366]" /> {t("registerWhatsapp")}
              </h2>
              <a
                href={waRegister}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#04101f]"
              >
                <MessageCircle className="h-4 w-4" /> {COMPANY.phoneDisplay}
              </a>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
