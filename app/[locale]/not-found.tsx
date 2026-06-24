import { getTranslations } from "next-intl/server";
import { Section, LinkButton } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("nav");
  return (
    <Section className="pt-24 text-center">
      <h1 className="font-display text-6xl font-extrabold text-[--color-secondary]">404</h1>
      <p className="mt-4 text-[--color-ink-muted]">Page not found.</p>
      <div className="mt-8 flex justify-center">
        <LinkButton href="/" variant="accent">
          {t("home")}
        </LinkButton>
      </div>
    </Section>
  );
}
