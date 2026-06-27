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
  linkedin: "https://www.linkedin.com/in/chams-eddine-madi-74b407379/",
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

/** Guarantee text — money-back, OMR-based threshold. */
export const GUARANTEE_TEXT =
  "If we don't identify at least 20,000 OMR in annual recoverable value — you pay nothing. In writing.";

/** The ONLY trust items permitted — verified, recent. */
export const REAL_TRACTION = [
  {
    key: "ministry",
    icon: "🏛️",
    en: "Ministry Recognition",
    ar: "اعتراف من الوزارة",
    detailEn:
      "Methodology published on Oman National Open Data Portal — Ministry of Transport, Communications & IT — June 2026.",
    detailAr:
      "منهجية منشورة على البوابة الوطنية للبيانات المفتوحة — وزارة النقل والاتصالات وتقنية المعلومات — يونيو 2026.",
  },
  {
    key: "oetc",
    icon: "⚡",
    en: "Grid Operator Engagement",
    ar: "تواصل مع مشغّل الشبكة",
    detailEn:
      "Meeting with GM Load Dispatch Centre, OETC — operator of Oman's national transmission grid — June 2026.",
    detailAr:
      "اجتماع مع المدير العام لمركز التحكم في الأحمال OETC — مشغّل شبكة النقل الوطنية في عُمان — يونيو 2026.",
  },
  {
    key: "sas",
    icon: "🏗️",
    en: "Government Advisory",
    ar: "استشارة حكومية",
    detailEn:
      "Consultation session — SAS Center, Ministry of Transport, Communications & IT — May 2026.",
    detailAr:
      "جلسة استشارية — مركز SAS، وزارة النقل والاتصالات وتقنية المعلومات — مايو 2026.",
  },
  {
    key: "patent",
    icon: "📋",
    en: "Patent Filed",
    ar: "براءة اختراع مودعة",
    detailEn:
      "Economic Decision Engine method — patent application filed. Proprietary dispatch optimization technology.",
    detailAr:
      "طريقة محرّك القرار الاقتصادي — طلب براءة اختراع مودَع. تقنية امتلاكية لتحسين التوزيع.",
  },
  {
    key: "ctoreview",
    icon: "🔬",
    en: "Expert Technical Review",
    ar: "مراجعة فنية خبيرة",
    detailEn:
      "CTO & Director IPP/EPC Renewable Energy confirmed methodology. Technical corrections incorporated and published.",
    detailAr:
      "مدير تقني وCTO لمطوّر طاقة متجددة (IPP/EPC) أكّد المنهجية. التعديلات الفنية أُدمجت ونُشرت.",
  },
  {
    key: "energyweek",
    icon: "💬",
    en: "Industry Engagement",
    ar: "تفاعل مع القطاع",
    detailEn:
      "8 direct conversations at Oman Sustainability & Energy Week 2026. Active pipeline across utility-scale energy operators in Oman.",
    detailAr:
      "8 محادثات مباشرة في أسبوع الاستدامة والطاقة 2026. خط أنابيب نشِط مع مشغّلين على مستوى الشبكة في عُمان.",
  },
  {
    key: "gcc",
    icon: "🌍",
    en: "GCC Commercial Discussions",
    ar: "محادثات تجارية في الخليج",
    detailEn:
      "Distribution partnership discussions in progress across GCC renewable energy market.",
    detailAr:
      "محادثات شراكة توزيع جارية في سوق الطاقة المتجددة في دول الخليج.",
  },
] as const;

/** Anonymous, industry-attributed quotes — safe to display. */
export const INDUSTRY_QUOTES = [
  {
    key: "renewables",
    en: "The economic inefficiency from sub-optimized dispatch is certainly within a realistic range. Points 2 and 3 — charge timing and discharge optimization — are the hardest to control in practice.",
    ar: "عدم الكفاءة الاقتصادية الناتج عن التوزيع غير المُحسَّن يقع بالتأكيد ضمن نطاق واقعي. النقطتان 2 و3 — توقيت الشحن وتحسين التفريغ — هما الأصعب في الضبط عمليًا.",
    role: "Lead, Renewables & Emerging Technologies — Major Oman Energy Operator",
    roleAr: "قائد قسم المتجددات والتقنيات الناشئة — مشغّل طاقة كبير في عُمان",
    date: "June 2026",
  },
  {
    key: "monitoring",
    en: "There is significant value in integrating operational monitoring with economic optimization. Operationally correct decisions are not necessarily the most economically efficient.",
    ar: "هناك قيمة كبيرة في دمج المراقبة التشغيلية مع التحسين الاقتصادي. القرارات الصحيحة تشغيليًا ليست بالضرورة الأكثر كفاءة اقتصاديًا.",
    role: "Control & Monitoring Engineer — Operational Energy Facility, Oman",
    roleAr: "مهندس تحكم ومراقبة — منشأة طاقة تشغيلية، عُمان",
    date: "June 2026",
  },
  {
    key: "cto",
    en: "The methodology should account for DC/AC ratio 1.25 and single-axis tracker with bifacial modules — energy yield will get a huge boost. OETC is investing in standalone BESS targeting 3GW by 2030.",
    ar: "ينبغي أن تأخذ المنهجية بعين الاعتبار نسبة DC/AC = 1.25 وأنظمة التتبع أحادي المحور مع ألواح ثنائية الوجه — سترتفع كمية الطاقة المنتجة بشكل كبير. تستثمر OETC في بطاريات تخزين مستقلة بهدف 3 جيجاوات بحلول 2030.",
    role: "CTO & Director IPP/EPC Renewable Energy — Senior Technical Review",
    roleAr: "مدير تقني وCTO لمطوّر طاقة متجددة — مراجعة فنية كبيرة",
    date: "June 2026",
  },
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

/** Validated benchmarks — Sinaw-class 500 MW IPP, official Oman data 2022-2024. */
export const PREDAIOT_BENCHMARKS = {
  SCENARIO_A_REVENUE: 7_375_230,
  SCENARIO_B_REVENUE: 8_962_012,
  SCENARIO_C_REVENUE: 9_921_262,
  ECONOMIC_DECISION_GAP: 2_546_032,
  INTELLIGENCE_PREMIUM: 959_250,
  EEI_BASELINE: 0.743,
  EEI_EMS: 0.903,
  EEI_PREDAIOT: 1.0,
  CURTAILMENT_BASELINE: 42_750,
  CURTAILMENT_EMS: 27_360,
  CURTAILMENT_PREDAIOT: 8_208,
  DECISIONS_PER_DAY: 287,
  ARBITRAGE_CAPTURE_EMS: 0.623,
  ARBITRAGE_CAPTURE_PREDAIOT: 1.0,
  DATA_SOURCE_DEMAND: "Nama PWP MIS 2022 Hourly Demand Data",
  DATA_SOURCE_PRICING: "APSR Annual Report 2024",
  DATA_SOURCE_PORTAL:
    "opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f",
  SIMULATION_DISCLAIMER:
    "Simulation on official Oman government data. Not a live client measurement.",
} as const;

/** Format helpers */
export const fmtOMR = (n: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(n));

export const omrToUsd = (omr: number) => Math.round(omr * OMR_TO_USD);
