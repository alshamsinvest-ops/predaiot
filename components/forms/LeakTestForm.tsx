"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, Share2, CheckCircle2, Upload } from "lucide-react";
import { API_BASE, whatsappLink } from "@/lib/api";
import { ASSET_TYPES, COMPANY, GUARANTEE_TEXT, PROMO_HOOK_TEXT, fmtOMR, omrToUsd } from "@/lib/constants";
import { estimateValue } from "@/lib/value";
import Countdown from "@/components/ui/Countdown";

interface ResultState {
  capacityMW: number;
  annualRecoveryOMR: number;
  profitMinPct: number;
  profitMaxPct: number;
  illustrative: boolean;
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
      // Optional file upload (validated again server-side).
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("email", form.email);
        await fetch(`${API_BASE}/api/upload`, { method: "POST", body: fd }).catch(() => {});
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
        <CheckCircle2 className="mx-auto h-10 w-10 text-[--color-accent]" />
        <p className="mt-3 text-[--color-ink]">{t("rateLimited")}</p>
      </div>
    );
  }

  if (result) {
    const usd = omrToUsd(result.annualRecoveryOMR);
    const shareMsg = `PREDAIOT Leak Test (illustrative): ~${fmtOMR(
      result.annualRecoveryOMR
    )} OMR/yr recoverable on a ${result.capacityMW} MW asset. Free 7-day diagnostic → ${COMPANY.url}`;
    return (
      <div className="space-y-6">
        <div className="surface rounded-2xl p-8">
          <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-[--color-ink-muted]">
            {tc("illustrative")}
          </div>
          <h3 className="font-display text-2xl font-extrabold">{t("resultTitle")}</h3>
          <p className="mt-2 text-sm text-[--color-ink-muted]">{t("resultIllustrative")}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[--color-accent]/30 bg-[--color-accent]/5 p-5">
              <p className="text-xs text-[--color-ink-muted]">{t("resultRecovery")}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-[--color-accent]">
                {fmtOMR(result.annualRecoveryOMR)} <span className="text-base">OMR</span>
              </p>
              <p className="text-xs text-[--color-ink-muted]">≈ ${fmtOMR(usd)} USD / {tc("perYear")}</p>
            </div>
            <div className="rounded-2xl border border-[--color-secondary]/30 bg-[--color-secondary]/5 p-5">
              <p className="text-xs text-[--color-ink-muted]">{t("resultRange")}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-[--color-secondary]">
                {result.profitMinPct}%–{result.profitMaxPct}%
              </p>
              <p className="text-xs text-[--color-ink-muted]">{result.capacityMW} MW</p>
            </div>
          </div>

          <a
            href={whatsappLink(COMPANY.whatsappNumber, shareMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#04101f] hover:brightness-110"
          >
            <Share2 className="h-4 w-4" /> {t("shareWhatsapp")}
          </a>
        </div>

        {/* Conversion hook with live countdown + counter */}
        <div className="surface rounded-2xl p-8">
          <p className="text-sm font-semibold text-[--color-accent]">{t("promoTitle")}</p>
          <p className="mt-2 text-lg">{PROMO_HOOK_TEXT}</p>
          <div className="mt-5">
            <Countdown claimed={3} />
          </div>
        </div>

        <div className="surface flex items-start gap-3 rounded-2xl p-6">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[--color-accent]" />
          <div>
            <p className="text-sm font-semibold">{t("guaranteeTitle")}</p>
            <p className="mt-1 text-sm text-[--color-ink-muted]">{GUARANTEE_TEXT}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[--color-accent]" />
          <p className="mt-2 text-sm font-semibold">{t("thanks")}</p>
          <p className="text-sm text-[--color-ink-muted]">{t("thanksBody")}</p>
        </div>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[--color-secondary]";

  return (
    <form onSubmit={onSubmit} className="surface rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-[--color-ink-muted]">{t("name")}</span>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[--color-ink-muted]">{t("email")}</span>
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[--color-ink-muted]">{t("phone")}</span>
          <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[--color-ink-muted]">{t("company")}</span>
          <input required value={form.company} onChange={(e) => set("company", e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[--color-ink-muted]">{t("assetType")}</span>
          <select value={form.assetType} onChange={(e) => set("assetType", e.target.value)} className={field}>
            {ASSET_TYPES.map((a) => (
              <option key={a} value={a} className="bg-[--color-primary-900]">
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-[--color-ink-muted]">{t("capacity")}</span>
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
          <Upload className="h-4 w-4 text-[--color-secondary]" />
          <span className="flex-1">
            {file ? file.name : t("upload")}
            <span className="block text-xs text-[--color-ink-muted]">{t("uploadHint")}</span>
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
          className="h-4 w-4 accent-[--color-accent]"
        />
        <span>
          {t("noData")}
          <span className="block text-xs text-[--color-ink-muted]">{t("noDataHint")}</span>
        </span>
      </label>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[--color-accent] px-6 py-3.5 text-sm font-semibold text-[#04101f] glow-accent transition hover:brightness-110 disabled:opacity-60"
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
        className="mt-3 block text-center text-sm text-[--color-ink-muted] underline hover:text-[--color-ink]"
      >
        {t("registerWhatsapp")}
      </a>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[--color-accent]" />
        <div>
          <p className="text-xs font-semibold">{t("guaranteeTitle")}</p>
          <p className="mt-1 text-xs text-[--color-ink-muted]">{GUARANTEE_TEXT}</p>
        </div>
      </div>
    </form>
  );
}
