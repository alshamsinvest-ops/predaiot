"use client";

import { useLiveStore } from "@/store/liveStore";

const INGEST_CURL = `curl -X POST https://preda-iot.com/api/v1/ingest \\
  -H 'Content-Type: application/json' \\
  -H 'X-PREDAIOT-API-KEY: predaiot_demo_live' \\
  -d '{
    "asset_id": "BESS-01",
    "client_id": "demo",
    "timestamp": "2026-06-27T14:00:00Z",
    "soc_percent": 62,
    "soc_mwh": 496,
    "charge_rate_mw": 0,
    "discharge_rate_mw": 0,
    "solar_mw": 480,
    "grid_import_mw": 0,
    "grid_export_mw": 220,
    "grid_price_omr_mwh": 9.4,
    "curtailment_signal": false
  }'`;

const STREAM_JS = `const es = new EventSource(
  '/api/v1/stream/BESS-01'
);
es.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'DECISION') {
    console.log(data.decision.action, data.decision.reason);
  }
};`;

const STATUS_TONE: Record<string, string> = {
  CONNECTED: "bg-positive/20 text-positive",
  CONNECTING: "bg-secondary/20 text-secondary",
  DEMO: "bg-secondary/15 text-secondary",
  ERROR: "bg-accent/20 text-accent",
};

export default function APIPanel() {
  const apiStatus = useLiveStore((s) => s.apiStatus);
  const setApiStatus = useLiveStore((s) => s.setApiStatus);

  return (
    <div className="surface rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Integration
          </p>
          <h3 className="mt-1 font-display text-xl font-extrabold">
            Plug your asset into the engine
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
            STATUS_TONE[apiStatus] ?? STATUS_TONE.DEMO
          }`}
        >
          {apiStatus}
        </span>
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        Two endpoints — one to push telemetry, one to stream decisions back.
        Demo API key{" "}
        <code className="rounded bg-black/40 px-2 py-0.5 font-mono text-xs text-secondary">
          predaiot_demo_live
        </code>{" "}
        is rate-limited and scoped to the BESS-01 demo asset.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-secondary">
            POST /api/v1/ingest
          </p>
          <pre className="mt-2 max-h-72 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-ink">
            {INGEST_CURL}
          </pre>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-secondary">
            GET /api/v1/stream/[assetId] · Server-Sent Events
          </p>
          <pre className="mt-2 max-h-72 overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-ink">
            {STREAM_JS}
          </pre>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setApiStatus("CONNECTING")}
          className="rounded-full border border-secondary/40 px-4 py-2 font-mono text-xs text-secondary hover:bg-secondary/10"
        >
          Simulate connect
        </button>
        <button
          type="button"
          onClick={() => setApiStatus("DEMO")}
          className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-ink-muted hover:text-ink"
        >
          Back to demo
        </button>
      </div>
    </div>
  );
}
