export type ViewState =
  | 'HOME'
  | 'ABOUT'
  | 'ECONOMIC_INTELLIGENCE'
  | 'ECONOMIC_AUDITS'
  | 'CASE_STUDIES'
  | 'WHITE_PAPERS'
  | 'PRICING'
  | 'PLATFORM'
  | 'CONTACT'
  | 'LEAK_TEST'
  | 'PRIVACY';

export interface AuditInput {
  assetName: string;
  assetType: 'SOLAR' | 'WIND' | 'BESS' | 'HYBRID' | 'GAS_TURBINE' | 'INDUSTRIAL';
  capacityMW: number;
  annualOpHours: number;
  country: string;
  gridTariffUSD: number; // in USD per MWh
}

export interface AuditResult {
  efficiencyScore: number; // e.g. 74%
  leakageUSD: number; // in USD
  potentialRevenueUSD: number; // in USD
  recoveredValueUSD: number; // in USD
  breakdown: {
    delayedDispatch: number;
    rampRateFine: number;
    socDrift: number;
    untrackedOutages: number;
  };
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DispatchStatus {
  timestamp: string;
  loadMW: number;
  bessChargeMW: number; // positive = charging, negative = discharging
  solarMW: number;
  gridPriceUSD: number;
  traditionalCostUSD: number;
  predaiotCostUSD: number;
  savingsUSD: number;
}
