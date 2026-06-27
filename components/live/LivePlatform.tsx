"use client";

import { useEffect, useState } from "react";
import { Cpu, Gauge, LineChart, Plug } from "lucide-react";
import { useLiveStore } from "@/store/liveStore";
import {
  makeEconomicDecision,
  getDefaultConfig,
  calcSolarOutput,
} from "@/lib/economic-engine";
import { getRealtimePrice, getPriceForecast } from "@/lib/price-model";
import EconomicEngine from "./EconomicEngine";
import EconomicRadar from "./EconomicRadar";
import AutonomySlider from "./AutonomySlider";
import GapMeter from "./GapMeter";
import AssetStatus from "./AssetStatus";
import DecisionLog from "./DecisionLog";
import PriceRadar from "./PriceRadar";
import RevenueComparison from "./RevenueComparison";
import APIPanel from "./APIPanel";
import { PREDAIOT_BENCHMARKS, fmtOMR } from "@/lib/constants";

type Tab = "overview" | "engine" | "economics" | "api";

const TABS: { key: Tab; label: string; icon: typeof Gauge }[] = [
  { key: "overview", label: "Overview", icon: Gauge },
  { key: "engine", label: "Engine", icon: Cpu },
  { key: "economics", label: "Economics", icon: LineChart },
  { key: "api", label: "API", icon: Plug },
];

const EMS_VS_PREDAIOT = [
  { metric: "Decision basis", ems: "Fixed time schedule", predaiot: "Real-time economic signals" },
  { metric: "Price awareness", ems: "None", predaiot: "Live SMP every minute" },
  { metric: "Curtailment response", ems: "Passive — wasted", predaiot: "Active — converted to arbitrage" },
  { metric: "Autonomy control", ems: "Binary (manual / auto)", predaiot: "0–100% gradient slider" },
  { metric: "Financial visibility", ems: "None", predaiot: "Live OMR counter + gap meter" },
  { metric: "EMS comparison", ems: "N/A", predaiot: "Real-time divergence alerts" },
  { metric: "Decision explanation", ems: "None", predaiot: "Full rationale + confidence %" },
  { metric: "API integration", ems: "Proprietary SCADA", predaiot: "REST + SSE — open standard" },
  { metric: "Forecast horizon", ems: "None", predaiot: "8-hour price forecast" },
  {
    metric: "Annual value added",
    ems: "0 OMR",
    predaiot: `${fmtOMR(PREDAIOT_BENCHMARKS.INTELLIGENCE_PREMIUM)} OMR / asset / year`,
  },
];

export default function LivePlatform({ locale }: { locale: string }) {
  const updateTelemetry = useLiveStore((s) => s.updateTelemetry);
  const addDecision = useLiveStore((s) => s.addDecision);
  const autonomyLevel = useLiveStore((s) => s.autonomyLevel);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const isAr = locale === "ar";

  useEffect(() => {
    const config = getDefaultConfig("BESS-01");
    let currentSoC = 62;
    let avgChargePricePaid = 6.2;

    const tick = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const price = getRealtimePrice(h, m);
      const solar = calcSolarOutput(h, config);
      const { forecast } = getPriceForecast(h);

      const telemetry = {
        asset_id: "BESS-01",
        client_id: "demo",
        timestamp: now.toISOString(),
        soc_percent: currentSoC,
        soc_mwh: (currentSoC / 100) * config.energy_capacity_mwh,
        charge_rate_mw: 0,
        discharge_rate_mw: 0,
        solar_mw: solar,
        grid_import_mw: 0,
        grid_export_mw: 0,
        grid_price_omr_mwh: price,
        curtailment_signal:
          h >= 11 && h <= 14 && solar > 400 && Math.random() > 0.6,
      };

      updateTelemetry(telemetry);

      const decision = makeEconomicDecision(
        telemetry,
        config,
        [],
        forecast,
        autonomyLevel,
        avgChargePricePaid,
      );
      addDecision(decision);

      if (decision.action === "CHARGE" || decision.action === "ABSORB") {
        currentSoC = Math.min(config.max_soc_percent, currentSoC + 2.5);
        avgChargePricePaid = avgChargePricePaid * 0.9 + price * 0.1;
      } else if (decision.action === "DISCHARGE") {
        currentSoC = Math.max(config.min_soc_percent, currentSoC - 3.5);
      }
    };

    tick();
    const id = setInterval(tick, 2600);
    return () => clearInterval(id);
  }, [autonomyLevel, addDecision, updateTelemetry]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      {/* Tabs */}
      <div className="surface mt-8 flex flex-wrap gap-1 rounded-full p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition ${
                active
                  ? "bg-secondary text-[#04081A]"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <div className="mt-6 space-y-6">
          <GapMeter />
          <AssetStatus />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <EconomicEngine />
            <EconomicRadar />
          </div>
          <AutonomySlider />
          <DecisionLog />
        </div>
      )}

      {activeTab === "engine" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <EconomicEngine />
            <EconomicRadar />
          </div>
          <PriceRadar />
          <AutonomySlider />
          <DecisionLog />
        </div>
      )}

      {activeTab === "economics" && (
        <div className="mt-6 space-y-6">
          <GapMeter />
          <RevenueComparison />
          <PriceRadar />
          <div className="surface overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-ink-muted">
                  <th className="p-4">{isAr ? "المعيار" : "Metric"}</th>
                  <th className="p-4">{isAr ? "نظام EMS قياسي" : "Standard EMS"}</th>
                  <th className="p-4 text-secondary">PREDAIOT</th>
                </tr>
              </thead>
              <tbody>
                {EMS_VS_PREDAIOT.map((row, i) => (
                  <tr key={row.metric} className={i % 2 ? "bg-white/[0.02]" : ""}>
                    <td className="p-4 font-medium">{row.metric}</td>
                    <td className="p-4 text-ink-muted">{row.ems}</td>
                    <td className="p-4 font-mono text-secondary">{row.predaiot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-muted">
            {PREDAIOT_BENCHMARKS.SIMULATION_DISCLAIMER} · Data:{" "}
            {PREDAIOT_BENCHMARKS.DATA_SOURCE_DEMAND} +{" "}
            {PREDAIOT_BENCHMARKS.DATA_SOURCE_PRICING}.
          </p>
        </div>
      )}

      {activeTab === "api" && (
        <div className="mt-6 space-y-6">
          <APIPanel />
          <AssetStatus />
          <EconomicEngine />
        </div>
      )}
    </div>
  );
}
