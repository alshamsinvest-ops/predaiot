// ════════════════════════════════════════════════════════════════════════════
// PREDAIOT ECONOMIC DECISION ENGINE
// Patent-Pending Mathematical Framework
// ════════════════════════════════════════════════════════════════════════════

import type {
  AssetConfig,
  AssetTelemetry,
  EconomicDecision,
  DecisionAction,
} from "@/types/energy";

export const OMAN_MARKET = {
  SMP_AVERAGE_2024: 9.12,
  SCARCITY_PRICE_2024: 4.022,
  PEAK_PRICE_MAX: 22.1,
  OFFPEAK_PRICE_MIN: 4.9,
  GRID_FREQUENCY_NOMINAL: 50,
  MAX_RAMP_RATE_MW_PER_MIN: 10,
} as const;

// ── EQUATION 1: CHARGE VALUE ──────────────────────────────────────────────────
// V_charge(t) = [P_forecast_max(t,t+H) × η_rt] - P_now(t) - C_deg
export function calcChargeValue(
  priceNow: number,
  priceForecastMax: number,
  config: AssetConfig,
  batteryCostOMR: number = 500_000,
  cycleLife: number = 3000,
): number {
  const eta_rt = config.round_trip_efficiency;
  const C_deg = batteryCostOMR / cycleLife / config.energy_capacity_mwh;
  return priceForecastMax * eta_rt - priceNow - C_deg;
}

// ── EQUATION 2: DISCHARGE VALUE ──────────────────────────────────────────────
// V_discharge(t) = P_now(t) - [P_avg_charge / η_rt] - C_deg
export function calcDischargeValue(
  priceNow: number,
  avgChargePricePaid: number,
  config: AssetConfig,
  batteryCostOMR: number = 500_000,
  cycleLife: number = 3000,
): number {
  const eta_rt = config.round_trip_efficiency;
  const C_deg = batteryCostOMR / cycleLife / config.energy_capacity_mwh;
  return priceNow - avgChargePricePaid / eta_rt - C_deg;
}

// ── EQUATION 3: CURTAILMENT ABSORPTION VALUE ──────────────────────────────────
// V_absorb(t) = P_forecast_max(t,t+H) × η_rt - C_deg   (P_now = 0)
export function calcAbsorbValue(
  priceForecastMax: number,
  config: AssetConfig,
  batteryCostOMR: number = 500_000,
  cycleLife: number = 3000,
): number {
  const eta_rt = config.round_trip_efficiency;
  const C_deg = batteryCostOMR / cycleLife / config.energy_capacity_mwh;
  return priceForecastMax * eta_rt - C_deg;
}

// ── EQUATION 4: ECONOMIC EFFICIENCY INDEX (EEI) ───────────────────────────────
// EEI = R_actual / R_optimal
export function calcEEI(actualRevenue: number, optimalRevenue: number): number {
  if (optimalRevenue === 0) return 0;
  return Math.min(1.0, actualRevenue / optimalRevenue);
}

// ── EQUATION 5: VALUE RECOVERY RATE (VRR) ────────────────────────────────────
// VRR = (EEI_actual - EEI_baseline) / (1 - EEI_baseline)
export function calcVRR(eeiActual: number, eeiBaseline: number = 0.743): number {
  const denominator = 1 - eeiBaseline;
  if (denominator === 0) return 1;
  return Math.min(1.0, Math.max(0, (eeiActual - eeiBaseline) / denominator));
}

// ── EQUATION 6: ARBITRAGE MARGIN ─────────────────────────────────────────────
// M_arb = P_discharge - (P_charge / η_rt) - C_deg
export function calcArbitrageMargin(
  avgDischargePrice: number,
  avgChargePrice: number,
  config: AssetConfig,
  batteryCostOMR: number = 500_000,
  cycleLife: number = 3000,
): number {
  const eta_rt = config.round_trip_efficiency;
  const C_deg = batteryCostOMR / (cycleLife * config.energy_capacity_mwh);
  return avgDischargePrice - avgChargePrice / eta_rt - C_deg;
}

// ── EQUATION 7: SOLAR GENERATION MODEL ────────────────────────────────────────
export function calcSolarOutput(
  hour: number,
  config: AssetConfig,
  season: "summer" | "winter" | "spring" = "spring",
): number {
  const seasonalOffset = season === "summer" ? -0.5 : season === "winter" ? 0.5 : 0;
  const h_sunrise = 6.0 + seasonalOffset;
  const h_sunset = 18.5 + seasonalOffset;
  if (hour <= h_sunrise || hour >= h_sunset) return 0;
  const solar_fraction = Math.sin(
    (Math.PI * (hour - h_sunrise)) / (h_sunset - h_sunrise),
  );
  const f_tracker =
    config.tracker_type === "sat" ? 1.18 : config.tracker_type === "dat" ? 1.28 : 1.0;
  const f_bifacial = config.bifacial ? 1.08 : 1.0;
  const dc_output =
    config.solar_capacity_mwp *
    solar_fraction *
    config.performance_ratio *
    f_tracker *
    f_bifacial;
  const ac_limit = config.solar_capacity_mwp / config.dc_ac_ratio;
  return Math.min(dc_output, ac_limit);
}

// ── EQUATION 8: BATTERY SOC DYNAMICS ──────────────────────────────────────────
export function calcNewSoC(
  currentSoC: number,
  action: "CHARGE" | "DISCHARGE" | "HOLD",
  powerMW: number,
  deltaHours: number,
  config: AssetConfig,
): number {
  const {
    energy_capacity_mwh,
    charge_efficiency,
    discharge_efficiency,
    min_soc_percent,
    max_soc_percent,
  } = config;
  const currentMWh = (currentSoC / 100) * energy_capacity_mwh;
  let newMWh = currentMWh;
  if (action === "CHARGE") {
    const energyIn = powerMW * deltaHours * charge_efficiency;
    newMWh = Math.min(
      currentMWh + energyIn,
      (max_soc_percent / 100) * energy_capacity_mwh,
    );
  } else if (action === "DISCHARGE") {
    const energyOut = (powerMW * deltaHours) / discharge_efficiency;
    newMWh = Math.max(
      currentMWh - energyOut,
      (min_soc_percent / 100) * energy_capacity_mwh,
    );
  }
  return (newMWh / energy_capacity_mwh) * 100;
}

// ── EQUATION 9: CURTAILMENT PROBABILITY ──────────────────────────────────────
export function calcCurtailmentProbability(
  solarMW: number,
  estimatedLoadMW: number = 2800,
  threshold: number = 0.35,
  sensitivity: number = 2.5,
): number {
  if (estimatedLoadMW === 0) return 1;
  const renewablePenetration = solarMW / estimatedLoadMW;
  return Math.min(1, Math.max(0, (renewablePenetration - threshold) * sensitivity));
}

// ── EQUATION 10: CONFIDENCE SCORE ────────────────────────────────────────────
export function calcDecisionConfidence(
  priceNow: number,
  priceThreshold: number,
  soc: number,
  socOptimal: number,
  priceForecastMean: number,
  priceForecastStd: number,
): number {
  const C_price = Math.min(1, Math.abs(priceNow - priceThreshold) / priceThreshold);
  const C_soc = Math.max(0, 1 - Math.abs(soc - socOptimal) / 50);
  const C_forecast =
    priceForecastMean > 0
      ? Math.max(0, 1 - priceForecastStd / priceForecastMean)
      : 0.5;
  const w1 = 0.4,
    w2 = 0.35,
    w3 = 0.25;
  return Math.round((w1 * C_price + w2 * C_soc + w3 * C_forecast) * 100);
}

// ── MAIN DECISION FUNCTION ────────────────────────────────────────────────────
export function makeEconomicDecision(
  telemetry: AssetTelemetry,
  config: AssetConfig,
  _priceHistory: number[],
  priceForecast: number[],
  autonomyLevel: number = 0,
  avgChargePricePaid: number = 6.5,
): EconomicDecision {
  const {
    soc_percent: soc,
    grid_price_omr_mwh: priceNow,
    solar_mw: solarMW,
    curtailment_signal,
  } = telemetry;

  const priceForecastMax = Math.max(...priceForecast);
  const priceForecastMin = Math.min(...priceForecast);
  const priceForecastMean =
    priceForecast.reduce((a, b) => a + b, 0) / priceForecast.length;
  const priceForecastStd = Math.sqrt(
    priceForecast.reduce((sum, p) => sum + (p - priceForecastMean) ** 2, 0) /
      priceForecast.length,
  );

  const V_charge = calcChargeValue(priceNow, priceForecastMax, config);
  const V_discharge = calcDischargeValue(priceNow, avgChargePricePaid, config);
  const V_absorb = calcAbsorbValue(priceForecastMax, config);
  const V_hold = 0;

  const hour = new Date(telemetry.timestamp).getHours();
  const emsAction: DecisionAction =
    hour >= 2 && hour <= 6 ? "CHARGE" : hour >= 17 && hour <= 21 ? "DISCHARGE" : "HOLD";

  const CHARGE_THRESHOLD = 6.8;
  const DISCHARGE_THRESHOLD = 11.0;

  let action: DecisionAction = "HOLD";
  let reason = "Monitoring — no economically advantageous window";
  let confidence = 65;

  if (soc <= config.min_soc_percent + 5) {
    action = "CHARGE";
    reason = `Critical SoC (${soc.toFixed(0)}%) — charging regardless of price`;
    confidence = 99;
  } else if (
    curtailment_signal &&
    soc < config.max_soc_percent - 5 &&
    V_absorb > 0
  ) {
    action = "ABSORB";
    reason = `Curtailment active — absorbing free solar for future arbitrage`;
    confidence = 96;
  } else if (priceNow < CHARGE_THRESHOLD && V_charge > 4.0 && soc < 85) {
    action = "CHARGE";
    reason = `Exceptional price (${priceNow.toFixed(2)}) + high arbitrage spread`;
    confidence = calcDecisionConfidence(
      priceNow,
      CHARGE_THRESHOLD,
      soc,
      30,
      priceForecastMean,
      priceForecastStd,
    );
  } else if (priceNow > DISCHARGE_THRESHOLD && V_discharge > 3.0 && soc > 40) {
    action = "DISCHARGE";
    reason = `Peak price (${priceNow.toFixed(2)} OMR/MWh) — maximum arbitrage value`;
    confidence = calcDecisionConfidence(
      priceNow,
      DISCHARGE_THRESHOLD,
      soc,
      80,
      priceForecastMean,
      priceForecastStd,
    );
  } else if (priceNow < 7.5 && V_charge > 1.5 && soc < 75) {
    action = "CHARGE";
    reason = `Favorable charge opportunity — building SoC for evening peak`;
    confidence = calcDecisionConfidence(
      priceNow,
      7.5,
      soc,
      40,
      priceForecastMean,
      priceForecastStd,
    );
  } else if (priceNow > 9.5 && V_discharge > 1.5 && soc > 60) {
    action = "DISCHARGE";
    reason = `Above-average price — generating while margin is positive`;
    confidence = calcDecisionConfidence(
      priceNow,
      9.5,
      soc,
      80,
      priceForecastMean,
      priceForecastStd,
    );
  } else {
    reason = `Price (${priceNow.toFixed(2)}) within range — waiting for better window`;
    confidence = 71;
  }

  const rateOMR = config.power_capacity_mw;
  const omrImpact = Math.abs(
    action === "CHARGE"
      ? V_charge * rateOMR
      : action === "DISCHARGE"
        ? V_discharge * rateOMR
        : action === "ABSORB"
          ? V_absorb * rateOMR * 0.7
          : 0,
  );

  const emsDivergence = action !== emsAction;
  const emsOpportunityCost = emsDivergence && action !== "HOLD" ? omrImpact : 0;

  return {
    timestamp: telemetry.timestamp,
    asset_id: telemetry.asset_id,
    action,
    reason,
    confidence_percent: Math.min(99, Math.max(50, confidence)),
    confidence_level: confidence > 85 ? "HIGH" : confidence > 70 ? "MEDIUM" : "LOW",
    omr_impact_per_decision: omrImpact,
    omr_impact_annual_projected: (omrImpact * 287 * 365) / 1000,
    V_charge,
    V_discharge,
    V_hold,
    V_absorb,
    price_now: priceNow,
    price_forecast_peak_8h: priceForecastMax,
    price_forecast_min_4h: priceForecastMin,
    soc_at_decision: soc,
    solar_at_decision: solarMW,
    ems_action: emsAction,
    ems_divergence: emsDivergence,
    ems_opportunity_cost_omr: emsOpportunityCost,
    autonomy_level: autonomyLevel,
    executed:
      autonomyLevel >= 95 ||
      (autonomyLevel >= 66 && confidence >= 90) ||
      (autonomyLevel >= 33 && confidence >= 95),
  };
}

// ── DEFAULT ASSET CONFIG (Demo) ───────────────────────────────────────────────
export function getDefaultConfig(assetId: string): AssetConfig {
  return {
    asset_id: assetId,
    client_id: "demo",
    client_name: "Demo Client",
    asset_name: assetId,
    power_capacity_mw: 200,
    energy_capacity_mwh: 800,
    round_trip_efficiency: 0.875,
    charge_efficiency: 0.9354,
    discharge_efficiency: 0.9354,
    min_soc_percent: 10,
    max_soc_percent: 95,
    degradation_rate_per_cycle: 0.0001,
    solar_capacity_mwp: 625,
    dc_ac_ratio: 1.25,
    tracker_type: "sat",
    bifacial: true,
    performance_ratio: 0.82,
    grid_connection_mw: 500,
    location: "MIS",
  };
}
