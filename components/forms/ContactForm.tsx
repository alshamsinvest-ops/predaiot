"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function ContactForm() {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch(`${API_BASE}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", fullName: form.name, ...form }),
      }).catch(() => {});
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="surface rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-accent" />
        <p className="mt-2 text-sm">{t("thanks")}</p>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-secondary";

  return (
    <form onSubmit={submit} className="surface space-y-3 rounded-2xl p-6">
      <input required placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
      <input required type="email" placeholder={t("email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
      <input placeholder={t("company")} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
      <textarea required rows={4} placeholder={t("message")} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-[#04101f] disabled:opacity-60"
      >
        {busy ? tc("loading") : t("send")}
      </button>
    </form>
  );
}
