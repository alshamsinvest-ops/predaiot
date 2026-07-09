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

/**
 * SECTOR_SLIDES — cinematic full-bleed slideshow across the whole energy
 * value chain (SectorShowcase). Auto cross-fades every few seconds.
 *
 * TO GO 8K: generate each sector's image from the prompts in
 * docs/BRAND_REDESIGN.md, save it as `public/brand/sectors/{key}.jpg`
 * (e.g. public/brand/sectors/oilgas.jpg), then set that slide's `src` to
 * `/brand/sectors/{key}.jpg`. No other change needed — the component and
 * labels update automatically. The current `src` values are curated
 * placeholders so the slideshow works today.
 */
export interface SectorSlide {
  key: string;
  en: string;
  ar: string;
  /** Preferred local 8K render at public/brand/sectors/{key}.jpg. */
  src: string;
  /** Production-verified stock shown until the local file exists. */
  fallback: string;
}

/**
 * Slideshow ordered to the five founder-provided energy photos. Each slide
 * points at a local render — drop the real photo at the path below and it
 * shows immediately; until then a verified stock photo of the same subject
 * stands in (see SlideImage).
 *
 *   public/brand/sectors/oilgas.jpg      → Oil & Gas refinery (red/white stack, sunset)
 *   public/brand/sectors/wind.jpg        → Wind turbines at dusk
 *   public/brand/sectors/hydro.jpg       → Hydro dam + spillway
 *   public/brand/sectors/industrial.jpg  → Petrochemical / industrial plant
 *   public/brand/sectors/renewables.jpg  → Solar panels + wind turbines at sunset
 */
export const SECTOR_SLIDES: SectorSlide[] = [
  { key: "oilgas", en: "Oil & Gas", ar: "النفط والغاز", src: "/brand/sectors/oilgas.jpg", fallback: U("photo-1518709268805-4e9042af9f23") },
  { key: "wind", en: "Wind", ar: "طاقة الرياح", src: "/brand/sectors/wind.jpg", fallback: U("photo-1497435334941-8c899ee9e8e9") },
  { key: "hydro", en: "Hydro Power", ar: "الطاقة الكهرومائية", src: "/brand/sectors/hydro.jpg", fallback: U("photo-1473341304170-971dccb5ac1e") },
  { key: "industrial", en: "Industrial Energy", ar: "الطاقة الصناعية", src: "/brand/sectors/industrial.jpg", fallback: U("photo-1551288049-bebda4e38f71") },
  { key: "renewables", en: "Renewables", ar: "الطاقة المتجددة", src: "/brand/sectors/renewables.jpg", fallback: U("photo-1509391366360-2e959784a276") },
];
