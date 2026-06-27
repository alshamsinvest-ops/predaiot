import { NextRequest, NextResponse } from "next/server";
import {
  makeEconomicDecision,
  getDefaultConfig,
} from "@/lib/economic-engine";
import { getPriceForecast } from "@/lib/price-model";
import { validateApiKey } from "@/lib/multi-tenant";
import type { AssetTelemetry } from "@/types/energy";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("X-PREDAIOT-API-KEY");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }
  const tenant = await validateApiKey(apiKey);
  if (!tenant) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  const telemetry = (await request.json().catch(() => null)) as
    | AssetTelemetry
    | null;
  if (!telemetry || typeof telemetry.asset_id !== "string") {
    return NextResponse.json(
      { error: "Invalid telemetry payload" },
      { status: 400 },
    );
  }
  if (!tenant.assets.includes(telemetry.asset_id)) {
    return NextResponse.json(
      { error: "Asset not authorized for this tenant" },
      { status: 403 },
    );
  }

  const config = getDefaultConfig(telemetry.asset_id);
  const hour = new Date(telemetry.timestamp).getHours();
  const { forecast } = getPriceForecast(hour);

  const decision = makeEconomicDecision(telemetry, config, [], forecast);

  // TODO: persist decision; broadcast over SSE; if executed, dispatch hardware command.

  return NextResponse.json({
    received: true,
    decision,
    execution_status: decision.executed ? "SENT_TO_HARDWARE" : "ADVISORY_ONLY",
  });
}
