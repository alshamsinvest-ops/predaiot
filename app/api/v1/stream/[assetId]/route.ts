import { NextRequest } from "next/server";
import {
  makeEconomicDecision,
  getDefaultConfig,
  calcSolarOutput,
} from "@/lib/economic-engine";
import { getRealtimePrice, getPriceForecast } from "@/lib/price-model";
import type { AssetTelemetry } from "@/types/energy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const encoder = new TextEncoder();
  const config = getDefaultConfig(assetId);

  let currentSoC = 62;
  let avgChargePricePaid = 6.2;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

      send({
        type: "CONNECTED",
        asset_id: assetId,
        timestamp: new Date().toISOString(),
        message:
          "PREDAIOT Economic Engine connected. Decisions stream in real-time.",
      });

      const interval = setInterval(() => {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const price = getRealtimePrice(h, m);
        const solar = calcSolarOutput(h, config);
        const { forecast } = getPriceForecast(h);

        const telemetry: AssetTelemetry = {
          asset_id: assetId,
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

        const decision = makeEconomicDecision(
          telemetry,
          config,
          [],
          forecast,
          0,
          avgChargePricePaid,
        );

        if (decision.action === "CHARGE" || decision.action === "ABSORB") {
          currentSoC = Math.min(config.max_soc_percent, currentSoC + 2.5);
          avgChargePricePaid = avgChargePricePaid * 0.9 + price * 0.1;
        } else if (decision.action === "DISCHARGE") {
          currentSoC = Math.max(config.min_soc_percent, currentSoC - 3.5);
        }

        send({ type: "DECISION", telemetry, decision });
      }, 3000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
