// ── ASSET DATA ──────────────────────────────────────────────────────────────

export interface AssetTelemetry {
  asset_id: string;
  client_id: string;
  timestamp: string;

  soc_percent: number;
  soc_mwh: number;
  charge_rate_mw: number;
  discharge_rate_mw: number;

  solar_mw: number;
  wind_mw?: number;
  diesel_mw?: number;

  grid_import_mw: number;
  grid_export_mw: number;
  grid_price_omr_mwh: number;

  curtailment_signal: boolean;
  frequency_hz?: number;
  voltage_kv?: number;
}

export interface AssetConfig {
  asset_id: string;
  client_id: string;
  client_name: string;
  asset_name: string;

  power_capacity_mw: number;
  energy_capacity_mwh: number;
  round_trip_efficiency: number;
  charge_efficiency: number;
  discharge_efficiency: number;
  min_soc_percent: number;
  max_soc_percent: number;
  degradation_rate_per_cycle: number;

  solar_capacity_mwp: number;
  dc_ac_ratio: number;
  tracker_type: "fixed" | "sat" | "dat";
  bifacial: boolean;
  performance_ratio: number;

  grid_connection_mw: number;
  location: "MIS" | "DIAM" | "isolated";
}

// ── ECONOMIC DECISION ────────────────────────────────────────────────────────

export type DecisionAction = "CHARGE" | "DISCHARGE" | "HOLD" | "ABSORB";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface EconomicDecision {
  timestamp: string;
  asset_id: string;

  action: DecisionAction;
  reason: string;
  confidence_percent: number;
  confidence_level: ConfidenceLevel;

  omr_impact_per_decision: number;
  omr_impact_annual_projected: number;

  V_charge: number;
  V_discharge: number;
  V_hold: number;
  V_absorb: number;

  price_now: number;
  price_forecast_peak_8h: number;
  price_forecast_min_4h: number;
  soc_at_decision: number;
  solar_at_decision: number;

  ems_action: DecisionAction;
  ems_divergence: boolean;
  ems_opportunity_cost_omr: number;

  autonomy_level: number;
  executed: boolean;
}

// ── ECONOMIC PERFORMANCE ─────────────────────────────────────────────────────

export interface EconomicPerformance {
  asset_id: string;
  period_start: string;
  period_end: string;

  actual_revenue_omr: number;
  optimal_revenue_omr: number;
  ems_revenue_omr: number;

  economic_decision_gap_omr: number;
  intelligence_premium_omr: number;
  hardware_gap_omr: number;

  eei: number;
  vrr: number;

  total_decisions: number;
  charge_decisions: number;
  discharge_decisions: number;
  hold_decisions: number;
  ems_divergences: number;

  curtailment_mwh: number;
  curtailment_percent: number;
  arbitrage_mwh: number;
  curtailment_converted_mwh: number;
}

// ── CLIENT CONFIG ─────────────────────────────────────────────────────────────

export interface ClientConfig {
  client_id: string;
  client_name: string;
  api_key: string;
  autonomy_level: number;
  autonomy_confidence_threshold: number;
  assets: AssetConfig[];
  timezone: string;
  currency: "OMR" | "USD" | "EUR";
  plan: "diagnostic" | "audit" | "pilot" | "deployment";
}
