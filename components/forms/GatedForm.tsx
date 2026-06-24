"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Download } from "lucide-react";
import { API_BASE } from "@/lib/api";
import GoogleSignInButton from "./GoogleSignInButton";

/**
 * Email-gated capture used for white-paper downloads and the investor brief.
 * Writes to the unified Airtable lead pipeline via the backend.
 */
export default function GatedForm({
  type,
  ctaLabel,
  gateLabel,
  withGoogle = true,
  fileUrl,
}: {
  type: "paper" | "investor";
  ctaLabel: string;
  gateLabel: string;
  withGoogle?: boolean;
  fileUrl?: string;
}) {
  const tc = useTranslations("common");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch(`${API_BASE}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, fullName: name, email }),
      }).catch(() => {});
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="surface rounded-2xl p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-[--color-accent]" />
        <p className="mt-2 text-sm">{tc("send")} ✓</p>
        <p className="text-sm text-[--color-ink-muted]">{gateLabel}</p>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[--color-accent] px-6 py-3 text-sm font-semibold text-[#04101f]"
          >
            <Download className="h-4 w-4" /> {ctaLabel}
          </a>
        ) : null}
      </div>
    );
  }

  const field = "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[--color-secondary]";

  return (
    <div className="surface rounded-2xl p-6">
      <p className="text-sm text-[--color-ink-muted]">{gateLabel}</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[--color-accent] px-6 py-3 text-sm font-semibold text-[#04101f] disabled:opacity-60"
        >
          <Download className="h-4 w-4" /> {busy ? tc("loading") : ctaLabel}
        </button>
      </form>
      {withGoogle ? (
        <>
          <div className="my-4 text-center text-xs text-[--color-ink-muted]">— {tc("continueGoogle")} —</div>
          <GoogleSignInButton onSignedIn={() => setDone(true)} />
        </>
      ) : null}
    </div>
  );
}
