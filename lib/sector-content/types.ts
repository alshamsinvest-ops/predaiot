/**
 * Types for per-sector bespoke content rendered on /industries/[sector].
 * Content is split into a.ts / b.ts / c.ts (5+5+3 sectors) and merged in
 * index.ts. CONTENT GOVERNANCE: no fabricated per-sector OMR figures — copy
 * is qualitative and specific to the decisions each sector makes.
 */
export interface Bilingual {
  en: string;
  ar: string;
}

export interface SectorLeak {
  title: Bilingual;
  body: Bilingual;
}

export interface SectorLever {
  name: Bilingual;
  body: Bilingual;
}

export interface SectorFaq {
  q: Bilingual;
  a: Bilingual;
}

export interface SectorContent {
  headline: Bilingual;
  lead: Bilingual;
  leaks: SectorLeak[];
  levers: SectorLever[];
  faqs: SectorFaq[];
}
