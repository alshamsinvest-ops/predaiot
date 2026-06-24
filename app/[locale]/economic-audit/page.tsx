import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, ArrowRight } from "lucide-react";
import { Section, Kicker, Card, LinkButton } from "@/components/ui";
import LeakTestForm from "@/components/forms/LeakTestForm";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { PRICING, PROMO_HOOK_TEXT, fmtOMR } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/economic-audit",
    title: locale === "ar" ? "التدقيق الاقتصادي" : "Economic Audit — Free 7-Day Leak Test",
    description:
      "Free 7-day economic diagnostic for solar, battery and industrial energy assets in Oman & GCC — with a written guarantee. Solar asset economic audit and BESS optimization.",
  });
}

export default async function AuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("audit");
  const tl = await getTranslations("leak");
  const tc = await getTranslations("common");

  const tiers = [
    {
      name: t("free"),
      price: "0 OMR",
      desc: t("freeDesc"),
      highlight: true,
      features: [tl("guaranteeTitle"), `${PRICING.audit.deliveryDays}-day`, "0 CAPEX"],
    },
    {
      name: t("auditTier"),
      price: `${fmtOMR(PRICING.audit.minOMR)}–${fmtOMR(PRICING.audit.maxOMR)} OMR`,
      promo: `${fmtOMR(PRICING.audit.promoMinOMR)}–${fmtOMR(PRICING.audit.promoMaxOMR)} OMR`,
      desc: t("auditDesc"),
      features: [
        `${PRICING.audit.analysisHours.toLocaleString()}-hour analysis`,
        `${PRICING.audit.deliveryDays}-day delivery`,
        t("promoNote"),
      ],
    },
    {
      name: t("pilot"),
      price: `${locale === "ar" ? "من" : "from"} ${fmtOMR(PRICING.pilot.fromOMR)} OMR`,
      desc: t("pilotDesc"),
      features: [`${PRICING.pilot.durationDays}-day shadow-mode`],
    },
    {
      name: t("deployment"),
      price: `${PRICING.deployment.predaiotPct}% / ${PRICING.deployment.clientPct}%`,
      desc: t("deploymentDesc"),
      features: ["Zero upfront", "Revenue share"],
    },
  ];

  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          "Economic Audit",
          "Economic dispatch audit for energy assets in Oman and the GCC.",
          "/economic-audit"
        )}
      />

      <Section className="pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <Kicker>{tl("kicker")}</Kicker>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{tl("headline")}</h1>
          <p className="mt-4 text-lg text-[--color-ink-muted]">{t("lead")}</p>
        </div>

        {/* FREE DIAGNOSTIC FORM — above all paid options */}
        <div className="mx-auto mt-10 max-w-3xl">
          <LeakTestForm />
        </div>
      </Section>

      {/* PROMO HOOK */}
      <Section className="py-8">
        <div className="surface rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-[--color-accent]">{tl("promoTitle")}</p>
          <p className="mx-auto mt-2 max-w-2xl text-lg">{PROMO_HOOK_TEXT}</p>
        </div>
      </Section>

      {/* PAID TIERS */}
      <Section>
        <h2 className="font-display text-3xl font-extrabold">{t("tiersTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlight ? "border border-[--color-accent]/40" : ""}>
              <h3 className="font-display text-lg font-bold">{tier.name}</h3>
              <div className="mt-2">
                {tier.promo ? (
                  <div>
                    <span className="font-display text-2xl font-extrabold text-[--color-accent]">{tier.promo}</span>
                    <span className="ml-2 text-sm text-[--color-ink-muted] line-through">{tier.price}</span>
                  </div>
                ) : (
                  <span className="font-display text-2xl font-extrabold text-[--color-secondary]">{tier.price}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-[--color-ink-muted]">{tier.desc}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[--color-accent]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <LinkButton href="/contact" variant="secondary">
            {tc("bookCall")} <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
