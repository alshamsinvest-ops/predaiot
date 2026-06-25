"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, Share2, CheckCircle2, Upload } from "lucide-react";
import { API_BASE, whatsappLink } from "@/lib/api";
import { ASSET_TYPES, COMPANY, GUARANTEE_TEXT, fmtOMR, omrToUsd } from "@/lib/constants";
import { estimateValue } from "@/lib/value";

interface ResultState {
  capacityMW: number;
  annualRecoveryOMR: number;
  profitMinPct: number;
  profitMaxPct: number;
  illustrative: boolean;
  // Real computed audit (when a data file was uploaded and scored)
  computed?: boolean;
  financialLossOMR?: number;
  recoverablePct?: number;
  method?: string;
  measured?: boolean;
  periods?: number;
  notes?: string[];
}

const MAX_BYTES = 10 * 1024 * 1024;
const OK_EXT = [".csv", ".xls", ".xlsx"];

export default function LeakTestForm() {
  const t = useTranslations("leak");
  const tc = useTranslations("common");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    assetType: ASSET_TYPES[0] as string,
    capacity: "",
    noData: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onFile(f: File | null) {
    setFileError(null);
    if (!f) return setFile(null);
    const lower = f.name.toLowerCase();
    if (!OK_EXT.some((e) => lower.endsWith(e))) {
      setFileError("Only CSV or Excel files are accepted.");
      return;
    }
    if (lower.endsWith(".xlsm")) {
      setFileError("Macro-enabled files are not accepted.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setFileError("File exceeds the 10MB limit.");
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setRateLimited(false);
    setBusy(true);

    const capacityMW = form.noData ? 500 : Number(form.capacity) || 0;
    const localEstimate = estimateValue(form.noData ? 500 : capacityMW);

    try {
      // If the visitor uploaded data, run the REAL audit engine on it.
      if (file && !form.noData) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("fullName", form.name);
        fd.append("email", form.email);
        fd.append("phone", form.phone);
        fd.append("company", form.company);
        fd.append("assetType", form.assetType);
        fd.append("capacityMW", String(capacityMW));
        const ar = await fetch(`${API_BASE}/api/audit`, { method: "POST", body: fd });
        if (ar.status === 429) {
          setRateLimited(true);
          setBusy(false);
          return;
        }
        const adata = await ar.json().catch(() => ({}));
        if (adata?.computed && adata.audit?.ok) {
          const a = adata.audit;
          setResult({
            capacityMW,
            annualRecoveryOMR: a.financialLossOMR,
            profitMinPct: localEstimate.profitMinPct,
            profitMaxPct: localEstimate.profitMaxPct,
            illustrative: false,
            computed: true,
            financialLossOMR: a.financialLossOMR,
            recoverablePct: a.recoverablePct,
            method: a.method,
            measured: a.measured,
            periods: a.periods,
            notes: a.notes,
          });
          setBusy(false);
          return;
        }
        // Parsing failed — fall through to illustrative.
      }

      const res = await fetch(`${API_BASE}/api/diagnostic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          assetType: form.assetType,
          capacityMW,
          noData: form.noData,
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setBusy(false);
        return;
      }

      const data = await res.json().catch(() => ({}));
      setResult({
        capacityMW: data.capacityMW ?? localEstimate.capacityMW,
        annualRecoveryOMR: data.annualRecoveryOMR ?? localEstimate.annualRecoveryOMR,
        profitMinPct: data.profitMinPct ?? localEstimate.profitMinPct,
        profitMaxPct: data.profitMaxPct ?? localEstimate.profitMaxPct,
        illustrative: data.illustrative ?? true,
      });
    } catch {
      // Backend unreachable — still show the client-side illustrative result.
      setResult({ ...localEstimate, illustrative: true });
    } finally {
      setBusy(false);
    }
  }

  if (rateLimited) {
    return (
      <div className="surface rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
        <p className="mt-3 text-ink">{t("rateLimited")}</p>
      </div>
    );
  }

  if (result) {
    const usd = omrToUsd(result.annualRecoveryOMR);
    const computed = result.computed === true;
    const shareMsg = computed
      ? `PREDAIOT economic audit: ${fmtOMR(result.financialLossOMR ?? 0)} OMR recoverable (${result.recoverablePct}% of revenue), computed from my data. → ${COMPANY.url}`
      : `PREDAIOT Leak Test (illustrative): ~${fmtOMR(result.annualRecoveryOMR)} OMR/yr recoverable on a ${result.capacityMW} MW asset. Free 7-day diagnostic → ${COMPANY.url}`;
    return (
      <div className="space-y-6">
        <div className="surface rounded-2xl p-8">
          <div
            className={`mb-4 inline-flex rounded-full border px-3 py-1 text-[11px] ${
              computed
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-white/15 bg-white/5 text-ink-muted"
            }`}
          >
            {computed ? "Computed from your data" : tc("illustrative")}
          </div>
          <h3 className="font-display text-2xl font-extrabold">{t("resultTitle")}</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {computed
              ? `Calculated with PREDAIOT's Economic Decision method across ${(result.periods ?? 0).toLocaleString()} periods${
                  result.measured ? "" : " (expected performance estimated from your data envelope)"
                }.`
              : t("resultIllustrative")}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <p className="text-xs text-ink-muted">
                {computed ? "Recoverable economic value (Financial Loss)" : t("resultRecovery")}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-accent">
                {fmtOMR(result.annualRecoveryOMR)} <span className="text-base">OMR</span>
              </p>
              <p className="text-xs text-ink-muted">≈ ${fmtOMR(usd)} USD</p>
            </div>
            <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
              <p className="text-xs text-ink-muted">
                {computed ? "Share of realized revenue" : t("resultRange")}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-secondary">
                {computed ? `${result.recoverablePct}%` : `${result.profitMinPct}%–${result.profitMaxPct}%`}
              </p>
              <p className="text-xs text-ink-muted">{result.capacityMW} MW</p>
            </div>
          </div>

          {computed ? (
            <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-[11px] text-ink-muted">
              {result.method}
            </p>
          ) : null}

          <a
            href={whatsappLink(COMPANY.whatsappNumber, shareMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#04101f] hover:brightness-110"
          >
            <Share2 className="h-4 w-4" /> {t("shareWhatsapp")}
          </a>
        </div>

        <div className="surface flex items-start gap-3 rounded-2xl p-6">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold">{t("guaranteeTitle")}</p>
            <p className="mt-1 text-sm text-ink-muted">{GUARANTEE_TEXT}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-accent" />
          <p className="mt-2 text-sm font-semibold">{t("thanks")}</p>
          <p className="text-sm text-ink-muted">{t("thanksBody")}</p>
        </div>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-secondary";

  return (
    <form onSubmit={onSubmit} className="surface rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">{t("name")}</span>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">{t("email")}</span>
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">{t("phone")}</span>
          <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">{t("company")}</span>
          <input required value={form.company} onChange={(e) => set("company", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">{t("assetType")}</span>
          <select value={form.assetType} onChange={(e) => set("assetType", e.target.value)} className={field}>
            {ASSET_TYPES.map((a) => (
              <option key={a} value={a} className="bg-primary-900">
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink-muted">{t("capacity")}</span>
          <input
            type="number"
            min="0"
            step="any"
            disabled={form.noData}
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
            className={`${field} disabled:opacity-50`}
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/15 bg-black/10 px-4 py-3 text-sm">
          <Upload className="h-4 w-4 text-secondary" />
          <span className="flex-1">
            {file ? file.name : t("upload")}
            <span className="block text-xs text-ink-muted">{t("uploadHint")}</span>
          </span>
          <input
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            disabled={form.noData}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {fileError ? <p className="mt-1 text-xs text-red-400">{fileError}</p> : null}
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.noData}
          onChange={(e) => {
            set("noData", e.target.checked);
            if (e.target.checked) setFile(null);
          }}
          className="h-4 w-4 accent-accent"
        />
        <span>
          {t("noData")}
          <span className="block text-xs text-ink-muted">{t("noDataHint")}</span>
        </span>
      </label>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-[#04101f] glow-accent transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? tc("loading") : t("submit")}
      </button>

      <a
        href={whatsappLink(
          COMPANY.whatsappNumber,
          "Hello PREDAIOT — I'd like to register for the free 7-day Leak Test. My company is:"
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-sm text-ink-muted underline hover:text-ink"
      >
        {t("registerWhatsapp")}
      </a>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-xs font-semibold">{t("guaranteeTitle")}</p>
          <p className="mt-1 text-xs text-ink-muted">{GUARANTEE_TEXT}</p>
        </div>
      </div>
    </form>
  );
}
