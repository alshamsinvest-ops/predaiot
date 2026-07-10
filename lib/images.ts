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
  /** Preferred local render under public/brand/. */
  src: string;
  /** Production-verified stock shown if the local file is missing. */
  fallback: string;
}

/**
 * Slideshow ordered to the five founder-provided energy photos. Each slide
 * points at the uploaded photo in public/brand/; if a file is ever missing,
 * a verified stock photo of the same subject stands in (see SlideImage).
 *
 *   public/brand/oilgas.jpg      → Oil & Gas refinery (red/white stack, sunset)
 *   public/brand/wind.jpg        → Wind turbines at dusk
 *   public/brand/hydro.jpg       → Hydro dam + spillway
 *   public/brand/industrial.jpg  → Petrochemical / industrial plant
 *   public/brand/renewable.jpg   → Solar panels + wind turbines at sunset
 */
/**
 * SECTOR_HERO — the bespoke, founder-provided energy artwork behind every
 * /industries/[sector] hero (uploaded to public/brand/). Paths are URL-encoded
 * because the source files carry human-readable names with spaces and symbols.
 * Oil & Gas reuses the existing oilgas.jpg photograph. If a file is ever
 * missing, IndustrialImage falls back gracefully; the sector page also passes
 * IMAGES.grid as a last-resort default.
 */
export const SECTOR_HERO: Record<string, Img> = {
  oilgas: {
    src: "/brand/oilgas.jpg",
    alt: { en: "Oil & gas facility at sunset", ar: "منشأة نفط وغاز عند الغروب" },
  },
  power: {
    src: "/brand/Power%20Generation.png",
    alt: { en: "Power generation plant", ar: "محطة توليد الطاقة" },
  },
  utilities: {
    src: "/brand/Utilities.png",
    alt: { en: "Utility-scale energy infrastructure", ar: "بنية تحتية للطاقة على نطاق المرافق" },
  },
  renewables: {
    src: "/brand/Renewables.png",
    alt: { en: "Renewable energy generation", ar: "توليد الطاقة المتجددة" },
  },
  wind: {
    src: "/brand/Wind%20Energy.png",
    alt: { en: "Wind energy turbines", ar: "توربينات طاقة الرياح" },
  },
  tnd: {
    src: "/brand/Transmission%20%26%20Distribution%20%28T%26D%29.png",
    alt: { en: "Transmission & distribution network", ar: "شبكة النقل والتوزيع" },
  },
  smartgrid: {
    src: "/brand/Smart%20Grid.png",
    alt: { en: "Smart grid control", ar: "التحكم في الشبكة الذكية" },
  },
  industrial: {
    src: "/brand/Industrial.png",
    alt: { en: "Industrial energy plant", ar: "منشأة الطاقة الصناعية" },
  },
  water: {
    src: "/brand/Water.png",
    alt: { en: "Water & energy infrastructure", ar: "البنية التحتية للمياه والطاقة" },
  },
  hydrogen: {
    src: "/brand/Hydrogen.png",
    alt: { en: "Green hydrogen production", ar: "إنتاج الهيدروجين الأخضر" },
  },
  datacenters: {
    src: "/brand/Data%20Centers.png",
    alt: { en: "Data center power infrastructure", ar: "بنية الطاقة التحتية لمراكز البيانات" },
  },
  microgrids: {
    src: "/brand/microgrid.png",
    alt: { en: "Microgrid generation and storage", ar: "توليد وتخزين الشبكة المصغّرة" },
  },
  vpp: {
    src: "/brand/Virtual%20Power%20Plant%20%28VPP%29.png",
    alt: { en: "Virtual power plant fleet", ar: "أسطول محطة الطاقة الافتراضية" },
  },
};

export const SECTOR_SLIDES: SectorSlide[] = [
  { key: "oilgas", en: "Oil & Gas", ar: "النفط والغاز", src: "/brand/oilgas.jpg", fallback: U("photo-1518709268805-4e9042af9f23") },
  { key: "wind", en: "Wind", ar: "طاقة الرياح", src: "/brand/wind.jpg", fallback: U("photo-1497435334941-8c899ee9e8e9") },
  { key: "hydro", en: "Hydro Power", ar: "الطاقة الكهرومائية", src: "/brand/hydro.jpg", fallback: U("photo-1473341304170-971dccb5ac1e") },
  { key: "industrial", en: "Industrial Energy", ar: "الطاقة الصناعية", src: "/brand/industrial.jpg", fallback: U("photo-1551288049-bebda4e38f71") },
  { key: "renewables", en: "Renewables", ar: "الطاقة المتجددة", src: "/brand/renewable.jpg", fallback: U("photo-1509391366360-2e959784a276") },
];
