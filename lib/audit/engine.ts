import { PRIMARY } from "@/lib/constants";

/**
 * PREDAIOT Economic Decision engine — implements the published/patented method:
 *
 *   Financial_Loss = Σ (P_expected − P_actual) × Market_Price
 *
 * accumulated over every period in the asset's data. A maintenance/dispatch
 * action is economically justified when the accumulated Financial_Loss meets or
 * exceeds the intervention cost (patent claim 2). This turns raw telemetry into
 * a real recoverable-value figure — not a marketing estimate.
 *
 * Market price defaults to Oman's published System Marginal Price
 * (PRIMARY.smpOMRPerMWh) when the data has no price column.
 */

export interface AuditInput {
  rows: Record<string, string | number>[];
  capacityMW?: number;
  /** Override market price (OMR/MWh). Defaults to published SMP. */
  pricePerMWh?: number;
}

export interface AuditResult {
  ok: boolean;
  method: string;
  periods: number;
  energyExpectedMWh: number;
  energyActualMWh: number;
  energyGapMWh: number;
  avgPriceOMRPerMWh: number;
  financialLossOMR: number;
  /** Recoverable value as % of actual realized revenue. */
  recoverablePct: number;
  /** True when we used a real expected-vs-actual gap from the data. */
  measured: boolean;
  notes: string[];
}

const NORM = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const MATCH = {
  timestamp: ["timestamp", "time", "datetime", "date", "hour", "period"],
  expected: ["expected", "pexp", "baseline", "nameplate", "theoretical", "target", "potential", "forecast"],
  actual: ["actual", "measured", "pactual", "output", "generation", "production", "real", "delivered", "energy", "mwh", "mw"],
  price: ["price", "marketprice", "smp", "tariff", "omrmwh", "omr", "value"],
};

function findColumn(headers: string[], keys: string[]): string | null {
  const normalized = headers.map((h) => ({ raw: h, n: NORM(h) }));
  for (const key of keys) {
    const hit = normalized.find((h) => h.n === key) || normalized.find((h) => h.n.includes(key));
    if (hit) return hit.raw;
  }
  return null;
}

const num = (v: unknown): number => {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

export function computeAudit({ rows, capacityMW, pricePerMWh }: AuditInput): AuditResult {
  const notes: string[] = [];
  const defaultPrice = pricePerMWh ?? PRIMARY.smpOMRPerMWh;

  if (!rows.length) {
    return emptyResult("No data rows found.");
  }

  const headers = Object.keys(rows[0]);
  const colActual = findColumn(headers, MATCH.actual);
  const colExpected = findColumn(headers, MATCH.expected);
  const colPrice = findColumn(headers, MATCH.price);

  if (!colActual) {
    return emptyResult("Could not find a generation/output column in your data.");
  }

  let expectedSum = 0;
  let actualSum = 0;
  let lossOMR = 0;
  let priceSum = 0;
  let priceCount = 0;
  let periods = 0;

  // If no expected column, derive an expected baseline from the data's own
  // high-performance envelope (95th-percentile output) — clearly an estimate.
  let baseline = 0;
  const measured = Boolean(colExpected);
  if (!measured) {
    const outs = rows.map((r) => num(r[colActual])).filter(Number.isFinite).sort((a, b) => a - b);
    baseline = outs.length ? outs[Math.floor(outs.length * 0.95)] : 0;
    notes.push(
      "No 'expected' column found — expected performance estimated from the 95th-percentile of your own output. Provide an expected/baseline column for an exact audit."
    );
  }

  for (const r of rows) {
    const actual = num(r[colActual]);
    if (!Number.isFinite(actual)) continue;
    const expected = measured ? num(r[colExpected as string]) : baseline;
    if (!Number.isFinite(expected)) continue;
    const price = colPrice ? num(r[colPrice]) : defaultPrice;
    const p = Number.isFinite(price) ? price : defaultPrice;

    const gap = Math.max(0, expected - actual); // only count under-performance
    expectedSum += expected;
    actualSum += actual;
    lossOMR += gap * p; // Financial_Loss = (P_exp − P_actual) × Market_Price
    priceSum += p;
    priceCount += 1;
    periods += 1;
  }

  if (periods === 0) return emptyResult("No numeric performance values could be read.");

  const avgPrice = priceSum / priceCount;
  const actualRevenue = actualSum * avgPrice;
  const recoverablePct = actualRevenue > 0 ? (lossOMR / actualRevenue) * 100 : 0;

  if (capacityMW && capacityMW > 0) {
    notes.push(`Asset capacity: ${capacityMW} MW.`);
  }
  if (!colPrice) {
    notes.push(`Market price defaulted to Oman SMP ${PRIMARY.smpOMRPerMWh} OMR/MWh (published).`);
  }

  return {
    ok: true,
    method: "Financial_Loss = Σ (P_expected − P_actual) × Market_Price (PREDAIOT patented Economic Decision method)",
    periods,
    energyExpectedMWh: round(expectedSum),
    energyActualMWh: round(actualSum),
    energyGapMWh: round(expectedSum - actualSum),
    avgPriceOMRPerMWh: round(avgPrice, 3),
    financialLossOMR: Math.round(lossOMR),
    recoverablePct: round(recoverablePct, 1),
    measured,
    notes,
  };
}

function emptyResult(reason: string): AuditResult {
  return {
    ok: false,
    method: "Financial_Loss = Σ (P_expected − P_actual) × Market_Price",
    periods: 0,
    energyExpectedMWh: 0,
    energyActualMWh: 0,
    energyGapMWh: 0,
    avgPriceOMRPerMWh: 0,
    financialLossOMR: 0,
    recoverablePct: 0,
    measured: false,
    notes: [reason],
  };
}

const round = (n: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};
