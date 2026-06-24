import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Lock, ShieldCheck, FileCheck, Key, Database, ScrollText } from "lucide-react";
import { Section, PageHeader, Card } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "security" });
  return buildMetadata({ locale, path: "/security", title: t("title"), description: t("lead") });
}

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("security");

  const items = [
    { icon: Lock, text: t("items.https") },
    { icon: Key, text: t("items.auth") },
    { icon: FileCheck, text: t("items.uploads") },
    { icon: ShieldCheck, text: t("items.rules") },
    { icon: Database, text: t("items.encryption") },
    { icon: ScrollText, text: t("items.audit") },
  ];

  return (
    <>
      <Section className="pt-12">
        <PageHeader title={t("title")} lead={t("lead")} />
      </Section>
      <Section className="py-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((i) => (
            <Card key={i.text}>
              <i.icon className="h-6 w-6 text-accent" />
              <p className="mt-3 text-ink-muted">{i.text}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
