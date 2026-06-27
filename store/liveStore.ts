import { create } from "zustand";
import type {
  AssetTelemetry,
  EconomicDecision,
  EconomicPerformance,
  ClientConfig,
} from "@/types/energy";

export type ApiStatus = "CONNECTED" | "CONNECTING" | "ERROR" | "DEMO";

interface LiveState {
  connected: boolean;
  apiStatus: ApiStatus;

  client: ClientConfig | null;
  selectedAssetId: string | null;

  telemetry: AssetTelemetry | null;
  currentDecision: EconomicDecision | null;
  decisionLog: EconomicDecision[];

  performance: EconomicPerformance | null;
  omrRecoveredSession: number;
  omrGapToday: number;
  eei: number;

  autonomyLevel: number;

  priceHistory: { hour: number; price: number; label: string }[];
  priceForecast: { hour: number; price: number; upper: number; lower: number }[];

  setAutonomy: (level: number) => void;
  updateTelemetry: (data: AssetTelemetry) => void;
  addDecision: (decision: EconomicDecision) => void;
  setConnected: (status: boolean) => void;
  setApiStatus: (status: ApiStatus) => void;
  setPriceHistory: (
    history: { hour: number; price: number; label: string }[],
  ) => void;
  setPriceForecast: (
    forecast: { hour: number; price: number; upper: number; lower: number }[],
  ) => void;
  incrementOmrRecovered: (amount: number) => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  connected: false,
  apiStatus: "DEMO",
  client: null,
  selectedAssetId: "BESS-01",
  telemetry: null,
  currentDecision: null,
  decisionLog: [],
  performance: null,
  omrRecoveredSession: 8340,
  omrGapToday: 1247,
  eei: 74.3,
  autonomyLevel: 0,
  priceHistory: [],
  priceForecast: [],

  setAutonomy: (level) => set({ autonomyLevel: level }),
  updateTelemetry: (data) => set({ telemetry: data }),
  addDecision: (decision) =>
    set((state) => ({
      currentDecision: decision,
      decisionLog: [decision, ...state.decisionLog].slice(0, 100),
      eei: Math.min(
        100,
        Math.max(60, state.eei + (decision.action !== "HOLD" ? 0.05 : -0.02)),
      ),
      omrRecoveredSession:
        decision.action !== "HOLD"
          ? state.omrRecoveredSession +
            Math.round(decision.omr_impact_per_decision)
          : state.omrRecoveredSession,
      omrGapToday: decision.ems_divergence
        ? state.omrGapToday +
          Math.round(decision.ems_opportunity_cost_omr * 0.3)
        : state.omrGapToday,
    })),
  setConnected: (status) => set({ connected: status }),
  setApiStatus: (status) => set({ apiStatus: status }),
  setPriceHistory: (history) => set({ priceHistory: history }),
  setPriceForecast: (forecast) => set({ priceForecast: forecast }),
  incrementOmrRecovered: (amount) =>
    set((state) => ({ omrRecoveredSession: state.omrRecoveredSession + amount })),
}));
