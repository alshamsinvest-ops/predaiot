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
            <p className="mt-4 text-lg font-semibold text-accent">{t("missionBody")}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
