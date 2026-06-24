/**
 * Curated industrial / energy photography (solar fields, storage, grid,
 * control rooms). Served via next/image with a dark navy overlay — never
 * generic SaaS stock. Centralized so imagery stays consistent and on-brand.
 */
export interface Img {
  src: string;
  alt: { en: string; ar: string };
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

export const IMAGES = {
  solarField: {
    src: U("photo-1509391366360-2e959784a276"),
    alt: { en: "Utility-scale solar field at dusk", ar: "حقل طاقة شمسية على نطاق المرافق عند الغروب" },
  },
  solarAerial: {
    src: U("photo-1466611653911-95081537e5b7"),
    alt: { en: "Aerial view of a solar panel array", ar: "منظر جوي لمصفوفة ألواح شمسية" },
  },
  grid: {
    src: U("photo-1473341304170-971dccb5ac1e"),
    alt: { en: "High-voltage transmission grid at dusk", ar: "شبكة نقل عالية الجهد عند الغروب" },
  },
  industrial: {
    src: U("photo-1518709268805-4e9042af9f23"),
    alt: { en: "Industrial energy facility at night", ar: "منشأة طاقة صناعية ليلاً" },
  },
  controlRoom: {
    src: U("photo-1551288049-bebda4e38f71"),
    alt: { en: "Operations analytics and control dashboards", ar: "لوحات تحليلات وتحكم في العمليات" },
  },
  windSolar: {
    src: U("photo-1497435334941-8c899ee9e8e9"),
    alt: { en: "Renewable energy landscape", ar: "مشهد للطاقة المتجددة" },
  },
} satisfies Record<string, Img>;
