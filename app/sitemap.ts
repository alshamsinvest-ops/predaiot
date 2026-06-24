import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/constants";
import { locales } from "@/i18n/routing";

const ROUTES = [
  "",
  "/economic-audit",
  "/bess",
  "/solar",
  "/technology",
  "/industries",
  "/security",
  "/privacy-policy",
  "/cases",
  "/papers",
  "/investors",
  "/pricing",
  "/about",
  "/contact",
  "/login",
  "/portal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${COMPANY.url}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l === "ar" ? "ar-OM" : "en", `${COMPANY.url}/${l}${route}`])
        ),
      },
    }))
  );
}
