import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { COMPANY } from "@/lib/constants";
import { organizationJsonLd } from "@/lib/seo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import JsonLd from "@/components/JsonLd";
import { MotionProvider } from "@/components/kinetic/MotionProvider";
import { Analytics } from "@vercel/analytics/next";

// IBM Plex Sans — display + body. Industrial geometric sans, no luxury serif.
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});
// IBM Plex Mono — economic numbers, IDs, chrome. Precision-instrument feel.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default: `${COMPANY.name} — ${COMPANY.legalTagline}`,
    template: `%s · ${COMPANY.name}`,
  },
  description: COMPANY.legalTagline,
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png" }],
    apple: "/brand/favicon.png",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${plex.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">
        <JsonLd data={organizationJsonLd()} />
        <NextIntlClientProvider>
          <MotionProvider>
            <Header locale={locale} />
            <main id="main">{children}</main>
            <Footer />
            <WhatsAppFloat />
          </MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
