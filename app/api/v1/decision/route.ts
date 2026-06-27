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

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { telemetry, autonomy_level, avg_charge_price_paid } = body as {
    telemetry: AssetTelemetry;
    autonomy_level?: number;
    avg_charge_price_paid?: number;
  };
  if (!telemetry?.asset_id) {
    return NextResponse.json({ error: "Missing telemetry" }, { status: 400 });
  }

  const config = getDefaultConfig(telemetry.asset_id);
  const hour = new Date(telemetry.timestamp).getHours();
  const { forecast } = getPriceForecast(hour);

  const decision = makeEconomicDecision(
    telemetry,
    config,
    [],
    forecast,
    autonomy_level ?? 0,
    avg_charge_price_paid ?? 6.5,
  );

  return NextResponse.json({ decision });
}
