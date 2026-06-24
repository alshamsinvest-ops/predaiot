import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import LoginClient from "@/components/auth/LoginClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return buildMetadata({ locale, path: "/login", title: t("title"), description: t("title") });
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Section className="pt-16">
      <LoginClient />
    </Section>
  );
}
