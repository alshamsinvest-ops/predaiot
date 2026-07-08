import type { Metadata } from "next";
import { COMPANY, POSITIONING, SECTORS } from "./constants";
import { locales } from "@/i18n/routing";

const BASE = COMPANY.url;

interface PageMetaInput {
  locale: string;
  path: string; // e.g. "/economic-audit" (no locale prefix)
  title: string;
  description: string;
  image?: string;
}

/** Per-page metadata with OG + Twitter + hreflang alternates. */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = "/og/predaiot-og.jpg",
}: PageMetaInput): Metadata {
  const url = `${BASE}/${locale}${path === "/" ? "" : path}`;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    const tag = l === "ar" ? "ar-OM" : "en";
    languages[tag] = `${BASE}/${l}${path === "/" ? "" : path}`;
  }

  return {
    metadataBase: new URL(BASE),
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      siteName: COMPANY.name,
      title,
      description,
      locale: locale === "ar" ? "ar_OM" : "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Site-wide Organization schema. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: BASE,
    email: COMPANY.email,
    telephone: COMPANY.phoneDisplay,
    founder: { "@type": "Person", name: COMPANY.founder, jobTitle: COMPANY.founderRole },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Muscat",
      addressCountry: "OM",
    },
    description: `${COMPANY.legalTagline}. ${POSITIONING.oneLiner}`,
    areaServed: ["OM", "GCC"],
    knowsAbout: SECTORS.map((s) => s.en),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    provider: { "@type": "Organization", name: COMPANY.name, url: BASE },
    areaServed: ["OM", "GCC"],
    description,
    url: `${BASE}${path}`,
  };
}

export function articleJsonLd(headline: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: { "@type": "Organization", name: COMPANY.name },
    publisher: { "@type": "Organization", name: COMPANY.name },
    url: `${BASE}${path}`,
  };
}
