/**
 * PREDAIOT — CONTENT & NUMBER GOVERNANCE (single source of truth)
 * =================================================================
 * Every economic figure shown anywhere on the site MUST come from this file.
 *
 * BANNED — never generate these anywhere on the site:
 *   - "10+ Years Operational Data"
 *   - "Millions of Data Points Processed"
 *   - "SOC2 Ready" / any compliance badge not actually held
 *   - "Series A" or any funding claim beyond pre-seed
 *   - Fabricated case-study numbers (e.g. "99.2% availability / 76.3% efficiency")
 *   - Any pre-filled login with a real Oman company name
 *   - Any pricing other than the exact figures in PRICING below
 *
 * Only the figures below are permitted. PRIMARY figures are for the homepage
 * hero, the case study, and audit defaults. SECONDARY figures are for
 * technical pages ONLY and must always carry the SECONDARY.label disclaimer.
 */

export const COMPANY = {
  name: "PREDAIOT",
  legalTagline: "Economic Decision Intelligence for Energy Assets",
  domain: "preda-iot.com",
  url: "https://preda-iot.com",
  founder: "Chams Eddine Madi",
  founderRole: "Founder & CEO",
  email: "chams@preda-iot.com",
  phoneDisplay: "+968 7411 4028",
  phoneE164: "+96874114028",
  whatsappNumber: "96874114028",
  location: "Muscat, Sultanate of Oman",
} as const;

/** PRIMARY economic figures — homepage hero, case study, audit defaults. */
export const PRIMARY = {
  annualRevenueOMR: 862903, // OMR additional annual revenue
  assetMW: 500, // per 500 MW asset
  profitMin: 9.1, // %
  profitMax: 15, // %
  capex: 0,
  citation:
    "Published methodology — PREDAIOT, Oman National Open Data Portal, June 2026",
  citationLink:
    "https://opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f",
  // Supporting figures
  smpOMRPerMWh: 9.12, // System Marginal Price 2024
  scarcityOMRPerMWh: 4.022, // Scarcity Price
  subsidy2024OMR: 602_300_000, // Government subsidy 2024 = 602.3M OMR
} as const;

/** SECONDARY figures — technical pages ONLY, always labeled. */
export const SECONDARY = {
  label: "Peak-case internal simulation — smaller asset class",
  upliftMaxPct: 25, // up to 25%
  upliftUSD: 108_000, // ~$108K per year
  solarMW: 10,
  batteryMWh: 15,
  hours: 8760, // real Oman data
} as const;

/** OMR → USD indicative rate for small secondary display only. */
export const OMR_TO_USD = 2.6;

export const PRICING = {
  free: { omr: 0 },
  audit: {
    minOMR: 2500,
    maxOMR: 3000,
    promoMinOMR: 1250,
    promoMaxOMR: 1500,
    promoFirstClients: 10,
    promoWindowDays: 14,
    deliveryDays: 7,
    analysisHours: 8760,
  },
  pilot: { fromOMR: 20000, durationDays: 90 },
  deployment: { predaiotPct: 40, clientPct: 60, upfrontOMR: 0 },
} as const;

/** Exact guarantee text — do not alter wording. */
export const GUARANTEE_TEXT =
  "If we don't find at least 5% in recoverable value in your free week, we'll tell you so in writing — no audit needed, no cost, ever.";

/** Exact promo hook text — do not alter wording. */
export const PROMO_HOOK_TEXT =
  "Lock in the full audit at 50% off — 1,250–1,500 OMR instead of 2,500–3,000 OMR — first 10 clients only, or within 14 days.";

/** The ONLY trust items permitted. No fabricated logos or testimonials. */
export const REAL_TRACTION = [
  { key: "patent", en: "Patent filed (Tunisia)", ar: "براءة اختراع مودعة (تونس)" },
  { key: "omantel", en: "Omantel Accelerator, Cohort 7", ar: "مسرّعة عمانتل، الدفعة 7" },
  { key: "loi", en: "Signed LOI with Sunified (GCC)", ar: "خطاب نوايا موقّع مع Sunified (الخليج)" },
  {
    key: "opendata",
    en: "Methodology published on Oman's National Open Data Portal",
    ar: "منهجية منشورة على البوابة الوطنية للبيانات المفتوحة في عُمان",
  },
  {
    key: "oetc",
    en: "Active technical dialogue with OETC Load Dispatch Centre",
    ar: "حوار فني نشِط مع مركز التحكم في الأحمال OETC",
  },
  { key: "stage", en: "Pre-revenue, pre-seed stage", ar: "مرحلة ما قبل الإيرادات وما قبل التأسيس" },
] as const;

export const INDUSTRIES = [
  "utilities",
  "solar",
  "bess",
  "industrial",
  "oilgas",
  "infrastructure",
] as const;

/** Airtable destination for all leads (web + WhatsApp = one pipeline). */
export const AIRTABLE = {
  baseId: "appeUbnHpGamghy8q",
  leadsTableId: "tbl6r1kqhvRN4IDgI",
  source: "Website Free Diagnostic",
  stage: "🎯 Target",
} as const;

/** Exact Claude system prompt for the PREDAIOT Copilot (per brief). */
export const COPILOT_SYSTEM_PROMPT = `You are PREDAIOT's Economic Decision Copilot. You help energy asset operators in Oman/GCC understand economic dispatch optimization, BESS performance, and the value of economic audits. You know PREDAIOT's methodology is based on published Oman market data. You can estimate potential value recovery based on asset type and capacity, and guide users toward booking a free diagnostic. Never fabricate client results or claim live deployments. Keep responses concise and data-driven.`;

export const COPILOT = {
  name: "PREDAIOT Copilot",
  model: "claude-sonnet-4-6",
  poweredBy: "Powered by Claude",
  suggestedPrompts: [
    "Estimate my battery's optimization potential",
    "What is economic vs. technical efficiency?",
    "How does the free diagnostic work?",
    "Generate a sample audit summary",
  ],
} as const;

export const ASSET_TYPES = [
  "Solar PV",
  "BESS (Battery Storage)",
  "Solar + Storage",
  "Industrial Load",
  "Oil & Gas Facility",
  "Grid / Utility",
  "Other",
] as const;

/** Format helpers */
export const fmtOMR = (n: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(n));

export const omrToUsd = (omr: number) => Math.round(omr * OMR_TO_USD);
