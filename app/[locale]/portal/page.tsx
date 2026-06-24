import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import PortalClient from "@/components/auth/PortalClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal" });
  return buildMetadata({ locale, path: "/portal", title: t("title"), description: t("lead") });
}

export default async function PortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Section className="pt-16">
      <PortalClient />
    </Section>
  );
}
