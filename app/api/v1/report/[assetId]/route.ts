import { NextRequest, NextResponse } from "next/server";
import { PREDAIOT_BENCHMARKS } from "@/lib/constants";
import type { EconomicPerformance } from "@/types/energy";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;

  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - 365 * 24 * 60 * 60 * 1000);

  // Demo aggregate — values pulled from validated benchmarks (Sinaw-class).
  // In production this is computed from the persisted decision log for the
  // requested asset and period.
  const performance: EconomicPerformance = {
    asset_id: assetId,
    period_start: periodStart.toISOString(),
    period_end: periodEnd.toISOString(),
    actual_revenue_omr: PREDAIOT_BENCHMARKS.SCENARIO_B_REVENUE,
    optimal_revenue_omr: PREDAIOT_BENCHMARKS.SCENARIO_C_REVENUE,
    ems_revenue_omr: PREDAIOT_BENCHMARKS.SCENARIO_B_REVENUE,
    economic_decision_gap_omr: PREDAIOT_BENCHMARKS.ECONOMIC_DECISION_GAP,
    intelligence_premium_omr: PREDAIOT_BENCHMARKS.INTELLIGENCE_PREMIUM,
    hardware_gap_omr:
      PREDAIOT_BENCHMARKS.SCENARIO_B_REVENUE - PREDAIOT_BENCHMARKS.SCENARIO_A_REVENUE,
    eei: PREDAIOT_BENCHMARKS.EEI_PREDAIOT,
    vrr: 1.0,
    total_decisions: PREDAIOT_BENCHMARKS.DECISIONS_PER_DAY * 365,
    charge_decisions: Math.round(PREDAIOT_BENCHMARKS.DECISIONS_PER_DAY * 365 * 0.32),
    discharge_decisions: Math.round(
      PREDAIOT_BENCHMARKS.DECISIONS_PER_DAY * 365 * 0.28,
    ),
    hold_decisions: Math.round(PREDAIOT_BENCHMARKS.DECISIONS_PER_DAY * 365 * 0.4),
    ems_divergences: Math.round(PREDAIOT_BENCHMARKS.DECISIONS_PER_DAY * 365 * 0.41),
    curtailment_mwh: PREDAIOT_BENCHMARKS.CURTAILMENT_PREDAIOT,
    curtailment_percent: 0.96,
    arbitrage_mwh: 224_000,
    curtailment_converted_mwh:
      PREDAIOT_BENCHMARKS.CURTAILMENT_BASELINE -
      PREDAIOT_BENCHMARKS.CURTAILMENT_PREDAIOT,
  };

  return NextResponse.json({ performance });
}
