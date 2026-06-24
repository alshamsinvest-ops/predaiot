import { PRIMARY } from "./constants";

/**
 * Value-recovery estimator. Every dynamic figure shown to a visitor scales
 * linearly from the published PRIMARY benchmark (862,903 OMR per 500 MW),
 * so no number on the site can drift from its cited source.
 */
export interface ValueEstimate {
  capacityMW: number;
  annualRecoveryOMR: number;
  profitMinPct: number;
  profitMaxPct: number;
  /** Conservative floor shown in the guarantee (5%). */
  guaranteedFloorOMR: number;
}

const OMR_PER_MW = PRIMARY.annualRevenueOMR / PRIMARY.assetMW; // ≈ 1,725.8 OMR/MW

export function estimateValue(capacityMW: number): ValueEstimate {
  const mw = Number.isFinite(capacityMW) && capacityMW > 0 ? capacityMW : PRIMARY.assetMW;
  const annual = Math.round(OMR_PER_MW * mw);
  return {
    capacityMW: mw,
    annualRecoveryOMR: annual,
    profitMinPct: PRIMARY.profitMin,
    profitMaxPct: PRIMARY.profitMax,
    // 5% recoverable-value floor referenced in the written guarantee,
    // expressed against the modelled recovery envelope.
    guaranteedFloorOMR: Math.round(annual * (5 / PRIMARY.profitMin)),
  };
}

/** Illustrative default used when a visitor has no data ("scaled from benchmark"). */
export const BENCHMARK_ESTIMATE = estimateValue(PRIMARY.assetMW);
